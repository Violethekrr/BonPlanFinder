import { bgBlue, bgOrange } from "../Constantes"
import { Instagram, Facebook, Twitter} from "lucide-react";

export default function Footer() {
  return (
    <div className={`${bgBlue} grid grid-cols-1 gap-4 sm:grid-cols-2  sm:gap-20 p-5 text-xs md:text-sm xl:text-base text-white`}>
      <div className="flex flex-col ">
        <h2 className="font-medium text-sm md:text-base xl:text-lg  ">BonPlanFinder</h2>
        <p className={`h-0.5 ${bgOrange} w-[20%] xl:w-[15%] mb-3`}></p>
        <p className="pb-3">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quae quas dLorem ipsum dolor sit, amet consectetur adipisicing elit. Quae quas d</p>
        <div className="flex gap-3 ">
          <Twitter />
          <Facebook />
          <Instagram />
        </div>
      </div>
      <div className="flex flex-col ">
        <h2 className="font-medium text-sm md:text-base xl:text-lg  ">Categories</h2>
        <p className={`h-0.5 ${bgOrange} w-[20%] xl:w-[15%] mb-3`}></p>
        <ul>
          <li>Lorem ipsum dolor</li>
          <li>Lorem ipsum dolor</li>
          <li>Lorem ipsum dolor</li>
          <li>Lorem ipsum dolor</li>
          <li>Lorem ipsum dolor</li>
        </ul>
      </div>
      
    </div>
  )
}
