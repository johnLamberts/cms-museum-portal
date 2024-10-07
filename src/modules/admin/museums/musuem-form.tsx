import { useRef } from "react";

const MuseumForm = () => {
  
  const menuContainerRef = useRef<HTMLDivElement | null>(null);
  
  return (
    <>

      <div className="flex h-full" ref={menuContainerRef}>

        <div className="relative flex flex-col flex-1 h-full overflow-hidden">
          
        </div>
      </div>
    
    </>
  )
}

export default MuseumForm
