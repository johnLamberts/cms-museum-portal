/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import generatePassword from "@/lib/generaPassword"
import { UploadIcon } from "lucide-react"
import type React from "react"
import { useEffect, useState } from "react"
import useMunicipalities from "../settings/municipalities/hooks/useMunicipality"
import type IMunicipal from "../settings/municipalities/municipal.interface"

const UserForm = ({ form, isEditingMode, user, mode }: any) => {
  const { data: municipalitiesData, isLoading, error } = useMunicipalities()
  const [municipalities, setMunicipalities] = useState<IMunicipal[]>([])
  const [imagePreview, setImagePreview] = useState<string | null>(form.getValues("userImg") || null)

  const { setValue } = form

  useEffect(() => {
    if (municipalitiesData?.data?.municipality && Array.isArray(municipalitiesData.data.municipality)) {
      setMunicipalities(municipalitiesData.data.municipality)

      // When editing, map user.municipal (name) to the corresponding municipal_id
      if (isEditingMode && user?.municipal) {
        const foundMunicipality = municipalitiesData.data.municipality.find(
          (m: IMunicipal) => m.municipal === user.municipal,
        )
        if (foundMunicipality) {
          setValue("userLocation", foundMunicipality.municipal_id?.toString() || "")
        }
      }
    }
  }, [municipalitiesData, isEditingMode, user, setValue])

  const handleSelectChange = (value: string) => {
    form.setValue("userLocation", value)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const img = reader.result as string
        setImagePreview(img)
        form.setValue("userImg", img)
      }
      reader.readAsDataURL(file)
    }
  }

  useEffect(() => {
    const userImg = form.getValues("userImg")
    if (userImg && typeof userImg === "string") {
      setImagePreview(userImg)
    }

    if (!isEditingMode) {
      setValue("password", generatePassword())
    }
  }, [form, isEditingMode, setValue])

  return (
    <main className="grid flex-1 items-start gap-4 p-4 md:gap-8">
      <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
        <Form {...form}>
          <form className="space-y-8">
            <div className="grid gap-4 lg:gap-8">
              <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                {(mode !== "changePassword" || !isEditingMode) && (
                  <Card x-chunk="dashboard-07-chunk-0">
                    <CardHeader>
                      <CardTitle>User Details</CardTitle>
                      <CardDescription>
                        Basic details you might include when adding a user such as name, and other information.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6">
                        <div className="grid gap-3">
                          <FormField
                            control={form.control}
                            name="userRole"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  User Role <span className="text-red-600">*</span>
                                </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a role to user" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="staff">Staff</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid gap-3">
                          <FormField
                            control={form.control}
                            name="userLocation"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  User Location <span className="text-red-600">*</span>
                                </FormLabel>
                                <Select onValueChange={handleSelectChange} value={field.value || ""}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Set a specific location to user">
                                        {field.value
                                          ? municipalities.find((m) => m.municipal_id?.toString() === field.value)
                                              ?.municipal || "Select location"
                                          : "Select location"}
                                      </SelectValue>
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {isLoading ? (
                                      <SelectItem value="loading">Loading locations...</SelectItem>
                                    ) : error ? (
                                      <SelectItem value="error">Error loading locations</SelectItem>
                                    ) : municipalities.length > 0 ? (
                                      municipalities.map((municipal: IMunicipal) => (
                                        <SelectItem
                                          key={municipal.municipal_id}
                                          value={municipal.municipal_id?.toString() || ""}
                                        >
                                          {municipal.municipal || "Unnamed Location"}
                                        </SelectItem>
                                      ))
                                    ) : (
                                      <SelectItem value="no-locations">No locations available</SelectItem>
                                    )}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid gap-3">
                          <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Name <span className="text-red-600">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="John" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid gap-3">
                          <FormField
                            control={form.control}
                            name="middleName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Middle Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Dela Cruz" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid gap-3">
                          <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Last Name <span className="text-red-600">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="John" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                <Card x-chunk="dashboard-07-chunk-2">
                  <CardHeader>
                    <CardTitle>{mode === "changePassword" ? "Change Password" : "User Authentication"}</CardTitle>
                    {mode === "changePassword" && <CardDescription>Update the user's password</CardDescription>}
                  </CardHeader>
                  <CardContent>
                    <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                      {(mode !== "changePassword" || !isEditingMode) && (
                        <div className="grid gap-3">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Email <span className="text-red-600">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="john.doe@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                      {/* Show password field only when:
                          1. Adding a new user (!isEditingMode) OR
                          2. Specifically in changePassword mode */}
                      {(!isEditingMode || mode === "changePassword") && (
                        <div className="grid gap-3">
                          <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Password <span className="text-red-600">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="shadcn" type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                {(mode !== "changePassword" || !isEditingMode) && (
                  <Card className="overflow-hidden" x-chunk="dashboard-07-chunk-4">
                    <CardHeader>
                      <CardTitle>User Image</CardTitle>
                      <CardDescription>
                        Dropoff your user image here, or you can just disregard this section
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <FormField
                        control={form.control}
                        name="userImg"
                        render={({ field: { value, onChange, ...field } }) => (
                          <FormItem className="flex flex-col items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <div className="flex flex-col w-full justify-center items-center">
                                {imagePreview && (
                                  <img
                                    alt="User preview"
                                    className="aspect-square w-full rounded-md object-cover"
                                    src={imagePreview || "/placeholder.svg"}
                                  />
                                )}
                                <div className="relative flex-1 md:grow-0 my-2">
                                  <UploadIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    className="w-full h-8 rounded-lg bg-background pl-8 md:w-[150px] lg:w-[276px]"
                                    placeholder="Upload user image..."
                                    type="file"
                                    accept="image/jpeg,image/png,image/gif"
                                    onChange={(event) => {
                                      const file = event.target.files?.[0]
                                      if (file) {
                                        onChange(file)
                                        handleFileChange(event)
                                      }
                                    }}
                                    {...field}
                                  />
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </form>
        </Form>
      </div>
    </main>
  )
}

export default UserForm

