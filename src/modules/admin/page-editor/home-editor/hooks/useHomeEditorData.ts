// // src/hooks/useHomeEditorData.ts
// import { useState, useEffect } from 'react';
// import { toast } from 'sonner';

// export interface Section {
//   id: string;
//   title: string;
//   content: string;
//   visible: boolean;
//   type?: string;
//   order?: number;
//   customClass?: string;
//   animation?: string;
// }

// export interface SeoData {
//   metaTitle: string;
//   metaDescription: string;
//   keywords?: string;
//   ogTitle?: string;
//   ogDescription?: string;
//   ogImage?: string;
//   canonical?: string;
// }

// export interface HeroButton {
//   text: string;
//   url: string;
//   enabled: boolean;
// }

// export interface Typography {
//   headingFont: string;
//   bodyFont: string;
//   baseSize: string;
// }

// export interface Spacing {
//   sectionSpacing: string;
//   contentWidth: number;
// }

// export interface Header {
//   show: boolean;
//   style?: string;
// }

// export interface Footer {
//   show: boolean;
//   style?: string;
// }

// export interface HomePageData {
//   title: string;
//   subtitle: string;
//   aboutTitle: string;
//   aboutContent: string;
//   coverImage: string;
//   sections: Section[];
//   seo: SeoData;
//   heroButton?: HeroButton;
//   layout?: string;
//   colorScheme?: string;
//   typography?: Typography;
//   spacing?: Spacing;
//   header?: Header;
//   footer?: Footer;
//   logo?: string;
//   favicon?: string;
//   lastUpdated?: string;
//   publishedAt?: string;
//   status?: 'draft' | 'published';
//   aboutLayout?: string;
// }

// export const useHomeEditorData = () => {
//   const [pageData, setPageData] = useState<HomePageData | null>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isSaving, setIsSaving] = useState<boolean>(false);
//   const [isDirty, setIsDirty] = useState<boolean>(false);
//   const [originalData, setOriginalData] = useState<HomePageData | null>(null);

//   // Default data structure
//   const defaultData: HomePageData = {
//     title: "Welcome to Our Website",
//     subtitle: "Discover what makes us different and start your journey with us.",
//     aboutTitle: "About Us",
//     aboutContent: "We are dedicated to providing the best experience for our customers.",
//     coverImage: "https://generated.vusercontent.net/placeholder.svg",
//     sections: [
//       {
//         id: "features",
//         title: "Features",
//         content: "Our platform offers a wide range of features to help you succeed.",
//         visible: true,
//         type: "features",
//         order: 0
//       },
//       {
//         id: "testimonials",
//         title: "Testimonials",
//         content: "See what our customers have to say about us.",
//         visible: true,
//         type: "testimonials",
//         order: 1
//       },
//       {
//         id: "call-to-action",
//         title: "Get Started Today",
//         content: "Join thousands of satisfied customers and start your journey with us.",
//         visible: true,
//         type: "call-to-action",
//         order: 2
//       }
//     ],
//     seo: {
//       metaTitle: "Welcome to Our Website",
//       metaDescription: "Discover what makes us different and start your journey with us.",
//       keywords: "website, business, services",
//     },
//     heroButton: {
//       text: "Get Started",
//       url: "/contact",
//       enabled: true
//     },
//     layout: "standard",
//     colorScheme: "blue",
//     typography: {
//       headingFont: "helvetica",
//       bodyFont: "helvetica",
//       baseSize: "medium"
//     },
//     spacing: {
//       sectionSpacing: "normal",
//       contentWidth: 75
//     },
//     header: {
//       show: true
//     },
//     footer: {
//       show: true,
//       style: "standard"
//     },
//     status: 'draft'
//   };

//   // Mock API functions for demo purposes
//   // Replace these with actual API calls to your backend
//   const mockApi = {
//     getHomePage: async (): Promise<{ success: boolean; data?: any; error?: string }> => {
//       return new Promise((resolve) => {
//         // Simulate API delay
//         setTimeout(() => {
//           resolve({
//             success: true,
//             data: localStorage.getItem('homePageData') 
//               ? JSON.parse(localStorage.getItem('homePageData') || '')
//               : { homeContent: defaultData }
//           });
//         }, 800);
//       });
//     },
    
//     saveHomePage: async (data: any): Promise<{ success: boolean; data?: any; error?: string }> => {
//       return new Promise((resolve) => {
//         // Simulate API delay
//         setTimeout(() => {
//           localStorage.setItem('homePageData', JSON.stringify({ homeContent: data }));
//           resolve({
//             success: true,
//             data: { homeContent: data }
//           });
//         }, 1200);
//       });
//     }
//   };

//   // Load data
//   const loadData = async () => {
//     setIsLoading(true);
//     setError(null);
    
//     try {
//       const response = await mockApi.getHomePage();
      
//       if (response.success && response.data) {
//         // Use response data or fall back to default structure
//         const content = response.data.homeContent || defaultData;
//         setPageData(content);
//         setOriginalData(JSON.parse(JSON.stringify(content))); // Deep clone for comparison
//       } else {
//         // If no data is found, use default data
//         setPageData(defaultData);
//         setOriginalData(JSON.parse(JSON.stringify(defaultData)));
//       }
      
//       setIsDirty(false);
//     } catch (error) {
//       console.error("Error loading home page data:", error);
//       setError(error instanceof Error ? error.message : "Failed to load page data");
//       toast.error("Failed to load page data");
      
//       // Still set default data on error
//       setPageData(defaultData);
//       setOriginalData(JSON.parse(JSON.stringify(defaultData)));
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Save data
//   const saveData = async (): Promise<boolean> => {
//     if (!pageData) return false;
    
//     setIsSaving(true);
    
//     try {
//       const dataToSave = {
//         ...pageData,
//         lastUpdated: new Date().toISOString()
//       };
      
//       const response = await mockApi.saveHomePage(dataToSave);
      
//       if (!response.success) {
//         throw new Error(response.error || "Failed to save changes");
//       }
      
//       setOriginalData(JSON.parse(JSON.stringify(dataToSave)));
//       setIsDirty(false);
//       return true;
//     } catch (error) {
//       console.error("Error saving home page data:", error);
//       toast.error(error instanceof Error ? error.message : "Failed to save changes");
//       return false;
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   // Update page data - this sets the dirty flag
