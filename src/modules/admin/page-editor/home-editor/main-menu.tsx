// src/modules/admin/page-editor/home-editor/menus/MediaMenu.tsx
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import supabase from '@/lib/supabase';
import { Editor } from '@tiptap/react';
import {
  FilePlus,
  Image,
  Upload,
  XCircle
} from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

interface MediaMenuProps {
  editor: Editor;
  appendTo?: React.RefObject<HTMLElement>;
}

export const MediaMenu: React.FC<MediaMenuProps> = ({ editor }) => {
  const [open, setOpen] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState('');
  const [imageTitle, setImageTitle] = React.useState('');
  const [videoUrl, setVideoUrl] = React.useState('');
  const [uploadedFiles, setUploadedFiles] = React.useState<FileList | null>(null);
  const [activeTab, setActiveTab] = React.useState('url');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  if (!editor) {
    return null;
  }

  // Use the proper command for the Image extension
  const addImage = (url: string, alt = '') => {
    if (!url) return;
    
    try {
      // Check if editor is available and initialized properly
      if (!editor || editor.isDestroyed) {
        console.error('Editor not available or destroyed');
        return;
      }
      
      // Use the specific setImage command from the Image extension
      editor
        .chain()
        .focus()
        .setImage({ src: url, alt: alt || 'Image' })
        .run();
      
      console.log('Image inserted with URL:', url);
      
      setOpen(false);
      setImageUrl('');
      setImageTitle('');
    } catch (error) {
      console.error('Error inserting image:', error);
      toast.error('Failed to insert image', {
        description: 'There was a problem adding the image to the editor'
      });
    }
  };

  const addVideo = (url: string) => {
    if (url) {
      // Extract YouTube or Vimeo ID
      let videoId = '';
      let provider = '';
      
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        provider = 'youtube';
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
        videoId = match ? match[1] : '';
      } else if (url.includes('vimeo.com')) {
        provider = 'vimeo';
        const match = url.match(/vimeo\.com\/(\d+)/);
        videoId = match ? match[1] : '';
      }
      
      if (videoId && provider) {
        editor
          .chain()
          .focus()
          .insertContent({
            type: 'videoEmbed',
            attrs: { src: url, provider, videoId }
          })
          .run();
        
        setOpen(false);
        setVideoUrl('');
      } else {
        toast.error('Invalid video URL', {
          description: 'Please use YouTube or Vimeo links.'
        });
      }
    }
  };

  // Improved file upload function with better error handling and logging
  const handleFileUpload = async () => {
    if (!uploadedFiles || uploadedFiles.length === 0) {
      toast.error('Please select a file to upload');
      return;
    }

    const file = uploadedFiles[0];
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large', {
        description: 'Maximum file size is 5MB'
      });
      return;
    }
    
    try {
      toast.loading('Uploading file...', {
        id: 'upload-toast'
      });
      
      // Generate a unique file name to prevent collisions
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `home-editor/${fileName}`;
      
      console.log('Uploading file to path:', filePath);
      
      // Upload file to Supabase Storage with more robust error handling
      const { error } = await supabase.storage
        .from('museo_rizal')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) {
        console.error('Supabase upload error:', error);
        throw new Error(error.message || 'Error uploading file');
      }
      
      // Get public URL for the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from('museo_rizal')
        .getPublicUrl(filePath);
      
      const publicUrl = publicUrlData.publicUrl;
      console.log('File uploaded successfully. Public URL:', publicUrl);
      
      toast.dismiss('upload-toast');
      
      if (file.type.startsWith('image/')) {
        // Add the image to the editor with the correct public URL
        addImage(publicUrl, file.name);
        
        toast.success('Upload complete', {
          description: 'Image uploaded successfully'
        });
      } else {
        toast.error('Upload failed', {
          description: 'Unsupported file type'
        });
      }
      
      // Reset file input
      setUploadedFiles(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.dismiss('upload-toast');
      toast.error('Upload failed', {
        description: error instanceof Error ? error.message : 'There was a problem uploading your file'
      });
      
      // Reset file input on error as well
      setUploadedFiles(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Image className="h-4 w-4" />
            <span>Media</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Insert Media</DialogTitle>
            <DialogDescription>
              Add images, videos, or other media to your content.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="url" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="url">URL</TabsTrigger>
              <TabsTrigger value="upload">Upload</TabsTrigger>
            </TabsList>
            
            <TabsContent value="url" className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="image-url">Image URL</Label>
                <Input
                  id="image-url"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image-title">Alt Text</Label>
                <Input
                  id="image-title"
                  placeholder="Image description"
                  value={imageTitle}
                  onChange={(e) => setImageTitle(e.target.value)}
                />
              </div>
              
              <Button 
                onClick={() => addImage(imageUrl, imageTitle)}
                disabled={!imageUrl}
                className="w-full"
              >
                Insert Image
              </Button>
              
              <div className="my-4 relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or add a video
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="video-url">Video URL (YouTube or Vimeo)</Label>
                <Input
                  id="video-url"
                  placeholder="https://youtube.com/watch?v=..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                />
              </div>
              
              <Button 
                onClick={() => addVideo(videoUrl)}
                disabled={!videoUrl}
                className="w-full"
              >
                Insert Video
              </Button>
            </TabsContent>
            
            <TabsContent value="upload" className="space-y-4 py-4">
              <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                {uploadedFiles && uploadedFiles.length > 0 ? (
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        {uploadedFiles[0].name}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setUploadedFiles(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button 
                      onClick={handleFileUpload}
                      className="w-full"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload
                    </Button>
                  </div>
                ) : (
                  <>
                    <FilePlus className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag and drop files here or click to browse
                    </p>
                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => setUploadedFiles(e.target.files)}
                      className="hidden"
                      id="file-upload"
                    />
                    <Label
                      htmlFor="file-upload"
                      className="bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded-md cursor-pointer"
                    >
                      Select File
                    </Label>
                  </>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Supported formats: JPEG, PNG, GIF, WebP. Max file size: 5MB.
              </p>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};
