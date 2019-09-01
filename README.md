# vuerd-core
Editor Common UI

## Storybook 
[Live Demo](https://vuerd.github.io/vuerd-docs/)

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
- [vuerd-plugin-tui.editor](https://github.com/vuerd/vuerd-plugin-tui.editor)

## Development Status Prototype
### TODO
- Plugin API
- [X] editor
- Usage API
- [ ] Event
- [ ] Titlebar
- [ ] Sidebar
- [ ] Statusbar
- [ ] Activitybar
- [ ] EditorBottom
- [ ] Contextmenu
