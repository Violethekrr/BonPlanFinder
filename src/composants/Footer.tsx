import { bgBlue, bgOrange } from "../Constantes"
import { FaFacebook, FaWhatsapp } from "react-icons/fa";
import { useTheme } from "../Context/Theme";


export default function Footer() {
  const {isDark}= useTheme()

  return (
    <div className={` ${isDark? `${bgBlue } text-white`:`${bgBlue } text-gray-100`} grid grid-cols-1 gap-4 sm:grid-cols-7  sm:gap-20 p-5 text-xs md:text-sm xl:text-base `}>
      <div className="rounded-full bg-white shadow-xl border-2 border-[#F07D00]">
          <img src="/bpf.webp" alt="" className={`w-40 h-34 `} />
      </div>
      <div className="flex flex-col col-span-3">
        <h2 className="font-medium text-sm md:text-base xl:text-lg  ">BonPlanFinder</h2>
        <p className={`h-0.5 ${bgOrange} w-[20%] xl:w-[15%] mb-3`}></p>
        <p className="pb-3">La plateforme collaborative pour trouver les meilleurs prix près de chez vous. <br></br> Rejoingnez notre communauté d'acheteurs avisés</p>
        <div className="flex gap-3 ">
         
          <a href="https://www.facebook.com/profile.php?id=61587799234794" className="hover:text-[#F07D00] transition-colors duration-300"><FaFacebook className="w-7 h-7"/></a> 
          <a href="https://wa.me/242066067237" className="hover:text-[#F07D00] transition-colors duration-300"><FaWhatsapp className="w-7 h-7"/></a>        
        </div>
      </div>
      <div className="flex flex-col col-span-3">
        <h2 className="font-medium text-sm md:text-base xl:text-lg  ">Categories</h2>
        <p className={`h-0.5 ${bgOrange} w-[20%] xl:w-[15%] mb-3`}></p>
        <ul>
          <li>Emballages</li>
          <li>Boissons</li>
          <li>Cosmétique</li>
         
        </ul>
      </div>
      
      
    </div>
  )
}
