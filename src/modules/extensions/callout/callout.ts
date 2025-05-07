/* eslint-disable @typescript-eslint/no-explicit-any */
// src/modules/extensions/callout/callout.ts
import { mergeAttributes, Node } from '@tiptap/core'

export interface CalloutOptions {
  HTMLAttributes: Record<string, any>,
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    callout: {
      /**
       * Add a callout node
       */
      setCallout: (options: { type: string }) => ReturnType,
    }
  }
}

export const Callout = Node.create<CalloutOptions>({
  name: 'callout',

  group: 'block',

  content: 'block+',

  defining: true,

  isolating: true,

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'callout',
      },
    }
  },

  addAttributes() {
    return {
      type: {
        default: 'info',
        parseHTML: element => element.getAttribute('data-type') || 'info',
        renderHTML: attributes => ({
          'data-type': attributes.type,
        }),
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-callout]',
        getAttrs: dom => {
          if (typeof dom === 'string') return {}
          const element = dom as HTMLElement
          const type = element.getAttribute('data-type')
          return { type: type || 'info' }
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const type = HTMLAttributes.type || 'info'
    
    // Define CSS classes based on callout type
    const typeClasses = {
      info: 'bg-blue-50 border-blue-200 text-blue-800',
      warning: 'bg-amber-50 border-amber-200 text-amber-800',
      error: 'bg-red-50 border-red-200 text-red-800',
      success: 'bg-green-50 border-green-200 text-green-800',
      note: 'bg-gray-50 border-gray-200 text-gray-800',
    }
    
    const classes = `p-4 border-l-4 rounded-md my-4 ${typeClasses[type as keyof typeof typeClasses] || typeClasses.info}`
    
    return [
      'div',
      mergeAttributes(
        { class: classes },
        HTMLAttributes,
        { 'data-callout': '', 'data-type': type }
      ),
      0,
    ]
  },

  addCommands() {
    return {
      setCallout: options => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
          content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Callout content...' }] }],
        })
      },
    }
  },
})
