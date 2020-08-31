import { Component } from '../components/component';
import template from './props-form.html';
// import FileRecord from '../lib/file-record';
// import utils from '../lib/utils';
import { FileAgent, FileAgentProps, createFileAgentProps } from '..';

export class PropsForm extends Component {
  props = createFileAgentProps();
  constructor(protected fileAgent: FileAgent) {
    super();
    this.fileAgent.setProps({
      deletable: true,
      editable: true,
      // sortable: 'handle',
      sortable: true,
      draggable: true,
      layout: 'list',
    });
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
    for (const sel of [['layout', ['default', 'list']]]) {
      const prop = sel[0] as string;
      const options = sel[1] as string[];
      const div = document.createElement('div');
      const select = document.createElement('select');
      // select.placeholder = ({ capture: 'e.g: user, environment', accept: 'image/*,.txt' } as any)[prop] || '';
      const value = (this.fileAgent.props as any)[prop];
      for (const opt of options) {
        const option = document.createElement('option');
        option.value = opt;
        option.label = opt;
        option.innerHTML = opt;
        select.appendChild(option);
      }
      if (value) {
        select.value = value;
      }
      div.appendChild(this.parseTemplate(`<span>${prop}</span>`));
      div.appendChild(select);
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
