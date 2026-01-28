import { Menu, Moon, Sun} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTheme } from "../Context/Theme";
import { Link, useLocation } from "react-router-dom";
import { textOrange } from "../Constantes";

export default function Navbar() {
  const [button, setButton] = useState<boolean>(false);
  const { isDark, toggleTheme} = useTheme();
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
    <div>
      {/* Navbar desktop */}
      <motion.div
        initial={{ opacity: 1, y: 0 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
        className={`z-20 text-xs md:text-sm xl:text-base hidden fixed w-full  sm:flex sm:justify-between gap-10   p-3 font-medium ${
          !isDark
            ? "text-gray-600 bg-white"
            : "text-white bg-gray-800 "
        } ${scrolled ? "shadow-md shadow-gray-700" : "bg-none"}`}
      >
        <div>
          <img src="/bpf.png" alt="" className={`w-24 h-24 ${isDark? 'rounded-full bg-white': ''}`}/>
        </div>
        <div className={`flex gap-10 justify-center items-center `}>
          <Link to="/" className={linkClass("/")}>Accueil</Link>
          <Link to="/Catalogues" className={linkClass("/Catalogues")}>Catalogues</Link>
          <Link to="/Produits" className={linkClass("/Produits")}>Produits</Link> 
          <button onClick={()=>toggleTheme()}>{isDark? <Sun /> : <Moon/>}</button>
        </div>
      </motion.div>

      {/* Navbar mobile */}
      <div className="flex justify-between z-20 sm:hidden">
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
          className={`z-40 absolute flex flex-col sm:hidden gap-3 p-5 font-medium ${
            !isDark
            ? "text-gray-600 bg-white"
            : "text-white bg-gray-800 "
          }`}
        >
          <Link to="/" className={linkClass("/")}>Accueil</Link>
          <Link to="/Catalogues" className={linkClass("/Catalogues")}>Catalogues</Link>
          <Link to="/Produits" className={linkClass("/Produits")}>Produits</Link>
          <button onClick={()=>toggleTheme()}>{isDark? <Sun /> : <Moon/>}</button>
        </motion.div>
      )}
    </div>
  );
}
