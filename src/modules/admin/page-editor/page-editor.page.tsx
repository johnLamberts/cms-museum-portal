// src/modules/admin/page-editor/page-editor.page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Home, Info, Newspaper, PencilRuler, Settings, UserRound } from 'lucide-react';
import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

const PageEditorPage: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname.split('/').pop() || '';
  
  // Determine which tab should be active
  const getActiveTab = () => {
    if (currentPath === 'page_editor' || currentPath === 'homepage') return 'home';
    if (currentPath === 'aboutpage') return 'about';
    if (currentPath === 'home-content') return 'home-content';
    return 'home';
  };

  return (
    <div className="container px-4 py-6 mx-auto max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Page Editor</h1>
        <p className="text-muted-foreground mt-1">
          Create and edit content for your website pages
        </p>
      </div>

      <Tabs defaultValue={getActiveTab()} className="w-full">
        <TabsList className="mb-6 w-full justify-start">
          <TabsTrigger value="home" asChild>
            <NavLink to="/admin-dashboard/page_editor/homepage" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              <span>Home Page</span>
            </NavLink>
          </TabsTrigger>
          <TabsTrigger value="about" asChild>
            <NavLink to="/admin-dashboard/page_editor/aboutpage" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              <span>About Page</span>
            </NavLink>
          </TabsTrigger>
          <TabsTrigger value="home-content" asChild>
            <NavLink to="/admin-dashboard/page_editor/home-content" className="flex items-center gap-2">
              <PencilRuler className="h-4 w-4" />
              <span>Advanced Editor</span>
            </NavLink>
          </TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <Outlet />
        </div>
      </Tabs>

      {currentPath === 'page_editor' && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Home Page
              </CardTitle>
              <CardDescription>Edit your website's landing page content</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Customize the first page visitors see when they arrive at your website.
              </p>
              <NavLink 
                to="/admin-dashboard/page_editor/homepage" 
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                Edit Home Page
              </NavLink>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                About Page
              </CardTitle>
              <CardDescription>Tell visitors about your museum</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Share your museum's history, mission, and vision with your audience.
              </p>
              <NavLink 
                to="/admin-dashboard/page_editor/aboutpage" 
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                Edit About Page
              </NavLink>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PencilRuler className="h-5 w-5" />
                Advanced Editor
              </CardTitle>
              <CardDescription>Use our block-based editor for rich content</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Create complex layouts with our advanced block-based editor for more control.
              </p>
              <NavLink 
                to="/admin-dashboard/page_editor/home-content" 
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                Open Advanced Editor
              </NavLink>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Newspaper className="h-5 w-5" />
                News & Events
              </CardTitle>
              <CardDescription>Manage news articles and event pages</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Share updates, news, and upcoming events with your visitors.
              </p>
              <NavLink 
                to="/admin-dashboard/events" 
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2"
              >
                Manage Events
              </NavLink>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserRound className="h-5 w-5" />
                Team Page
              </CardTitle>
              <CardDescription>Showcase your team members</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Introduce your staff, curators, and leadership team to your audience.
              </p>
              <button 
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2"
                disabled
              >
                Coming Soon
              </button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Global Settings
              </CardTitle>
              <CardDescription>Configure global page settings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Manage SEO settings, social media links, and contact information.
              </p>
              <NavLink 
                to="/admin-dashboard/settings" 
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2"
              >
                Edit Settings
              </NavLink>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PageEditorPage;
