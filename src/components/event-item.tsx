interface EventItemProps {
  icon?: string;
  title: string;
  description: string;
  date?: string;
}

const EventItem = ({ icon, title, description, date }: EventItemProps) => {
  return (
    <div className="flex flex-col md:gap-20 gap-6 md:p-10 p-8 border border-primary-100">
      {icon &&  <img src={icon} width={"auto"} height={"auto"} alt={title} />}
      <div className="flex flex-col gap-4">
        <p className="font-display md:text-display-md text-display-sm font-normal text-[#0B0400]">
          {title}
        </p>
       {date && (
         <p className="text-body-sm  font-lighter">
         {date}
       </p>
       )}
        <p className="text-body-lg font-light text-neutral-700">
          {description}
        </p>
      </div>
    </div>
  );
};
export default EventItem;
