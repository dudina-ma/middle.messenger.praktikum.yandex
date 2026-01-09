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

class NoUpdateComponent extends TestComponent {
  shouldComponentUpdate(): boolean {
    return false;
  }
}

class CompileComponent extends Block<TestComponentProps> {
  render(): DocumentFragment {
    return this.compile('<div>{{text}}</div>', this.props);
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
    component.dispatchComponentDidMount();

    expect(component.getContent()?.textContent).toBe('Hello World');
  });

  it('should create element with correct tagName', () => {
    component = new TestComponent('section', { text: 'test' });

    document.body.appendChild(component.getContent()!);
    component.dispatchComponentDidMount();

    expect(component.getContent()?.tagName.toLowerCase()).toBe('section');
  });

  it('should update render output when props change', () => {
    component = new TestComponent('div', { text: 'Hello World' });

    component.setProps({ text: 'Hello World 2' });

    document.body.appendChild(component.getContent()!);
    component.dispatchComponentDidMount();

    expect(component.getContent()?.textContent).toBe('Hello World 2');
  });

  it('should call componentDidMount when dispatchComponentDidMount is called', () => {
    component = new TestComponent('div', { text: 'test' });
    const componentDidMountSpy = jest.spyOn(component, 'componentDidMount');

    component.dispatchComponentDidMount();

    expect(componentDidMountSpy).toHaveBeenCalledTimes(1);
  });

  it('should not re-render when shouldComponentUpdate returns false', () => {
    const noUpdateComponent = new NoUpdateComponent('div', { text: 'Initial' });

    document.body.appendChild(noUpdateComponent.getContent()!);
    noUpdateComponent.dispatchComponentDidMount();

    const initialContent = noUpdateComponent.getContent()?.textContent;
    const renderSpy = jest.spyOn(noUpdateComponent, 'render');

    noUpdateComponent.setProps({ text: 'Changed' });

    expect(renderSpy).not.toHaveBeenCalled();
    expect(noUpdateComponent.getContent()?.textContent).toBe(initialContent);
  });

  it('should call compile method when render is called', () => {
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
  });

  it('should render child component in template', () => {
    const child = new ChildComponent('div', { text: 'Child Text' });
    const parent = new ParentWithChildComponent('div', { child });

    document.body.appendChild(parent.getContent()!);
    parent.dispatchComponentDidMount();

    const parentElement = parent.getContent();
    const childElement = parentElement?.querySelector('span');

    expect(childElement).toBeTruthy();
    expect(childElement?.textContent).toBe('Child Text');
  });

  it('should replace stub with child content', () => {
    const child = new ChildComponent('div', { text: 'Child' });
    const parent = new ParentWithChildComponent('div', { child });

    document.body.appendChild(parent.getContent()!);
    parent.dispatchComponentDidMount();

    const parentElement = parent.getContent();
    const stub = parentElement?.querySelector('[data-id]');
    expect(stub).toBeNull();
  });

  it('should handle multiple children', () => {
    const child1 = new ChildComponent('div', { text: 'Child 1' });
    const child2 = new ChildComponent('div', { text: 'Child 2' });

    class ParentWithMultipleChildren extends Block<{
      child1: Block<TestComponentProps>;
      child2: Block<TestComponentProps>;
    }> {
      render(): DocumentFragment {
        return this.compile('<div>{{{child1}}} {{{child2}}}</div>', this.props);
      }
    }

    const parent = new ParentWithMultipleChildren('div', { child1, child2 });

    document.body.appendChild(parent.getContent()!);
    parent.dispatchComponentDidMount();

    const spans = parent.getContent()?.querySelectorAll('span');
    expect(spans).toHaveLength(2);
    expect(spans?.[0].textContent).toBe('Child 1');
    expect(spans?.[1].textContent).toBe('Child 2');
  });

  it('should identify array of Blocks as list', () => {
    const item1 = new ChildComponent('div', { text: 'Item 1' });
    const item2 = new ChildComponent('div', { text: 'Item 2' });
    const items = [item1, item2];

    const parent = new ParentWithListComponent('div', { items });

    expect(parent['lists']).toHaveProperty('items');
    expect(parent['lists'].items).toEqual(items);
  });

  it('should render list of children in template', () => {
    const item1 = new ChildComponent('div', { text: 'Item 1' });
    const item2 = new ChildComponent('div', { text: 'Item 2' });
    const parent = new ParentWithListComponent('div', { items: [item1, item2] });

    document.body.appendChild(parent.getContent()!);
    parent.dispatchComponentDidMount();

    const spans = parent.getContent()?.querySelectorAll('span');
    expect(spans).toHaveLength(2);
    expect(spans?.[0].textContent).toBe('Item 1');
    expect(spans?.[1].textContent).toBe('Item 2');
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
  });

  it('should handle empty children array', () => {
    const parent = new ParentWithListComponent('div', { items: [] });

    document.body.appendChild(parent.getContent()!);
    parent.dispatchComponentDidMount();

    const spans = parent.getContent()?.querySelectorAll('span');
    expect(spans).toHaveLength(0);
  });

  it('should create unique stub for each child', () => {
    const child1 = new ChildComponent('div', { text: 'Child 1' });
    const child2 = new ChildComponent('div', { text: 'Child 2' });

    class ParentWithMultipleChildren extends Block<{
      child1: Block<TestComponentProps>;
      child2: Block<TestComponentProps>;
    }> {
      render(): DocumentFragment {
        return this.compile('<div>{{{child1}}} {{{child2}}}</div>', this.props);
      }
    }

    const parent = new ParentWithMultipleChildren('div', { child1, child2 });
    document.body.appendChild(parent.getContent()!);
    parent.dispatchComponentDidMount();

    const spans = parent.getContent()?.querySelectorAll('span');
    expect(spans).toHaveLength(2);
    expect(spans?.[0].textContent).not.toBe(spans?.[1].textContent);
  });
});