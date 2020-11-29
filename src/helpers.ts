import { Callback, CallbackName, WithCallbacksCreator } from './types';
import { Dispatch } from 'redux';

export const withCallbacks: WithCallbacksCreator = <
  S = any,
  D extends Dispatch = Dispatch
>() => {
  const callbackMap = new Map<CallbackName, Callback<S, D>>();

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const moduleReducer = () => {};

  const add = (name: CallbackName, callback: Callback<S, D>) => {
    callbackMap.set(name, callback);
    return moduleReducer;
  };

  moduleReducer.add = add;
  moduleReducer.callbackMap = callbackMap;

  return moduleReducer;
};
