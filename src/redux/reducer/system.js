import {
    GET_SQL_EXECUTE,
    POST_SQL_EXECUTE,
    FILE_UPLOAD_ACTION,

    GET_SQL_EXECUTE_OPEN,
    POST_SQL_EXECUTE_OPEN,
} from '../action/system';

export const getSqlExecuteData = (state = {}, action) => {
    switch (action.type) {
        case GET_SQL_EXECUTE:
            action.success ? action.success(action.json) : null;
            return action.json;
        case POST_SQL_EXECUTE:
            action.success ? action.success(action.json) : null;
            return action.json;
        default:
            return state;
    }
}

export const getSqlExecuteOpenData = (state = {}, action) => {
    switch (action.type) {
        case GET_SQL_EXECUTE_OPEN:
            action.success ? action.success(action.json) : null;
            return action.json;
        case POST_SQL_EXECUTE_OPEN:
            action.success ? action.success(action.json) : null;
            return Object.assign(state, {
                default: action.json
            });
        default:
            return state;
    }
}

export const fileUploadData = (state = {}, action) => {
    switch (action.type) {
        case FILE_UPLOAD_ACTION:
            action.success ? action.success(action.json) : null;
            return action.json;
        default:
            return state;
    }
}
