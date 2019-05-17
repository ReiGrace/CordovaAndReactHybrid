// import { syncHistoryWithStore } from 'react-router-redux';
// import myhistory from '../history/history.js';

// If you are using ES6's import syntax in your application's entry point,
// you should instead import the polyfill at the top of the entry point to ensure the polyfills are loaded first
import "babel-polyfill";
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import RefProvider from './provider';
import configure from '../redux/store/configureStore';
import Router from '../js/page/Index/index';
import Login from '../js/page/Login/index';

// import 'antd-mobile/dist/antd-mobile.css';

window.store = configure({ config: global.$GLOBALCONFIG });
// require("../iconfont/iconfont.css");
// 如果使用router路由，需要同步history和store
// 创建一个增强版的history来结合store同步导航事件
//TODO: 问题：store插件中包含增强的history，是否两个history相同才能同步？
// const history = syncHistoryWithStore(myhistory, store);
// history.listen(function (location) { return location });

render(
    <Provider store={store} >
        <RefProvider refs={{}} >
            <Router page={Login} />
        </RefProvider>
    </Provider>,
    document.querySelector('#app')
);