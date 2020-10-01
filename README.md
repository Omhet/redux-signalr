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

### First, configure your middleware: register callbacks and build a connection object

src/redux/withSignalR.ts

```ts
import { withCallbacks, signalMiddleware, LogLevel, HttpTransportType, HubConnectionBuilder } from 'redux-signalr';

const callbacks = withCallbacks()
  .add('ReceiveMessage', (msg: string) => (dispatch) => {
    dispatch(setText(msg));
  })
  .add('ReceiveRandomNumber', (num: number) => (dispatch) => {
    dispatch(setRandomNumber(num));
  })
  
const connection = new HubConnectionBuilder()
  .configureLogging(LogLevel.Debug)
  .withUrl("https://0.0.0.0:5001/testHub", {
    skipNegotiation: true,
    transport: HttpTransportType.WebSockets,
  })
  .build();

const signal = signalMiddleware({
  callbacks,
  connection,
});
```

### Second, apply the configured middleware

src/redux/index.ts

```ts
import signal from './helpers/withSignalR';

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
export const sendMessage = (txt: string): Action => (dispatch, getState, invoke) => {
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

#### Additional features

##### Don't start a connection immediately

Create signalMiddleware with shouldConnectionStartImmediately set to false. Export the 'connection'.

```ts  
export const connection = new HubConnectionBuilder()
  .configureLogging(LogLevel.Debug)
  .withUrl("https://0.0.0.0:5001/testHub", {
    skipNegotiation: true,
    transport: HttpTransportType.WebSockets,
  })
  .build();

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
