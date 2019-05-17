import { createStore, applyMiddleware } from 'redux';
import { logger } from '../../middleware';
import rootReducer from '../reducer';
import thunk from 'redux-thunk' // redux-thunk 支持 dispatch function，并且可以异步调用它

const nextReducer = require('../reducer');

export default function configure(initialState) {
    // console.log('initialState', initialState);

    //判断是否启动redux调试插件
    const create = window.devToolsExtension ? window.devToolsExtension()(createStore) : createStore;

    // 添加插件
    const createStoreWithMiddleware = applyMiddleware(
        // reduxRouterMiddleware,
        logger,
        thunk
    )(create);

    // 增强store
    window.store = createStoreWithMiddleware(rootReducer, initialState);

    if (module.hot) {
        module.hot.accept('../reducer', () => {
            store.replaceReducer(nextReducer);
        });
    }

    return store;
}

