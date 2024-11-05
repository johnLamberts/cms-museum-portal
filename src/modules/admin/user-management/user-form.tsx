import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { UploadIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateUser = () => {
  const navigate = useNavigate();
  const [isFloating, setIsFloating] = useState(false)
  const buttonsRef = useRef<HTMLDivElement>(null)
  const originalTopRef = useRef<number | null>(null)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (buttonsRef.current) {
        if (originalTopRef.current === null) {
          originalTopRef.current = buttonsRef.current.getBoundingClientRect().top + currentScrollY
        }

        const buttonTop = buttonsRef.current.getBoundingClientRect().top
        const originalPositionReached = currentScrollY <= originalTopRef.current - buttonTop

        if (currentScrollY > lastScrollY.current && buttonTop <= 0) {
          setIsFloating(true)
        } else if (currentScrollY < lastScrollY.current && originalPositionReached) {
          setIsFloating(false)
        }
      }

      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  return (
        <main className="grid flex-1 items-start gap-4 p-4 md:gap-8">
          <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
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
                Jericho Sunga
              </h1>
              <Badge className="ml-auto sm:ml-0" variant="outline">
                New User
              </Badge>
              <div
              ref={buttonsRef}
              className={`hidden items-center gap-2 md:ml-auto md:flex ${
                isFloating ? 'fixed top-0 right-4 z-10 bg-background p-2 shadow-md' : ''
              }`}
              >            
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(-1)}
                >
                    Cancel
                </Button>
                <Button size="sm" variant={"gooeyRight"}>
                  Save User
                </Button>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
              <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                <Card x-chunk="dashboard-07-chunk-0">
                  <CardHeader>
                    <CardTitle>User Details</CardTitle>
                    <CardDescription>
                      Basic details you might include when adding a user such as
                      name, and other information.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <div className="grid gap-3">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          className="w-full"
                          defaultValue="Gamer Gear Pro Controller"
                          id="firstName"
                          type="text"
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="middleName">Middle Name</Label>
                        <Input
                          className="w-full"
                          defaultValue="Gamer Gear Pro Controller"
                          id="middleName"
                          type="text"
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          className="w-full"
                          defaultValue="Gamer Gear Pro Controller"
                          id="lastName"
                          type="text"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card x-chunk="dashboard-07-chunk-2">
                  <CardHeader>
                    <CardTitle>User Authentication</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                      <div className="grid gap-3">
                          <Label htmlFor="middleName">Email</Label>
                          <Input
                            className="w-full"
                            defaultValue="Gamer Gear Pro Controller"
                            id="middleName"
                            type="text"
                          />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="lastName">Password</Label>
                          <Input
                            className="w-full"
                            defaultValue="Gamer Gear Pro Controller"
                            id="lastName"
                            type="text"
                          />
                        </div>
                    </div>
                  </CardContent>
                </Card>
                <Card x-chunk="dashboard-07-chunk-2">
                  <CardHeader>
                    <CardTitle>User Role</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                      <div className="grid gap-1">
                        <Label htmlFor="category">Role</Label>
                        <Select>
                          <SelectTrigger
                            aria-label="Select category"
                            id="category"
                          >
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="clothing">Clothing</SelectItem>
                            <SelectItem value="electronics">Admin</SelectItem>
                            <SelectItem value="accessories">Cashier</SelectItem>
                            <SelectItem value="accessories">Staff</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                <Card x-chunk="dashboard-07-chunk-3">
                  <CardHeader>
                    <CardTitle>User Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <div className="grid gap-3">
                        <Label htmlFor="status">Status</Label>
                        <Select>
                          <SelectTrigger aria-label="Select status" id="status">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Active</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card
                  className="overflow-hidden"
                  x-chunk="dashboard-07-chunk-4"
                >
                  <CardHeader>
                    <CardTitle>User Image</CardTitle>
                    <CardDescription>
                      Lipsum dolor sit amet, consectetur adipiscing elit
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
                      <div className="grid auto-rows-max items-center gap-4 lg:col-span-2 lg:gap-8">
                        <button className="h-[4rem] w-[5rem] flex aspect-square w-full items-center justify-center rounded-md border border-dashed">
                          <UploadIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="sr-only">Upload</span>
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card x-chunk="dashboard-07-chunk-5">
                  <CardHeader>
                    <CardTitle>Archive User</CardTitle>
                    <CardDescription>
                      Lipsum dolor sit amet, consectetur adipiscing elit.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div />
                    <Button disabled size="sm" variant="secondary">
                      Archive User
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 md:hidden">
              <Button size="sm" variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button size="sm">Save Product</Button>
            </div>
          </div>
        </main>
  );
};
export default CreateUser;
