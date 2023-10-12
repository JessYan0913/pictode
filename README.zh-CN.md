# Pictode 🎨

欢迎来到 **Pictode** - 你的创意自由发挥的画板！🚀

[立即体验](https://pictode.com)

简体中文 | [English](README.md)

**Pictode** 是一个基于 Vue 3、TypeScript、Konva、HeadlessUI 和 Tailwind CSS 等酷炫技术构建的画板项目，它让你可以随心所欲地绘制、创作和表达自己的创意。✨

## 🖌️ 绘图工具

**Pictode** 提供了一系列的绘制工具，从简单的矩形到复杂的连线，你可以尽情选择并创造属于你自己的艺术作品。🎨

- 使用 **✏️ 铅笔工具**，释放你的涂鸦天赋。
- 用 **📷 图片工具**，插入照片，为你的画板增添多彩元素。
- 借助 **🖋️ 文本工具**，写下你的思绪和创意。
- 创造完美的几何图形，如 **🟩 矩形**、**🔶 菱形** 和 **🟤 椭圆**。

## 🪄 导入与导出

将你的艺术作品与世界分享！**Pictode** 支持各种导入和导出选项，包括 JPG、PNG 和 JSON 格式。📤📥

- 导出你的项目，分享给朋友或同事。
- 导入其他人的项目，获得灵感并进行编辑。

## ✨ 插件增强功能

**Pictode** 还支持各种插件，以满足不同的需求。

[![Edit pictode](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/p/sandbox/pictode-playground-7rm8zq?file=%2Fsrc%2FApp.vue%3A1%2C1)

### 🕒 操作记录

1. 安装 `@pictode/plugin-history` 依赖包。

```shell
npm install @pictode/plugin-selector
```

2. 实例化 `historyPlugin` 插件。

```ts
import { HistoryPlugin } from '@pictode/plugin-history';

const historyPlugin = new HistoryPlugin();
```

3. 使用 `app.use(historyPlugin)` 方法加载插件。

```ts
app.use(historyPlugin);
```

4. 之后，你可以通过 `app.undo()` 和 `app.redo()` 方法来实现撤销和重做的功能。

### ✅ 选择器

1. 安装 `@pictode/plugin-selector` 依赖包。

```shell
npm install @pictode/plugin-selector
```

2. 实例化 `selectorPlugin` 插件。

```ts
import { SelectorPlugin } from '@pictode/plugin-selector';

const selectorPlugin = new SelectorPlugin();
```

3. 使用 `app.use(selectorPlugin)` 方法加载插件。

```ts
app.use(selectorPlugin);
```

6. 通过 `鼠标点击` 或 `app.select(...)` 和 `app.cancelSelect(...)` 方法来实现选中和取消选中图形的操作。同时，按下 `Shift` 键可以实现多选和取消选择的功能。

### 🔄 对齐工具

1. 安装 `@pictode/plugin-alignment` 依赖包。

```shell
npm install @pictode/plugin-selector
```

2. 实例化 `alignmentPlugin` 插件。

```ts
import { AlignmentPlugin } from '@pictode/plugin-alignment';

const alignmentPlugin = new AlignmentPlugin();
```

3. 使用 `app.use(alignmentPlugin)` 方法加载插件。

```ts
app.use(alignmentPlugin);
```

6. 之后，你可以使用一系列方法来实现对齐操作，包括 `app.alignTop`、`app.alignRight`、`app.alignBottom`、`app.alignLeft`、`app.alignCenterX`、`app.alignCenterY` 等。
7. 此外，你还可以使用 `app.distributeX` 和 `app.distributeY` 方法来实现水平均分和垂直均分功能。

## 🌟 为什么选择 Pictode？

- 强大的绘制工具，满足所有创意需求。
- 灵活的插件系统，根据需求扩展功能。
- 友好的撤销和重做功能，无惧错误。
- 丰富的导入导出选项，方便分享和合作。

开始使用**Pictode**，释放你的创意吧！🚀

## 🚀 快速开始

你只需几个简单的步骤，就能启动**Pictode**并开始创作：

1. 克隆这个仓库到你的本地机器。
2. 安装所需的依赖：`pnpm bootstrap`。
3. 运行项目：`pnpm pictode`。
4. 打开浏览器，访问 `http://localhost:8800`。

现在，你可以开始使用**Pictode**，尽情发挥创意，创造出独一无二的作品！🚀

## 🙌 贡献

**Pictode** 是一个开源项目，我们欢迎各种形式的贡献。如果你有任何建议、问题或想要贡献代码，不要犹豫，立即加入我们的社区！

QQ 群：

![QQ群](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9001fc5a676e43a4b996cce33f273b94~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=750&h=1344&s=364721&e=png&b=2575ff)

## 📝 许可

**Pictode** 是根据 MIT 许可证发布的。查看 [LICENSE](LICENSE) 以获取更多信息。

感谢你选择**Pictode**，希望它能成为你创意表达的最佳工具！🎉

[在线访问](https://pictode.com)

如果有任何问题，请随时联系我们：1141326491@qq.com 📧

---

🌟 让**Pictode** 成为你创意的画布，让艺术在这里自由绽放！ 🌟
