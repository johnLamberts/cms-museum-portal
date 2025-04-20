/* eslint-disable @typescript-eslint/no-explicit-any */
// src/modules/extensions/card/card-content.ts
import { mergeAttributes, Node } from '@tiptap/core'

export interface CardContentOptions {
  HTMLAttributes: Record<string, any>,
}

export const CardContent = Node.create<CardContentOptions>({
  name: 'cardContent',

  group: 'cardContent',

  content: 'block+',

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'p-6 pt-0',
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="card-content"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(
        this.options.HTMLAttributes,
        HTMLAttributes,
        { 'data-type': 'card-content' }
      ),
      0,
    ]
  },
})
