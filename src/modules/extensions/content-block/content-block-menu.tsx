// src/modules/admin/page-editor/home-editor/menus/ContentBlockMenu.tsx
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Editor } from '@tiptap/react';
import {
  Code,
  Heading1,
  Heading2,
  Heading3,
  ListChecks,
  ListOrdered,
  Plus,
  Quote,
  Text,
} from 'lucide-react';
import * as React from 'react';

interface ContentBlockMenuProps {
  editor: Editor;
}

export const ContentBlockMenu: React.FC<ContentBlockMenuProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const addHeading = (level: 1 | 2 | 3) => {
    editor.chain().focus().toggleHeading({ level }).run();
  };

  const addParagraph = () => {
    editor.chain().focus().setParagraph().run();
  };

  const addBulletList = () => {
    editor.chain().focus().toggleBulletList().run();
  };

  const addOrderedList = () => {
    editor.chain().focus().toggleOrderedList().run();
  };

  const addTaskList = () => {
    editor.chain().focus().toggleTaskList().run();
  };

  const addBlockquote = () => {
    editor.chain().focus().toggleBlockquote().run();
  };

  const addCodeBlock = () => {
    editor.chain().focus().toggleCodeBlock().run();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <Plus className="h-4 w-4" />
          <span>Add Block</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Content Blocks</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => addParagraph()}>
            <Text className="mr-2 h-4 w-4" />
            <span>Paragraph</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => addHeading(1)}>
            <Heading1 className="mr-2 h-4 w-4" />
            <span>Heading 1</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => addHeading(2)}>
            <Heading2 className="mr-2 h-4 w-4" />
            <span>Heading 2</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => addHeading(3)}>
            <Heading3 className="mr-2 h-4 w-4" />
            <span>Heading 3</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => addBulletList()}>
            <ListOrdered className="mr-2 h-4 w-4" />
            <span>Bullet List</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => addOrderedList()}>
            <ListOrdered className="mr-2 h-4 w-4" />
            <span>Numbered List</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => addTaskList()}>
            <ListChecks className="mr-2 h-4 w-4" />
            <span>Task List</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => addBlockquote()}>
            <Quote className="mr-2 h-4 w-4" />
            <span>Blockquote</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => addCodeBlock()}>
            <Code className="mr-2 h-4 w-4" />
            <span>Code Block</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
