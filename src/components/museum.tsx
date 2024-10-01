import React from "react";

interface Museumrops {
  icon?: string;
  title: string;
  description: string;
  address?: string;
  button?: React.ReactNode
}

const Museum = ({ icon, title, description,  address , button}: Museumrops) => {
  return (
    <div className="flex lg:flex-row flex-col md:gap-20 gap-6 md:p-10 p-8 border border-primary-100">
      {icon &&  <img src={icon} width={"50%"} height={"auto"} alt={title} />}
      <div className="flex flex-col gap-4">
        <p className="font-display md:text-display-md text-display-sm font-normal text-[#0B0400]">
          {title}
        </p>
        <p className="text-body-sm  font-lighter">
          {address}
        </p>
        <p className="text-body-lg font-light text-neutral-700">
          {description}
        </p>

        {button && <div>{button}</div>}
      </div>
    </div>
  );
};
export default Museum;
