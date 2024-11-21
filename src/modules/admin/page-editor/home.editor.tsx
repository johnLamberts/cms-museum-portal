import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { UploadIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HomeEditor = () => {
  const navigate = useNavigate();

  return (
    
        <main className="grid flex-1 p-4 items-start gap-4 md:gap-8">
          <div className="mx-auto grid  flex-1 auto-rows-max gap-4">
            <div className="flex items-center gap-4">
              <Button
                className="h-7 w-7"
                size="icon"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                <ArrowLeftIcon className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
              <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                Home Page
              </h1>
              <Badge className="ml-auto sm:ml-0" variant="outline">
                Edit, and add details to the content.
              </Badge>
              <div className="hidden items-center gap-2 md:ml-auto md:flex">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button size="sm" variant={"gooeyRight"}>
                  Save Changes
                </Button>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
              <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                <Card x-chunk="dashboard-07-chunk-0">
                  <CardHeader>
                    <CardTitle>Hero Section</CardTitle>
                    <CardDescription>
                      Basic details you might think to make your page appealing to the front page after loading
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <div className="grid gap-3">
                        <Label htmlFor="name">Header</Label>
                        <Input
                          className="w-full"
                          defaultValue="Gamer Gear Pro Controller"
                          id="name"
                          type="text"
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="description">Subheader</Label>
                        <Textarea
                          className="min-h-32"
                          defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc."
                          id="description"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card x-chunk="dashboard-07-chunk-2">
                  <CardHeader>
                    <CardTitle>About Section</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <div className="grid gap-6">
                        <div className="grid gap-3">
                          <Label htmlFor="name">Header</Label>
                          <Input
                            className="w-full"
                            defaultValue="Gamer Gear Pro Controller"
                            id="name"
                            type="text"
                          />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="description">Subheader</Label>
                          <Textarea
                            className="min-h-32"
                            defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc."
                            id="description"
                          />
                        </div>
                      </div>
                  </CardContent>
                </Card>
              </div>
              <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                <Card
                  className="overflow-hidden"
                  x-chunk="dashboard-07-chunk-4"
                >
                  <CardHeader>
                    <CardTitle>Landing Page Cover</CardTitle>
                    <CardDescription>
                      Choose the most vibrant and elusive image
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2">
                      <img
                        alt="Product image"
                        className="aspect-square w-full rounded-md object-cover"
                        height="300"
                        src="https://generated.vusercontent.net/placeholder.svg"
                        width="300"
                      />
                      <div className="grid grid-cols-3 gap-2">
                        <button>
                          <img
                            alt="Product image"
                            className="aspect-square w-full rounded-md object-cover"
                            height="84"
                            src="https://generated.vusercontent.net/placeholder.svg"
                            width="84"
                          />
                        </button>
                        <button>
                          <img
                            alt="Product image"
                            className="aspect-square w-full rounded-md object-cover"
                            height="84"
                            src="https://generated.vusercontent.net/placeholder.svg"
                            width="84"
                          />
                        </button>
                        <button className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed">
                          <UploadIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="sr-only">Upload</span>
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 md:hidden">
              <Button size="sm" variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button size="sm">Save Changes</Button>
            </div>
          </div>
        </main>
  );
};
export default HomeEditor;
