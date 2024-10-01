import GeneralError from "@/modules/errors/general-error.page";
import { createBrowserRouter } from "react-router-dom";

export const appRouter = createBrowserRouter([
  {
    path: '/',
    lazy: async () => { 
      const AppShell = await import('@/layouts/home.layout');
      return { Component: AppShell.default }
    },
    errorElement: <GeneralError />
  }
])

export default appRouter;

