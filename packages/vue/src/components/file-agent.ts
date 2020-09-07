import Vue from 'vue';
import { FileAgent as CoreFileAgent, FileRecord, fileAgentProps, FileAgentProps } from '@file-agent/core';
import propsHelper from '../lib/props-helper';

const propsWatch = propsHelper.createWatcher(fileAgentProps);

export default Vue.extend({
  props: fileAgentProps,
  render(createElement) {
    return createElement(
      'div',
      // this.$slots.default
    );
  },
  created() {
    propsHelper.bindThis(propsWatch, this);
    this.renderCore();
  },
  mounted() {
    this.renderCore();
  },
  methods: {
    renderCore(updateUi?: boolean) {
      if (this.coreFileAgent) {
        this.coreFileAgent.setProps(this.$props as FileAgentProps, updateUi);
      } else {
        this.coreFileAgent = new CoreFileAgent(this.$props as FileAgentProps);
      }
      if (this.coreFileAgentRendered) {
        return;
      }
      if (!this.$el) {
        return;
      }
      this.coreFileAgent.render(this.$el as HTMLElement);
    },
    propUpdated(propName: string, value: any) {
      console.log('FileAgent propUpdated', propName, value);
      this.renderCore();
    },
  },
  watch: propsWatch,
});
