import { textBlue, bgBlue, bgOrange } from "../Constantes"
import { FaFacebook, FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";
import { useTheme } from "../Context/Theme";
import { useState } from "react";

export default function Contact() {
  const { isDark } = useTheme();

  const [formData, setFormData] = useState({
    nom: "",
    contact: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const phoneNumber = "242066067237"; // ton numéro WhatsApp
    const text = `Nom: ${formData.nom}%0AContact: ${formData.contact}%0AMessage: ${formData.message}`;
    const url = `https://wa.me/${phoneNumber}?text=${text}`;
    window.open(url, "_blank"); // ouvre WhatsApp avec le message
  };
  // Variants pour les animations
 const containerVariants = {
  hidden: { y: -50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 1.5, // ralentit l'entrée
      ease: "easeOut" as const
    }
  }
};

const itemVariants = {
  hidden: { x: 100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 1.2, // ralentit l'entrée
      ease: "easeOut" as const
    }
  },
  exit: {
    x: 100,
    opacity: 0,
    transition: {
      duration: 2 // déjà lent pour la sortie
    }
  }
};


  return (
    <div className='overflow-hidden sm:h-screen flex flex-col-reverse justify-center items-center sm:grid sm:grid-cols-2 gap-4 sm:gap-0 text-xs md:text-sm xl:text-base'>
      <motion.div 
       variants={containerVariants}
        initial="hidden"
        animate="visible"
        className='flex flex-col justify-center items-center '>
        <img src="/bpf1.webp" alt="Icon" className="w-[70%] h-[70%] sm:w-auto sm:h-auto"/>
        <p className={`text-xl md:text-2xl xl:text-3xl font-bold relative bottom-20 sm:bottom-30 ${textBlue}`}>Contactez-nous!!</p>
      </motion.div>

      <motion.div 
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className={`w-[90%] sm:w-full sm:mt-0 mt-10 ${isDark ? `bg-gray-800` : `${bgBlue}`} text-white p-6 shadow-2xl`}>
        
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2 border-b border-white mb-6">
            <p>Nom</p>
            <input required name="nom" type="text" value={formData.nom} onChange={handleChange}
              className="outline-none placeholder:text-xs placeholder:text-gray-500 pb-2" placeholder="Entrez votre nom" />
          </div>

          <div className="flex flex-col gap-2 border-b border-white mb-6">
            <p>Contact</p>
            <input required name="contact" type="text" value={formData.contact} onChange={handleChange}
              className="outline-none placeholder:text-xs placeholder:text-gray-500 pb-2" placeholder="Entrez votre email" />
          </div>

          <div className="flex flex-col gap-2 border-b border-white">
            <p>Message</p>
            <textarea required name="message" value={formData.message} onChange={handleChange}
              placeholder="Entrez votre message" className="placeholder:text-xs h-24 sm:h-18 lg:text-24 outline-none placeholder:text-gray-500"></textarea>
          </div>

          <button type="submit" className={`${bgOrange} font-bold rounded-md py-2 px-6 my-4 cursor-pointer hover:scale-102 duration-300 transition-transform`}>
            Envoyer sur WhatsApp
          </button>
        </form>

        <div className="flex gap-3 justify-center items-center">
          <a href="https://www.facebook.com/profile.php?id=61587799234794" className="hover:text-[#F07D00] transition-colors duration-300"><FaFacebook className="w-7 h-7"/></a> 
          <a href="https://wa.me/242066067237" className="hover:text-[#F07D00] transition-colors duration-300"><FaWhatsapp className="w-7 h-7"/></a>        
        </div>
      </motion.div>
    </div>
  );
}
