
const Hero = () => {
  return (
    <div>
    <div className="container mx-auto">
      <div className="flex flex-col xl:px-32 text-center gap-6 py-20 items-center">
      
        <h1 className="font-display md:text-display-2xl text-display-lg text-[#492309]">
          {/* <span className="bg-[#50C878]/85">Tech's Impact</span>{" "} */}
          Discover the <span className="bg-[#927B6B]/95 text-gray-300 italic px-2">Rich History</span> and Culture of Rizal
        </h1>
        <p className="col-span-8 md:text-body-xl text-body-lg font-light text-neutral-700 max-w-[800px]">
        Immerse yourself in Rizal’s vibrant history and artistic legacy. From iconic landmarks to hidden gems, explore the museums that bring our past to life and shape the stories of tomorrow.
        </p>
      </div>
    </div>
    <div className="relative">
      <a href="/">
        <img
          src={"/mock/mus1.png"}
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
  </div>
  )
}

export default Hero
