/* eslint-disable @typescript-eslint/no-explicit-any */
import { Spinner } from '@/components/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertCircle,
  ArrowLeftIcon,
  ArrowRightIcon,
  BarChart3Icon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UploadIcon,
  User2Icon,
  UsersIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EventDocumentation as EventDocumentationType, usePastEvents } from './usePastEvents';

// Define the component-specific documentation interface
interface DocumentationState {
  summary: string;
  objectives: string;
  achievements: string;
  challenges: string;
  learnings: string;
  statistics: {
    attendance: number;
    satisfaction: number;
    engagement: number;
  };
}

const EventDocumentation = () => {
  const { eventId } = useParams<{ eventId: string }>();

  const navigate = useNavigate();

  const {
    loading,
    error,
    currentEvent,
    eventDocumentation,
    savingStatus,
    saveDocumentation,
    updateDocumentation,
    updateEventDetails,
  } = usePastEvents(eventId);

  const [activeTab, setActiveTab] = useState<'details' | 'statistics' | 'photos'>('details');
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [documentation, setDocumentation] = useState<DocumentationState>({
    summary: '',
    objectives: '',
    achievements: '',
    challenges: '',
    learnings: '',
    statistics: {
      attendance: 0,
      satisfaction: 0,
      engagement: 0,
    },
  });
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [originalDocumentation, setOriginalDocumentation] = useState<DocumentationState | null>(null);

  // Initialize form state from fetched data
  useEffect(() => {
    if (eventDocumentation && eventDocumentation.content) {
      try {
        const parsedContent: DocumentationState = JSON.parse(eventDocumentation.content);
        const doc = {
          summary: parsedContent.summary || '',
          objectives: parsedContent.objectives || '',
          achievements: parsedContent.achievements || '',
          challenges: parsedContent.challenges || '',
          learnings: parsedContent.learnings || '',
          statistics: {
            attendance: parsedContent.statistics?.attendance || 0,
            satisfaction: parsedContent.statistics?.satisfaction || 0,
            engagement: parsedContent.statistics?.engagement || 0,
          },
        };
        
        setDocumentation(doc);
        setOriginalDocumentation(doc);
        setIsUpdating(true); // We have existing documentation to update
      } catch (err) {
        console.error('Error parsing event documentation content:', err);
      }
    } else if (currentEvent) {
      // If no documentation but have event, initialize with event data
      setDocumentation((prev) => ({
        ...prev,
        statistics: {
          ...prev.statistics,
          attendance: currentEvent.attendees || 0,
        },
      }));
      setIsUpdating(false); // No existing documentation, so we're creating new
    }
  }, [eventDocumentation, currentEvent]);

  // Track if there are unsaved changes
  useEffect(() => {
    if (!originalDocumentation) {
      // No original to compare to, so this is a new document (always has changes)
      setHasChanges(true);
      return;
    }

    // Deep compare the current state with the original
    const currentJSON = JSON.stringify(documentation);
    const originalJSON = JSON.stringify(originalDocumentation);
    
    setHasChanges(currentJSON !== originalJSON);
  }, [documentation, originalDocumentation]);

  const handleDocumentationChange = (field: keyof Omit<DocumentationState, 'statistics'>, value: string) => {
    setDocumentation((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleStatisticsChange = (field: keyof DocumentationState['statistics'], value: string) => {
    const numberValue = value === '' ? 0 : Number(value);
    setDocumentation((prev) => ({
      ...prev,
      statistics: {
        ...prev.statistics,
        [field]: numberValue,
      },
    }));
  };

  const handleSave = async () => {
    if (!eventId) return;

    try {
      // Serialize the documentation state into the content field
      const docData: EventDocumentationType = {
        event_id: eventId,
        content: JSON.stringify(documentation),
        created_at: eventDocumentation?.created_at || new Date().toISOString(),
      };

      // Determine if we're updating or creating new
      let success;
      
      if (isUpdating && eventDocumentation?.event_id) {
        // Update existing documentation
        success = await updateDocumentation({
          ...docData,
          event_id: eventDocumentation.event_id
        });
      } else {
        // Create new documentation
        success = await saveDocumentation(docData);
      }

      if (success) {
        // Update the event's attendees if changed
        if (documentation.statistics.attendance !== currentEvent?.attendees) {
          await updateEventDetails({
            attendees: documentation.statistics.attendance,
          });
        }

        // Update our local state for tracking changes
        setOriginalDocumentation({...documentation});
        setHasChanges(false);

        // Show success message
        setTimeout(() => {
          navigate('/events');
        }, 1500);
      }
    } catch (error: any) {
      console.error('Error saving documentation:', error);
    }
  };

  // Discard changes and reset to original state
  const handleDiscard = () => {
    if (originalDocumentation) {
      setDocumentation({...originalDocumentation});
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
        <Button variant="outline" size="icon" onClick={() => navigate('/events')}>
          <ArrowLeftIcon className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{currentEvent.title} - Documentation</h1>
          <p className="text-muted-foreground">
            {isUpdating ? 'Update' : 'Create'} comprehensive documentation for this completed event
          </p>
        </div>
        <div className="ml-auto flex gap-2">
          {isUpdating && hasChanges && (
            <Button variant="outline" onClick={handleDiscard}>
              Discard Changes
            </Button>
          )}
          <Button variant={previewMode ? 'default' : 'outline'} onClick={() => setPreviewMode(!previewMode)}>
            {previewMode ? 'Edit Mode' : 'Preview Mode'}
          </Button>
        </div>
      </div>

      {savingStatus.success && (
        <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
          <AlertDescription>
            Documentation {isUpdating ? 'updated' : 'saved'} successfully!
          </AlertDescription>
        </Alert>
      )}

      {savingStatus.error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{savingStatus.error}</AlertDescription>
        </Alert>
      )}

      {!previewMode ? (
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
          <div className="flex border-b mb-6">
            <TabsList className="bg-transparent h-auto p-0">
              <TabsTrigger
                value="details"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-4 py-2"
              >
                Event Details
              </TabsTrigger>
              <TabsTrigger
                value="statistics"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-4 py-2"
              >
                Statistics
              </TabsTrigger>
              <TabsTrigger
                value="photos"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-4 py-2"
              >
                Photos & Media
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="details" className="m-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg">Event Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <span>Date: {new Date(currentEvent.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                      <span>Location: {currentEvent.location || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <UsersIcon className="h-4 w-4 text-muted-foreground" />
                      <span>Attendees: {currentEvent.attendees || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <ClockIcon className="h-4 w-4 text-muted-foreground" />
                      <span>Duration: {currentEvent.duration || 'Not specified'}</span>
                    </div>
                  </div>

                  <div className="aspect-video w-full overflow-hidden rounded-md mt-4">
                    <img
                      src={currentEvent.coverPhoto || '/api/placeholder/400/320'}
                      alt={currentEvent.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Event Documentation</CardTitle>
                  <CardDescription>Document the key aspects of this event for future reference</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="summary">Event Summary</Label>
                    <Textarea
                      id="summary"
                      value={documentation.summary}
                      onChange={(e) => handleDocumentationChange('summary', e.target.value)}
                      placeholder="Provide a brief summary of the event, including its purpose and overall execution"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="objectives">Objectives</Label>
                    <Textarea
                      id="objectives"
                      value={documentation.objectives}
                      onChange={(e) => handleDocumentationChange('objectives', e.target.value)}
                      placeholder="What were the goals and objectives of this event?"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="achievements">Key Achievements</Label>
                    <Textarea
                      id="achievements"
                      value={documentation.achievements}
                      onChange={(e) => handleDocumentationChange('achievements', e.target.value)}
                      placeholder="What were the main achievements and successes of this event?"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="challenges">Challenges</Label>
                    <Textarea
                      id="challenges"
                      value={documentation.challenges}
                      onChange={(e) => handleDocumentationChange('challenges', e.target.value)}
                      placeholder="What challenges were faced during the planning and execution of this event?"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="learnings">Learnings & Future Recommendations</Label>
                    <Textarea
                      id="learnings"
                      value={documentation.learnings}
                      onChange={(e) => handleDocumentationChange('learnings', e.target.value)}
                      placeholder="What lessons were learned? What would you do differently next time?"
                      className="min-h-[100px]"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => navigate('/events')}>
                    Cancel
                  </Button>
                  <Button onClick={() => setActiveTab('statistics')}>
                    Next: Statistics <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="statistics" className="m-0">
            <Card>
              <CardHeader>
                <CardTitle>Event Statistics</CardTitle>
                <CardDescription>Record key metrics and performance indicators from this event</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="attendance">Attendance</Label>
                      <div className="flex items-center">
                        <UsersIcon className="h-4 w-4 text-muted-foreground mr-2" />
                        <Input
                          id="attendance"
                          type="number"
                          value={documentation.statistics.attendance || ''}
                          onChange={(e) => handleStatisticsChange('attendance', e.target.value)}
                          placeholder="Number of attendees"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="satisfaction">Satisfaction Rate (%)</Label>
                      <div className="flex items-center">
                        <User2Icon className="h-4 w-4 text-muted-foreground mr-2" />
                        <Input
                          id="satisfaction"
                          type="number"
                          min="0"
                          max="100"
                          value={documentation.statistics.satisfaction || ''}
                          onChange={(e) => handleStatisticsChange('satisfaction', e.target.value)}
                          placeholder="Visitor satisfaction percentage"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="engagement">Engagement Rate (%)</Label>
                      <div className="flex items-center">
                        <BarChart3Icon className="h-4 w-4 text-muted-foreground mr-2" />
                        <Input
                          id="engagement"
                          type="number"
                          min="0"
                          max="100"
                          value={documentation.statistics.engagement || ''}
                          onChange={(e) => handleStatisticsChange('engagement', e.target.value)}
                          placeholder="Visitor engagement percentage"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <div className="p-6 border rounded-lg bg-muted/10 flex items-center justify-center h-full">
                      <div className="text-center">
                        <BarChart3Icon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">Event Performance Metrics</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Enter your event statistics to generate visual reports and analytics
                        </p>
                        <Button variant="outline">Generate Statistics Report</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab('details')}>
                  <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back: Details
                </Button>
                <Button onClick={() => setActiveTab('photos')}>
                  Next: Photos <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="photos" className="m-0">
            <Card>
              <CardHeader>
                <CardTitle>Photos & Media</CardTitle>
                <CardDescription>Upload photos and media from the event</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer hover:bg-muted/10 transition-colors">
                  <div className="flex flex-col items-center gap-2">
                    <UploadIcon className="h-8 w-8 text-muted-foreground" />
                    <h3 className="text-lg font-medium">Upload Photos</h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      To manage event photos, please use the dedicated Photo Gallery section.
                    </p>
                    <Button className="mt-4" onClick={() => navigate(`/event/gallery/${eventId}`)}>
                      Go to Photo Gallery
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab('statistics')}>
                  <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back: Statistics
                </Button>
                <Button 
                  onClick={handleSave} 
                  disabled={savingStatus.saving || (!hasChanges && isUpdating)}
                >
                  {savingStatus.saving 
                    ? 'Saving...' 
                    : isUpdating 
                      ? hasChanges ? 'Update Documentation' : 'No Changes to Save'
                      : 'Save Documentation'
                  }
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        // Preview Mode
        <Card className="border-primary">
          <CardHeader className="bg-primary/5 border-b">
            <div className="flex items-center justify-between">
              <CardTitle>Event Documentation - Preview Mode</CardTitle>
              <Button variant="outline" onClick={() => setPreviewMode(false)}>
                Back to Editing
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-6 border-b">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3">
                  <div className="aspect-video w-full overflow-hidden rounded-md">
                    <img
                      src={currentEvent.coverPhoto || '/api/placeholder/400/320'}
                      alt={currentEvent.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="mt-4 space-y-4">
                    <div>
                      <h3 className="font-medium text-lg">{currentEvent.title}</h3>
                      <div className="text-sm text-muted-foreground">
                        {new Date(currentEvent.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                        <span>{currentEvent.location || 'Location not specified'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <UsersIcon className="h-4 w-4 text-muted-foreground" />
                        <span>{documentation.statistics.attendance || currentEvent.attendees || 0} attendees</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <ClockIcon className="h-4 w-4 text-muted-foreground" />
                        <span>{currentEvent.duration || 'Duration not specified'}</span>
                      </div>
                    </div>

                    <div className="bg-muted/30 p-4 rounded-md">
                      <h3 className="font-medium mb-2">Key Statistics</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span>Attendance:</span>
                          <span className="font-medium">{documentation.statistics.attendance || currentEvent.attendees || 0}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span>Satisfaction Rate:</span>
                          <span className="font-medium">{documentation.statistics.satisfaction || 0}%</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span>Engagement Rate:</span>
                          <span className="font-medium">{documentation.statistics.engagement || 0}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-2/3">
                  <ScrollArea className="h-[600px] pr-4">
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-bold mb-2">Event Summary</h2>
                        <p className="text-muted-foreground whitespace-pre-line">
                          {documentation.summary || 'No summary provided.'}
                        </p>
                      </div>

                      <Separator />

                      <div>
                        <h2 className="text-xl font-bold mb-2">Objectives</h2>
                        <p className="text-muted-foreground whitespace-pre-line">
                          {documentation.objectives || 'No objectives provided.'}
                        </p>
                      </div>

                      <Separator />

                      <div>
                        <h2 className="text-xl font-bold mb-2">Key Achievements</h2>
                        <p className="text-muted-foreground whitespace-pre-line">
                          {documentation.achievements || 'No achievements provided.'}
                        </p>
                      </div>

                      <Separator />

                      <div>
                        <h2 className="text-xl font-bold mb-2">Challenges</h2>
                        <p className="text-muted-foreground whitespace-pre-line">
                          {documentation.challenges || 'No challenges provided.'}
                        </p>
                      </div>

                      <Separator />

                      <div>
                        <h2 className="text-xl font-bold mb-2">Learnings & Future Recommendations</h2>
                        <p className="text-muted-foreground whitespace-pre-line">
                          {documentation.learnings || 'No learnings provided.'}
                        </p>
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between p-4">
            <Button variant="outline" onClick={() => setPreviewMode(false)}>
              Back to Editing
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={savingStatus.saving || (!hasChanges && isUpdating)}
            >
              {savingStatus.saving 
                ? 'Saving...' 
                : isUpdating 
                  ? hasChanges ? 'Update Documentation' : 'No Changes to Save'
                  : 'Save Documentation'
              }
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default EventDocumentation;
