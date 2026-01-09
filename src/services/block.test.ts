import Block from './block';

type TestComponentProps = {
  text?: string;
  count?: number;
};

class TestComponent extends Block<TestComponentProps> {
  render(): DocumentFragment {
    const fragment = document.createDocumentFragment();
    const div = document.createElement('div');
    div.textContent = this.props.text || 'test';
    fragment.appendChild(div);
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
    component = new CompileComponent('div', { text: 'test' });

    expect(compileSpy).toHaveBeenCalledTimes(1);
    expect(compileSpy).toHaveBeenCalledWith('<div>{{text}}</div>', { text: 'test' });

    compileSpy.mockRestore();
  });
});