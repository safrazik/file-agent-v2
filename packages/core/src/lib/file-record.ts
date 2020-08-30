import { getIconFromExt, SvgIcon } from './icons';
import utils from './utils';
import { RGBA, ImageThumbnail, VideoThumbnail } from './utils';

export interface Dimensions {
  height: number;
  width: number;
}

export interface Options {
  accept?: string;
  maxSize?: string;
  read: boolean;
  thumbnailSize?: number;
  smartBackground?: boolean;
}

interface ErrorText {
  common?: string;
  type?: string;
  size?: string;
  upload?: string;
}

interface ErrorFlags {
  common?: boolean;
  type?: boolean;
  size?: boolean;
  upload?: false | string;
}

export interface RawFileRecord {
  url: string | ((value?: string) => string | undefined | Promise<FileRecord>);
  urlResized: string | null;
  src: () => any;
  name: any;
  lastModified: number;
  sizeText: string;
  size: number;
  type: string;
  ext: string;
  color: string;
  file: File;
  progress: number | ((progress?: number) => number | void);
  error?: false | ErrorFlags;
  dimensions: Dimensions;
  videoThumbnail: string;
  imageColor: RGBA;
  customName: string;
  upload: UploadData;
}

interface DummyFile {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  lastModifiedDate: Date;
}

interface UploadData {
  data: any;
  error: string | false;
}

class FileRecord {
  public static getFromRaw(
    rawFileRecord: RawFileRecord,
    options: Options,
    isSync = false
  ): FileRecord | Promise<FileRecord> {
    const fileRecord = new FileRecord(rawFileRecord, options);
    const promise = fileRecord.setUrl(rawFileRecord.url as string);
    rawFileRecord.progress = fileRecord.progress.bind(fileRecord); // convert it as a function
    rawFileRecord.src = fileRecord.src.bind(fileRecord);
    rawFileRecord.name = fileRecord.name.bind(fileRecord); // convert it as a function
    if (isSync) {
      return fileRecord;
    }
    return promise;
  }

  public static fromRaw(rawFileRecord: RawFileRecord, options: Options): Promise<FileRecord> {
    return FileRecord.getFromRaw(rawFileRecord, options, false) as Promise<FileRecord>;
  }

  public static fromRawSync(rawFileRecord: RawFileRecord, options: Options): FileRecord {
    return FileRecord.getFromRaw(rawFileRecord, options, true) as FileRecord;
  }

  public static fromRawArray(rawFileRecords: RawFileRecord[], options: Options): Promise<FileRecord[]> {
    const promises: Promise<FileRecord>[] = [];
    for (const rawFileRecord of rawFileRecords) {
      promises.push(FileRecord.fromRaw(rawFileRecord, options));
    }
    return Promise.all(promises);
  }

  public static toRawArray(fileRecords: FileRecord[]): RawFileRecord[] {
    const rawFileRecords: RawFileRecord[] = [];
    for (const fileRecord of fileRecords) {
      rawFileRecords.push(fileRecord.toRaw());
    }
    return rawFileRecords;
  }

  public static readFile(fileRecord: FileRecord): Promise<FileRecord> {
    return new Promise((resolve, reject) => {
      if (!fileRecord.read) {
        fileRecord.setUrl(null);
        resolve(fileRecord);
        return;
      }
      utils.getDataURL(fileRecord.file).then((dataUrl) => {
        fileRecord.setUrl(dataUrl).then(() => {
          resolve(fileRecord);
        }, reject);
      }, reject);
    });
  }

  public static readFiles(fileRecords: FileRecord[]): Promise<FileRecord[]> {
    const promises: Promise<FileRecord>[] = [];
    for (const fileRecord of fileRecords) {
      promises.push(FileRecord.readFile(fileRecord));
    }
    return Promise.all(promises);
  }

  public urlValue: null | string = null;
  public urlResized: null | string = null;
  public image: HTMLImageElement | {} = {};
  public isPlayingAv: boolean = false;

  public oldFileName: string | null = null;
  public oldCustomName: string | null = null;
  public upload: UploadData = { data: null, error: false };

  public raw: RawFileRecord;
  public progressInternal: number;
  public accept?: string;
  public dimensions: Dimensions;
  public error: false | ErrorFlags;
  public file: File;
  public height: undefined | number | string;
  public width: undefined | number | string;
  public id: string;
  public imageColor?: RGBA;
  public lastKnownSrc: null | string;
  public maxSize?: string;
  public options: Options;
  public read: boolean;
  public thumbnailSize: number;
  public videoThumbnail: any;
  public customName: any;
  public xhr?: XMLHttpRequest;
  public xhrQueue?: () => any;
  public stopAv?: (() => any) | null;
  public tusUpload?: any;
  public calculateAverageColor: boolean;

  public onChange = {
    name: (value: string) => {
      /** no op */
    },
    progress: (value: number) => {
      /** no op */
    },
    url: (value: string) => {
      /** no op */
    },
    thumbnail: (value: VideoThumbnail) => {
      /** no op */
    },
    dimensions: (value: { width: number; height: number }) => {
      /** no op */
    },
    error: (value: false | ErrorFlags) => {
      /** no op */
    },
  };

  public constructor(data: RawFileRecord, options: Options) {
    this.urlValue = null;
    this.urlResized = null;
    this.lastKnownSrc = null;
    this.image = {};
    this.isPlayingAv = false;
    this.oldFileName = null;
    this.oldCustomName = null;

    this.raw = data;
    this.file = data.file instanceof File ? data.file : (this.createDummyFile(data) as any);
    this.progressInternal = !isNaN(data.progress as number) ? (data.progress as number) : 0;
    // this.width = FileRecord.defaultWidth;
    // this.height = FileRecord.defaultHeight;
    this.thumbnailSize = options.thumbnailSize || 360;
    this.read = !!options.read;
    this.dimensions = data.dimensions || {};
    this.dimensions.width = this.dimensions.width || 0;
    this.dimensions.height = this.dimensions.height || 0;
    this.error = data.error || false;
    this.options = options;
    this.maxSize = options.maxSize;
    this.accept = options.accept;
    this.id = '' + new Date().getTime() + Math.random();
    this.videoThumbnail = data.videoThumbnail;
    this.imageColor = data.imageColor;
    this.customName = data.customName;
    this.calculateAverageColor = options.smartBackground !== undefined ? options.smartBackground : true;
    this.validate();
  }

  // populate(data, options = {}) {}

  public createDummyFile(data: RawFileRecord): DummyFile {
    const file: DummyFile = {} as DummyFile;
    file.lastModified = data.lastModified;
    const d = new Date();
    if (file.lastModified) {
      d.setTime(file.lastModified);
    }
    file.lastModifiedDate = d;
    file.name = typeof data.name === 'function' ? data.name() : data.name;
    file.size = data.size;
    file.type = data.type;
    return file;
  }

  public hasProgress(): boolean {
    return !isNaN(this.progressInternal); // && this._progress <= 100;
  }

  public progress(value?: number): number | void {
    if (value !== undefined) {
      this.progressInternal = value;
      this.onChange.progress(value);
      return;
    }
    return this.progressInternal || 0;
  }

  public getProgress(): number {
    return this.progress() as number;
  }

  public setProgress(progress: number): void {
    this.progress(progress);
  }

  public url(value?: string): string | undefined | Promise<this> {
    if (value !== undefined) {
      return this.setUrl(value).then(() => {
        this.onChange.url(value);
        return this;
      });
    }
    return this.urlValue || undefined;
  }

  public thumbnail(value?: VideoThumbnail): VideoThumbnail | void {
    if (value !== undefined) {
      this.imageColor = value.color;
      this.videoThumbnail = value.url;
      this.dimensions.width = value.width;
      this.dimensions.height = value.height;
      this.onChange.thumbnail(value);
      this.onChange.dimensions(this.dimensions);
    }
    return {
      color: this.imageColor,
      url: this.videoThumbnail,
      width: this.dimensions.width,
      height: this.dimensions.height,
    } as VideoThumbnail;
  }

  public src(): string {
    if (this.isImage()) {
      return this.urlResized || this.urlValue || (this.file as any).url;
    }
    if (this.isPlayableVideo()) {
      return this.videoThumbnail || '';
    }
    return '';
  }

  public size(): string {
    if (!this.file) {
      return '';
    }
    return utils.getSizeFormatted(this.file.size);
  }

  public ext(): string {
    if (this.file && this.file.name.indexOf('.') !== -1) {
      return (this.file.name as any).split('.').pop();
    }
    return '?';
    // return this.file.type.split('/').shift();
  }

  public name(withoutExt?: boolean): string {
    const ext = this.ext();
    if (this.customName) {
      return this.customName + (withoutExt ? '' : ext !== '?' ? '.' + ext : '');
    }
    const name = this.file && this.file.name;
    if (withoutExt) {
      if (ext !== '?') {
        return name.substr(0, name.length - (ext.length + 1));
      }
    }
    return name;
  }

  public nameWithoutExtension(value?: string | false): string | void {
    if (value !== undefined) {
      const newValue = value === false ? (this.oldCustomName as string) : value;
      const oldValue = this.nameWithoutExtension() as string;
      if (oldValue !== newValue) {
        this.oldCustomName = oldValue;
        this.customName = newValue;
        this.onChange.name(newValue);
      }
      return;
    }
    if (this.customName) {
      return this.customName;
    }
    const ext = this.ext();
    const name = this.file && this.file.name;
    if (ext !== '?') {
      return name.substr(0, name.length - (ext.length + 1));
    }
    return name;
  }

  public isDarkColor(): boolean {
    if (this.imageColor) {
      const rgb = this.imageColor;
      const darkPoint = 20;
      return rgb[0] <= darkPoint && rgb[1] <= darkPoint && rgb[2] <= darkPoint;
    }
    return false;
  }

  public color(): string {
    if (this.imageColor) {
      const rgb = this.imageColor;
      return 'rgb(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ')';
    }
    if (this.isImage()) {
      return 'transparent';
    }
    const ext = this.ext();
    const svgIcon = this.icon();
    // var svgIcon = getIconFromExt(ext);
    if (svgIcon.color) {
      return svgIcon.color;
    }
    return utils.getColorForText(ext);
  }

  public isImage(): boolean {
    return this.file && this.file.type.indexOf('image') !== -1;
  }

  public isVideo(): boolean {
    return this.file && this.file.type.indexOf('video') !== -1;
  }

  public isPlayableVideo(): boolean {
    return this.icon().category === 'video-playable';
  }

  public isAudio(): boolean {
    return this.file && this.file.type.indexOf('audio') !== -1;
  }

  public isPlayableAudio(): boolean {
    return this.icon().category === 'audio-playable';
  }

  public isText(): boolean {
    return this.file && this.file.type.indexOf('text') !== -1;
  }

  public setUrl(url: string | null): Promise<this> {
    this.urlValue = url;
    return new Promise((resolve, reject) => {
      if (this.isImage()) {
        this.resizeImage().then(
          () => {
            resolve(this);
          },
          (err) => {
            resolve(this);
          }
        );
        return;
      }
      resolve(this);
    });
  }

  public imageResized(resized: ImageThumbnail | null) {
    if (!resized) {
      return;
    }
    this.urlResized = resized.url;
    this.image = resized.image;
    if (resized.image && resized.image.width && resized.image.height) {
      this.dimensions.width = resized.image.width;
      this.dimensions.height = resized.image.height;
    }
    this.lastKnownSrc = this.urlResized;
    this.imageColor = resized.color;
  }

  public resizeImage(): Promise<this> {
    return new Promise((resolve, reject) => {
      utils
        .resizeImage(this.thumbnailSize, this.file, this.urlValue as string, this.calculateAverageColor)
        .then((resized) => {
          this.imageResized(resized);
          resolve(this);
        })
        .catch(reject);
    });
  }

  public icon(): SvgIcon {
    const ext = this.ext();
    const svgIcon = getIconFromExt(ext);
    return svgIcon;
  }

  public getErrorMessage(errorText?: ErrorText): string {
    const error = this.error;
    if (!error) {
      return '';
    }
    errorText = errorText || {};
    errorText = {
      common: errorText.common || 'Invalid file.',
      type: errorText.type || 'Invalid file type.',
      size: errorText.size || 'Files should not exceed ' + this.maxSize + ' in size',
    };
    if (error.type) {
      return errorText.type as string;
    } else if (error.size) {
      return errorText.size as string;
    } else if (error.upload) {
      return this.upload.error ? this.upload.error : error.upload;
    }
    return errorText.common as string;
  }

  public customError(error?: string | false) {
    this.setError(error);
  }

  public setError(error?: string | false) {
    if (error === false) {
      this.error = false;
    } else {
      this.error = {
        upload: error,
      };
    }
    this.onChange.error(this.error);
  }

  public uploadError(error?: string | false) {
    return this.setError(error);
  }

  public toRaw(): RawFileRecord {
    const raw = this.raw || {};
    // raw.url = this.urlValue;
    raw.url = this.url.bind(this);
    raw.urlResized = this.urlResized;
    raw.src = this.src.bind(this);
    raw.name = this.name.bind(this);
    raw.lastModified = this.file.lastModified;
    raw.sizeText = this.size();
    raw.size = this.file.size;
    raw.type = this.file.type;
    raw.ext = this.ext();
    raw.color = this.color();
    raw.file = this.file;
    raw.progress = this.progress.bind(this); // pass it as a function
    raw.upload = this.upload;
    if (!('error' in raw)) {
      Object.defineProperty(raw, 'error', {
        get: () => {
          return this.error;
        },
      });
    }
    raw.dimensions = this.dimensions;
    return raw;
  }

  public validate(): void {
    const validType = utils.validateType(this.file, this.accept);
    const validSize = utils.validateSize(this.file, this.maxSize as string);
    if (!validType || !validSize) {
      this.error = {
        type: !validType,
        size: !validSize,
      };
    } else {
      this.error = false;
    }
  }
}

export default FileRecord;
