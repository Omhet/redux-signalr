# Redux middleware for SignalR (ASP.NET Core)

## Installation

```bash
npm install redux-signalr
```
or
```bash
yarn add redux-signalr
```

## Usage

**NOTE:** You don't need to install @microsoft/signalr as  it's already included in this package for convenience and exports all the code from @microsoft/signalr.
Also, apart of SignalR invoke method, redux-signalr gives you an access to Redux state and dispatch in actions, so you don't need to use redux-thunk and redux-signalr simultaneously as the latter already does the same job.

### First, configure your middleware and register callbacks

src/redux/withSignalR.ts
```ts
import { withCallbacks, signalMiddleware, LogLevel, HttpTransportType } from 'redux-signalr';

const callbacks = withCallbacks()
  .add('ReceiveMessage', (msg: string) => (dispatch: Dispatch) => {
    dispatch(setText(msg));
  })
  .add('ReceiveRandomNumber', (num: number) => (dispatch: Dispatch) => {
    dispatch(exampleFsa.setRandomNumber(num));
  })
  
const signal = signalMiddleware({
    callbacks,
    url: 'https://192.168.1.12:5001/testHub',
    logLevel: LogLevel.Debug,
    connectionOptions: { 
      skipNegotiation: true,
      transport: HttpTransportType.WebSockets
    }
})
```

### Second, apply the configured middleware 

src/redux/index.ts
```ts
import signal from './helpers/createSignalMiddleware';

export default function configureStore(preloadedState?: RootState) {
  return createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(signal)
  );
}
```

### Third, write action functions as you would do with thunk, but now it has the third parameter - invoke (from signalR) to call server methods

src/redux/modules/example/index.ts
```ts
const sendMessage = (txt: string): Action => (dispatch, getState, invoke) => {
  invoke('SendMessage', txt)
};
```

### Fourth (only for TS), add custom types

src/redux/types.ts
```ts
import { rootReducer } from './rootReducer';
import { AnyAction } from 'redux';
import { SignalAction, SignalDispatch } from 'redux-signalr';

export type RootState = ReturnType<typeof rootReducer>;

export type Action<ReturnValue = void> = SignalAction<
  ReturnValue,
  RootState,
  AnyAction
>;

export type Dispatch<Action extends AnyAction = AnyAction> = SignalDispatch<
  RootState,
  Action
>;
```
