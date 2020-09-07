import React from 'react';
import Vue from 'vue';

import { FileAgent as CoreFileAgent, FileAgentProps, FileRecord } from '@file-agent/core';

const VueComponentSample = Vue.extend({
  //
});

export interface VueComponentProps /* extends FileAgentProps */ {
  component: typeof VueComponentSample;
}

export class VueComponentClass extends React.Component<VueComponentProps> {
  private $container?: HTMLElement;

  constructor(public props: VueComponentProps) {
    super(props);
  }

  setContainer(el: HTMLElement | null) {
    /*     if (el === this.$container) {
      return;
    }
    if (!this.$container) {
      this.$container = el as HTMLElement;
      this.renderVueComponent();
    } */
    this.$container = el as HTMLElement;
    this.renderVueComponent();
  }

  renderVueComponent() {
    if (!this.$container) {
      return;
    }
    console.log('oooooooooooooo', this.props.component);
    //
    new Vue({
      render: (h) => h(this.props.component),
    }).$mount(this.$container);
  }

  componentDidUpdate() {
    // this.renderVueComponent();
  }

  render() {
    return React.createElement(
      'div',
      {
        ref: this.setContainer.bind(this),
      },
      ``,
    );
  }
}

export default VueComponentClass;
