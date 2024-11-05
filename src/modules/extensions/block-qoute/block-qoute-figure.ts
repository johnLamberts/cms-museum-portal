import { mergeAttributes } from '@tiptap/core'
import { Figure } from '../figure'
import { Quote } from './qoute'
import { QuoteCaption } from './qoute-caption'

declare module '@tiptap/core' {
   
  interface Commands<ReturnType> {
    blockquoteFigure: {
      setBlockquote: () => ReturnType
    }
  }
}

export const BlockquoteFigure = Figure.extend({
  name: 'blockquoteFigure',

  group: 'block',

  content: 'quote quoteCaption',

  isolating: true,

  addExtensions() {
    return [Quote, QuoteCaption]
  },

  renderHTML({ HTMLAttributes }) {
    return ['figure', mergeAttributes(HTMLAttributes, { 'data-type': this.name }), ['div', {}, 0]]
  },

  addKeyboardShortcuts() {
    return {
      Enter: () => false,
    }
  },

  addAttributes() {
    return {
      ...this.parent?.(),
    }
  },

  addCommands() {
    return {
      setBlockquote:
        () =>
        ({ state, chain }) => {
          const position = state.selection.$from.start()
          const selectionContent = state.selection.content()

          return chain()
            .focus()
            .insertContent({
              type: this.name,
              content: [
                {
                  type: 'quote',
                  content: selectionContent.content.toJSON() || [
                    {
                      type: 'paragraph',
                      attrs: {
                        textAlign: 'left',
                      },
                    },
                  ],
                },
                {
                  type: 'quoteCaption',
                },
              ],
            })
            .focus(position + 1)
            .run()
        },
    }
  },
})

export default BlockquoteFigure
