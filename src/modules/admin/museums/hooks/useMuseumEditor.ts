
import ExtensionKit from "@/modules/extensions/extension-kit";
import type { AnyExtension, Editor } from "@tiptap/core";
import { useEditor } from "@tiptap/react";
import { initialContent } from "../initialContent.data";

declare global {
  interface Window {
    editor: Editor | null;
  }
}


export const useBlockEditor = () => {


  const editor = useEditor(
    {
      immediatelyRender: true,
      shouldRerenderOnTransaction: false,
      autofocus: true,
      onCreate: ctx => {
        if (ctx.editor.isEmpty) {
          ctx.editor.commands.setContent(initialContent)
          ctx.editor.commands.focus('start', { scrollIntoView: true })
        }
      },
      extensions: [
        ...ExtensionKit(),
      ].filter((e: AnyExtension ) => e !== undefined),
      editorProps: {
        attributes: {
          autocomplete: 'off',
          autocorrect: 'off',
          autocapitalize: 'off',
          class: 'min-h-full',
        },
      },
    },
    [],
  )


  window.editor = editor

  return { editor }
}
