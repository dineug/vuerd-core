import _Vue from 'vue'
import _VuerdCore from './editor/VuerdCore.vue'
import { Plugin, Option } from '@/types'
import Logger from '@/ts/Logger'
import Command from '@/plugin/Command'
import TextEditor from './plugins/editor/TextEditor'
import ImagePreview from './plugins/editor/ImagePreview'
import VideoPreview from './plugins/editor/VideoPreview'
import VSCode from './plugins/theme/VSCode'
import AtomOneDark from './plugins/theme/AtomOneDark'
import AtomOneLight from './plugins/theme/AtomOneLight'
import VSCodeIcons from './plugins/icon/VSCodeIcons'

const VuerdCore = {
  install (Vue: typeof _Vue, option?: Option) {
    if (option && option.logLevel) {
      Logger.logLevel = option.logLevel
    }
    Vue.component('VuerdCore', _VuerdCore)
  },
  use (plugin: Plugin) {
    plugin.install(new Command())
  }
}

// default editor
VuerdCore.use(TextEditor)
VuerdCore.use(ImagePreview)
VuerdCore.use(VideoPreview)

// default theme
VuerdCore.use(VSCode)
VuerdCore.use(AtomOneDark)
VuerdCore.use(AtomOneLight)

// default icon
VuerdCore.use(VSCodeIcons)

export default VuerdCore
