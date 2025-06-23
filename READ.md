## 说明

```markdown
# 安装依赖

pnpm i

# 这个虽然废弃了 但是还是可以用

pnpm install --save-dev @babel/plugin-proposal-private-property-in-object

# 升级

npx @dcloudio/uvm@latest

# 启动

yarn run dev:mp-weixin

# 页面限制必须登录才能访问，需要在页面vue中增加

<route lang="json5">
{
  needLogin: true, // 这行
}
```

## 项目说明

- 修改 pages.json、manifest.json 被覆盖问题
  - 本项目引入了 @uni-helper/vite-plugin-uni-pages，pages.json 文件将会自动生成，手动修改 pages.json 将会被覆盖。
  - 全局的东西请在 pages.config.ts 里面配置，页面的东西请在 vue 文件的 route-block 配置。
- 全局主题样式变量 应该修改的是 src/uni.scss
  - 对于本文件修改，他其实是针对每一个项目的，所以如果是主题样式变量，应该有限修改 额外增加的，其次让 $uni-开头的变量 继承他，但是 $uni- 开头的变量只能修改不能增加和删除
  - 然后子组件使用它即可
- 全局样式 src/style/index.scss 中 书写公共的样式，例如 .page-container 等样式
  - 默认还有一个 page 的 background-color: $page-bg-color; 属性，设定了页面的全局背景色
- 实现具体页面的时候遵循的思路
  - 优先实现 全局主题样式变量
  - 全局样式
  - 看是否需要提炼成公共组件(如果没有则创建，有则使用)
  - 最后书写页面的整体内容
- 页面布局模板如下

```vue
<route lang="json5" type="page">
{
  style: {
    enablePullDownRefresh: true,
    navigationStyle: 'custom',
    navigationBarTitleText: 'xxxx',
  },
}
</route>

<template>
  <view class="page-container[这里默认，由公共样式实现]">
    <view class="page-context[这里每个页面都强制使用这个类名，只不过由本页面去实现具体的样式]">
      这里是每个页面的具体内容
    </view>

    <!-- 底部导航,不需要每个页面为其考虑间距，底部导航组件自己实现与每个页面的间距 -->
    <BottomSection />
  </view>
</template>

<script lang="ts" setup>
// 生命周期
onLoad(() => {
  console.log('个人中心页面加载完成')
})

onPullDownRefresh(() => {
  console.log('下拉刷新')
  setTimeout(() => {
    uni.stopPullDownRefresh()
  }, 1000)
})
...
</script>

<style lang="scss" scoped>
.page-context {
  padding-top: 170rpx; // 这里的170rpx，提炼出来放到变量中，由变量文件统一修改
  background-color: $mall-bg-primary;
  width: 100%;
}

...
</style>
```
