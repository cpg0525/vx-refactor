- ##### 安装

> npm install v-refactor or yarn add v-refactor；

- ##### 使用方法

###### 1. 在 main.js 中注入 store 实例。

```
import vxRefactor from 'vx-refactor';
vxRefactor(store);

```

###### 2. 在业务 model 中用 connect 方法进行改造。

```
import { connect } from 'vx-refactor';

export const ns = 'namespace';
const state = {
  count: 0
};
const mutations = {
  addCount(state, payload) {
    state.count = payload;
  }
};
const actions = {
  setCount({ commit }, params) {
    commit('addCount', params);
  }
};
const getters = {
  getCount(state) {
    return state.count;
  }
};
export default connect({
  ns,
  state,
  mutations,
  actions,
  getters
});

```

###### 3. 在业务页面中调用。

```
import models, {ns} from './model'; // 引入当前业务所在的model

 computed: {
    ...mapState(ns, ['count'])
 },
 methods: {
    introduce() {
      // 支持选传第二个参数options。options 里可以有 root: true，它允许在命名空间模块里分发根的 action
      models.setCount(2) || models.setCount(2, {root: true});
      // 支持选传第二个参数options。
      models.commit.addCount(3）|| models.commit.addCount(3, {root: true});
    }
 }

```

#### vx-refactor 由来

+  命名:

   vx为vuex的读音缩写。refactor 意为重构的意思。整合起来，就是对原生vuex的重构。

+ 解决的问题

| 注入方式 | 调用方式 | 
| :---- | :---- |
| 原生vuex需大量注入模块 | 原生vuex调用action&mutation需配合 dispatch&commit等方法 |
| 经vx-refactor重构后，只需面向对象调用 | 经vx-refactor重构后，只需调用connect方法便可自动动态注入 | 
