import React, { useState } from 'react';

import { FileRecord, plugins, FileAgentProps } from '@file-agent/core';
import * as tus from 'tus-js-client';

// import FileIcon from '../components/file-icon';
// import FilePreview from '../components/file-preview';
import { FileAgent } from '@file-agent/react';
import { uploader } from '@file-agent/uploader';

import { fetchInitialFileRecords } from './FileRecordHelper';

plugins.uploader = uploader;

const baseUrl = 'https://safrazik.com/vue-file-agent/website/assets/';

// plugins.tus = (window as any).tus;
plugins.tus = tus;

const maxSize = '4MB';

export default function AdvancedDemo() {
  const [fileRecords, setFileRecords] = useState([] as FileRecord[]);
  const [deletable, setDeletable] = useState(true);
  const [editable, setEditable] = useState(true);
  const [linkable, setLinkable] = useState(true);
  //   const [fileAgentProps, setFileAgentProps] = useState({
  //     deletable: true,
  //     editable: true,
  //     linkable: true,
  //   } as FileAgentProps);

  if (!fileRecords.length) {
    fetchInitialFileRecords().then((fRecords) => {
      setFileRecords(fRecords);
      setTimeout(() => {
        setTimeout(() => {
          fRecords[0].progress(34);
          fRecords[0].setError('Custom Error test');
          fRecords[0].nameWithoutExtension('Hello Sample');
        }, 2000);
        setFileRecords(fRecords.reverse().concat([]));
      }, 2000);
    });
  }

  return (
    <div>
      <FileAgent
        {...{
          uploadUrl: 'https://master.tus.io/files/',
          resumable: true,
          multiple: true,
          sortable: true,
          fileRecords,
          deletable,
          editable,
          linkable,
          maxSize,
          // sortable: true,
          // theme: 'list',
          // draggable: document.getElementById('file-drag-area'),
          // events: {
          onBeforeDelete: (fileRecord) => {
            console.log('onBeforrrrrr', fileRecord.name());
            if (true || confirm('Sure?')) {
              return true;
            }
            return false;
          },
          onBeforeRename: (fileRecord) => {
            console.log('onBefoererere', ',,,,');
            // return false;
          },
          onSelect: (fRecords) => {
            console.log('onSelect', fRecords);
          },
          onRename: (fileRecord) => {
            console.log('onRename', fileRecord.name(), fileRecord);
            if (fileRecord.name().toLowerCase().indexOf('shit') === -1) {
              return;
            }
            fileRecord.setError('Shitty name is not allowed.');
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve(false);
              }, 3000);
            });
          },
          onDelete: (fileRecord) => {
            console.log('onDelete', fileRecord.name(), fileRecord);
            if (fileRecord.name().toLowerCase().indexOf('system') === -1) {
              return;
            }
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                fileRecord.setError('System files cannot be deleted.');
                resolve(false);
              }, 1000);
            });
          },
          onChange: (frr) => {
            setFileRecords(frr);
          },
          // },
          slotsOld: {
            afterInner: 'After inner',
            afterOuter: 'After outer',
            beforeInner: document.getElementById('some-unique-el'),
            beforeOuter: 'Before outer',
            // filePreview: (fileRecord) => {
            //   return `<div>
            //       File: ${fileRecord.name()}
            //     </div>`;
            // },
            //     filePreviewNewx: `<div class="file-preview-wrapper grid-box-item grid-block file-preview-new">

            // <span class="file-preview">
            //   <span style="position: absolute; top: 0; right: 0; bottom: 0; left: 0;">
            //     <h1 data-ref="help-text" class="help-text"></h1>
            //   </span>
            // </span>
            //         </div>`,
            sortableHandle: 'Sortable Handle',
          },
        }}
      />
    </div>
  );
}
