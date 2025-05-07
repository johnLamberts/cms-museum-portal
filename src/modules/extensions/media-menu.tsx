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

  const addImage = (url: string, alt = '') => {
    if (url) {
      editor
        .chain()
        .focus()
        .setImage({ src: url, alt: alt || 'Image' })
        .run();
      
      setOpen(false);
      setImageUrl('');
      setImageTitle('');
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
        toast.error('Invalid video URL. Please use YouTube or Vimeo links.');
      }
    }
  };

  const handleFileUpload = async () => {
    if (!uploadedFiles || uploadedFiles.length === 0) {
      toast.error('Please select a file to upload');
      return;
    }

    const file = uploadedFiles[0];
    
    // In a real app, you'd handle the file upload to your server/S3/etc
    // This is a mock implementation
    try {
      toast.loading('Uploading file...');
      
      // Simulate a file upload with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, we'll use a placeholder URL
      const placeholderUrl = '/api/placeholder/800/600';
      
      if (file.type.startsWith('image/')) {
        addImage(placeholderUrl, file.name);
        toast.success('Image uploaded successfully');
      } else {
        toast.error('Unsupported file type');
      }
      
      setUploadedFiles(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file');
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
