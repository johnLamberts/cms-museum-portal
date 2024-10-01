import SiteHeader from "@/components/site-header"
import About from "@/modules/landing-page/about.page"
import Hero from "@/modules/landing-page/hero.page"
import Highlights from "@/modules/landing-page/highlights.page"
import UpcomingEvents from "@/modules/landing-page/upcoming-events.page"

const HomeLayout = () => {
  return (
   <div className="bg-[E7E5E1]">
    
    {/* Header for pages */}
    <SiteHeader />

    {/* Landing page */}
    <Hero />
    <About />
   
   
    <hr className="text-neutral-300" />

    <UpcomingEvents />

    <Highlights />
   </div>
  )
}

export default HomeLayout
