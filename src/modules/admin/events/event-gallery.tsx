/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Spinner } from '@/components/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, ArrowLeftIcon, CameraIcon, ImageIcon, Pencil, Trash2, UploadIcon, XIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import eventService from './service/event.service';
import usePastEvents from './usePastEvents';

const EventGallery = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();

  const {
    loading,
    error,
    currentEvent,
    eventImages,
    savingStatus,
    addImages,
    deleteImage,
    resetSavingStatus,
  } = usePastEvents(eventId);

  const [_, setUploadedFiles] = useState<File[]>([]);
  const [uploadPreviews, setUploadPreviews] = useState<{ file: File; preview: string; caption: string }[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('existing');
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editCaption, setEditCaption] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      resetSavingStatus();
      uploadPreviews.forEach((item) => URL.revokeObjectURL(item.preview));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on unmount

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const newFiles = Array.from(files).filter((file) => validImageTypes.includes(file.type));

    if (newFiles.length === 0) return;

    setUploadedFiles((prev) => [...prev, ...newFiles]);

    const newPreviews = newFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      caption: '',
    }));

    setUploadPreviews((prev) => [...prev, ...newPreviews]);
  };

  const updateCaption = (index: number, caption: string) => {
    setUploadPreviews((prev) =>
      prev.map((item, i) => (i === index ? { ...item, caption } : item))
    );
  };

  const removePreview = (index: number) => {
    URL.revokeObjectURL(uploadPreviews[index].preview);
    setUploadPreviews((prev) => prev.filter((_, i) => i !== index));
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleOpenEditDialog = (image: any) => {
    setSelectedImage(image);
    setEditCaption(image.caption || '');
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedImage(null);
    setEditCaption('');
  };

  const handleConfirmEdit = async () => {
    if (!selectedImage) return;

    try {
      await eventService.updateEventImage(selectedImage.image_id, {
        caption: editCaption,
      });

      handleCloseEditDialog();
      navigate(`/event/gallery/${eventId}`); // Refresh data
    } catch (error) {
      console.error('Error updating caption:', error);
    }
  };

  const handleOpenDeleteDialog = (image: any) => {
    setSelectedImage(image);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedImage(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedImage) return;

    try {
      await deleteImage(selectedImage.image_id);
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const handleUploadImages = async () => {
    if (uploadPreviews.length === 0) return;

    setIsUploading(true);

    try {
      const imagesToUpload = uploadPreviews.map((item, index) => ({
        file: item.file,
        caption: item.caption,
        previewUrl: item.preview,
        display_order: index,
      }));

      await addImages(imagesToUpload);

      setUploadedFiles([]);
      setUploadPreviews([]);
      setActiveTab('existing');
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const setCoverPhoto = async (image: any) => {
    if (!currentEvent || !image) return;

    try {
      await eventService.updateEvent(currentEvent.event_id as string, {
        coverPhoto: image.url,
      });

      await eventService.uploadEventImage(image);

      navigate(`/event/gallery/${eventId}`); // Refresh data
    } catch (error) {
      console.error('Error setting cover photo:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner className="mx-auto" />
        <span className="sr-only">Loading event data...</span>
      </div>
    );
  }

  if (error || !currentEvent) {
    return (
      <div className="p-6 text-center">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || 'Event not found or failed to load.'}</AlertDescription>
        </Alert>
        <Button className="mt-4" onClick={() => navigate('/events')}>
          Back to Events
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" onClick={() => navigate(`/event/documentation/${eventId}`)}>
          <ArrowLeftIcon className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{currentEvent.title} - Photo Gallery</h1>
          <p className="text-muted-foreground">Manage event photos and cover image</p>
        </div>
      </div>

      {savingStatus.success && (
        <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
          <AlertDescription>Photos saved successfully!</AlertDescription>
        </Alert>
      )}

      {savingStatus.error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{savingStatus.error}</AlertDescription>
        </Alert>
      )}

      <Card>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
        <CardHeader>
            <div className="flex justify-between items-center mb-4">
              <CardTitle>Event Photos</CardTitle>
              <TabsList>
                <TabsTrigger value="existing">Existing Photos</TabsTrigger>
                <TabsTrigger value="upload">Upload New</TabsTrigger>
              </TabsList>
            </div>
            <CardDescription>
              {activeTab === 'existing' ? 'Manage existing photos for this event' : 'Upload new photos for this event'}
            </CardDescription>
        </CardHeader>
       
        <CardContent>
          <TabsContent value="existing" className="mt-0">
            {eventImages && eventImages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {eventImages.map((image: any) => (
                  <Card key={image.image_id} className="overflow-hidden group">
                    <div className="relative aspect-square">
                      <img
                        src={image.url}
                        alt={image.caption || 'Event photo'}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button size="sm" onClick={() => handleOpenEditDialog(image)}>
                          <Pencil className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleOpenDeleteDialog(image)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                      {image.is_cover_photo && (
                        <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                          Cover Photo
                        </div>
                      )}
                    </div>
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {image.caption || 'No caption provided'}
                        </p>
                        {!image.is_cover_photo && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCoverPhoto(image)}
                            className="text-xs"
                          >
                            Set as Cover
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-muted/10">
                <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No photos added yet. Upload images to showcase this event.
                </p>
                <Button variant="outline" className="mt-4" onClick={() => setActiveTab('upload')}>
                  Upload Photos
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="upload" className="mt-0">
            <div>
              <div
                className={`
                  border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                  ${dragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/25'}
                `}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={triggerFileInput}
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <UploadIcon className="h-8 w-8 text-muted-foreground" />
                  <p className="text-lg font-medium">Drag and drop images here</p>
                  <p className="text-sm text-muted-foreground">or click to browse</p>
                  <p className="text-xs text-muted-foreground mt-2">JPG, PNG, GIF or WebP, up to 5MB each</p>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  multiple
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  className="hidden"
                />
              </div>

              {uploadPreviews.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Preview ({uploadPreviews.length} images)</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {uploadPreviews.map((preview, index) => (
                      <Card key={index} className="overflow-hidden">
                        <div className="relative aspect-square">
                          <img
                            src={preview.preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8"
                            onClick={() => removePreview(index)}
                          >
                            <XIcon className="h-4 w-4" />
                          </Button>
                        </div>
                        <CardContent className="p-3">
                          <div className="space-y-2">
                            <Label htmlFor={`caption-${index}`}>Image Caption</Label>
                            <Textarea
                              id={`caption-${index}`}
                              placeholder="Add a caption to describe this image..."
                              value={preview.caption}
                              onChange={(e) => updateCaption(index, e.target.value)}
                              className="h-20 resize-none"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="flex justify-end mt-6">
                    <Button
                      onClick={handleUploadImages}
                      disabled={isUploading || uploadPreviews.length === 0}
                    >
                      {isUploading ? (
                        <>
                          <Spinner className="mr-2 h-4 w-4" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <CameraIcon className="mr-2 h-4 w-4" />
                          Upload {uploadPreviews.length} Images
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate(`/event/documentation/${eventId}`)}>
            Back to Events
          </Button>
          <Button onClick={() => navigate(`/event/past-details/${eventId}`)}>
            View Event Details
          </Button>
        </CardFooter>
        </Tabs>
         </Card>

      {/* Edit Caption Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Image Caption</DialogTitle>
            <DialogDescription>Update the caption for this image.</DialogDescription>
          </DialogHeader>

          {selectedImage && (
            <>
              <div className="my-4 aspect-video overflow-hidden rounded-md">
                <img src={selectedImage.url} alt="Selected event" className="w-full h-full object-cover" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-caption">Caption</Label>
                <Textarea
                  id="edit-caption"
                  value={editCaption}
                  onChange={(e) => setEditCaption(e.target.value)}
                  placeholder="Describe this image..."
                  className="min-h-[100px]"
                />
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={handleCloseEditDialog}>
                  Cancel
                </Button>
                <Button onClick={handleConfirmEdit}>Save Changes</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Image</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this image? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {selectedImage && (
            <>
              <div className="my-4 aspect-video overflow-hidden rounded-md">
                <img src={selectedImage.url} alt="Selected event" className="w-full h-full object-cover" />
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={handleCloseDeleteDialog}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleConfirmDelete}>
                  Delete Image
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventGallery;
