import React from 'react';

import { FileAgent as CoreFileAgent, FileAgentProps, FileRecord } from '@file-agent/core';

type CancelableEventReturnType = boolean | Promise<boolean> | undefined | null | void | any;
type SlotValue = HTMLElement | string | undefined | null | any;

let coreFileAgent: CoreFileAgent | undefined;

export const FileAgent = (props: FileAgentProps) => {
  // let containerOld: HTMLElement | undefined;
  // const createCoreFileAgent = () => {
  //   console.log('createCoreFileAgent');
  //   if (!containerOld) {
  //     return;
  //   }
  //   coreFileAgent = new CoreFileAgent(props);
  //   // coreFileAgent.render(container);
  // };

  // const renderCore = () => {
  //   if (!coreFileAgent) {
  //     createCoreFileAgent();
  //   } else {
  //     console.log('coreFileAgent.setProps');
  //     coreFileAgent.setProps(props);
  //   }
  //   coreFileAgent = new CoreFileAgent(props);
  //   coreFileAgent.render(containerOld);
  // };
  // const setContainerOld = (el: HTMLElement | null) => {
  //   console.log('setContainer', props.fileRecords);
  //   containerOld = el as HTMLElement;
  //   renderCore();
  // };
  const setContainer = (container: HTMLElement | null) => {
    console.log('rendering................setContainer............................');
    if (!coreFileAgent) {
      coreFileAgent = new CoreFileAgent(props);
    } else {
      console.log('coreFileAgent.setProps');
      coreFileAgent.setProps(props);
    }
    if (container) {
      coreFileAgent.render(container);
    }
  };
  console.log('rendering................LDLKDLDLKDJ>............................');
  return React.createElement(
    'div',
    {
      ref: setContainer,
    },
    ``,
  );
};

export class FileAgentClass extends React.Component<FileAgentProps> {
  private $container?: HTMLElement;
  private coreFileAgent?: CoreFileAgent;
  // private coreRendered = false;
  constructor(public props: FileAgentProps) {
    super(props);
    console.log('lllllllllllllooooo');
    // fileIcon.render(document.getElementById('file-icon-wrapper') as HTMLElement);
  }

  setContainer(el: HTMLElement | null) {
    console.log('setContainer', this.props.fileRecords);
    this.$container = el as HTMLElement;
    this.renderCore();
  }

  createCoreFileAgent() {
    console.log('createCoreFileAgent');
    if (!this.$container) {
      return;
    }
    this.coreFileAgent = new CoreFileAgent(this.props);
    this.coreFileAgent.render(this.$container);
  }

  renderCore() {
    if (/* this.coreRendered &&  */ this.coreFileAgent) {
      console.log('this.coreFileAgent.setProps');
      this.coreFileAgent.setProps(this.props);
      return;
    }
    this.createCoreFileAgent();
    // this.coreRendered = true;
  }

  componentDidMount() {
    console.log('componentDidMount', this.props.fileRecords);
    // this.renderCore();
  }

  componentDidUpdate() {
    console.log('componentDidUpdate', this.props.fileRecords);
    // this.renderCore();
  }

  componentWillUnmount() {
    // destroy
  }
  render() {
    return React.createElement(
      'div',
      {
        ref: this.setContainer.bind(this),
      },
      ``,
    );
    // return <div ref={this.setContainer.bind(this)} />;
  }
}

// export default FileAgent;
export default FileAgentClass;
