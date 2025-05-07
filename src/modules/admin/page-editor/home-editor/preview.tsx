/* eslint-disable @typescript-eslint/no-explicit-any */
// src/modules/admin/page-editor/home-editor/Preview.tsx
import ExtensionKit from '@/modules/extensions/extension-kit';
import { VideoEmbed } from '@/modules/extensions/video/video';
import Image from '@tiptap/extension-image';
import { AnyExtension, EditorContent, useEditor } from '@tiptap/react';
import React from 'react';

interface PreviewProps {
  content: any;
}

export const Preview: React.FC<PreviewProps> = ({ content }) => {
  const editor = useEditor({
      extensions: [
                 ...ExtensionKit(),
                 VideoEmbed,
                 Image.configure({
                  HTMLAttributes: {
                    class: 'rounded-md max-w-full h-auto',
                  },
                 }),
               ].filter((e: AnyExtension) => e !== undefined),
    content,
    editable: false,
    editorProps: {
      attributes: {
        class: 'focus:outline-none prose prose-slate max-w-none',
      },
    },
  });

  if (!editor) {
    return (
      <div className="flex items-center justify-center h-64 border rounded-md bg-muted/50">
        <p className="text-muted-foreground">Loading preview...</p>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex items-center justify-center h-64 border rounded-md bg-muted/50">
        <p className="text-muted-foreground">No content to preview</p>
      </div>
    );
  }

  return (
    <div className="preview-container">
      <div className="bg-white rounded-md p-6 min-h-[60vh] border">
        <div className="mx-auto max-w-4xl">
          <EditorContent editor={editor} />
        </div>
      </div>
      
      <div className="mt-4 bg-muted/20 p-4 rounded-md border border-dashed">
        <h3 className="text-sm font-medium mb-2">Preview Notes</h3>
        <p className="text-sm text-muted-foreground">
          This is a simplified preview. The actual appearance on your website may vary
          slightly based on your site's theme and styling.
        </p>
      </div>
    </div>
  );
};
