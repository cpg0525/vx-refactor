"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = void 0;
const deepmerge_1 = __importDefault(require("deepmerge"));
const shvl = __importStar(require("shvl"));
let _store;
const connect = ({ ns, getters, mutations, actions, state, cache, cacheOptions }) => {
    cacheOptions = cacheOptions || {};
    const storage = cacheOptions.storage || (window && window.localStorage);
    const key = cacheOptions.key || ns;
    function getState(key, storage) {
        const value = storage.getItem(key);
        try {
            return (typeof value !== "undefined")
                ? JSON.parse(value)
                : undefined;
        }
        catch (err) { }
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
                    (cacheOptions.setState || setState)(key, (cacheOptions.reducer || reducer)(state, [ns]), storage);
                }
            });
            let savedState = (() => (cacheOptions.getState || getState)(key, storage))();
            if (typeof savedState === "object" && savedState !== null) {
                _store.replaceState(cacheOptions.overwrite
                    ? savedState
                    : deepmerge_1.default(_store.state, savedState));
            }
        }
        return methods;
    }
    else {
        throw new Error("请先调用vx-refactor(store)进行初始化~");
    }
};
exports.connect = connect;
exports.default = (store) => {
    _store = store;
};
//# sourceMappingURL=index.js.map