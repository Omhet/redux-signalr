import { Callback, CallbackName, WithCallbacksCreator } from './types';
import { Dispatch } from 'redux';

export const withCallbacks: WithCallbacksCreator = <
  D extends Dispatch = Dispatch,
  S = any
>() => {
  const callbackMap = new Map<CallbackName, Callback<D, S>>();

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const moduleReducer = () => {};

  const add = (name: CallbackName, callback: Callback<D, S>) => {
    callbackMap.set(name, callback);
    return moduleReducer;
  };

  moduleReducer.add = add;
  moduleReducer.callbackMap = callbackMap;

  return moduleReducer;
};
