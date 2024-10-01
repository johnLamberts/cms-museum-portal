import EventItem from "@/components/event-item"
import Eyebrow from "@/components/eyebrow"
import { Button } from "@/components/ui/button"
import { ArrowRightIcon } from "@radix-ui/react-icons"

const Highlights = () => {
  return (
    <div className="container mx-auto">
      <div className="flex flex-col gap-12 lg:py-20 md:py-16 py-12 px-5">
        <div className="grid xl:grid-cols-12 grid-cols-1 xl:gap-8 gap-10 items-center">
          <div className="xl:col-span-6 lg:col-span-8 flex flex-col xl:gap-24 md:gap-20 gap-10">
            <div className="flex flex-col gap-6">
              <Eyebrow label="Museum Sneakpeak" />
              <h3 className="font-display md:text-display-xl text-display-md font-normal pb-4 text-[#492309]">
                {/* Some of <span className="italic">our crafts</span> made with
                love */}
                Immerse Yourself in Rizal Province's Past
              </h3>
            </div>
            <EventItem
              date="September 2, 2013"
              key={"2"}
              icon={"/mock/high1.jpeg"}
              title={"THE BLANCO FAMILY ART MUSEUM"}
              description={"The museum houses the vast collection of artwork produced by the Blanco family of painters."}
            />
            <div className="xl:flex hidden items-start">
              <Button
                variant={"linkHover2"}
                className="text-[#0B0400] font-bold"
              >
                Read more
                <span>
                  <ArrowRightIcon className="ml-1" />
                </span>
              </Button>{" "}
            </div>
          </div>
          <div className="xl:col-span-6 lg:col-span-8 flex flex-col xl:gap-24 md:gap-20 gap-10 xl:px-14">
            <EventItem
              date="September 2, 2013"
              key={"2"}
              icon={"/mock/high2.jpeg"}
              title={"THE BOTONG FRANCISCO MUSEUM AND STREET MURALS"}
              description={"TThe Botong Francisco Museum & Street Murals is just 10 minutes away from Blanco Art Family Museum. "}
            />
            <EventItem
              key={"2"}
              date="September 2, 2013"
              icon={"/mock/high3.jpg"}
              title={"NEMIRANDA ART HOUSE"}
              description={"A collection of famous artist ( Nemesio “Nemi” R. Miranda Jr.) paintings masterfully employing figurative realism in his artworks, portraying rural life and folkloric art on display."}
            />
          </div>
        </div>
        <div className="xl:hidden flex items-start">
          <Button variant={"linkHover1"} className="text-[#0B0400] font-bold">
            Read more
            <span>
              <ArrowRightIcon className="ml-1" />
            </span>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Highlights
