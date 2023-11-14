# Pictode 🎨

Welcome to **Pictode** - your canvas for unlimited creativity! 🚀

![banner](https://github.com/JessYan0913/picx-images-hosting/blob/master/Kapture%202023-10-18%20at%2022.26.09.gif)

[Experience it now](https://pictode.com)

[简体中文](README.zh-CN.md) | English

**Pictode** is a canvas project built on cutting-edge technologies like Vue 3, TypeScript, Konva, HeadlessUI, and Tailwind CSS. It empowers you to draw, create, and express your creativity freely. ✨

## Local Setup

- Clone the repository locally

```shell
git clone https://github.com/JessYan0913/pictode.git
```

- Install dependencies

```shell
cd pictode

npm i -g pnpm

pnpm bootstrap
```

- 启动项目

```shell
pnpm pictode
```

- 访问项目`http://localhost:8800`

## 🖌️ Drawing Tools

**Pictode** offers a range of drawing tools, from simple rectangles to intricate lines, allowing you to craft your unique artworks. 🎨

- Unleash your doodling talent with the **✏️ Pencil tool**.
- Insert photos and colorful elements into your canvas with the **📷 Image tool**.
- Express your thoughts and ideas with the **🖋️ Text tool**.
- Create perfect geometric shapes like **🟩 Rectangles**, **🔶 Diamonds**, and **🟤 Ellipses**.

## 🪄 Import and Export

Share your artistic creations with the world! **Pictode** supports various import and export options, including JPG, PNG, and JSON formats. 📤📥

- Export your projects and share them with friends or colleagues.
- Import others' projects to gain inspiration and make edits.

## ✨ Enhanced by Plugins

**Pictode** offers various plugins to cater to diverse needs.

[![Edit pictode](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/p/sandbox/pictode-playground-7rm8zq?file=%2Fsrc%2FApp.vue%3A1%2C1)

### 🕒 History Plugin

1. Install the `@pictode/plugin-history` dependency.

```shell
npm install @pictode/plugin-selector
```

2. Instantiate the historyPlugin plugin.

```ts
import { HistoryPlugin } from '@pictode/plugin-history';

const historyPlugin = new HistoryPlugin();
```

3. Use the app.use(historyPlugin) method to load the plugin.

```ts
app.use(historyPlugin);
```

4. You can now implement undo and redo functionality with the app.undo() and app.redo() methods.

### ✅ Selector Plugin

1. Install the @pictode/plugin-selector dependency.

```shell
npm install @pictode/plugin-selector
```

2. Instantiate the selectorPlugin plugin.

```ts
import { SelectorPlugin } from '@pictode/plugin-selector';

const selectorPlugin = new SelectorPlugin();
```

3. Use the app.use(selectorPlugin) method to load the plugin.

```ts
app.use(selectorPlugin);
```

4. Implement selecting and deselecting shapes using mouse clicks or the app.select(...) and app.cancelSelect(...) methods. Hold down the Shift key to enable multi-selection and deselection.

### 🔄 Alignment Tools

1. Install the @pictode/plugin-alignment dependency.

```shell
npm install @pictode/plugin-selector
```

2. Instantiate the alignmentPlugin plugin.

```ts
import { AlignmentPlugin } from '@pictode/plugin-alignment';

const alignmentPlugin = new AlignmentPlugin();
```

3. Use the app.use(alignmentPlugin) method to load the plugin.

```ts
app.use(alignmentPlugin);
```

4. You can now perform alignment operations using a range of methods, including app.alignTop, app.alignRight, app.alignBottom, app.alignLeft, app.alignCenterX, app.alignCenterY, and more.

5. Additionally, use app.distributeX and app.distributeY methods to achieve horizontal and vertical distribution.

## 🌟 Why Choose Pictode?

- Powerful drawing tools to meet all creative needs.
- A flexible plugin system for expanding functionality as needed.
- User-friendly undo and redo functionality to fearlessly correct mistakes.
- Rich import and export options for easy sharing and collaboration.

Start using **Pictode** to unleash your creativity! 🚀

## 🚀 Getting Started

You can launch **Pictode** and start creating in just a few simple steps:

1. Clone this repository to your local machine.
2. Install the required dependencies: pnpm bootstrap.
3. Run the project: pnpm pictode.
4. Open your browser and visit http://localhost:8800.

Now you can dive into **Pictode**, let your creativity flow, and create unique masterpieces! 🚀

## 🙌 Contribute

**Pictode** is an open-source project, and we welcome contributions in all forms. If you have suggestions, questions, or want to contribute code, don't hesitate to join our community!

Thanks to the following developers for their contributions to this project:

<a href="https://github.com/JessYan0913/pictode/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=JessYan0913/pictode" />
</a>

## 📝 License

**Pictode** is released under the MIT License. Check out the LICENSE for more information.

Thank you for choosing **Pictode**, and we hope it becomes your ultimate tool for creative expression! 🎉

[Visit Online](https://pictode.com)

If you have any questions, feel free to contact us at：1141326491@qq.com 📧

---

🌟 Let **Pictode** be your canvas for creative expression, where art can freely flourish! 🌟
