/* eslint-disable @typescript-eslint/no-explicit-any */
import * as signalR from '@microsoft/signalr';
import { Action, Dispatch, Middleware, AnyAction } from 'redux';

export interface SignalDispatch<S, A extends Action> {
  <T extends A>(action: T): T;
  <R>(asyncAction: SignalAction<R, S, A>): R;
}

export type SignalAction<R, S, A extends Action> = (
  dispatch: SignalDispatch<S, A>,
  getState: () => S,
  invoke: signalR.HubConnection['invoke']
) => R;

export type SignalMiddleware<S = {}, A extends Action = AnyAction> = Middleware<
  SignalDispatch<S, A>,
  S,
  SignalDispatch<S, A>
>;

export type CallbackName = string;
export type Callback<D = any, S = any> = (
  ...args: any[]
) => (
  dispatch: D,
  getState: () => S,
  invoke: signalR.HubConnection['invoke']
) => void;
export interface WithCallbacks<D = any, S = any> {
  (): void;
  add: (name: CallbackName, callback: Callback<D, S>) => WithCallbacks<D, S>;
  callbackMap: Map<string, Callback<D, S>>;
}
export type WithCallbacksCreator = <D = any, S = any>() => WithCallbacks<D, S>;

export interface MiddlewareConfig<D = any, S = any> {
  callbacks: WithCallbacks<D, S>;
  connection: signalR.HubConnection;
  onStart?(): void;
  shouldConnectionStartImmediately?: boolean;
}
