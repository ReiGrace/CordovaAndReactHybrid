export default store => next => action => {
    //经过多次封装的logger
    // console.log('dispatching', action)
    let result = next(action);
    // console.log('next state', store.getState());
    return result;
}