import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'

export default defineUniPages({
  entryPagePath: 'pages/mall/index',
  globalStyle: {
    navigationStyle: 'default',
    navigationBarTitleText: 'unibest',
    navigationBarBackgroundColor: '#f7f7f7',
    navigationBarTextStyle: 'black',
    backgroundColor: '#f7f7f7',
  },
  easycom: {
    autoscan: true,
    custom: {
      '^fg-(.*)': '@/components/fg-$1/fg-$1.vue',
      '^wd-(.*)': 'wot-design-uni/components/wd-$1/wd-$1.vue',
      '^(?!z-paging-refresh|z-paging-load-more)z-paging(.*)':
        'z-paging/components/z-paging$1/z-paging$1.vue',
    },
  },
  // 如果不需要tabBar，推荐使用 spa 模板。（pnpm create xxx -t spa）
  tabBar: {
    color: '#666666',
    selectedColor: '#018d71', // tab 上的文字选中时的颜色
    backgroundColor: '#F8F8F8', // tab 的背景色
    borderStyle: 'black', // tabBar 上边框的颜色
    // blurEffect: 'none', // iOS 高斯模糊效果，参考 [使用说明](https://ask.dcloud.net.cn/article/36617)
    height: '50px',
    fontSize: '10px',
    iconWidth: '24px',
    spacing: '3px',
    list: [
      {
        iconPath: 'static/tabbar/home.png',
        selectedIconPath: 'static/tabbar/home-active.png',
        pagePath: 'pages/mall/index',
        text: '首页',
      },
      // {
      //   iconPath: 'static/tabbar/example.png',
      //   selectedIconPath: 'static/tabbar/exampleHL.png',
      //   pagePath: 'pages/about/about',
      //   text: '关于',
      // },
      {
        iconPath: 'static/tabbar/user.png',
        selectedIconPath: 'static/tabbar/user-active.png',
        pagePath: 'pages/mine/index',
        text: '我的',
      },
    ],
  },
})
