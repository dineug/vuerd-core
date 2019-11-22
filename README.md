# vuerd-core [![Build Status](https://travis-ci.com/vuerd/vuerd-core.svg?branch=master)](https://travis-ci.com/vuerd/vuerd-core)
Editor Common UI
![vuerd-core](https://user-images.githubusercontent.com/45829489/69156939-8c146b80-0b27-11ea-99ed-6f1b8ce3c3ae.gif)

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
| Project | Status | Description
| --- | --- | --- |
| [vuerd-plugin-erd](https://github.com/vuerd/vuerd-plugin-erd) | [![Build Status](https://travis-ci.com/vuerd/vuerd-plugin-erd.svg?branch=master)](https://travis-ci.com/vuerd/vuerd-plugin-erd) | ERD Editor |
| [vuerd-plugin-tui.editor](https://github.com/vuerd/vuerd-plugin-tui.editor) | [![Build Status](https://travis-ci.com/vuerd/vuerd-plugin-tui.editor.svg?branch=master)](https://travis-ci.com/vuerd/vuerd-plugin-tui.editor) | Markdown WYSIWYG Editor |

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
