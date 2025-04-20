// src/modules/admin/page-editor/home-editor/menus/LayoutMenu.tsx
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
  Columns,
  LayoutGrid,
  LayoutList,
  SplitSquareVertical
} from 'lucide-react';
import * as React from 'react';

interface LayoutMenuProps {
  editor: Editor;
  appendTo?: React.RefObject<HTMLElement>;
}

export const LayoutMenu: React.FC<LayoutMenuProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const addTwoColumns = () => {
    editor.chain().focus()
      .insertContent({
        type: 'columns',
        attrs: { cols: 2 },
        content: [
          {
            type: 'column',
            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Column 1' }] }]
          },
          {
            type: 'column',
            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Column 2' }] }]
          }
        ]
      })
      .run();
  };

  const addThreeColumns = () => {
    editor.chain().focus()
      .insertContent({
        type: 'columns',
        attrs: { cols: 3 },
        content: [
          {
            type: 'column',
            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Column 1' }] }]
          },
          {
            type: 'column',
            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Column 2' }] }]
          },
          {
            type: 'column',
            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Column 3' }] }]
          }
        ]
      })
      .run();
  };

  const addCallout = () => {
    editor.chain().focus()
      .insertContent({
        type: 'callout',
        attrs: { type: 'info' },
        content: [{ type: 'paragraph', content: [{ type: 'text', text: 'This is a callout box...' }] }]
      })
      .run();
  };

  const addCard = () => {
    editor.chain().focus()
      .insertContent({
        type: 'card',
        content: [
          { 
            type: 'cardHeader', 
            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Card Title' }] }] 
          },
          { 
            type: 'cardContent', 
            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Card content goes here...' }] }] 
          }
        ]
      })
      .run();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <Columns className="h-4 w-4" />
          <span>Layout</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start" >
        <DropdownMenuLabel>Layout Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={addTwoColumns}>
            <SplitSquareVertical className="mr-2 h-4 w-4" />
            <span>Two Columns</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={addThreeColumns}>
            <LayoutGrid className="mr-2 h-4 w-4" />
            <span>Three Columns</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={addCallout}>
            <LayoutList className="mr-2 h-4 w-4" />
            <span>Callout Box</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={addCard}>
            <LayoutList className="mr-2 h-4 w-4" />
            <span>Card</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
