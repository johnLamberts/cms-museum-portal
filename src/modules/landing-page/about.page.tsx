import Eyebrow from "@/components/eyebrow"

const About = () => {
  return (
    <div>
    <div className="container mx-auto pl-5">
      <div className="grid lg:grid-cols-12 grid-cols-1 lg:gap-8 gap-20 lg:py-32 py-12 items-center">
        <div className="lg:col-span-6 flex flex-col gap-6">
          <Eyebrow label="ABOUT US" />
          <h2 className="text-[#492309] font-display md:text-display-xl text-display-md font-normal pb-4">
            Rizal Museums: Preserving the <span className="bg-[#927B6B]/95 text-gray-300 italic px-2">Past</span>, Inspiring the <span className="bg-[#927B6B]/95 text-gray-300 italic px-2">Future</span>.
          </h2>
         
          <p className="md:text-body-lg text-body-md font-light text-neutral-700">
          Dedicated to preserving and celebrating Rizal Province’s rich heritage, we connect you to its museums, where history, art, and innovation come together to tell the stories of the past and inspire the future.
          </p>

          <div className="flex justify-left items-left">
            {/* <Button
              variant={"linkHover2"}
              className="text-[#50C878] font-bold"
            >
              Read more
              <span>
                <ArrowRightIcon className="ml-1" />
              </span>
            </Button> */}
          </div>
        </div>
        <div className="lg:col-span-6 flex flex-col gap-8 relative">
          <img src={"/mock/mus2.png"} alt="Award Badge" />
        </div>
      </div>
    </div>
  </div>
  )
}

export default About
