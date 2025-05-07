import { Node, mergeAttributes } from '@tiptap/core'

export const CustomPage = Node.create({
  name: 'customPage',
  group: 'block',
  content: 'block+',
  
  addAttributes() {
    return {
      height: {
        default: '100%',
        parseHTML: element => element.style.height,
        renderHTML: attributes => {
          return { style: `height: ${attributes.height}` }
        }
      },
      width: {
        default: '100%',
        parseHTML: element => element.style.width,
        renderHTML: attributes => {
          return { style: `width: ${attributes.width}` }
        }
      },
      padding: {
        default: '0',
        parseHTML: element => element.style.padding,
        renderHTML: attributes => {
          return { style: `padding: ${attributes.padding}` }
        }
      },
      margin: {
        default: '0',
        parseHTML: element => element.style.margin,
        renderHTML: attributes => {
          return { style: `margin: ${attributes.margin}` }
        }
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="custom-page"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'custom-page' }), 0]
  },
})
