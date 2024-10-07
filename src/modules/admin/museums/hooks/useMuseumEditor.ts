
import type { Editor } from "@tiptap/core";

declare global {
  interface Window {
    editor: Editor | null;
  }
}


