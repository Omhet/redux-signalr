# Redux middleware for SignalR (ASP.NET Core)

[![NPM Version](https://img.shields.io/npm/v/redux-signalr.svg?style=flat)](https://www.npmjs.com/package/redux-signalr)
[![NPM License](https://img.shields.io/npm/l/all-contributors.svg?style=flat)](https://github.com/Omhet/redux-signalr/blob/master/LICENSE)

## Installation

```bash
npm install redux-signalr
```

or

```bash
yarn add redux-signalr
```

## Usage

**NOTE:** Apart of SignalR invoke method, redux-signalr gives you an access to Redux state and dispatch in actions, so you don't need to use redux-thunk and redux-signalr simultaneously as the latter already does the same job.

### First, configuration

#### Build a connection object

```ts
const connection = new HubConnectionBuilder()
  .configureLogging(LogLevel.Debug)
  .withUrl('https://0.0.0.0:5001/testHub', {
    skipNegotiation: true,
    transport: HttpTransportType.WebSockets,
  })
  .build();
```

#### Register callbacks

In the callbacks you have an access to redux dispatch and getState and signalr invoke methods.

```ts
const callbacks = withCallbacks()
  .add('ReceiveMessage', (msg: string) => (dispatch) => {
    dispatch(setText(msg));
  })
  .add('ReceiveRandomNumber', (num: number) => (dispatch, getState, invoke) => {
    const { example } = getState();
    dispatch(setRandomNumber(num));
    invoke('SendMessage', txt + example.text)
  })
```

#### Create middleware with the callbcaks and connection object

```ts
export const signal = signalMiddleware({
  callbacks,
  connection,
});
```

### Second, apply the configured middleware

```ts
import { signal } from './helpers/withSignalR';

export default function configureStore(preloadedState?: RootState) {
  return createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(signal)
  );
}
```

### Third, write action functions as you would do with thunk, but now it has the third parameter - invoke (from signalR) to call server methods

```ts
export const sendMessage = (txt: string): Action => (dispatch, getState, invoke) => {
  invoke('SendMessage', txt)
};
```

### Fourth (only for TS), add custom types

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

Use those Dispatch and RootState types in callbacks, this way you will have correct typings for dispatch and getState methods in your callbacks

```ts
const callbacks = withCallbacks<Dispatch, RootState>()
  .add('CallbackName', () => (dispatch, getState, invoke) => { }
```

#### Additional features

##### Don't start a connection immediately

Create signalMiddleware with shouldConnectionStartImmediately set to false.

```ts
const signal = signalMiddleware({
  callbacks,
  connection,
  shouldConnectionStartImmediately: false
});
```

Then, import the 'connection' in the place you want and start it if it's not already.
Here is an example with a simple Button container:

```ts
import { connection } from "../redux/helpers/createSignalMiddleware";

const StartConnectionButton: FunctionComponent = () => {
  const handleClick = useCallback(() => {
    if (connection.state !== HubConnectionState.Connected) {
      connection
        .start()
        .then(() => console.log("Connection started"))
        .catch((err) => console.error(err.toString()));
    }
  }, []);

  return <Button onClick={handleClick}>Start Connection</Button>;
};

export default StartConnectionButton;
```
