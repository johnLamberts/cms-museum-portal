/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import type React from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import uploadImageToSupabase from "@/lib/storage-upload"
import { BubbleMenu } from "@tiptap/react"
import { ImageIcon, LayoutGrid, Trash2, Upload } from "lucide-react"
import { type RefObject, useEffect, useRef, useState } from "react"

interface GalleryMenuProps {
  editor: any
  appendTo?: RefObject<HTMLElement>
}

const GalleryMenu = ({ editor, appendTo }: GalleryMenuProps) => {
  const [_, setFileInput] = useState<HTMLInputElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setFileInput(fileInputRef.current)
  }, [])

  if (!editor) return null

  const isGalleryActive = editor.isActive("gallery")

  // const addGallery = () => {
  //   editor
  //     .chain()
  //     .focus()
  //     .insertContent({
  //       type: "gallery",
  //       content: [
  //         {
  //           type: "galleryItem",
  //           attrs: { src: "/placeholder.svg?height=300&width=400", alt: "Gallery image" },
  //         },
  //         {
  //           type: "galleryItem",
  //           attrs: { src: "/placeholder.svg?height=300&width=400", alt: "Gallery image" },
  //         },
  //         {
  //           type: "galleryItem",
  //           attrs: { src: "/placeholder.svg?height=300&width=400", alt: "Gallery image" },
  //         },
  //       ],
  //     })
  //     .run()
  // }

  const addImageToGallery = () => {
    if (isGalleryActive) {
      editor.chain().focus().addGalleryItem().run()
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    try {
      const file = files[0]
      const url = await uploadImageToSupabase(file)
      editor.chain().focus().addGalleryItem({ src: url, alt: file.name }).run()
    } catch (error) {
      console.error("Error uploading image:", error)
    } finally {
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const uploadImage = () => {
    fileInputRef.current?.click()
  }

  const removeGallery = () => {
    editor.chain().focus().deleteSelection().run()
  }

  return (
    <>
      <input type="file" ref={fileInputRef} style={{ display: "none" }} accept="image/*" onChange={handleFileUpload} />

      <BubbleMenu
        editor={editor}
        shouldShow={({ editor }) => editor.isActive("gallery")}
        tippyOptions={{ appendTo: appendTo?.current || "parent" }}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <LayoutGrid className="h-4 w-4 mr-2" />
              Gallery
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={addImageToGallery}>
              <ImageIcon className="h-4 w-4 mr-2" />
              Add Placeholder Image
            </DropdownMenuItem>
            <DropdownMenuItem onClick={uploadImage}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Image
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={removeGallery} className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Remove Gallery
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </BubbleMenu>
    </>
  )
}

export default GalleryMenu

