/* eslint-disable @typescript-eslint/no-explicit-any */
export const galleryItem = {
  title: "Gallery",
  description: "Add a gallery of images",
  searchTerms: ["gallery", "images", "photos", "collection"],
  icon: "LayoutGrid",
  command: ({ editor, range }: any) => {
    editor.chain().focus().deleteRange(range).setGallery().run()
  },
}
