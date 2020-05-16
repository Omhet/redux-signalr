declare type Name = string;
declare type Callback = (...args: any[]) => (dispatch: any) => void;
export declare const withCallbacks: () => {
    (): void;
    add: (name: Name, callback: Callback) => any;
    callbackMap: Map<string, Callback>;
};
export {};
