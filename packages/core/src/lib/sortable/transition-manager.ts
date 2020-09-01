type Layout = 'grid' | 'list' | 'default';
export interface ElementRect {
  rect: DOMRect;
  element: HTMLElement;
}
const transitioningElements: HTMLElement[] = [];
export class TransitionManager {
  private options = {
    transitionDuration: 300,
    transitionStyle: {
      opacity: '0',
      transform: 'translate3d(0, 0, 0) scale(0.25)',
    } as Record<string, string>,
  };
  // private transitioningElements: HTMLElement[] = [];
  constructor(private layout?: Layout) {
    if (this.isListLayout) {
      this.options.transitionStyle.transform = 'translate3d(0px, -20px, 0px)';
    }
  }

  get transitioningElements() {
    return transitioningElements;
  }

  // set transitioningElements(elements: HTMLElement[]) {
  //   transitioningElements = elements;
  // }

  public isElementTransitioning(element: HTMLElement, transitioning?: boolean) {
    const index = this.transitioningElements.indexOf(element);
    const isAlready = index !== -1;
    if (transitioning === undefined) {
      return isAlready;
    }

    if (transitioning === true) {
      if (isAlready) {
        return;
      }
      this.transitioningElements.push(element);
    } else if (transitioning === false) {
      if (!isAlready) {
        return;
      }
      this.transitioningElements.splice(index, 1);
    }
  }

  public areElementsTransitioning(elements: HTMLElement[], transitioning?: boolean) {
    // this.transitioningElements = this.transitioningElements.concat(elements);
    // this.transitioningElements.push(...elements);
    for (const elem of elements) {
      this.isElementTransitioning(elem, transitioning);
    }
  }

  private get isListLayout() {
    return this.layout === 'list';
  }
  nextFrameX(callback: () => void) {
    callback();
  }

  nextFrame(callback: () => void) {
    const request = window.requestAnimationFrame || window.webkitRequestAnimationFrame;
    if (!request) {
      callback();
      return;
    }
    request(() => {
      callback();
    });
  }
  afterOneFrame(callback: () => void) {
    requestAnimationFrame(() => {
      this.nextFrame(callback);
    });
  }
  transformOtherElement(child: HTMLElement, first: DOMRect, last: DOMRect) {
    let isTransitioning = false;
    if (this.isElementTransitioning(child)) {
      isTransitioning = true;
      // return /*isElementTransitioning*/;
    }
    const toSameLocation =
      first.x === last.x &&
      first.y === last.y &&
      first.top === last.top &&
      first.right === last.right &&
      first.bottom === last.bottom &&
      first.left === last.left &&
      first.width === last.width &&
      first.height === last.height;
    if (toSameLocation) {
      console.log('yes... toSameLocation... @@@@@@@@@@');
      return;
    }
    if (isTransitioning && toSameLocation) {
      // probably "applyTransitions" called twice
      // return;
    }
    this.isElementTransitioning(child, true);
    child.style.transition = '';
    this.nextFrame(() => {
      const transform = `translate3d(${first.left - last.left}px, ${first.top - last.top}px, 0)`;
      child.style.transform = transform;
      this.nextFrame(() => {
        child.style.transition = `all ${this.options.transitionDuration}ms`;
        this.nextFrame(() => {
          child.style.transform = '';
          // child.style.transform = 'translate3d(0, 0, 0)';
          const onTransitionEnd = (event: Event) => {
            console.log('onTransitionEnd...');
            event.stopPropagation();
            this.nextFrameX(() => {
              child.style.transition = '';
            });
            this.isElementTransitioning(child, false);
            child.removeEventListener('transitionend', onTransitionEnd, false);
          };
          child.addEventListener('transitionend', onTransitionEnd, false);
        });
      });
    });
  }
  private applyTransitionStyle(child: HTMLElement, style?: Record<string, string>) {
    if (!style) {
      style = this.options.transitionStyle;
    }
    for (const prop in style) {
      if (style.hasOwnProperty(prop)) {
        child.style[prop as any] = style[prop];
      }
    }
  }
  private resetTransitionStyle(child: HTMLElement) {
    const resetStyle: Record<string, string> = {};
    const style = this.options.transitionStyle;
    for (const prop in style) {
      if (style.hasOwnProperty(prop)) {
        resetStyle[prop] = '';
      }
    }
    this.applyTransitionStyle(child, resetStyle);
  }
  addElement(child: HTMLElement) {
    if (this.isElementTransitioning(child)) {
      console.log('this.isElementTransitioning(child)', this.isElementTransitioning(child));
      // return /*isElementTransitioning*/;
    }
    this.isElementTransitioning(child, true);
    child.style.transition = '';
    this.applyTransitionStyle(child);
    this.nextFrame(() => {
      child.style.transition = `all ${this.options.transitionDuration}ms`;
      this.nextFrame(() => {
        this.resetTransitionStyle(child);
        const onTransitionEnd = (event: Event) => {
          event.stopPropagation();
          if (event.target !== child) {
            console.log('transition ended some other el');
            return;
          }
          console.log('transition ended: SAME CHILD');
          this.nextFrame(() => {
            child.style.transition = '';
          });
          this.isElementTransitioning(child, false);
          child.removeEventListener('transitionend', onTransitionEnd, false);
        };
        child.addEventListener('transitionend', onTransitionEnd, false);
      });
    });
  }

  removeElement(child: HTMLElement) {
    if (this.isElementTransitioning(child)) {
      // return /*isElementTransitioning*/;
    }
    this.isElementTransitioning(child, true);
    this.resetTransitionStyle(child);
    child.style.transition = `all ${this.options.transitionDuration}ms`;
    this.nextFrame(() => {
      this.applyTransitionStyle(child);
    });
    const onTransitionEnd = (event: Event) => {
      event.stopPropagation();
      if (event.target !== child) {
        return;
      }
      console.log('on remove transition end...');
      child.style.transition = '';
      this.resetTransitionStyle(child);
      child.parentElement?.removeChild(child);
      this.isElementTransitioning(child, false);
      child.removeEventListener('transitionend', onTransitionEnd, false);
    };
    child.addEventListener('transitionend', onTransitionEnd, false);
  }

  removeElements(children: HTMLElement[]) {
    for (const child of children) {
      this.removeElement(child);
    }
  }

  sortElements(
    container: HTMLElement,
    oldElements: HTMLElement[],
    newElements: HTMLElement[],
    oldElementRects: ElementRect[],
    newElementRects: ElementRect[]
  ) {
    return this.applyTransitions([], [], newElements, oldElementRects, newElementRects);
  }

  applyTransitions(
    newChildren: HTMLElement[],
    removedChildren: HTMLElement[],
    otherChildren: HTMLElement[],
    childRects: ElementRect[],
    // ignoredChildren?: HTMLElement[]
    newElementRects?: ElementRect[]
  ) {
    console.log('applyTransitions');
    // this.addElements(newChildren);
    for (const child of newChildren) {
      this.addElement(child);
    }

    let displayValue = 'inline-block';
    removedChildren.map((child) => {
      displayValue = child.style.display;
      child.style.display = 'none';
    });

    for (const child of removedChildren) {
      const childRect = childRects.filter((cr) => cr.element === child)[0];
      const rect = childRect ? childRect.rect : undefined;
      if (rect) {
        child.style.position = 'fixed';
        child.style.height = `${rect.height}px`;
        child.style.width = `${rect.width}px`;
        child.style.top = `${rect.top}px`;
        child.style.right = `${rect.right}px`;
        child.style.bottom = `${rect.bottom}px`;
        child.style.left = `${rect.left}px`;
      } else {
        child.style.position = 'absolute';
      }
      child.style.display = displayValue;
      child.style.opacity = '0.25';
      this.removeElement(child);
    }

    if (!newElementRects) {
      console.log('ballloo!');
      newElementRects = [];
      for (const child of otherChildren) {
        // getBoundingClientRect causes sync layout
        newElementRects.push({
          rect: child.getBoundingClientRect(),
          element: child,
        });
      }
    }
    for (const child of otherChildren) {
      const childRect = childRects.filter((cr) => cr.element === child)[0];
      const rect = childRect ? childRect.rect : undefined;
      if (!rect) {
        continue;
      }
      const newElementRect = newElementRects.filter((cr) => cr.element === child)[0];
      const newRect = newElementRect ? newElementRect.rect : child.getBoundingClientRect();
      this.transformOtherElement(child, rect, newRect);
    }
  }
}
