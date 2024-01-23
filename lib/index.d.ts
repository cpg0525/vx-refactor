interface Storage {
    getItem: (key: string) => any;
    setItem: (key: string, value: any) => void;
    removeItem: (key: string) => void;
}
interface Module {
}
interface Icommon {
    commit: (type: string, payload?: any, options?: Object) => any | ((mutation: Object, options?: Object) => any);
    dispatch: (type: string, payload?: any, options?: Object) => any | ((action: Object, options?: Object) => any);
    getters: object;
    state: object;
}
interface Store extends Icommon {
    registerModule: (path: string | Array<string>, module: Module, options?: Object) => any;
    unregisterModule: (path: string | Array<string>) => any;
    hasModule(path: string | Array<string>): boolean;
    replaceState(state: Object): any;
}
interface Context extends Icommon {
    rootState: object;
}
interface Actions {
    [key: string]: (this: Context, payload?: object, context?: Context) => any;
}
interface Mutations {
    [key: string]: (state: object, payload?: object) => any;
}
interface Result<K> {
    ns: string;
    commit: {
        [P in keyof K]: K[P];
    };
}
interface CacheOptions {
    key?: string;
    paths?: string[];
    reducer?: (state: object, paths: string[]) => object;
    subscriber?: (store: Store) => (handler: (mutation: any, state: object) => void) => void;
    storage?: Storage;
    getState?: (key: string, storage: Storage) => any;
    setState?: (key: string, state: any, storage: Storage) => void;
    assertStorage?: (storage: Storage) => void | Error;
    overwrite?: boolean;
}
export declare const connect: <T extends Actions, K extends Mutations>({ ns, getters, mutations, actions, state, cache, cacheOptions }: {
    ns: string;
    getters?: object;
    mutations?: K;
    actions: T;
    state?: object;
    cacheOptions?: CacheOptions;
    cache?: boolean;
}) => T | Result<K>;
declare const _default: (store: Store) => void;
export default _default;
