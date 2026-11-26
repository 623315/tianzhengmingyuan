# 天正明远 · AI 就业培训官网

线上地址：**https://623315.github.io/tianzhengmingyuan/**

纯静态网站，无需构建即可打开 `index.html`。

## 页面

- `index.html` 首页
- `curriculum.html` 课程体系
- `tuition.html` 收费与保障
- `campus.html` 北京顺义校区
- `apply.html` 预约咨询（含表单）
- `thanks.html` 表单提交成功页

共享样式在 `styles.css`，交互在 `main.js`，图片与品牌片在 `assets/`。

## 表单

预约表单提交到 FormSubmit，接收邮箱为 `623315@qq.com`。如需更换接收邮箱，请同时修改 `apply.html` 中表单的 `action` 和 `main.js` 里的 AJAX 地址。

## 部署

当前版本部署在 GitHub Pages，`main` 分支根目录。更新文件后提交并推送即可自动发布。

也可以把本目录直接上传到 Cloudflare Pages、Netlify 或任意静态托管服务。

如需绑定公司域名（例如 `aigc.ttx.ai` 的子域名），在 GitHub Pages 设置 Custom domain，或改部署到 Cloudflare Pages 后绑定均可。

## 说明

- 学费 0 元；食宿按当期标准收取；就业服务自愿委托，成功入职后按协议收费。
- 网站内容不构成就业承诺，具体以书面协议为准。
- 部分图片为校区与课程场景示意。
