import { Menu, Moon, Sun} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTheme } from "../Context/Theme";
import {  NavLink, useLocation } from "react-router-dom";
import { textOrange } from "../Constantes";

export default function Navbar() {
  const [button, setButton] = useState<boolean>(false);
  const { isDark, toggleTheme,panier} = useTheme();
  const [scrolled, setScrolled] = useState<boolean>(false);
  const location = useLocation();
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  const linkClass = (path: string) =>
    `relative inline-block after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:transition-all after:duration-500 ${
      location.pathname === path
        ? `${isDark ?  `${textOrange} after:w-full after:bg-[#F07D00]`: `${textOrange} after:w-full after:bg-[#F07D00]` }`
        : `${isDark ? `hover:text-[#F07D00] after:w-0 hover:after:w-full after:bg-[#F07D00]`: `hover:text-[#F07D00] after:w-0 hover:after:w-full after:bg-[#F07D00]`} `
    }`;

  return (
    <div className="text-xs md:text-sm xl:text-base">
      {/* Navbar desktop */}
      <motion.div
        initial={{ opacity: 1, y: 0 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
        className={`z-20 fixed  hidden w-full  sm:flex sm:justify-between gap-10   p-3 font-medium h-18 ${
          !isDark
            ? "text-gray-600 "
            : "text-white  "
        } ${scrolled ? "shadow-md shadow-gray-700 backdrop-blur-lg " : "bg-none"}`}
      >
        <div>
          <img src="/bpf1.png" alt="" className={`w-30 h-30 relative bottom-8 ${isDark? '': ''}`}/>
        </div>
        <div className={`flex gap-10 justify-center items-center `}>
          <NavLink to="/" className={linkClass("/")}>Accueil</NavLink>
          <NavLink to="/Catalogues" className={({isActive})=> isActive || location.pathname.startsWith("/Produits")?    `relative inline-block after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:transition-all after:duration-500  ${isDark ?  `${textOrange} after:w-full after:bg-[#F07D00]`: `${textOrange} after:w-full after:bg-[#F07D00]` }`  : `relative inline-block after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:transition-all after:duration-500  ${isDark ? `hover:text-[#F07D00] after:w-0 hover:after:w-full after:bg-[#F07D00]`: `hover:text-[#F07D00] after:w-0 hover:after:w-full after:bg-[#F07D00]`} `  }>Catalogues</NavLink> 
          <NavLink to="/Panier" className={linkClass("/Panier")} ><p>Panier</p> {panier.length>0 &&<p className={`absolute bottom-2 left-12 px-2 pb-1 pt-0.5 text-sm flex justify-center items-center rounded-full text-white bg-red-600`}>{panier.length}</p>} </NavLink>
          <NavLink to="/Contact" className={linkClass("/Contact")}>Contact</NavLink> 
          <button onClick={()=>toggleTheme()}>{isDark? <Sun /> : <Moon/>}</button>
        </div>
      </motion.div>

      {/* Navbar mobile */}
      <div className={`flex fixed w-full h-18 justify-between z-20 sm:hidden ${scrolled ? "shadow-md shadow-gray-700 backdrop-blur-lg " : "bg-none"}`}>
        <div
          onClick={() => setButton(!button)}
          className={` ${textOrange} pt-8 pl-2`}
          >
          <Menu className="w-8 h-8" />
        </div>
        <div className="">
          <img src="/bpf.png" alt="" className={`w-24 h-24 `} />
        </div>
      </div>
      

      {button && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.5 }}
          className={`z-40 mt-18 absolute flex flex-col sm:hidden gap-3 p-5 font-medium ${
            !isDark
            ? "text-gray-600 bg-white"
            : "text-white bg-gray-800 "
          }`}
        >
          <NavLink to="/" className={linkClass("/")}>Accueil</NavLink>
         <NavLink to="/Catalogues" className={({isActive})=> isActive || location.pathname.startsWith("/Produits")?    `relative inline-block after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:transition-all after:duration-500  ${isDark ?  `${textOrange} after:w-full after:bg-[#F07D00]`: `${textOrange} after:w-full after:bg-[#F07D00]` }`  : `relative inline-block after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:transition-all after:duration-500  ${isDark ? `hover:text-[#F07D00] after:w-0 hover:after:w-full after:bg-[#F07D00]`: `hover:text-[#F07D00] after:w-0 hover:after:w-full after:bg-[#F07D00]`} `  }>Catalogues</NavLink> 
          <NavLink to="/Panier" className={linkClass("/Panier")}>Panier</NavLink>
          <NavLink to="/Contact" className={linkClass("/Contact")}>Contact</NavLink> 
          <button onClick={()=>toggleTheme()}>{isDark? <Sun /> : <Moon/>}</button>
        </motion.div>
      )}
    </div>
  );
}
