import { textBlue, catalogues, bgBlue } from "../Constantes"
import { Search, ShoppingCart, ChevronDown } from "lucide-react";
import CatalogueCarte from '../composants/CatalogueCarte';
import { useEffect, useState } from "react";
import Pagination from "../composants/Pagination";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../Context/Theme";

export default function Catalogues() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(2);
  const [sortOrder, setSortOrder] = useState("A-Z");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const { isDark } = useTheme();

  useEffect(() => {
    const handleResize = () => {
      if(window.innerWidth >= 1280) {
        setItemsPerPage(4);
      } else if(window.innerWidth >= 768) {
        setItemsPerPage(3);
      } else {
        setItemsPerPage(2);
      }
      setCurrentPage(1);
    }
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("reset", handleResize);
  }, []);

  const cataloguesFiltre = catalogues.filter(
    (cat) => cat.titre.toLowerCase().includes(search.toLowerCase()) || cat.description.toLowerCase().includes(search.toLowerCase())
  );

  // Tri
  cataloguesFiltre.sort((a, b) => {
    if(sortOrder === "A-Z") {
      return a.titre.localeCompare(b.titre);
    } else {
      return b.titre.localeCompare(a.titre);
    }
  })

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCatalogues = cataloguesFiltre.slice(startIndex, endIndex);


  return (
    <main className={`w-full flex-col px-8`}>
      {/* En tête  */}
      <section id='header-main' className={`flex-col`}>
        <div className={`flex justify-center items-center ${isDark ? 'text-white' : textBlue} gap-4 my-6`}>
          <ShoppingCart className={`w-8 h-8 md:w-10 md:h-10 xl:w-12 xl:h-12 text-gray-400`} />
          <h1 className='text-3xl md:text-4xl xl:text-5xl'>Nos catalogues</h1>
        </div>
        <div id='Search-main' className='flex justify-center items-center mx-12 md:mx-32 xl:mx-52 my-6'>
          <input 
            type="text" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un catalogue" 
            className='placeholder:text-xs peer border border-[#34495E] border-r-0 focus:outline-none w-full bg-white focus:border-[#F07D00] p-2 text-gray-900 h-6 md:h-10 xl:h-14'/>
          <button className={`flex justify-center items-center border border-[#34495E] border-l-0 peer-focus:border-[#F07D00] bg-green-600 w-10 h-6 md:w-14 md:h-10 xl:w-18 xl:h-14`}>
            <Search className='w-4 h-4 md:w-8 md:h-8 xl:w-10 xl:h-10 text-white'/>
          </button>
        </div>
      </section>
      {/* Corps */}
      <section id='body-main' className='flex-col'>
        <div id='titre' className={`flex justify-start items-center font-bold ${isDark ? 'text-white' : textBlue} my-6`}>
          <h4 className='border-b-3 border-b-[#F07D00]'>Trie par</h4>
        </div>
        <div id='filtre' className='relative flex justify-start items-center gap-1 md:gap-2 lg:gap-12 xl:gap-16 2xl:gap-20 my-6'>
          <button
            onClick={() => setShowSortMenu(!showSortMenu)} 
            className={`flex justify-center items-center gap-2 px-4 py-1 text-[#F07D00] ${isDark ? 'bg-gray-800' : 'bg-gray-50'} shadow-sm rounded-2xl`}
          >
            <span className='text-xs md:text-sm xl:text-base'>{sortOrder}</span>
            <ChevronDown className='w-4 h-4 md:w-6 md:h-6 xl:w-8 xl:h-8'/>
          </button>
          {showSortMenu && (
            <div className={`absolute top-full mt-2 ${isDark ? 'bg-gray-50' : bgBlue} shadow-md rounded-lg z-20`}>
              <button
                onClick={() => { setSortOrder("A-Z"); setShowSortMenu(false); }}
                className="block px-4 py-2 hover:bg-gray-50 w-full text-left"
              >
                A-Z
              </button>
              <button 
                onClick={() => { setSortOrder("Z-A"); setShowSortMenu(false); }} 
                className='block px-4 py-2 hover:bg-gray-100 w-full text-left'
              >
                Z - A
              </button>
            </div>
          )}
        </div>
        <div id='Articles' className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8 xl:gap-12 my-6'>
          <AnimatePresence>
            {cataloguesFiltre.length === 0 ? (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-[#34495E] col-span-full"
              >
                Aucun catalogue ne correspond à votre recherche.
              </motion.p>
            ) : 
            paginatedCatalogues.map((cat, i) => 
            
              (
              <motion.div
                key={i} 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
              >
                <CatalogueCarte 
                  item={{
                    id: cat.id,
                    icone: cat.icone,
                    titre: cat.titre, 
                    description: cat.description, 
                    image: cat.image
                  }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        {cataloguesFiltre.length > itemsPerPage && (
              <Pagination 
                totalItems={cataloguesFiltre.length} 
                itemsPerPage={itemsPerPage} 
                currentPage={currentPage} 
                onPageChange={setCurrentPage} 
              />
        )}
      </section>

    </main>
  )
}
