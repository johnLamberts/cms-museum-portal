/* eslint-disable @typescript-eslint/no-explicit-any */
// src/modules/admin/page-editor/hooks/useBlockEditor.ts
import ExtensionKit from '@/modules/extensions/extension-kit';
import { VideoEmbed } from '@/modules/extensions/video/video';
import Image from '@tiptap/extension-image';
import { AnyExtension, Editor, useEditor } from '@tiptap/react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

// Define window.editor for devtools access
declare global {
  interface Window {
    editor: Editor | null;
  }
}

export const useBlockPageEditor = () => {
  const [content, setContent] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const editor = useEditor(
    {
      extensions: [
             ...ExtensionKit(),
             VideoEmbed,
             Image.configure({
              HTMLAttributes: {
                class: 'rounded-md max-w-full h-auto',
              },
             }),
           ].filter((e: AnyExtension) => e !== undefined),
             immediatelyRender: true,
            shouldRerenderOnTransaction: false,
            autofocus: true,
            onCreate: ctx => {
              console.log("Editor created, is empty:", ctx.editor.isEmpty);
              if (ctx.editor.isEmpty) {
                ctx.editor.commands.setContent(content);
                ctx.editor.commands.focus('start', { scrollIntoView: true });
              }
            },
      editorProps: {
        attributes: {
          class: 'focus:outline-none prose prose-slate max-w-none min-h-[500px]',
        },
      },
      // onUpdate: ({ editor }) => {
      //   // This will add an asterisk to the browser tab title when there are unsaved changes
      //   const originalTitle = document.title.replace(/^\* /, '');
      //   document.title = `* ${originalTitle}`;
      // },
      // onFocus: ({ editor, event }) => {
      //   // Handle focus events if needed
      // },
      // onBlur: ({ editor, event }) => {
      //   // Handle blur events if needed
      // },
      // Don't set autofocus: true here as it can reset content when the hook re-renders
    },
    []
  );

  // Make editor accessible via window for debugging purposes
  useEffect(() => {
    if (editor) {
      window.editor = editor;
    }
    
    return () => {
      window.editor = null;
    };
  }, [editor]);

  // Set initial content of the editor
  const setInitialContent = useCallback((initialContent: any) => {
    if (editor && !editor.isDestroyed && initialContent) {
      try {
        console.log("Setting initial content:", initialContent);
        
        // First clear any existing content and reset editor
        editor.commands.clearContent();
        
        // Then set the new content
        editor.commands.setContent(initialContent);
        
        // Mark as initialized so we don't reset content again unexpectedly
        setIsInitialized(true);
        setContent(initialContent);
      } catch (error) {
        console.error('Error setting initial content:', error);
        toast.error('Failed to load content', {
          description: 'Please refresh and try again'
        });
      }
    }
  }, [editor]);

  // Handle key commands
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Save on Ctrl+S or Command+S
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        toast.info('Use the Save button to save your changes');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return {
    editor,
    content,
    setInitialContent,
    isInitialized
  };
};
