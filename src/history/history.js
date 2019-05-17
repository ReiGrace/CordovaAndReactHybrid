import { useRouterHistory } from 'react-router';
import createHashHistory from 'history/lib/createHashHistory';

// useRouterHistory is a history enhancer that configures a given createHistory factory to work with React Router. 
// This allows using custom histories in addition to the bundled singleton histories.
// `useRouterHistory`是一个`history`增强器，用于配置给定的`createHistory`工厂来与React Router配合工作。 除了捆绑的单例历史之外，还允许使用自定义历史。
// 不建议使用`createHashHistory`，此为适应旧浏览器
export default useRouterHistory(createHashHistory)({ queryKey: false });
