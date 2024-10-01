import EventItem from "@/components/event-item"
import Eyebrow from "@/components/eyebrow"

const MoreAbout = () => {
  return (
    <div>
    <div className="container mx-auto">
      <div className="flex flex-col xl:px-32 text-center gap-6 py-20 items-center">
      
        <h1 className="font-display md:text-display-2xl text-display-lg text-[#492309]">
          {/* <span className="bg-[#50C878]/85">Tech's Impact</span>{" "} */}
          Museo Rizal: Virtual <span className="bg-[#927B6B]/95 text-gray-300 italic px-2">Tours and Digital</span> Collections
        </h1>
        <p className="col-span-8 md:text-body-xl text-body-lg font-light text-neutral-700 max-w-[800px]">
        Through a digital journey, allowing visitors to discover rare artifacts, historical documents, and personal belongings that provide a glimpse into his life
        </p>
      </div>
    </div>
    <div className=" px-12 mb-10">

      <div className="my-2">

      <Eyebrow label="What We Offer" />
      </div>
      
      <div className="flex lg:flex-row flex-col gap-8 ">
              <EventItem
                title="Comprehensive Museum Directory:"
                description="Our portal features a complete listing of museums in Rizal Province, providing essential information such as location, operating hours, admission fees, and current exhibitions."
              />
              <EventItem
                title="Event Highlights"
                description="Stay updated on upcoming events, exhibitions, and educational programs hosted by various museums, allowing you to engage with our cultural community."
              />
              <EventItem
                title="Interactive Experience"
                description="With user accounts, visitors can save their favorite museums and events, leave reviews, and contribute to the ongoing dialogue about our rich history."
              />
      </div>
    </div>

    <div className="relative">
      <a href="/">
        <img
          src={"/mock/pinto1.png"}
          alt="Get in touch"
          className="w-screen h-auto contain	"
        />

        <img
          src={"/cta-button.svg"}
          alt="Get in touch"
          className="absolute xl:left-28 lg:left-[44%] md:left-[42%] left-[35%] -top-16"
        />
      </a>
    </div>

    <div className="pt-4 px-12 mb-10">

      <div className="my-2">

      <Eyebrow label="What We Commit" />
      </div>
      
      <div className="flex lg:flex-row flex-col gap-8 ">
              <EventItem
                title="Our Commitment"
                description="We are committed to preserving and promoting the cultural legacy of Rizal Province. Our team works closely with local museums, historians, and cultural advocates to ensure the accuracy and quality of the information provided. We believe that knowledge is best shared, and we encourage visitors to explore, engage, and participate in our vibrant cultural scene"
              />
      </div>
    </div>

    <div className="relative">
      <div className="grid grid-cols-2 h-auto">
        <img
          src={"/mock/tataraul.jpg"}
          alt="Get in touch"
          className="h-full w-full object-cover"
        />
        <img
          src={"/mock/tataraul2.jpg"}
          alt="Get in touch"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  </div>
  )
}

export default MoreAbout
