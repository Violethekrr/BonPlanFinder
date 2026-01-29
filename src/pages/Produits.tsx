import { useLocation } from "react-router-dom";
import { produits, pieces, bgOrange } from "../Constantes"
import { textOrange, bgBlue } from "../Constantes";
import { useTheme } from "../Context/Theme";
import { Search, ChevronDown, ChevronUp, SearchX } from "lucide-react";
import { useState } from "react";
import type { piecesProps, produitsProps } from "../Constantes";
import { motion, AnimatePresence, delay } from "framer-motion";

export default function Produits() {

  function trierProduits(produits: produitsProps[], type: string, pieces: piecesProps[]): produitsProps[] {
    switch (type) {
      case "prix >":
        return [...produits].sort((a, b) => {
          const pa = pieces.find(p => p.id_produit === a.id)?.prix ?? 0;
          const pb = pieces.find(p => p.id_produit === b.id)?.prix ?? 0;
          return pb - pa; 
        });
      case "prix <":
        return [...produits].sort((a, b) => {
          const pa = pieces.find(p => p.id_produit === a.id)?.prix ?? 0;
          const pb = pieces.find(p => p.id_produit === b.id)?.prix ?? 0;
          return pa - pb; 
        });
      case "a-z":
        return [...produits].sort((a, b) => a.nom.localeCompare(b.nom));
      case "z-a":
        return [...produits].sort((a, b) => b.nom.localeCompare(a.nom));
      default:
        return produits;
    }
  }

  const location = useLocation(); 
  const { isDark } = useTheme();
  const { id } = location.state || {};
  const { nom } = location.state || {};
  const [select, setSelect] = useState<boolean>(false);
  const [trie, setTrie] = useState<string>('prix <');
  const [pieceEnCours, setPieceEnCours] = useState<{[key:number]: piecesProps | null}>({});
  const [selectPiece, setSelectPiece] = useState<number | null>(null);
  const [rechercher, setRechercher] = useState('');
  
  const triage = [
    { id: 1, type: 'prix >' },
    { id: 1, type: 'prix <' },
    { id: 2, type: 'a-z' },
    { id: 3, type: 'z-a' }
  ];
  
  const produitsEnCours = produits.filter((produit) => produit.id_type === id);
  
  const produitsEnCoursFilter = produitsEnCours.filter(pd =>
    pd.nom.toLowerCase().includes(rechercher.toLowerCase()) ||
    pd.description.toLowerCase().includes(rechercher.toLowerCase()) 
  );
  
  const produitsAffiches = trierProduits(produitsEnCoursFilter, trie, pieces);

  // Variants pour les animations
  const containerVariants = {
    hidden: { y: -20,scale:0.95, opacity: 0 },
    visible: {
      y:0,
      scale:1,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 25
      }
    }
  };



  const dropdownVariants = {
    hidden: { 
      opacity: 0,
      y: -10,
      scale: 0.95
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 25
      }
    },
    exit: { 
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`flex flex-col gap-4 text-xs md:text-sm xl:text-base ${isDark ? 'text-white' : ''}`}
    >
     
      <motion.h2 
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className={`text-3xl md:text-4xl xl:text-5xl font-bold ${textOrange} text-center tracking-tight`}
      >
        {nom}
      </motion.h2>
      
      <motion.p 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className={`text-center leading-relaxed max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
      >
        Parcourez notre sélection de produits et laissez-vous inspirer par la variété et la qualité des articles proposés. 
        Chaque produit est présenté avec soin pour vous offrir une expérience claire et agréable, que vous soyez à la recherche 
        de praticité, de confort ou d'esthétisme. Prenez le temps de découvrir les détails, comparez les options et trouvez 
        facilement ce qui correspond à vos envies.
      </motion.p>
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={`flex items-center justify-center gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
      >
        <div className={`h-px w-12 ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
        <p className="font-medium">{produitsEnCours.length} produits disponibles</p>
        <div className={`h-px w-12 ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
      </motion.div>
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className={`flex justify-between ${isDark? `border border-gray-700 ` :`${bgBlue}`} p-5 items-center rounded-md max-w-6xl mx-auto w-full`}
      >
        <div className="flex w-[45%] justify-center items-center sm:w-[70%] bg-white rounded-lg focus-within:border-[#F07D00] border border-transparent overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
          <input  
            value={rechercher} 
            onChange={(e) => setRechercher(e.target.value)} 
            placeholder="rechercher un produit dans ce catalogue" 
            type="text" 
            className="placeholder:text-xs outline-none w-full bg-white focus:border-[#F07D00] p-2 text-gray-900" 
          />
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#5AA136] text-white p-2"
          >
            <Search className="w-5"/>
          </motion.button>
        </div>
        
        <div className="flex flex-col gap-3 text-white text-xs lg:text-sm">
          <div className="flex gap-3 justify-center items-center">
            <p className="font-light">Trier par</p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelect(!select)} 
              className={`flex items-center gap-1 border font-medium rounded-lg px-4 py-2 text-sm transition-all duration-200 border-gray-300`}
            >
              {trie} {select ? <ChevronUp className="w-4 h-4"/> : <ChevronDown className="w-4 h-4"/>}
            </motion.button>
          </div>
          
          <AnimatePresence>
            {select && (
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={`absolute z-20 right-[12%] mt-12 rounded-lg grid grid-cols-1 gap-2 text-center ${
                  !isDark ? 'bg-white text-black' : `${bgBlue}`
                }`}
              >
                {triage.map((type, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <motion.button 
                      whileHover={{  backgroundColor: '#F07D00' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setTrie(type.type)} 
                      className={`py-2 px-8 w-full hover:text-white transition-all duration-150 ${!isDark ? 'text-gray-800' : 'text-white'}`}
                    >
                      {type.type}
                    </motion.button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto w-full pt-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 pb-10"
      >
        {produitsAffiches.map((produit, i) => {
          const piece = pieces.filter((p) => p.id_produit === produit.id);
          const pieceCours = piece[0];
          
          return (
            <motion.div 
              key={i}
             
              whileHover={{ 
                scale: 1.03,
                transition: { duration: 0.3 }
              }}
              className={`group grid grid-cols-1 rounded-lg shadow-xl ${isDark ? 'bg-gray-800 bg-opacity-50 backdrop-blur-sm shadow-xl hover:shadow-2xl border border-gray-700 hover:border-gray-600' : 'bg-white shadow-lg hover:shadow-2xl'}`}
            >
              <div className="relative overflow-hidden h-56 rounded-t-lg">
                <motion.img 
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  src={produit.image} 
                  alt={produit.nom} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="grid grid-cols-1 gap-2 p-3">
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className={`font-medium text-sm md:text-lg xl:text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}
                >
                  {produit.nom}
                </motion.p>
                
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className={`pb-2 border-b ${isDark ? 'text-gray-400 border-gray-700' : 'text-gray-600 border-gray-200'}`}
                >
                  {produit.description}
                </motion.p>
                
                <div className="flex justify-between items-center w-full">
                  <div>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Prix</p>
                    <motion.p 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.4, type: "spring" }}
                      className={`font-bold text-xl ${textOrange}`}
                    >
                      {pieceEnCours[produit.id]?.prix ?? pieceCours?.prix} <span className="text-sm">FCFA</span>
                    </motion.p>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectPiece(selectPiece === produit.id ? null : produit.id)} 
                      className={`flex items-center gap-1 font-medium rounded-lg px-4 py-2 text-sm transition-all duration-200 ${isDark ? 'bg-gray-700 hover:bg-gray-600 border border-gray-600' : 'bg-gray-100 hover:bg-gray-200 border border-gray-300'}`}
                    >
                      {pieceEnCours[produit.id]?.nombre_de_pieces ?? pieceCours?.nombre_de_pieces} pcs
                      {selectPiece === produit.id ? <ChevronUp className="w-4 h-4"/> : <ChevronDown className="w-4 h-4"/>}
                    </motion.button>
                    
                    <AnimatePresence>
                      {selectPiece === produit.id && (
                        <motion.div
                          variants={dropdownVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className={`absolute z-20 mt-12 overflow-hidden shadow-2xl rounded-lg grid grid-cols-1 gap-2 ${!isDark ? 'bg-white' : 'bg-gray-800 backdrop-blur-md'}`}
                        >
                          {piece.map((p, idx) => (
                            <motion.div 
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                            >
                              <motion.button 
                                whileHover={{ backgroundColor: '#F07D00' }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setPieceEnCours(prev => ({ ...prev, [produit.id]: p }))} 
                                className={`px-6 py-2 w-full hover:text-white transition-colors duration-150 ${!isDark ? 'text-gray-800' : 'text-white'}`}
                              >
                                <div className="flex justify-between items-center">
                                  <span>{p.nombre_de_pieces} pcs</span>
                                </div>
                              </motion.button>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                
                 <button className={`${bgOrange} mt-3 py-2 rounded-xl font-semibold text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200`}>
                  Acheter maintenant
                </button>
              </div>
            </motion.div>
          );
        })}
       
      </motion.div>
        {produitsAffiches.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`flex flex-col items-center justify-center w-full py-20 max-w-7xl mx-auto ${
            !isDark ? "text-gray-800" : "text-white"
          }`}
        >
         
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring" as const,
              stiffness: 200,
              damping: 15,
              delay: 0.2 
            }}
            className={`mb-6 p-6 rounded-full ${
              isDark ? 'bg-gray-800' : 'bg-gray-100'
            }`}
          >
            <motion.div
              animate={{ 
                rotate: [0, -10, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
            >
              <SearchX className={`w-16 h-16 ${
                isDark ? 'text-gray-600' : 'text-gray-400'
              }`} />
            </motion.div>
          </motion.div>

      
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-base md:text-lg xl:text-xl font-semibold mb-2"
          >
            Aucun produit trouvé
          </motion.h3>

         
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={`text-sm md:text-base ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            Essayez de modifier vos critères de recherche
          </motion.p>
        </motion.div>
      ) }
    </motion.div>
  );
}