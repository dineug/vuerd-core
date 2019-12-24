import TextEditor from "./TextEditor.vue";
import { Command } from "@/types";

export default {
  install(command: Command) {
    command.editorAdd({
      name: "TextEditor",
      component: TextEditor,
      scope: ["*"]
    });
  }
};
