/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { UploadIcon } from "lucide-react"
import type React from "react"
import { useEffect, useState } from "react"
import useMunicipalities from "../settings/municipalities/hooks/useMunicipality"
import type IMunicipal from "../settings/municipalities/municipal.interface"

const CATEGORIES = [
  { id: "ancient-artifacts", name: "Ancient Artifacts" },
  { id: "classical-antiquities", name: "Classical Antiquities" },
  { id: "fine-art", name: "Fine Art" },
  { id: "asian-collections", name: "Asian Collections" },
  { id: "pre-columbian-art", name: "Pre-Columbian Art" },
  { id: "literary-artifacts", name: "Literary Artifacts" },
  { id: "science-technology", name: "Science & Technology" },
  { id: "indigenous-art", name: "Indigenous Art" },
  { id: "decorative-arts", name: "Decorative Arts" },
  { id: "modern-contemporary", name: "Modern & Contemporary" },
]

const GalleryForm = ({ form, isEditingMode, artifact }: any) => {
  const { data: municipalitiesData, isLoading, error } = useMunicipalities()
  const [municipalities, setMunicipalities] = useState<IMunicipal[]>([])
  const [imagePreview, setImagePreview] = useState<string | null>(form.getValues("artifactImg") || null)

  const { setValue } = form

  useEffect(() => {
    if (municipalitiesData?.data?.municipality && Array.isArray(municipalitiesData.data.municipality)) {
      setMunicipalities(municipalitiesData.data.municipality)

      // When editing, map artifact.municipal (name) to the corresponding municipal_id
      if (isEditingMode && artifact?.municipal) {
        const foundMunicipality = municipalitiesData.data.municipality.find(
          (m: IMunicipal) => m.municipal === artifact.municipal,
        )
        if (foundMunicipality) {
          setValue("location", foundMunicipality.municipal_id?.toString() || "")
        }
      }
    }
  }, [municipalitiesData, isEditingMode, artifact, setValue])

  const handleSelectChange = (value: string) => {
    form.setValue("location", value)
  }

  const handleCategoryChange = (value: string) => {
    form.setValue("category", value)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const img = reader.result as string
        setImagePreview(img)
        form.setValue("artifactImg", img)
      }
      reader.readAsDataURL(file)
    }
  }

  useEffect(() => {
    const artifactImg = form.getValues("artifactImg")
    if (artifactImg && typeof artifactImg === "string") {
      setImagePreview(artifactImg)
    }
  }, [form])

  return (
    <main className="grid flex-1 items-start gap-4 p-4 md:gap-8">
      <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
        <Form {...form}>
          <form className="space-y-8">
            <div className="grid gap-4 lg:gap-8">
              <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                <Card x-chunk="dashboard-07-chunk-0">
                  <CardHeader>
                    <CardTitle>Artifact Details</CardTitle>
                    <CardDescription>
                      Enter the basic information about this museum artifact
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <div className="grid gap-3">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Title <span className="text-red-600">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="Ancient Egyptian Sarcophagus" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid gap-3">
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Description <span className="text-red-600">*</span>
                              </FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Detailed description of the artifact"
                                  className="min-h-32"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid gap-3">
                        <FormField
                          control={form.control}
                          name="period"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Time Period</FormLabel>
                              <FormControl>
                                <Input placeholder="New Kingdom Period, c. 1550-1070 BCE" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid gap-3">
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Category <span className="text-red-600">*</span>
                              </FormLabel>
                              <Select onValueChange={handleCategoryChange} value={field.value || ""}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {CATEGORIES.map((category) => (
                                    <SelectItem key={category.id} value={category.id}>
                                      {category.name}
                                    </SelectItem>
                                  ))}
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
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Location <span className="text-red-600">*</span>
                              </FormLabel>
                              <Select onValueChange={handleSelectChange} value={field.value || ""}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select artifact location">
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
                          name="featured"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Featured Artifact</FormLabel>
                                <p className="text-sm text-muted-foreground">
                                  Highlight this as a featured exhibit in the museum
                                </p>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden" x-chunk="dashboard-07-chunk-4">
                  <CardHeader>
                    <CardTitle>Artifact Image</CardTitle>
                    <CardDescription>
                      Upload an image of the artifact
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="artifactImg"
                      render={({ field: { value, onChange, ...field } }) => (
                        <FormItem className="flex flex-col items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <div className="flex flex-col w-full justify-center items-center">
                              {imagePreview && (
                                <img
                                  alt="Artifact preview"
                                  className="aspect-square w-full rounded-md object-cover"
                                  src={imagePreview || "/placeholder.svg"}
                                />
                              )}
                              <div className="relative flex-1 md:grow-0 my-2">
                                <UploadIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                  className="w-full h-8 rounded-lg bg-background pl-8 md:w-[150px] lg:w-[276px]"
                                  placeholder="Upload artifact image..."
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
              </div>
            </div>
          </form>
        </Form>
      </div>
    </main>
  )
}

export default GalleryForm
