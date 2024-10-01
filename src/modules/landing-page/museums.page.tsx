import Museum from "@/components/museum"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { ArrowRightIcon, ChevronDownIcon } from "@radix-ui/react-icons"

const locations = [
  {
    "path": "Angono",
    "value": "angono"
  },
  {
    "path": "Antipolo",
    "value": "antipolo"
  },
  {
    "path": "Baras",
    "value": "baras"
  },
  {
    "path": "Binangonan",
    "value": "binangonan"
  },
  {
    "path": "Cainta",
    "value": "cainta"
  },
  {
    "path": "Cardona",
    "value": "cardona"
  },
  {
    "path": "Jalajala",
    "value": "jalajala"
  },
  {
    "path": "Morong",
    "value": "morong"
  },
  {
    "path": "Pililla",
    "value": "pililla"
  },
  {
    "path": "Rodriguez",
    "value": "rodriguez"
  },
  {
    "path": "San Mateo",
    "value": "san_mateo"
  },
  {
    "path": "Tanay",
    "value": "tanay"
  },
  {
    "path": "Taytay",
    "value": "taytay"
  },
  {
    "path": "Teresa",
    "value": "teresa"
  }
]


const Museums = () => {
  return (
    <div>
      <div className="container mx-auto">
        <div className="flex flex-col xl:px-32 text-center gap-3 py-20 items-center">
        
          <h1 className="font-display md:text-display-md text-display-sm text-[#492309]">
            {/* <span className="bg-[#50C878]/85">Tech's Impact</span>{" "} */}
            Explore  <span className="bg-[#927B6B]/95 text-gray-300 italic px-2">Rizal’s Province</span>  Museums
          </h1>
          <p className="col-span-6 md:text-body-md text-body-sm font-light text-neutral-700 max-w-[800px]">
          Explore the cultural landmarks of Rizal Province, where every museum unveils a piece of history, art, and heritage. From traditional crafts to modern exhibits, delve into the stories that have shaped our vibrant communities.
          </p>
        </div>
      </div>
      <hr className="text-neutral-300" />

      {/* Search Box */}
      <div className="flex items-center py-4 px-4 space-x-4">
        <Input
          placeholder="Search museums..."
          className="max-w-sm"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="">
              Filter by Location <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {locations
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    
                  >
                    {column.value}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="px-4">
        <div className="flex flex-col gap-8 ">
           <Museum
            title="ANG NUNO ARTISTS FOUNDATION GALLERY"
            icon="/mock/mus1.png"
            address="Angono, Rizal"
            description="A vast collection of paintings, sculptures and other art forms conceptualized and made by independent and budding artists from Angono, the gallery is located at Balaw-Balaw Specialty Restaurant, where customers, visitors and guests alike, oftentimes enjoy viewing the artworks on display.e"
            button={<>
              <Button variant={'expandIcon'} iconPlacement="right" Icon={ArrowRightIcon}>View Museum</Button>
            </>
            }
          />
           <Museum
            title="NEMIRANDA ART HOUSE"
            icon="/mock/high3.jpg"
            address="Angono, Rizal"
            description="A collection of famous artist ( Nemesio “Nemi” R. Miranda Jr.) paintings masterfully employing figurative realism in his artworks, portraying rural life and folkloric art on display. Also available are lectures, guided forms and painting workshops."
            button={<>
              <Button variant={'expandIcon'} iconPlacement="right" Icon={ArrowRightIcon}>View Museum</Button>
            </>
            }
          />
          <Museum
            title="PASEO RIZAL - MAYAGAY"
            icon="/mock/pinto1.jpg"
            address="Tanay, Rizal"
            description="It is where the panoramic view of the lake and mountains becomes an inspiration to many and has been the theme of numerous pens and canvasses. It is home to masterpieces such as paintings of rural scenes, sculptures molded by two caring hands, and antiques and art pieces depicted by a true Filipino heart."
            button={<>
              <Button variant={'expandIcon'} iconPlacement="right" Icon={ArrowRightIcon}>View Museum</Button>
            </>
            }
          />
        </div>
      </div>
    </div>
  )
}

export default Museums
