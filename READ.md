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

## 项目开发遵循

- 小程序 下拉或者上拉 看到的隐藏部分的 bgcolor 要和 页面统一样式 bgcolor 一致
- 小程序主题
  - 统一样式
    - bgcolor #ffffff 小程序默认也是它，所以其他地方不需要更改
  - panel
    - 标题样式 32rpx #333333
    - 内容
      - 标题样式 38rpx #ff6b9d
      - 标题解释文字 24rpx #666666
      - 醒目一点的weight 700
