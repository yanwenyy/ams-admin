<template>
  <div id="editorSection"></div>
</template>

<script>
import Editor from "tui-editor"; /* ES6 */
import "tui-editor/dist/tui-editor.css"; // editor's ui
import "tui-editor/dist/tui-editor-contents.css"; // editor's content
import "codemirror/lib/codemirror.css"; // codemirror
import "highlight.js/styles/github.css"; // code block highlight

export default {
  name: "mytuieditor",
  props: {
    content: String,
    value: String
  },
  mounted() {
    this.initialize();
  },
  beforeDestroy() {
    this.tuieditor = null;
    delete this.tuieditor;
  },
  methods: {
    initialize() {
      if (this.$el) {
        this.tuieditor = new Editor({
          el: document.querySelector("#editorSection"),
          initialEditType: "markdown",
          previewStyle: "vertical",
          height: "92vh",
          initialValue: this.content
        });
        this.tuieditor.getHtml();
      }
    },
    saveTo () {
      console.log(this.tuieditor.getHtml())
    }
  }
};
</script>

<style>
</style>
