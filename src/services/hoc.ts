import Block from './block';
import store from '../store/store';
import { StoreEvents } from '../store/store';
import type { State } from '../store/store';
import { isEqual } from '../utils/helpers';

type PageProps = {
	attr: Record<string, string>;
};

type PageConstructor = new (tagName?: string, props?: PageProps) => Block<object>;

function connect<TProps extends object>(mapStateToProps: (state: State) => TProps) {
	return function(Component: typeof Block<object>): PageConstructor {
		return class extends Component {
			private currentState: ReturnType<typeof mapStateToProps>;

			constructor(tagName?: string, props?: PageProps) {
				const initialState = mapStateToProps(store.getState());

				const finalTagName = tagName || 'div';
  
				super(finalTagName, { ...props, ...initialState } as object);
  
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
