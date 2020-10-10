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

export const connect = <T extends Actions, K extends Mutations>({
  ns,
  getters,
  mutations,
  actions,
  state
}: {
  ns: string;
  getters?: object;
  mutations?: K;
  actions: T;
  state?: object;
}): T | Result<K> => {
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

    const _state = _store.state[ns] || state || {};

    if (_store.state[ns]) {
      _store.unregisterModule(ns);
    }
    _store.registerModule(ns, {
      namespaced: true,
      mutations: mutations || {},
      actions: _actions,
      state: _state,
      getters: getters || {}
    });
    return methods;
  } else {
    throw new Error("请先调用vx-refactor(store)进行初始化哦~");
  }
};

export default (store: Store) => {
  _store = store;
};
