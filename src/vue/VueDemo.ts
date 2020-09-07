import Vue from 'vue';
import { FileAgentProps, FileRecord } from '@file-agent/core';
import { FileAgent } from '@file-agent/vue';
import template from './VueDemo.html';
import { fetchInitialFileRecords } from '../FileRecordHelper';
// const template = `<div>HEy 3</div>`;

export default Vue.extend({
  components: { FileAgent },
  data() {
    return {
      fileAgentProps: {
        fileRecords: [],
        deletable: true,
        sortable: true,
        editable: true,
        onDelete: (fileRecord) => {
          //
        },
        onChange: (fileRecords) => {
          (this as any).updateFileRecords(fileRecords);
        },
      } as FileAgentProps,
    };
  },
  methods: {
    updateFileRecords(fileRecords: FileRecord[]) {
      this.fileAgentProps.fileRecords = fileRecords;
    },
  },
  created() {
    fetchInitialFileRecords().then((fileRecords) => {
      this.fileAgentProps.fileRecords = fileRecords;
    });
  },
  template,
});
