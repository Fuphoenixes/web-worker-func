declare type Func = (...args: any) => any;
declare type WebWorkerBuilder = <T extends Func>(fn: T, options?: Options) => (...args: Parameters<T>) => Promise<ReturnType<T>>;
declare type Options = {
    timeout?: number;
    importScripts?: string[];
    transferable?: boolean;
};
declare const webWorkerBuilder: WebWorkerBuilder;

export { webWorkerBuilder as default };
