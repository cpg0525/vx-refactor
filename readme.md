
       _  _  _  _     ___   ___   __   __  ____  __  ___  
      ( )( )( \/ )___(  ,) (  _) (  ) / _)(_  _)/  \(  ,) 
       \\//  )  ((___))  \  ) _) /__\( (_   )( ( () ))  \ 
       (__) (_/\_)   (_)\_)(___)(_)(_)\__) (__) \__/(_)\_)


- ### vx-refactor 由来

  <p style="color: #333333;font-size: 1em;font-family: sans-serif;font-weight: 600;margin-bottom:0.8em">命名:</p>
   
   <p style="color: grey;font-size: 1em;font-family: sans-serif;font-weight: 600;margin-bottom:0.8em"><mark style="font-size:1.5em">vx</mark> 为vuex的读音缩写。refactor 意为重构的意思。整合起来，就是对原生vuex的重构。</p>
   

  <p style="color: #333333;font-size: 1em;font-family: sans-serif;font-weight: 600;margin-bottom:1.5em">解决的问题:</p>

  | 注入方式 | 调用方式 | 
  | :---- | :---- |
  | 原生 vuex 需大量注入模块 | 原生 vuex 调用 action & mutation 需配合 dispatch & commit 等方法 |
  | <p>经 <mark>vx-refactor</mark> 重构后，只需调用 <mark>connect</mark> 方法便可自动注入</p> | 经 <mark>vx-refactor</mark> 重构后，只需面向对象调用  | 


- ### 安装


  <p style="color: #000000;font-size: 1em;font-family: sans-serif;font-weight: 600">$ npm install vx-refactor or yarn add vx-refactor；</p>

- ### 使用方法

   <p style="color: grey;font-size: 0.8em;font-family: sans-serif;font-weight: 600;margin-bottom:0.8em">示例代码的目录如下：</p>

  ├── index.scss
  ├── index.vue
  └── model.js

  <p style="color: grey;font-size: 1em;font-family: sans-serif;font-weight: 600;margin-top:1em;margin-bottom:0.8em">1. 在 main.js 中注入 store 实例。</p>

   ```javascript
    import vxRefactor from 'vx-refactor';

    vxRefactor(store);
   ```

  <p style="color: grey;font-size: 1em;font-family: sans-serif;font-weight: 600;margin-bottom:0.8em">2. 在业务 model 中用 connect 方法进行改造。</p>

  ```javascript
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

  <p style="color: grey;font-size: 1em;font-family: sans-serif;font-weight: 600;margin-bottom:0.8em">3. 在业务页面中调用。</p>

  ```javascript
  import models, {ns} from './model'; // 引入当前业务所在的model
  
   computed: {
      ...mapState(ns, ['count'])
   },

   methods: {
      introduce() {
        // 支持选传第二个参数options。允许在命名空间模块里分发根的 action
        models.setCount(2) || models.setCount(2, {root: true});
        
        // 支持选传第二个参数options。允许在命名空间模块里分发根的 action
        models.commit.addCount(3）|| models.commit.addCount(3, {root: true});
      }
   }

  ```


