import { Callback, CallbackName, WithCallbacksCreator } from './types';

export const withCallbacks: WithCallbacksCreator = () => {
  const callbackMap = new Map<CallbackName, Callback>();

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const moduleReducer = () => {};

  const add = (name: CallbackName, callback: Callback) => {
    callbackMap.set(name, callback);
    return moduleReducer;
  };

  moduleReducer.add = add;
  moduleReducer.callbackMap = callbackMap;

  return moduleReducer;
};
