import merge from "deepmerge";
import * as shvl from "shvl";
interface Storage {
  getItem: (key: string) => any;
  setItem: (key: string, value: any) => void;
  removeItem: (key: string) => void;
}
let _store: Store;

interface Module { }
interface Icommon {
  commit: (type: string, payload?: any, options?: Object) => any | ((mutation: Object, options?: Object) => any);
  dispatch: (type: string, payload?: any, options?: Object) => any | ((action: Object, options?: Object) => any);
  getters: object;
  state: object;
}
interface Store extends Icommon {
  registerModule: (path: string | Array<string>, module: Module, options?: Object) => any;
  unregisterModule: (path: string | Array<string>) => any;
  hasModule(path: string | Array<string>): boolean
  replaceState(state: Object)
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
  subscriber?: (
    store: Store
  ) => (handler: (mutation: any, state: object) => void) => void;
  storage?: Storage;
  getState?: (key: string, storage: Storage) => any;
  setState?: (key: string, state: any, storage: Storage) => void;
  assertStorage?: (storage: Storage) => void | Error;
  overwrite?: boolean;
}
export const connect = <T extends Actions, K extends Mutations>({
  ns,
  getters,
  mutations,
  actions,
  state,
  cache,
  cacheOptions
}: {
  ns: string;
  getters?: object;
  mutations?: K;
  actions: T;
  state?: object;
  cacheOptions?: CacheOptions,
  cache?: boolean;
}): T | Result<K> => {
  cacheOptions = cacheOptions || {};
  const storage = cacheOptions.storage || (window && window.localStorage);
  const key = cacheOptions.key || ns;

  function getState(key, storage) {
    const value = storage.getItem(key);

    try {
      return (typeof value !== "undefined")
        ? JSON.parse(value)
        : undefined;
    } catch (err) { }

    return undefined;
  }

  function setState(key, state, storage) {
    return storage.setItem(key, JSON.stringify(state));
  }

  function reducer(state, paths) {
    return Array.isArray(paths)
      ? paths.reduce(function (substate, path) {
        return shvl.set(substate, path, shvl.get(state, path));
      }, {})
      : state;
  }

  function subscriber(store) {
    return function (handler) {
      return store.subscribe(handler);
    };
  }

  if (_store) {
    if (!ns || !actions) {
      throw new Error("ns(命名空间) 和 actions(方法集合) 字段为必传哦~");
    }

    const methods = { ns, commit: {} } as T | Result<K>;
    const _actions = {};
    const typeFn = (options, key) => !!options ? key : `${ns}/${key}`;

    Object.keys(actions).forEach(key => {
      const _self = actions[key];
      _actions[key] = (context: Context, payload) => _self.bind(context)(context, payload);

      // @ts-ignore
      methods[key] = function (payload, options?: Object) {
        return _store.dispatch(typeFn(options, key), payload, options);
      };
    });

    Object.keys(mutations).forEach(key => {
      methods.commit[key] = (payload, options?: Object) => {
        _store.commit(typeFn(options, key), payload, options);
      };
    });

    const _state = _store.hasModule(ns) || state || {};

    if (_store.hasModule(ns)) {
      _store.unregisterModule(ns);
    }
    _store.registerModule(ns, {
      namespaced: true,
      mutations: mutations || {},
      actions: _actions,
      state: _state,
      getters: getters || {}
    });
    if (cache) {
      (cacheOptions.subscriber || subscriber)(_store)(function (mutation, state) {
        if (mutation) {
          (cacheOptions.setState || setState)(
            key,
            (cacheOptions.reducer || reducer)(state, [ns]),
            storage
          );
        }
      });
      let savedState = (() => (cacheOptions.getState || getState)(key, storage))();

      if (typeof savedState === "object" && savedState !== null) {
        _store.replaceState(
          cacheOptions.overwrite
            ? savedState
            : merge(_store.state, savedState)
        );
      }
    }

    return methods;
  } else {
    throw new Error("请先调用vx-refactor(store)进行初始化~");
  }
};

export default (store: Store) => {
  _store = store;
};
