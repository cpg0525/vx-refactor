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
export declare const connect: <T extends Actions, K extends Mutations>({ ns, getters, mutations, actions, state }: {
    ns: string;
    getters?: object;
    mutations?: K;
    actions: T;
    state?: object;
}) => T | Result<K>;
declare const _default: (store: Store) => void;
export default _default;
