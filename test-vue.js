/**
 * MVVM和MVC
 * MVC：
 *  Model：处理数据逻辑
 *  View：处理数据显示
 *  Controller：处理用户交互
 * MVVM：
 *  Model：处理数据逻辑
 *  View：处理数据显示
 *  ViewModel：数据绑定到ViewModel并渲染页面，视图变化通知ViewModel跟新数据
 */

/**
 * v-model
 * value+input方法的语法糖。会根据标签的不同生成不同的事件和属性
 * 
 * 异步渲染
 * 组件级更新，不采用异步更新，每次更新数据都会对当前组件进行重新渲染
 * 
 * nextTick
 * 异步渲染最后一步。主要使用了宏任务和微任务，定义一个异步方法，多次调用
 * nextTick会将方法存入队列，通过异步方法清空当前队列
 * 
 * 父子组件生命周期调用顺序
 * 渲染顺序：先父后子，完成顺序：先子后父
 * 更新顺序：父更新导致子更新，子更新完成后父
 * 销毁顺序：先父后子，完成顺序：先子后父
 * 
 * 组件通信
 * 父子通信：父组件数据通过props传给子组件，子组件通过$on绑定父组件的事件，通过$emit
 * 触发事件
 * 跨组件通信 eventBus
 * vuex状态管理实现通信
 * 
 * vuex
 * state：驱动应用的数据源
 * view：声明方式将state映射到视图
 * action：响应在view上的用户输入导致的状态变化
 * 
 * state：存储状态
 * getter：state的计算属性
 * mutations：修改状态，同步提交commit
 * action：异步操作dispath
 * modules：子模块
 * 
 * computed、watch
 * computed：是一个watcher具备缓存，当依赖的数据变化是计算，没变化时，读取缓存
 * watch：适用数据变化的异步操作
 * 
 * v-if、v-show
 * v-if：条件不成立不渲染指令所在节点的DOM
 * v-show：切换当前DOM的显示和隐藏
 * 
 * v-for、v-if
 * v-for优先级高于v-if，连用v-if的每个元素都添加一下，造成性能问题
 * 
 * 组件渲染和更新
 * 渲染组件时，通过vue.extend()方法构建子组件的构造函数，并实例化。手动调用$mount挂载。
 * 更新组件会进行pathVnode流程
 * 
 * 插槽和作用域插槽
 * 插槽：创建组件虚拟节点，将组件的虚拟节点保存。渲染拿到对应solt属性的节点替换。作用域是父组件
 * 作用域插槽：解析为函数，子组件渲染时，调用函数。作用域是当前子组件
 * 
 * vue.mixin
 * 
 * keep-alive
 * 实现组件的缓存，当组件切换时不会对当前组件进行卸载。属性：include/exclude，生命周期：activated/deactivated
 * 
 * vue性能优化
 * 编码优化：事件代理、keep-alive、key唯一性、路由懒加载等
 * 加载优化：按需导入
 * 体验优化：骨架屏
 * SEO：预渲染
 */