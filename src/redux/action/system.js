import fetch from 'isomorphic-fetch';
import Api from '../../config/config';
import Unit from '../../config/unit';

export const GET_SQL_EXECUTE = 'GET_SQL_EXECUTE';
export const POST_SQL_EXECUTE = 'POST_SQL_EXECUTE';
export const FILE_UPLOAD_ACTION = 'FILE_UPLOAD_ACTION';

// executeOpen
export const GET_SQL_EXECUTE_OPEN = 'GET_SQL_EXECUTE_OPEN';
export const POST_SQL_EXECUTE_OPEN = 'POST_SQL_EXECUTE_OPEN';

const getDataSuccess = (json, success, type) => {
    return {
        json,
        success,
        type: type
    }
}

//执行 SQL服务（带权） GET
export const getSqlExecuteAction = (params, success) => {
    var path = Api.Sql.execute + Unit.paramData(params);
    return dispatch => {
        return fetch(path, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'AccessToken': localStorage.getItem('accessToken')
            }
        })
            .then(response => response.json())
            .then(json => dispatch(getDataSuccess(json, success, GET_SQL_EXECUTE)))
            .catch(error => console.log(error));
    }
}

//执行 SQL服务（带权） POST
export const postSqlExecuteAction = (params, success) => {
    var path = Api.Sql.execute;
    return dispatch => {
        return fetch(path, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'AccessToken': localStorage.getItem('accessToken')
            },
            body: Unit.paramData(params, false)
        })
            .then(response => response.json())
            .then(json => dispatch(getDataSuccess(json, success, POST_SQL_EXECUTE)))
            .catch(error => console.log(error));
    }
}

//执行 SQL服务 GET
export const getSqlExecuteOpenAction = (params, success) => {
    var path = Api.Sql.executeOpen + Unit.paramData(params);
    return dispatch => {
        return fetch(path, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(json => dispatch(getDataSuccess(json, success, GET_SQL_EXECUTE_OPEN)))
            .catch(error => console.log(error));
    }
}

// 执行 SQL服务 POST，根据sqlCode确定获取数据类型
export const postSqlExecuteOpenAction = (params, success) => {
    var path = Api.Sql.executeOpen;
    return dispatch => {
        return fetch(path, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                'AccessToken': localStorage.getItem('accessToken')
            },
            body: Unit.paramData(params, false)
        })
            .then(response => response.json())
            .then(json => dispatch(getDataSuccess(json, success, POST_SQL_EXECUTE_OPEN)))
            .catch(error => console.log(error));
    }
}

// 通用上传接口
export const fileUploadAction = (params, success) => {
    var path = Api.File.upload;
    return dispatch => {
        return fetch(path, {
            method: 'POST',
            headers: {
                // 'Content-Type': 'multipart/form-data',
                'AccessToken': localStorage.getItem('accessToken')
            },
            body: params
        })
            .then(response => response.json())
            .then(json => dispatch(getDataSuccess(json, success, FILE_UPLOAD_ACTION)))
            .catch(error => console.log(error));
    }
}