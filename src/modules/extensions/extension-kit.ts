import Details from "@tiptap-pro/extension-details"
import DetailsContent from "@tiptap-pro/extension-details-content"
import DetailsSummary from "@tiptap-pro/extension-details-summary"
import TableOfContents from "@tiptap-pro/extension-table-of-contents"
import UniqueID from "@tiptap-pro/extension-unique-id"
import CharacterCount from "@tiptap/extension-character-count"
import { isChangeOrigin } from "@tiptap/extension-collaboration"
import Color from "@tiptap/extension-color"
import Dropcursor from "@tiptap/extension-dropcursor"
import FontFamily from "@tiptap/extension-font-family"
import Highlight from "@tiptap/extension-highlight"
import HorizontalRule from "@tiptap/extension-horizontal-rule"
import Placeholder from "@tiptap/extension-placeholder"
import Subscript from "@tiptap/extension-subscript"
import Superscript from "@tiptap/extension-superscript"
import TableHeader from "@tiptap/extension-table-header"
import TableRow from "@tiptap/extension-table-row"
import TaskItem from "@tiptap/extension-task-item"
import TaskList from "@tiptap/extension-task-list"
import TextAlign from "@tiptap/extension-text-align"
import TextStyle from "@tiptap/extension-text-style"
import Typography from "@tiptap/extension-typography"
import StarterKit from "@tiptap/starter-kit"
import { BlockquoteFigure } from "./block-qoute"
import { CodeBlock } from "./code-block"
import { Document } from "./document"
import { FontSize } from "./font-size"
import Heading from "./heading/heading"
import ImageBlock from "./image-block/image-block"
import ImageUpload from "./image-upload/image-upload"
import Column from "./multicolumn/column"
import Columns from "./multicolumn/columns"
import Selection from "./selection/selection"
import SlashCommand from "./slash-command/slash-command"
import { Table, TableCell } from "./table"
import { TrailingNode } from "./trailing-node/trailing-node"
export { Table, TableCell, TableHeader, TableRow } from './table'

export const ExtensionKit = () => [
  Document,
  Columns,
  Column,
  TaskList,
  TaskItem.configure({
    nested: true,
  }),
  Heading.configure({
    levels: [1, 2, 3, 4, 5, 6],
  }),
  BlockquoteFigure,
  FontSize,
  CodeBlock,
  HorizontalRule,
  UniqueID.configure({
    types: ['paragraph', 'heading', 'blockquote', 'codeBlock', 'table'],
    filterTransaction: transaction => !isChangeOrigin(transaction),
  }),
  StarterKit.configure({
    document: false,
    dropcursor: false,
    heading: false,
    horizontalRule: false,
    blockquote: false,
    history: false,
    codeBlock: false,
  }),
  Details.configure({
    persist: true,
    HTMLAttributes: {
      class: 'details',
    },
  }),
  TextStyle,
  TextAlign.extend({
    addKeyboardShortcuts() {
      return {}
    },
  }).configure({
    types: ['heading', 'paragraph'],
  }),
  Subscript,
  Superscript,
  Color,
  Typography,
  CharacterCount.configure({ limit: 50000 }),
  Highlight.configure( { multicolor: true }),
  FontFamily,
  Selection,
  DetailsContent,
  DetailsSummary,
  TrailingNode,
  ImageBlock,
  ImageUpload,
  Placeholder.configure({
    includeChildren: true,
    showOnlyCurrent: false,
    placeholder: () => '',
  }),
  Dropcursor.configure({
    width: 2,
    class: 'ProseMirror-dropcursor border-black',
  }),
  
  SlashCommand,
  Table,
  TableOfContents,
  TableCell,
  TableHeader,
  TableRow,
  // FileHandler.configure({
  //   allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
  //   onDrop: (currentEditor, files, pos) => {
  //     files.forEach(async file => {
  //       // const url = await API.uploadImage(file)

  //       currentEditor.chain().setImageBlockAt({ pos, src: "url" }).focus().run()
  //     })
  //   },
  //   onPaste: (currentEditor, files) => {
  //     files.forEach(async file => {
  //       // const url = await API.uploadImage(file)

  //       return currentEditor
  //         .chain()
  //         .setImageBlockAt({ pos: currentEditor.state.selection.anchor, src: "url" })
  //         .focus()
  //         .run()
  //     })
  //   },
  // }),

]

export default ExtensionKit
