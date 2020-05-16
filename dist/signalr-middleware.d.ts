import { SignalMiddleware, MiddlewareConfig } from './types';
declare const signal: ({ callbacks, onStart, url, logLevel, connectionOptions, connection: userConnection }: MiddlewareConfig) => SignalMiddleware;
export default signal;
