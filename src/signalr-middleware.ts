import { SignalMiddleware, MiddlewareConfig } from './types';

const signal = ({
  callbacks,
  onStart = () => {},
  connection,
}: MiddlewareConfig): SignalMiddleware => (store) => {
  const { callbackMap } = callbacks;
  for (const [name, callback] of callbackMap) {
    connection.on(name, (...args) => {
      callback
        .call(null, ...args)
        .call(
          store,
          store.dispatch.bind(store),
          store.getState.bind(store),
          connection.invoke.bind(connection)
        );
    });
  }

  connection
    .start()
    .then(function () {
      onStart();
    })
    .catch(function (err) {
      return console.error(err.toString());
    });

  return (next) => (action) =>
    typeof action === 'function'
      ? action(
          store.dispatch.bind(store),
          store.getState.bind(store),
          connection.invoke.bind(connection)
        )
      : next(action);
};

export default signal;
