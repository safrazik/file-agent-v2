import React from 'react';
import dynamic from 'next/dynamic';

// let initialized = false;
// if (!initialized) {
//   if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
//     // initialize client specific
//   }
//   initialized = true;
// }

export const getComponentWrapped = (component: typeof React.Component) => {
  const DynamicComponentWithNoSSR = dynamic(() => Promise.resolve(component), { ssr: false });
  return DynamicComponentWithNoSSR;
};

export const getComponent = (componentName: string) => {
  // Critical dependency: the request of a dependency is an expression
  const DynamicComponentWithNoSSR = dynamic(() => import('' + componentName), { ssr: false });
  return DynamicComponentWithNoSSR;
};

export const LandingDemo = getComponent('./LandingDemo');
export const AdvancedDemo = getComponent('./AdvancedDemo');
