import Block from './block';

type TestComponentProps = {
  text?: string;
  count?: number;
};

class TestComponent extends Block<TestComponentProps> {
  render(): DocumentFragment {
    const fragment = document.createDocumentFragment();
    const tagName = this.element?.tagName.toLowerCase() || 'div';
    const element = document.createElement(tagName);
    element.textContent = this.props.text || 'test';
    fragment.appendChild(element);
    return fragment;
  }
}

class ChildComponent extends Block<TestComponentProps> {
  render(): DocumentFragment {
    return this.compile('<span>{{text}}</span>', this.props);
  }
}

class ParentWithChildComponent extends Block<{ child: Block<TestComponentProps> }> {
  render(): DocumentFragment {
    return this.compile('<div>{{{child}}}</div>', this.props);
  }
}

class ParentWithListComponent extends Block<{ items: Block<TestComponentProps>[] }> {
  render(): DocumentFragment {
    return this.compile('<div>{{#each items}}{{{this}}}{{/each}}</div>', this.props);
  }
}

class ParentWithMultipleChildren extends Block<{
  child1: Block<TestComponentProps>;
  child2: Block<TestComponentProps>;
}> {
  render(): DocumentFragment {
    return this.compile('<div>{{{child1}}} {{{child2}}}</div>', this.props);
  }
}

describe('Block', () => {
  let component: TestComponent;

  afterEach(() => {
    if (component) {
      component.destroy();
    }
    document.body.innerHTML = '';
  });

  it('should use props in render output', () => {
    component = new TestComponent('div', { text: 'Hello World' });

    document.body.appendChild(component.getContent()!);

    expect(component.getContent()?.textContent).toBe('Hello World');
  });

  it('should create element with correct tagName', () => {
    component = new TestComponent('section', { text: 'test' });

    document.body.appendChild(component.getContent()!);

    expect(component.getContent()?.tagName.toLowerCase()).toBe('section');
  });

  it('should update render output when props change', () => {
    component = new TestComponent('div', { text: 'Hello World' });

    component.setProps({ text: 'Hello World 2' });

    document.body.appendChild(component.getContent()!);

    expect(component.getContent()?.textContent).toBe('Hello World 2');
  });

  it('should call componentDidMount when dispatchComponentDidMount is called', () => {
    component = new TestComponent('div', { text: 'test' });
    const componentDidMountSpy = jest.spyOn(component, 'componentDidMount');

    component.dispatchComponentDidMount();

    expect(componentDidMountSpy).toHaveBeenCalledTimes(1);
  });

  it('should not re-render when shouldComponentUpdate returns false', () => {
    class NoUpdateComponent extends TestComponent {
      shouldComponentUpdate(): boolean {
        return false;
      }
    }

    const noUpdateComponent = new NoUpdateComponent('div', { text: 'Initial' });

    document.body.appendChild(noUpdateComponent.getContent()!);
    noUpdateComponent.dispatchComponentDidMount();

    const initialContent = noUpdateComponent.getContent()?.textContent;
    const renderSpy = jest.spyOn(noUpdateComponent, 'render');

    noUpdateComponent.setProps({ text: 'Changed' });

    expect(renderSpy).not.toHaveBeenCalled();
    expect(noUpdateComponent.getContent()?.textContent).toBe(initialContent);

    noUpdateComponent.destroy();
  });

  it('should call compile method when render is called', () => {
    class CompileComponent extends Block<TestComponentProps> {
      render(): DocumentFragment {
        return this.compile('<div>{{text}}</div>', this.props);
      }
    }

    const compileSpy = jest.spyOn(CompileComponent.prototype, 'compile');
    new CompileComponent('div', { text: 'test' });

    expect(compileSpy).toHaveBeenCalledTimes(1);
    expect(compileSpy).toHaveBeenCalledWith('<div>{{text}}</div>', { text: 'test' });

    compileSpy.mockRestore();
  });

  it('should identify Block instance as child', () => {
    const child = new ChildComponent('div', { text: 'Child Text' });
    const parent = new ParentWithChildComponent('div', { child });

    expect(parent['children']).toHaveProperty('child');
    expect(parent['children'].child).toBe(child);

    parent.destroy();
    child.destroy();
  });

  it('should render child component in template', () => {
    const child = new ChildComponent('div', { text: 'Child Text' });
    const parent = new ParentWithChildComponent('div', { child });

    document.body.appendChild(parent.getContent()!);

    const parentElement = parent.getContent();
    const childElement = parentElement?.querySelector('span');

    expect(childElement).toBeTruthy();
    expect(childElement?.textContent).toBe('Child Text');

    parent.destroy();
    child.destroy();
  });

  it('should replace stub with child content', () => {
    const child = new ChildComponent('div', { text: 'Child' });
    const parent = new ParentWithChildComponent('div', { child });

    document.body.appendChild(parent.getContent()!);

    const parentElement = parent.getContent();
    const stub = parentElement?.querySelector('[data-id]');
    expect(stub).toBeNull();

    parent.destroy();
    child.destroy();
  });

  it('should handle multiple children', () => {
    const child1 = new ChildComponent('div', { text: 'Child 1' });
    const child2 = new ChildComponent('div', { text: 'Child 2' });

    const parent = new ParentWithMultipleChildren('div', { child1, child2 });

    document.body.appendChild(parent.getContent()!);

    const spans = parent.getContent()?.querySelectorAll('span');
    expect(spans).toHaveLength(2);
    expect(spans?.[0].textContent).toBe('Child 1');
    expect(spans?.[1].textContent).toBe('Child 2');

    parent.destroy();
    child1.destroy();
    child2.destroy();
  });

  it('should identify array of Blocks as list', () => {
    const item1 = new ChildComponent('div', { text: 'Item 1' });
    const item2 = new ChildComponent('div', { text: 'Item 2' });
    const items = [item1, item2];

    const parent = new ParentWithListComponent('div', { items });

    expect(parent['lists']).toHaveProperty('items');
    expect(parent['lists'].items).toEqual(items);

    parent.destroy();
    item1.destroy();
    item2.destroy();
  });

  it('should render list of children in template', () => {
    const item1 = new ChildComponent('div', { text: 'Item 1' });
    const item2 = new ChildComponent('div', { text: 'Item 2' });
    const parent = new ParentWithListComponent('div', { items: [item1, item2] });

    document.body.appendChild(parent.getContent()!);

    const spans = parent.getContent()?.querySelectorAll('span');
    expect(spans).toHaveLength(2);
    expect(spans?.[0].textContent).toBe('Item 1');
    expect(spans?.[1].textContent).toBe('Item 2');

    parent.destroy();
    item1.destroy();
    item2.destroy();
  });

  it('should separate children from regular props', () => {
    const child = new ChildComponent('div', { text: 'Child' });

    class ParentWithChildAndProps extends Block<{
      child: Block<TestComponentProps>;
      text: string;
    }> {
      render(): DocumentFragment {
        return this.compile('<div>{{text}}: {{{child}}}</div>', this.props);
      }
    }

    const parent = new ParentWithChildAndProps('div', {
      child,
      text: 'Parent Text'
    });

    expect(parent['children']).toHaveProperty('child');
    expect(parent.props).toHaveProperty('text');
    expect(parent.props.text).toBe('Parent Text');

    parent.destroy();
    child.destroy();
  });

  it('should handle empty children array', () => {
    const parent = new ParentWithListComponent('div', { items: [] });

    document.body.appendChild(parent.getContent()!);

    const spans = parent.getContent()?.querySelectorAll('span');
    expect(spans).toHaveLength(0);

    parent.destroy();
  });

  it('should create unique stub for each child', () => {
    const child1 = new ChildComponent('div', { text: 'Child 1' });
    const child2 = new ChildComponent('div', { text: 'Child 2' });

    const parent = new ParentWithMultipleChildren('div', { child1, child2 });
    document.body.appendChild(parent.getContent()!);

    const spans = parent.getContent()?.querySelectorAll('span');
    expect(spans).toHaveLength(2);
    expect(spans?.[0].textContent).not.toBe(spans?.[1].textContent);

    parent.destroy();
    child1.destroy();
    child2.destroy();
  });

  it('should hide element', () => {
    component = new TestComponent('div', { text: 'test' });
    document.body.appendChild(component.getContent()!);

    component.hide();
    expect(component.getContent()?.style.display).toBe('none');
  });

  it('should show element', () => {
    component = new TestComponent('div', { text: 'test' });
    document.body.appendChild(component.getContent()!);

    component.hide();
    expect(component.getContent()?.style.display).toBe('none');

    component.show();
    expect(component.getContent()?.style.display).toBe('block');
  });

  it('should destroy element and remove from DOM', () => {
    component = new TestComponent('div', { text: 'test' });
    document.body.appendChild(component.getContent()!);

    expect(document.body.contains(component.getContent()!)).toBe(true);

    component.destroy();

    expect(component.getContent()).toBeNull();
    expect(document.body.contains(component.getContent()!)).toBe(false);
  });

  it('should add and remove event listeners', () => {
    const clickHandler = jest.fn();

    class ComponentWithEvents extends Block<{ events: { click: (e: Event) => void } }> {
      render(): DocumentFragment {
        return this.compile('<button>Click me</button>', this.props);
      }
    }

    const eventComponent = new ComponentWithEvents('div', { events: { click: clickHandler } });
    document.body.appendChild(eventComponent.getContent()!);

    const button = eventComponent.getContent()?.querySelector('button');
    button?.click();

    expect(clickHandler).toHaveBeenCalledTimes(1);

    eventComponent.setProps({ events: {} } as any);
    button?.click();

    expect(clickHandler).toHaveBeenCalledTimes(1);

    eventComponent.destroy();
  });

  it('should add attributes to element', () => {
    class ComponentWithAttrs extends Block<{ attr: { id: string; class: string } }> {
      render(): DocumentFragment {
        return this.compile('<div>Test</div>', this.props);
      }
    }

    const attrComponent = new ComponentWithAttrs('div', {
      attr: { id: 'test-id', class: 'test-class' }
    });
    document.body.appendChild(attrComponent.getContent()!);

    expect(attrComponent.getContent()?.getAttribute('id')).toBe('test-id');
    expect(attrComponent.getContent()?.getAttribute('class')).toBe('test-class');

    attrComponent.destroy();
  });

  it('should call componentReceivesProps when props change', () => {
    class ComponentWithReceivesProps extends TestComponent {
      componentReceivesProps(nextProps: TestComponentProps): void {
        super.componentReceivesProps(nextProps);
      }
    }

    const receivesPropsComponent = new ComponentWithReceivesProps('div', { text: 'Initial' });
    const componentReceivesPropsSpy = jest.spyOn(receivesPropsComponent, 'componentReceivesProps');

    receivesPropsComponent.setProps({ text: 'Updated' });

    expect(componentReceivesPropsSpy).toHaveBeenCalledTimes(1);
    expect(componentReceivesPropsSpy).toHaveBeenCalledWith({ text: 'Updated' });

    componentReceivesPropsSpy.mockRestore();
    receivesPropsComponent.destroy();
  });

  it('should not update when setProps is called with null or undefined', () => {
    component = new TestComponent('div', { text: 'Initial' });
    const initialText = component.props.text;

    component.setProps(null as any);
    component.setProps(undefined as any);

    expect(component.props.text).toBe(initialText);
  });

  it('should throw error when trying to delete prop', () => {
    component = new TestComponent('div', { text: 'test' });

    expect(() => {
      delete component.props.text;
    }).toThrow('Нельзя удалить свойство text из props');
  });
});