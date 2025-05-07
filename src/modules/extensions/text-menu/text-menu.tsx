// /* eslint-disable react-hooks/rules-of-hooks */
// // src/modules/admin/page-editor/home-editor/menus/TextFormatMenu.tsx
// import * as React from 'react';
// import { Editor } from '@tiptap/react';
// import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
// import { 
//   Bold, 
//   Italic, 
//   Underline, 
//   Strikethrough, 
//   Link, 
//   AlignLeft, 
//   AlignCenter, 
//   AlignRight, 
//   AlignJustify 
// } from 'lucide-react';
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from '@/components/ui/popover';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';

// interface TextFormatMenuProps {
//   editor: Editor;
// }

// export const TextFormatMenu: React.FC<TextFormatMenuProps> = ({ editor }) => {
//   const [linkUrl, setLinkUrl] = React.useState('');
//   const [linkOpen, setLinkOpen] = React.useState(false);

//   if (!editor) {
//     return null;
//   }

//   const isActive = (type: string, options = {}) => {
//     return editor.isActive(type, options);
//   };

//   const toggleBold = () => {
//     editor.chain().focus().toggleBold().run();
//   };

//   const toggleItalic = () => {
//     editor.chain().focus().toggleItalic().run();
//   };

//   const toggleUnderline = () => {
//     editor.chain().focus().toggleUnderline().run();
//   };

//   const toggleStrike = () => {
//     editor.chain().focus().toggleStrike().run();
//   };

//   const setTextAlign = (alignment: 'left' | 'center' | 'right' | 'justify') => {
//     editor.chain().focus().setTextAlign(alignment).run();
//   };

//   const toggleLink = (url: string) => {
//     if (url) {
//       editor.chain().focus().setLink({ href: url }).run();
//     } else {
//       editor.chain().focus().unsetLink().run();
//     }
//     setLinkOpen(false);
//   };

//   React.useEffect(() => {
//     // Update link URL when selection changes
//     if (linkOpen) {
//       const { href } = editor.getAttributes('link');
//       setLinkUrl(href || '');
//     }
//   }, [editor, linkOpen]);

//   return (
//     <div className="flex items-center space-x-1">
//       <ToggleGroup type="multiple" className="flex flex-wrap">
//         <ToggleGroupItem
//           value="bold"
//           aria-label="Toggle bold"
//           data-state={isActive('bold') ? 'on' : 'off'}
//           onClick={toggleBold}
//           size="sm"
//         >
//           <Bold className="h-4 w-4" />
//         </ToggleGroupItem>
        
//         <ToggleGroupItem
//           value="italic"
//           aria-label="Toggle italic"
//           data-state={isActive('italic') ? 'on' : 'off'}
//           onClick={toggleItalic}
//           size="sm"
//         >
//           <Italic className="h-4 w-4" />
//         </ToggleGroupItem>
        
//         <ToggleGroupItem
//           value="underline"
//           aria-label="Toggle underline"
//           data-state={isActive('underline') ? 'on' : 'off'}
//           onClick={toggleUnderline}
//           size="sm"
//         >
//           <Underline className="h-4 w-4" />
//         </ToggleGroupItem>
        
//         <ToggleGroupItem
//           value="strike"
//           aria-label="Toggle strikethrough"
//           data-state={isActive('strike') ? 'on' : 'off'}
//           onClick={toggleStrike}
//           size="sm"
//         >
//           <Strikethrough className="h-4 w-4" />
//         </ToggleGroupItem>
//       </ToggleGroup>

//       <span className="w-px h-6 bg-border mx-1"></span>
      
//       <ToggleGroup type="single" className="flex flex-wrap">
//         <ToggleGroupItem
//           value="left"
//           aria-label="Align left"
//           data-state={isActive({ textAlign: 'left' }) ? 'on' : 'off'}
//           onClick={() => setTextAlign('left')}
//           size="sm"
//         >
//           <AlignLeft className="h-4 w-4" />
//         </ToggleGroupItem>
        
//         <ToggleGroupItem
//           value="center"
//           aria-label="Align center"
//           data-state={isActive({ textAlign: 'center' }) ? 'on' : 'off'}
//           onClick={() => setTextAlign('center')}
//           size="sm"
//         >
//           <AlignCenter className="h-4 w-4" />
//         </ToggleGroupItem>
        
//         <ToggleGroupItem
//           value="right"
//           aria-label="Align right"
//           data-state={isActive({ textAlign: 'right' }) ? 'on' : 'off'}
//           onClick={() => setTextAlign('right')}
//           size="sm"
//         >
//           <AlignRight className="h-4 w-4" />
//         </ToggleGroupItem>
        
//         <ToggleGroupItem
//           value="justify"
//           aria-label="Align justify"
//           data-state={isActive({ textAlign: 'justify' }) ? 'on' : 'off'}
//           onClick={() => setTextAlign('justify')}
//           size="sm"
//         >
//           <AlignJustify className="h-4 w-4" />
//         </ToggleGroupItem>
//       </ToggleGroup>

//       <span className="w-px h-6 bg-border mx-1"></span>
      
//       <Popover open={linkOpen} onOpenChange={setLinkOpen}>
//         <PopoverTrigger asChild>
//           <Button 
//             variant="outline" 
//             size="sm" 
//             className={`h-8 px-2 ${isActive('link') ? 'bg-accent' : ''}`}
//           >
//             <Link className="h-4 w-4" />
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className="w-80">
//           <div className="flex flex-col space-y-2">
//             <h4 className="font-medium text-sm">Insert Link</h4>
//             <div className="flex space-x-2">
//               <Input
//                 placeholder="https://example.com"
//                 value={linkUrl}
//                 onChange={(e) => setLinkUrl(e.target.value)}
//                 className="flex-1"
//               />
//               <Button onClick={() => toggleLink(linkUrl)}>Apply</Button>
//             </div>
//             {isActive('link') && (
//               <Button 
//                 variant="outline" 
//                 size="sm" 
//                 onClick={() => toggleLink('')}
//               >
//                 Remove Link
//               </Button>
//             )}
//           </div>
//         </PopoverContent>
//       </Popover>
//     </div>
//   );
// };
