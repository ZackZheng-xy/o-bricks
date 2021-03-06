// 将来和渲染器打交道

import { createApp } from "./main"

// 创建vue实例
export default context => {
  const { app, router, store } = createApp(context)
  return new Promise((resolve, reject) => {
    // 跳转首屏地址
    router.push(context.url)

    // 等待路由就绪
    router.onReady(() => {
      // 判断是否存在asyncData选项
      // 获取匹配路由相关组件
      const comps = router.getMatchedComponents()
      // 遍历，并执行可能存在的asyncData
      Promise.all(comps.map(comp => {
        if (comp.asyncData) {
          return comp.asyncData({
            store,
            route: router.currentRoute
          })
        }
      })).then(() => {
        // 数据已经存入store，只需要序列化它，传到前端再复原
        context.state = store.state
        resolve(app)
      }).catch(reject)
    }, reject)
  })
}