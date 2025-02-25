/* eslint-disable @typescript-eslint/no-explicit-any */
import uploadImageToSupabase from "@/lib/storage-upload"
import FileHandler from "@tiptap-pro/extension-file-handler"

const configureFileHandler = (editor: any) => {
  return FileHandler.configure({
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
    onDrop: (_, files, pos) => {
      files.forEach(async file => {
        try {
          const url = await uploadImageToSupabase(file)
          editor.chain().setImageBlockAt({ pos, src: url }).focus().run()
        } catch (error) {
          console.error('Error uploading image:', error)
          // Handle error (e.g., show a notification to the user)
        }
      })
    },
    onPaste: (_, files) => {
      files.forEach(async file => {
        try {
          const url = await uploadImageToSupabase(file)
          editor
            .chain()
            .setImageBlockAt({ pos: editor.state.selection.anchor, src: url })
            .focus()
            .run()
        } catch (error) {
          console.error('Error uploading image:', error)
          // Handle error (e.g., show a notification to the user)
        }
      })
    },
  })
}

export default configureFileHandler;
