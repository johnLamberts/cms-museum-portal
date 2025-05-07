/* eslint-disable @typescript-eslint/no-explicit-any */
// src/modules/extensions/card/card-header.ts
import { mergeAttributes, Node } from '@tiptap/core'

export interface CardHeaderOptions {
  HTMLAttributes: Record<string, any>,
}

export const CardHeader = Node.create<CardHeaderOptions>({
  name: 'cardHeader',

  group: 'cardHeader',

  content: 'block+',

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'flex flex-col space-y-1.5 p-6',
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="card-header"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(
        this.options.HTMLAttributes,
        HTMLAttributes,
        { 'data-type': 'card-header' }
      ),
      0,
    ]
  },
})
