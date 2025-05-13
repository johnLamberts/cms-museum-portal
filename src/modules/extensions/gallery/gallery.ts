/* eslint-disable @typescript-eslint/no-explicit-any */
import { Node, mergeAttributes } from "@tiptap/core"

export interface GalleryOptions {
  HTMLAttributes: Record<string, any>
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    gallery: {
      setGallery: () => ReturnType
      addGalleryItem: (options?: { src?: string; alt?: string }) => ReturnType
    }
  }
}

export const Gallery = Node.create<GalleryOptions>({
  name: "gallery",

  group: "block",

  content: "galleryItem+",

  defining: true,

  addOptions() {
    return {
      HTMLAttributes: {
        class: "gallery-container",
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: "div[class=gallery-container]",
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },

  addCommands() {
    return {
      setGallery:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            content: [
              {
                type: "galleryItem",
                attrs: { src: "/placeholder.svg?height=300&width=400", alt: "Gallery image" },
              },
            ],
          })
        },
      addGalleryItem:
        (options = {}) =>
        ({ commands, state }) => {
          const { src = "/placeholder.svg?height=300&width=400", alt = "Gallery image" } = options
          const { selection } = state
          const pos = selection.$anchor.pos

          return commands.insertContentAt(pos, {
            type: "galleryItem",
            attrs: { src, alt },
          })
        },
    }
  },
})

export const GalleryItem = Node.create({
  name: "galleryItem",

  group: "inline",

  inline: true,

  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      id: {
        default: null,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: "div[class=gallery-item]",
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      { class: "gallery-item", "data-id": HTMLAttributes.id },
      ["img", { src: HTMLAttributes.src, alt: HTMLAttributes.alt }],
    ]
  },
})

