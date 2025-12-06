import { Editor, NodeViewWrapper } from '@tiptap/react';
import { useCallback } from 'react';

import { ImageUploader } from './image-uploader';

export const ImageUploadComponent = ({ getPos, editor }: { getPos: () => number; editor: Editor }) => {
  const onUpload = useCallback(
    (url: string) => {
      if (url) {
        editor
          .chain()
          .focus()
          .deleteNode('imageUpload') // ✅ Instead of `deleteRange`, remove the placeholder node
          .setImageBlock({ src: url }) // ✅ Ensure `setImageBlock` is registered
          .run()
      }
    },
    [getPos, editor],
  )

  return (
    <NodeViewWrapper>
      <div className="p-0 m-0" data-drag-handle>
        <ImageUploader onUpload={onUpload} />
      </div>
    </NodeViewWrapper>
  )
}

export default ImageUploadComponent
