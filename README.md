# vuerd-core
Editor Common UI

## Document
[Storybook](https://vuerd.github.io/vuerd-docs/)   
[Live Demo](https://vuerd.github.io/vuerd-docs/iframe.html?id=demo-live--vuerd-core)

## Install
```bash
$ yarn add vuerd-core
or
$ npm install vuerd-core
```
## Usage
```js
// main.js or main.ts
import Vue from 'vue';
import VuerdCore from 'vuerd-core';
import 'vuerd-core/dist/vuerd-core.css';
Vue.use(VuerdCore);
```
```html
<VuerdCore/>
```

## Plugin
- [vuerd-plugin-erd](https://github.com/vuerd/vuerd-plugin-erd)
- [vuerd-plugin-tui.editor](https://github.com/vuerd/vuerd-plugin-tui.editor)

## Development Status Prototype
### TODO
- Plugin API
  - [x] Editor
  - [x] Theme
- Usage API
  - [x] Event
  - [x] Config Data
  - [ ] TitleBar
  - [ ] Sidebar
  - [ ] Statusbar
  - [ ] ActivityBar
  - [ ] EditorBottom
  - [x] Contextmenu

## License
[MIT](https://github.com/vuerd/vuerd-core/blob/master/LICENSE)
