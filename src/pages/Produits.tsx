import { useLocation } from "react-router-dom";
import { produits, pieces, bgOrange } from "../Constantes"
import { textOrange, bgBlue } from "../Constantes";
import { useTheme } from "../Context/Theme";
import { Search, ChevronDown, ChevronUp, SearchX, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import type { panierProps, piecesProps, produitsProps } from "../Constantes";
import { motion, AnimatePresence} from "framer-motion";
import imageCompression from "browser-image-compression";



async function convertToWebp(file: File): Promise<string> {
  const options = {
    fileType: "image/webp",
    maxWidthOrHeight: 800,
    initialQuality: 0.8,
  };

  const compressedFile = await imageCompression(file, options);
  return URL.createObjectURL(compressedFile);
}

export async function urlToWebp(url: string): Promise<string> {
  const response = await fetch(url);
  const blob = await response.blob();

  // Transformer Blob → File
  const file = new File([blob], "image.jpg", { type: blob.type, lastModified: Date.now() });

  return await convertToWebp(file);
}




export  function Produits() {

  function trierProduits(produits: produitsProps[], type: string, pieces: piecesProps[]): produitsProps[] {
    switch (type) {
      case "Prix >":
        return [...produits].sort((a, b) => {
          const pa = pieces.find(p => p.id_produit === a.id)?.prix ?? 0;
          const pb = pieces.find(p => p.id_produit === b.id)?.prix ?? 0;
          return pb - pa; 
        });
      case "Prix <":
        return [...produits].sort((a, b) => {
          const pa = pieces.find(p => p.id_produit === a.id)?.prix ?? 0;
          const pb = pieces.find(p => p.id_produit === b.id)?.prix ?? 0;
          return pa - pb; 
        });
      case "A-Z":
        return [...produits].sort((a, b) => a.nom.localeCompare(b.nom));
      case "Z-A":
        return [...produits].sort((a, b) => b.nom.localeCompare(a.nom));
      default:
        return produits;
    }
  }

  const location = useLocation(); 
  const { isDark ,setPanier,panier} = useTheme();
  const { id } = location.state || {};
  const { nom } = location.state || {};
  const [select, setSelect] = useState<boolean>(false);
  const [trie, setTrie] = useState<string>('Prix <');
  const [pieceEnCours, setPieceEnCours] = useState<{[key:number]: piecesProps | null}>({});
  const [selectPiece, setSelectPiece] = useState<number | null>(null);
  const [rechercher, setRechercher] = useState('');
  const [ajouter, setAjouter]= useState<boolean>(false)

  const triage = [
    { id: 1, type: 'Prix >' },
    { id: 1, type: 'Prix <' },
    { id: 2, type: 'A-Z' },
    { id: 3, type: 'Z-A' }
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



const ajouterAuPanier = (produit: produitsProps, piece: piecesProps) => {
  // si le panier est vide, on commence à 1
  const newId = panier.length > 0 ? panier[panier.length - 1].id + 1 : 1;

  const nouvelItem: panierProps = {
    id: newId,
    produit,
    piece
  };

  setPanier([...panier, nouvelItem]);
  setAjouter(true)
};

function ProduitItem({produit,piece,pieceCours,dejaDansPanier}:{produit: produitsProps, piece: piecesProps[], pieceCours: piecesProps, dejaDansPanier: boolean}){
  const [webpImage, setWebpImage] = useState<string | null>(null);
  
  useEffect(() => { 
    let mounted = true; 
    (async () => { 
      const img = await urlToWebp(produit.image); 
      if (mounted) setWebpImage(img); })(); 
      return () => { mounted = false }; }, [produit.image]);
  return (
    <motion.div 
    
      whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
      className={`group grid grid-cols-1 rounded-lg shadow-xl ${
        isDark 
          ? 'bg-gray-800 bg-opacity-50 backdrop-blur-sm shadow-xl hover:shadow-2xl border-gray-700 hover:border-gray-600' 
          : 'bg-white shadow-lg hover:shadow-2xl'
      }`}
    >
      <div className="overflow-hidden h-56 rounded-t-lg">
        <motion.img 
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.5 }}
          src={webpImage ?? produit.image} 
          loading="lazy"
          alt={produit.nom} 
          className="w-full h-full object-cover bg-center -z-10"
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
              {pieceCours?.prix} <span className="text-sm">FCFA</span>
            </motion.p>
          </div>
          
          <div className="flex flex-col gap-3">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectPiece(selectPiece === produit.id ? null : produit.id)} 
              className={`flex items-center gap-1 font-medium rounded-lg px-4 py-2 text-sm transition-all duration-200 ${
                isDark 
                  ? 'bg-gray-700 hover:bg-gray-600 border border-gray-600' 
                  : 'bg-gray-100 hover:bg-gray-200 border border-gray-300'
              }`}
            >
              {pieceCours?.nombre_de_pieces} {produit.id_type=== 2 ? 'ml':'pcs'}
              {selectPiece === produit.id ? <ChevronUp className="w-4 h-4"/> : <ChevronDown className="w-4 h-4"/>}
            </motion.button>
            
            <AnimatePresence>
              {selectPiece === produit.id && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className={`absolute group-hover:scale-102 transition-transform duration-300 z-100 mt-12 overflow-hidden shadow-2xl rounded-lg grid grid-cols-1 gap-2 ${
                    !isDark ? 'bg-white' : 'bg-gray-800 backdrop-blur-md'
                  }`}
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
                        className={`px-6 py-2 w-full hover:text-white transition-colors duration-150 ${
                          !isDark ? 'text-gray-800' : 'text-white'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span>{p.nombre_de_pieces}</span>
                        </div>
                      </motion.button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        <button
          onClick={() => {
            if (!dejaDansPanier) {
              ajouterAuPanier(produit, pieceCours);
            }
          }}
          disabled={dejaDansPanier}
          className={`mt-3 py-2 rounded-xl font-semibold text-white shadow-md transition-all duration-200
            ${dejaDansPanier 
              ? "bg-[#5AA136] cursor-not-allowed" 
              : `${bgOrange} hover:shadow-lg transform hover:-translate-y-0.5`}
          `}
        >
          Ajouter au panier
        </button>
      </div>
    </motion.div>
  );
}


  

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={` flex flex-col gap-4 text-xs md:text-sm xl:text-base mx-[5%] ${isDark ? 'text-white' : ''}`}
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
        className={`sm:flex sm:justify-between shadow-2xl  ${isDark? `border border-gray-700 ` :`${bgBlue}`} p-5 items-center rounded-md max-w-6xl mx-auto w-full`}
      >
        <div className="flex  justify-center items-center mb-2 sm:w-[70%] bg-white rounded-lg focus-within:border-[#F07D00] border border-transparent overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
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
              className={`flex items-center gap-1 border font-medium rounded-lg px-4 py-2 text-xs sm:text-sm transition-all duration-200 border-gray-300`}
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
                className={`absolute z-40 right-[12%] mt-12 rounded-lg grid grid-cols-1 gap-2 text-center ${
                  !isDark ? 'bg-white text-black' : `bg-gray-800`
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
       {produitsAffiches.map((produit) => {
        const piece = pieces.filter((p) => p.id_produit === produit.id);
        const pieceCours = pieceEnCours[produit.id] ?? piece[0];
        const dejaDansPanier = panier.some(
          (item) => item.produit.id === produit.id && item.piece.id === pieceCours.id
        );

        return (
          <ProduitItem
            key={produit.id}
            produit={produit}
            piece={piece}
            pieceCours={pieceCours}
            dejaDansPanier={dejaDansPanier}
          />
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
      {ajouter &&
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" >
          <div className={`flex flex-col justify-center items-center w-auto h-auto rounded-xl p-10 ${!isDark? 'bg-white' : 'bg-gray-800'} shadow-md`}>
             <div className="flex items-center gap-3 text-[#5AA136]">
            <CheckCircle className="w-6 h-6" />
            <p className="font-medium">Produit ajouté au panier !</p>
          </div>
       
      
         <div className={`px-6 py-4 w-full flex justify-center items-center`}>
          <button
            onClick={()=> setAjouter(false)}
            className={`flex justify-center items-center py-1 rounded-lg w-[40%] transition-colors bg-[#5AA136] hover:bg-[#4b852e] text-white`}
          >
             Merci
          </button>
        </div>
          </div>
         
      </div> }
    </motion.div>
  );
}