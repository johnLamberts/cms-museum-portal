import { useEditor } from '@tiptap/react'

const PageControls = () => {
  const editor = useEditor()

  const updatePageAttribute = (attribute: string, value: string) => {
    editor?.chain().focus().updateAttributes('customPage', { [attribute]: value }).run()
  }

  return (
    <div>
      <label>
        Height:
        <input
          type="text"
          onChange={(e) => updatePageAttribute('height', e.target.value)}
          placeholder="100%"
        />
      </label>
      <label>
        Width:
        <input
          type="text"
          onChange={(e) => updatePageAttribute('width', e.target.value)}
          placeholder="100%"
        />
      </label>
      <label>
        Padding:
        <input
          type="text"
          onChange={(e) => updatePageAttribute('padding', e.target.value)}
          placeholder="0"
        />
      </label>
      <label>
        Margin:
        <input
          type="text"
          onChange={(e) => updatePageAttribute('margin', e.target.value)}
          placeholder="0"
        />
      </label>
    </div>
  )
}

export default PageControls;
