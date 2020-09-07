import { FileRecord } from '@file-agent/core';

const baseUrl = 'https://safrazik.com/vue-file-agent/website/assets/';

export const rawFileRecords = [
  {
    name: 'Some Large File.zip',
    size: 25165824, // 24 MB
    type: 'application/zip',
    ext: 'zip',
  },
  {
    name: 'House Sparrow.jpg',
    lastModified: 1583992794341,
    sizeText: '14 KB',
    size: 14403,
    type: 'image/jpeg',
    ext: 'jpg',
    url: baseUrl + 'files/House Sparrow.jpg',
    progress: 67,
  },
  {
    name: 'Golf.mp4',
    lastModified: 1576563996233,
    sizeText: '549 KB',
    size: 561813,
    type: 'video/mp4',
    ext: 'mp4',
    dimensions: {
      width: 640,
      height: 360,
    },
    url: baseUrl + 'files/Golf.mp4',
    videoThumbnail: baseUrl + 'files/Golf-thumb.jpg',
    imageColor: [66, 62, 45],
  },
  {
    name: 'sample.pdf',
    lastModified: 1565232623243,
    sizeText: '3 KB',
    size: 3028,
    type: 'application/pdf',
    ext: 'pdf',
    url: baseUrl + 'files/sample.pdf',
  },
];

export const fetchInitialFileRecords = () => {
  return FileRecord.fromRawArray(rawFileRecords as any, { read: false });
};
