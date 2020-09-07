import React from 'react';

import { FileAgent as CoreFileAgent, FileAgentProps, FileRecord } from '@file-agent/core';

type CancelableEventReturnType = boolean | Promise<boolean> | undefined | null | void | any;
type SlotValue = HTMLElement | string | undefined | null | any;

export class FileAgentClass extends React.Component<FileAgentProps> {
  private $container?: HTMLElement;
  private coreFileAgent: CoreFileAgent;
  private coreRendered = false;
  constructor(public props: FileAgentProps) {
    super(props);
    console.log('reactFileAgent:constructor');
    this.coreFileAgent = new CoreFileAgent(this.props);
    // fileIcon.render(document.getElementById('file-icon-wrapper') as HTMLElement);
  }

  setContainer(el: HTMLElement | null) {
    console.log('reactFileAgent:setContainer', el === this.$container);
    if (el === this.$container) {
      return;
    }
    this.$container = el as HTMLElement;
    // this.renderCore();
    // if (!this.$container) {
    // }
    if (this.$container) {
      this.coreFileAgent.render(this.$container);
    }
  }

  // createCoreFileAgent() {}

  // renderCore(updateUi?: boolean) {
  //   console.log('reactFileAgent:renderCore');
  //   this.createCoreFileAgent();
  //   this.coreRendered = true;
  // }

  updateProps(updateUi?: boolean) {
    this.coreFileAgent.setProps(this.props, updateUi);
  }

  componentDidMount() {
    console.log(
      'reactFileAgent:componentDidMount',
      this.props.fileRecords?.map((fr) => fr.name()),
    );
    // this.renderCore();
  }

  componentDidUpdate() {
    console.log(
      'reactFileAgent:componentDidUpdate',
      this.props.fileRecords?.map((fr) => fr.name()),
    );
    this.updateProps();
  }

  componentWillUnmount() {
    console.log(
      'reactFileAgent:componentWillUnmount',
      this.props.fileRecords?.map((fr) => fr.name()),
    );
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

// tslint:disable-next-line
export class FileAgentClass2 extends React.Component<FileAgentProps> {
  private $container?: HTMLElement;
  private coreFileAgent: CoreFileAgent;
  private coreRendered = false;
  private containerRef: React.RefObject<HTMLDivElement>;
  constructor(public props: FileAgentProps) {
    super(props);
    this.coreFileAgent = new CoreFileAgent(this.props);
    this.containerRef = React.createRef();
  }

  updateProps(updateUi?: boolean) {
    this.coreFileAgent.setProps(this.props, updateUi);
  }

  componentDidMount() {
    this.coreFileAgent.render(this.containerRef.current as HTMLElement);
  }

  componentDidUpdate() {
    this.updateProps();
  }

  render() {
    return <div ref={this.containerRef}></div>;
  }
}
export default FileAgentClass;
