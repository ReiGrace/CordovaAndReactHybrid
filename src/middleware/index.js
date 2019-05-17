// 本项目暂不使用history来增强router
// A middleware you can apply to your Redux store to capture dispatched actions created by the action creators.
// It will redirect those actions to the provided history instance.
// import { routerMiddleware } from 'react-router-redux';

// router能够使用的history
// import history from '../history/history';

// 用react-router-redux带的routerMiddleware工具来将history加入插件
// const reduxRouterMiddleware = routerMiddleware(history);


import logger from './logger';

export {
    // reduxRouterMiddleware,
    logger
}