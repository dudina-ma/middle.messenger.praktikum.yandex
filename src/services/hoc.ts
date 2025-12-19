import Block from './block';
import store from '../store/store';
import { StoreEvents } from '../store/store';
import type { State } from '../store/store';
import { isEqual } from '../utils/helpers';

type PageProps = {
	attr: Record<string, string>;
};

type PageConstructor = new (tagName?: string, props?: PageProps) => Block<object>;

// типизация
function connect<TProps extends object>(mapStateToProps: (state: State) => TProps) {
	return function(Component: typeof Block<object>): PageConstructor {
		return class extends Component {
			private currentState: ReturnType<typeof mapStateToProps>;

			// по идее это неправильно, потому что мы не только страницы будем оборачивать в этот HOC, а и компоненты
			constructor(tagName?: string, props?: PageProps) {
				const initialState = mapStateToProps(store.getState());

				// разобраться
				const finalTagName = tagName || (props as any)?.tagName || 'div';
				const propsWithoutTagName = props ? { ...props } : {};
				delete (propsWithoutTagName as any).tagName;
  
				super(finalTagName, { ...propsWithoutTagName, ...initialState } as object);
  
				this.currentState = initialState;

				// подписываемся на событие
				store.on(StoreEvents.Updated, this.handleStoreUpdate);
			}

			private handleStoreUpdate = () => {
				// при обновлении получаем новое состояние
				const newState = mapStateToProps(store.getState());
            
				// если что-то из используемых данных поменялось, обновляем компонент
				if (!isEqual(this.currentState, newState)) {
					this.setProps({ ...newState });
				}

				this.currentState = newState;
			};

			public destroy() {
				super.destroy();
				store.off(StoreEvents.Updated, this.handleStoreUpdate);
			}
		};
	};
}
  
export default connect;
