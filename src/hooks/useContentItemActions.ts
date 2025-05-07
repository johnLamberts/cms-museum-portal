
import { Node } from '@tiptap/pm/model'
import { NodeSelection } from '@tiptap/pm/state'
import { Editor } from '@tiptap/react'
import { useCallback, useState } from 'react'

const useContentItemActions = (editor: Editor, currentNode: Node | null, currentNodePos: number) => {
  const [pageStyle, setPageStyle] = useState({
    height: '100%',
    width: '100%',
    padding: '0px',
    margin: '0px',
  })
  
  const resetTextFormatting = useCallback(() => {
    const chain = editor.chain()

    chain.setNodeSelection(currentNodePos).unsetAllMarks()

    if (currentNode?.type.name !== 'paragraph') {
      chain.setParagraph()
    }

    chain.run()
  }, [editor, currentNodePos, currentNode?.type.name])

  const duplicateNode = useCallback(() => {
    editor.commands.setNodeSelection(currentNodePos)

    const { $anchor } = editor.state.selection
    const selectedNode = $anchor.node(1) || (editor.state.selection as NodeSelection).node

    editor
      .chain()
      .setMeta('hideDragHandle', true)
      .insertContentAt(currentNodePos + (currentNode?.nodeSize || 0), selectedNode.toJSON())
      .run()
  }, [editor, currentNodePos, currentNode?.nodeSize])

  const copyNodeToClipboard = useCallback(() => {
    editor.chain().setMeta('hideDragHandle', true).setNodeSelection(currentNodePos).run()

    document.execCommand('copy')
  }, [editor, currentNodePos])

  const deleteNode = useCallback(() => {
    editor.chain().setMeta('hideDragHandle', true).setNodeSelection(currentNodePos).deleteSelection().run()
  }, [editor, currentNodePos])

  const handleAdd = useCallback(() => {
    if (currentNodePos !== -1) {
      const currentNodeSize = currentNode?.nodeSize || 0
      const insertPos = currentNodePos + currentNodeSize
      const currentNodeIsEmptyParagraph = currentNode?.type.name === 'paragraph' && currentNode?.content?.size === 0
      const focusPos = currentNodeIsEmptyParagraph ? currentNodePos + 2 : insertPos + 2

      editor
        .chain()
        .command(({ dispatch, tr, state }) => {
          if (dispatch) {
            if (currentNodeIsEmptyParagraph) {
              tr.insertText('/', currentNodePos, currentNodePos + 1)
            } else {
              tr.insert(insertPos, state.schema.nodes.paragraph.create(null, [state.schema.text('/')]))
            }

            return dispatch(tr)
          }

          return true
        })
        .focus(focusPos)
        .run()
    }
  }, [currentNode, currentNodePos, editor])

  // New page style actions
  const updatePageStyle = useCallback((property: keyof typeof pageStyle, value: string) => {
    setPageStyle(prev => ({ ...prev, [property]: value }))
    
    // Apply the style to the editor's root node
    editor.view.dom.style[property] = value
  }, [editor])

  const resetPageStyle = useCallback(() => {
    const defaultStyle = {
      height: '100%',
      width: '100%',
      padding: '0px',
      margin: '0px',
    }
    setPageStyle(defaultStyle)
    
    // Reset the editor's root node style
    Object.entries(defaultStyle).forEach(([key, value]) => {
      editor.view.dom.style[key as keyof typeof defaultStyle] = value
    })
  }, [editor])

  const openPageStyleDialog = useCallback(() => {
    // This function would open a dialog or modal to edit page styles
    // You'd implement this based on your UI framework (e.g., using a modal from your UI library)
    console.log('Open page style dialog')
    // For example, you might dispatch an action or set some state to show a modal
  }, [])

  return {
    resetTextFormatting,
    duplicateNode,
    copyNodeToClipboard,
    deleteNode,
    handleAdd,
    pageStyle,
    updatePageStyle,
    resetPageStyle,
    openPageStyleDialog,
  }
}

export default useContentItemActions
