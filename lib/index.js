let _store;
export const connect = ({ ns, getters, mutations, actions, state }) => {
    if (_store) {
        if (!ns || !actions) {
            throw new Error("ns(命名空间) 和 actions(方法集合) 字段为必传哦~");
        }
        const methods = { ns, commit: {} };
        const _actions = {};
        const typeFn = (options, key) => !!options ? key : `${ns}/${key}`;
        Object.keys(actions).forEach(key => {
            const _self = actions[key];
            _actions[key] = (context, payload) => _self.bind(context)(context, payload);
            // @ts-ignore
            methods[key] = function (payload, options) {
                return _store.dispatch(typeFn(options, key), payload, options);
            };
        });
        Object.keys(mutations).forEach(key => {
            methods.commit[key] = (payload, options) => {
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
    }
    else {
        throw new Error("请先调用vx-refactor(store)进行初始化哦~");
    }
};
export default (store) => {
    _store = store;
};
//# sourceMappingURL=index.js.map