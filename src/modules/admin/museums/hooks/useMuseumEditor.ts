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
        console.log("Editor created, is empty:", ctx.editor.isEmpty);
        if (ctx.editor.isEmpty) {
          ctx.editor.commands.setContent(initialContent);
          ctx.editor.commands.focus('start', { scrollIntoView: true });
        }
      },
      extensions: [
        ...ExtensionKit(),
      ].filter((e: AnyExtension) => e !== undefined),
      editorProps: {
        attributes: {
          autocomplete: 'off',
          autocorrect: 'off',
          autocapitalize: 'off',
          class: 'min-h-full',
        },
      },
    },
    []
  );

  window.editor = editor;

  // Improved setContent function with better error handling and logging
  const setContent = (content: string) => {
    if (!editor) {
      console.error("Cannot set content: Editor not initialized");
      return false;
    }
    
    if (editor.isDestroyed) {
      console.error("Cannot set content: Editor has been destroyed");
      return false;
    }
    
    try {
      console.log("Setting editor content, length:", content?.length || 0);
      
      // Force a transaction to ensure content is set
      editor.view.dispatch(
        editor.state.tr.setMeta('preventUpdate', true)
      );
      
      // Set the content
      editor.commands.setContent(content);
      
      console.log("Content set successfully");
      return true;
    } catch (error) {
      console.error("Error setting editor content:", error);
      return false;
    }
  };

  return { editor, setContent };
};
