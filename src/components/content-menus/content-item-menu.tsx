import useContentItemActions from "@/hooks/useContentItemActions";
import { useData } from "@/hooks/useData";
import { PaddingIcon } from "@radix-ui/react-icons";
import * as Popover from "@radix-ui/react-popover";
import DragHandle from '@tiptap-pro/extension-drag-handle-react';
import { Editor } from "@tiptap/core";
import { useEffect, useState } from "react";
import { Button } from "../q_ui/button";
import { Surface } from "../surface";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Toolbar } from "../ui/toolbar";
import { Icon } from "./../icon";
import { DropdownButton } from "./content-dropdown-button";


export type ContentItemMenuProps = {
  editor: Editor
}

export const ContentItemMenu = ({ editor }: ContentItemMenuProps) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const data = useData()
  const actions = useContentItemActions(editor, data.currentNode, data.currentNodePos)

  useEffect(() => {
    if (menuOpen) {
      editor.commands.setMeta('lockDragHandle', true)
    } else {
      editor.commands.setMeta('lockDragHandle', false)
    }
  }, [editor, menuOpen])

  return (
    <DragHandle
      pluginKey="ContentItemMenu"
      editor={editor}
      onNodeChange={data.handleNodeChange}
      tippyOptions={{
        offset: [-8, 16],
        zIndex: 99,
        placement: 'top-start', // Change placement to top-start
      }}
    >
      <div className="flex items-center gap-0.5 absolute top-[-20px] left-0">
        <Toolbar.Button onClick={actions.handleAdd}>
          <Icon name="Plus" />
        </Toolbar.Button>

        

        {/* New page style dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Toolbar.Button onClick={actions.handleAdd}>
                <PaddingIcon name="Padding" />
              </Toolbar.Button>            
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Page Style</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="height" className="text-right">Height</Label>
                  <Input
                    id="height"
                    value={actions.pageStyle.height}
                    onChange={(e: { target: { value: string; }; }) => actions.updatePageStyle('height', e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="width" className="text-right">Width</Label>
                  <Input
                    id="width"
                    value={actions.pageStyle.width}
                    onChange={(e: { target: { value: string; }; }) => actions.updatePageStyle('width', e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="padding" className="text-right">Padding</Label>
                  <Input
                    id="padding"
                    value={actions.pageStyle.padding}
                    onChange={(e: { target: { value: string; }; }) => actions.updatePageStyle('padding', e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="margin" className="text-right">Margin</Label>
                  <Input
                    id="margin"
                    value={actions.pageStyle.margin}
                    onChange={(e: { target: { value: string; }; }) => actions.updatePageStyle('margin', e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <Button onClick={actions.resetPageStyle}>Reset Styles</Button>
            </DialogContent>
          </Dialog>
  
        <Popover.Root open={menuOpen} onOpenChange={setMenuOpen}>
          <Popover.Trigger asChild>
            <Toolbar.Button>
              <Icon name="GripVertical" />
            </Toolbar.Button>
          </Popover.Trigger>
          <Popover.Content side="bottom" align="start" sideOffset={8}>
            <Surface className="p-2 flex flex-col min-w-[16rem]">
              <Popover.Close>
                <DropdownButton onClick={actions.resetTextFormatting}>
                  <Icon name="RemoveFormatting" />
                  Clear formatting
                </DropdownButton>
              </Popover.Close>
              <Popover.Close>
                <DropdownButton onClick={actions.copyNodeToClipboard}>
                  <Icon name="Clipboard" />
                  Copy to clipboard
                </DropdownButton>
              </Popover.Close>
              <Popover.Close>
                <DropdownButton onClick={actions.duplicateNode}>
                  <Icon name="Copy" />
                  Duplicate
                </DropdownButton>
              </Popover.Close>
              <Toolbar.Divider horizontal />
              <Popover.Close>
                <DropdownButton
                  onClick={actions.deleteNode}
                  className="text-red-500 bg-red-500 dark:text-red-500 hover:bg-red-500 dark:hover:text-red-500 dark:hover:bg-red-500 bg-opacity-10 hover:bg-opacity-20 dark:hover:bg-opacity-20"
                >
                  <Icon name="Trash2" />
                  Delete
                </DropdownButton>
              </Popover.Close>
            </Surface>
          </Popover.Content>
        </Popover.Root>
      </div>
    </DragHandle>
  )
}
