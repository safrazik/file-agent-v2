import { Component } from '../components/component';
import template from './props-form.html';
// import FileRecord from '../lib/file-record';
// import utils from '../lib/utils';
import { FileAgent, FileAgentProps, createFileAgentProps } from '..';
import FileRecord from '../lib/file-record';

export class PropsForm extends Component {
  props = createFileAgentProps();
  fileRecords: FileRecord[] = [];
  scopedFileRecord?: FileRecord;
  constructor(protected fileAgent: FileAgent) {
    super();
    this.fileAgent.setProps({
      deletable: true,
      editable: true,
      // sortable: 'handle',
      sortable: true,
      draggable: true,
      layout: 'grid',
      // layout: 'default',
      theme: 'light-circle',
      onChange: (fileRecords) => {
        this.fileRecords = fileRecords;
        this.updateScopedUi();
      },
    });
    this.fileRecords = this.fileAgent.props.fileRecords;
    // this.fileAgent.$props.theme = 'list';
    // this.fileAgent.$props.uploadUrl =
    //   'http://localhost/safrazik/vue-file-agent/packages/vue-file-agent/upload-server-examples/php/upload-server.php';
  }

  bindEvents() {
    //
    // this.getRef<HTMLInputElement>('prop-deletable').onchange = (event) => {
    //   console.log('(event.target as HTMLInputElement).checked', (event.target as HTMLInputElement).checked);
    //   this.fileAgent.$props.deletable = (event.target as HTMLInputElement).checked;
    //   this.update();
    // };
    const booleans = document.createElement('div');
    const strings = document.createElement('div');
    const choices = document.createElement('div');
    for (const prop of [
      'multiple',
      //   'averageColor',
      'meta',
      'compact',
      'deletable',
      'editable',
      'linkable',
      'disabled',
      'readonly',
      'sortable',
      'draggable',
      'smartBackground',
      //   'resumable',
      //   'uploadWithCredentials',
    ]) {
      const div = document.createElement('div');
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = (this.fileAgent.props as any)[prop];
      div.appendChild(input);
      div.appendChild(this.parseTemplate(`<span>${prop}</span>`));
      input.onchange = (event) => {
        console.log(prop, '(event.target as HTMLInputElement).checked', (event.target as HTMLInputElement).checked);
        this.fileAgent.setProps({ [prop]: (event.target as HTMLInputElement).checked });
      };
      booleans.appendChild(div);
    }
    for (const prop of [
      //
      'helpText',
      'accept',
      'maxSize',
      'maxFiles',
      'uploadUrl',
      'capture',
      'sortable',
      // 'theme',
    ]) {
      const div = document.createElement('div');
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = ({ capture: 'e.g: user, environment', accept: 'image/*,.txt' } as any)[prop] || '';
      const value = (this.fileAgent.props as any)[prop];
      if (value) {
        input.value = value;
      }
      div.appendChild(this.parseTemplate(`<span>${prop}</span>`));
      div.appendChild(input);
      input.oninput = (event) => {
        console.log(prop, '(event.target as HTMLInputElement).value', (event.target as HTMLInputElement).value);
        this.fileAgent.setProps({ [prop]: (event.target as HTMLInputElement).value });
      };
      strings.appendChild(div);
    }
    for (const sel of [
      //
      ['layout', ['default', 'list']],
      ['theme', ['default', 'rounded', 'light', 'dark', 'circle', 'light-circle', 'dark-circle']],
    ]) {
      const prop = sel[0] as string;
      const options = sel[1] as string[];
      const div = document.createElement('div');
      const select = document.createElement('select');
      // select.placeholder = ({ capture: 'e.g: user, environment', accept: 'image/*,.txt' } as any)[prop] || '';
      const radioElements: HTMLInputElement[] = [];
      const value = (this.fileAgent.props as any)[prop];
      const radioContainer = document.createElement('span');
      for (const opt of options) {
        const option = document.createElement('option');
        option.value = opt;
        option.label = opt;
        option.innerHTML = opt;
        select.appendChild(option);
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = `radio-${prop}`;
        input.value = opt;
        input.checked = value && value === opt;
        input.onchange = (event) => {
          console.log(prop, '(event.target as HTMLSelectElement).value', (event.target as HTMLSelectElement).value);
          this.fileAgent.setProps({ [prop]: (event.target as HTMLSelectElement).value });
        };
        const wrap = document.createElement('label');
        wrap.appendChild(input);
        wrap.appendChild(this.parseTemplate(`<span>${opt}</span>`));
        radioContainer.appendChild(wrap);
      }
      if (value) {
        select.value = value;
      }
      div.appendChild(this.parseTemplate(`<span>${prop}</span>`));
      div.appendChild(radioContainer);
      // div.appendChild(select);
      select.onchange = (event) => {
        console.log(prop, '(event.target as HTMLSelectElement).value', (event.target as HTMLSelectElement).value);
        this.fileAgent.setProps({ [prop]: (event.target as HTMLSelectElement).value });
      };
      strings.appendChild(div);
    }

    this.getRef('booleans').appendChild(booleans);
    this.getRef('strings').appendChild(strings);
    this.getRef('choices').appendChild(choices);
    // this.getRef('prop-helpText').oninput = (event) => {
    //   this.fileAgent.$props.helpText = (event.target as HTMLInputElement).value;
    //   this.update();
    // };
    // this.getRef('prop-accept').oninput = (event) => {
    //   this.fileAgent.$props.accept = (event.target as HTMLInputElement).value;
    //   this.update();
    // };
    (this.getRef('scoped-progress') as HTMLInputElement).oninput = (event) => {
      const value = (event.target as HTMLInputElement).value;
      if (!this.scopedFileRecord) {
        return;
      }
      this.scopedFileRecord.setProgress(parseFloat(value));
    };
    (this.getRef('scoped-error') as HTMLInputElement).oninput = (event) => {
      const value = (event.target as HTMLInputElement).value;
      if (!this.scopedFileRecord) {
        return;
      }
      this.scopedFileRecord.setError(value || false, false);
    };
    (this.getRef('scoped-name') as HTMLInputElement).oninput = (event) => {
      const value = (event.target as HTMLInputElement).value;
      if (!this.scopedFileRecord) {
        return;
      }
      this.scopedFileRecord.setNameWithoutExtension(value);
    };
    this.updateScopedUi();
  }

  updateScopedFilenameUi() {
    if (!this.scopedFileRecord) {
      return;
    }
    this.getRef('scoped-file').innerHTML = this.scopedFileRecord.name();
  }

  updateScopedUi() {
    if (!this.scopedFileRecord) {
      this.scopedFileRecord = this.fileRecords[0];
      this.updateScopedFilenameUi();
    }
    const container = this.getRef('scoped-container');
    container.innerHTML = '';
    let idx = -1;
    for (const fileRecord of this.fileRecords) {
      idx++;
      const div = document.createElement('div');
      const button = document.createElement('button');
      button.type = 'button';
      button.innerHTML = '' + (idx + 1) + '. ' + fileRecord.name();
      button.onclick = () => {
        // alert(idx);
        this.scopedFileRecord = fileRecord;
        this.updateScopedFilenameUi();
      };
      // div.appendChild(button);
      container.appendChild(button);
    }
    // this.getRef('scoped-operations');
  }

  get $el() {
    if (this.cachedEl) {
      return this.cachedEl;
    }
    const el = this.parseTemplate(template);
    this.cachedEl = el;
    this.bindEvents();
    return el;
  }
}
