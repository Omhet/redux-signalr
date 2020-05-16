export const withCallbacks = () => {
    const callbackMap = new Map();
    const moduleReducer = () => { };
    const add = (name, callback) => {
        callbackMap.set(name, callback);
        return moduleReducer;
    };
    moduleReducer.add = add;
    moduleReducer.callbackMap = callbackMap;
    return moduleReducer;
};
