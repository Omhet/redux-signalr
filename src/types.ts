import { HubConnection } from '@microsoft/signalr';
import { Action, Dispatch, Middleware, AnyAction } from 'redux';

export interface SignalDispatch<S, A extends Action> {
  <T extends A>(action: T): T;
  <R>(asyncAction: SignalAction<R, S, A>): R;
}

export type SignalAction<R, S, A extends Action> = (
  dispatch: SignalDispatch<S, A>,
  getState: () => S,
  invoke: HubConnection['invoke']
) => R;

export type SignalMiddleware<S = {}, A extends Action = AnyAction> = Middleware<
  SignalDispatch<S, A>,
  S,
  SignalDispatch<S, A>
>;

export type CallbackName = string;
export type Callback<S = any, D extends Dispatch = Dispatch> = (
  ...args: any[]
) => (dispatch: D, getState: () => S, invoke: HubConnection['invoke']) => void;
export interface WithCallbacks<S = any, D extends Dispatch = Dispatch> {
  (): void;
  add: (name: CallbackName, callback: Callback<S, D>) => WithCallbacks<S, D>;
  callbackMap: Map<string, Callback<S, D>>;
}
export type WithCallbacksCreator = <
  S = any,
  D extends Dispatch = Dispatch
>() => WithCallbacks<S, D>;

export interface MiddlewareConfig<S = any, D extends Dispatch = Dispatch> {
  callbacks: WithCallbacks<S, D>;
  connection: HubConnection;
  onStart?(): void;
  shouldConnectionStartImmediately?: boolean;
}
