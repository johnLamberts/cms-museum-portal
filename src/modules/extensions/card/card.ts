/* eslint-disable @typescript-eslint/no-explicit-any */
// src/modules/extensions/card/card.ts
import { mergeAttributes, Node } from '@tiptap/core'

export interface CardOptions {
  HTMLAttributes: Record<string, any>,
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    card: {
      /**
       * Add a card node
       */
      setCard: () => ReturnType,
    }
  }
}

export const Card = Node.create<CardOptions>({
  name: 'card',

  group: 'block',

  content: 'cardHeader cardContent',

  defining: true,

  isolating: true,

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'rounded-lg border bg-card text-card-foreground shadow-sm my-4',
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="card"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(
        this.options.HTMLAttributes,
        HTMLAttributes,
        { 'data-type': 'card' }
      ),
      0,
    ]
  },

  addCommands() {
    return {
      setCard: () => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          content: [
            {
              type: 'cardHeader',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Card Title' }] }]
            },
            {
              type: 'cardContent',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Card content goes here...' }] }]
            }
          ],
        })
      },
    }
  },
})
