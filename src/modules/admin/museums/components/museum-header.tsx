import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Editor, useEditorState } from "@tiptap/react";
import { EditorInfo } from "./musuem-info";

export type EditorHeaderProps = {
  isSidebarOpen?: boolean
  toggleSidebar?: () => void
  editor: Editor,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form?: any;
}


const MuseumHeaderForm = ({ editor, form }: EditorHeaderProps) => {
 
  const { characters, words } = useEditorState({
    editor,
    selector: (ctx): { characters: number; words: number } => {
      const { characters, words } = ctx.editor?.storage.characterCount || { characters: () => 0, words: () => 0 }
      
      
      return { characters: characters(), words: words() }
    },
  })
 
  return (

    <div className="flex flex-row items-center justify-between flex-none py-2 pl-6 pr-3  border-b-2 border-indigo-500 dark:bg-black dark:text-white dark:border-neutral-800">
      <div className="flex flex-row	 gap-x-1 5 items-center ">
        <div className="flex items-center gap-x-1 5">
          <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem >
                  <FormLabel>Title <span className="text-red-600">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="South Drugs" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
      </div>
      <EditorInfo characters={characters} words={words} />
    </div>
  )
}

export default MuseumHeaderForm
