import { textBlue,bgBlue,bgOrange } from "../Constantes"
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { motion} from "framer-motion";
import { useTheme } from "../Context/Theme";
export default function Contact() {
const {isDark}= useTheme()
  const containerVariants = {
    hidden: { x: 60, opacity: 0 },
    visible: {
      x:0,
      opacity: 1,
      transition: {
        
        stiffness: 1000,
        damping: 25
      }
    }
  };
const image = {
    hidden: { scale: 0.98, opacity: 0 },
    visible: {
      scale:1,
      opacity: 1,
      transition: {
        
        stiffness: 1000,
        damping: 25
      }
    }
  };

  return (
    <div className='overflow-hidden h-screen flex flex-col-reverse justify-center items-center sm:grid sm:grid-cols-2 gap-4 sm:gap-0 text-xs md:text-sm xl:text-base'>
      <motion.div 
        variants={image}
        initial="hidden"
        animate="visible" className='flex flex-col justify-center items-center'>
        <img src="/bpf1.png" alt="Icon" />
        <p className={`text-xl md:text-2xl xl:text-3xl font-bold relative bottom-30 ${textBlue}`}>Contactez-nous!!</p>
      </motion.div>
      <motion.div 
       variants={containerVariants}
       initial="hidden"
       animate="visible"
       exit="exit" className={` ${isDark ? `bg-gray-800`:`${bgBlue}`} text-white p-6 shadow-2xl`}>
        <form className="flex flex-col gap-2 ">
            <div className="flex flex-col gap-2 border-b border-white mb-6">
                <p>Nom</p>
                <input name="nom" type="text" className="outline-none placeholder:text-xs placeholder:text-gray-500 pb-2" placeholder="Entrez votre nom" />
            </div>
             <div className="flex flex-col gap-2 border-b border-white mb-6">
                <p>Email</p>
                <input name="email" type="email" className="outline-none placeholder:text-xs  placeholder:text-gray-500 pb-2" placeholder="Entrez votre email" />
            </div>
             <div className="flex flex-col gap-2 border-b border-white">
                <p>Message</p>
                <textarea name="message" placeholder="Entrez votre message" className="placeholder:text-xs h-24 outline-none  placeholder:text-gray-500"></textarea>
             </div>
             <button className={`${bgOrange} font-bold rounded-md  py-2 px-6 my-4 cursor-pointer hover:scale-102 duration-300 transition-transform`}>Contactez-nous!!</button>
        
        </form>
        <div className="flex gap-3 justify-center items-center">
          <a><FaInstagram className="w-7 h-7"/></a>
          <a><FaFacebook className="w-7 h-7"/></a> 
          <a><FaWhatsapp className="w-7 h-7"/></a>        
        </div>
      </motion.div >
    </div>
  )
}
