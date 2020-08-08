type Name = string;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Callback = (...args: any[]) => (dispatch: any) => void;

export const withCallbacks = () => {
  const callbackMap = new Map<Name, Callback>();

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const moduleReducer = () => {};

  const add = (name: Name, callback: Callback) => {
    callbackMap.set(name, callback);
    return moduleReducer;
  };

  moduleReducer.add = add;
  moduleReducer.callbackMap = callbackMap;

  return moduleReducer;
};
