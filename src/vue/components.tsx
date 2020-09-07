import React from 'react';
import Vue from 'vue';
import VueComponent from './VueComponent';
import VueDemoComponent from './VueDemo';

const vueComponent = Vue.extend({
  data() {
    return {
      hello: 'Vue',
    };
  },
  render(createElement) {
    return createElement('div', [
      createElement(
        'a',
        {
          attrs: {
            href: '#test',
          },
        },
        ['Hello Vue'],
      ),
    ]);
  },
  created() {
    //
  },
  mounted() {
    //
  },
  methods: {
    //
  },
});

export function VueDemo1() {
  return <VueComponent component={vueComponent} />;
}

export function VueDemo() {
  return <VueComponent component={VueDemoComponent} />;
}
