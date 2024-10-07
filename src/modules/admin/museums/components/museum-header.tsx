import { useEditorState} from "@tiptap/react";

const MuseumHeaderForm = () => {
 
  const { characters, words } = useEditorState({
    editor,
    selector: (ctx): { characters: Number, words: number } => {
      const { characters, words} = ctx.editor?.storage.charactarCount || { characters: () => 0, words: () => 0}

      return { characters: characters(), words: words() }
    }
  })
 
  return (

    <div className="flex flex-row items-center justify-between flex-none py-2 pl-6 pr-3 border-neutral-200">
      <div className="flex flex-row gap-x-1 5 items-center">
        <div className="flex items-center gap-x-1 5">
          <Toolbar
        </div>
      </div>
    </div>
  )
}

export default MuseumHeaderForm