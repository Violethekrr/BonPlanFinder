import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { categories, produits, pieces } from "../Constantes";
import { useTheme } from "../Context/Theme";
import { 
  FiSearch, FiUsers, FiCheckCircle, FiMapPin, FiShoppingBag, 
  FiChevronRight, FiMessageCircle, FiFacebook, FiTwitter, FiLink, 
  FiX, FiPlay, FiPause, FiSkipBack, FiHelpCircle,
  FiArrowRight, FiHome, FiTag, FiShare2, FiDollarSign
} from 'react-icons/fi';
import { motion, AnimatePresence, type Variants } from "framer-motion";

export default function Accueil() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<Array<{
    type: 'produit' | 'categorie';
    id: number;
    nom: string;
    categoryName?: string;
  }>>([]);

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  // Étapes du tutoriel
  const tutorialSteps = [
    {
      title: "Bienvenue sur BonPlanFinder! 🎯",
      description: "Découvrez comment trouver les meilleures offres et économiser de l'argent facilement.",
      icon: <FiHome className="w-8 h-8" />,
      action: "Cliquez sur les étapes pour suivre le guide"
    },
    {
      title: "1. Recherchez vos produits 🔍",
      description: "Utilisez la barre de recherche pour trouver n'importe quel produit. Tapez le nom, la marque ou la catégorie qui vous intéresse.",
      icon: <FiSearch className="w-8 h-8" />,
      action: "Essayez de taper 'boisson' dans la recherche"
    },
    {
      title: "2. Explorez par catégories 🏷️",
      description: "Parcourez nos catégories principales pour découvrir les meilleures offres dans chaque secteur.",
      icon: <FiTag className="w-8 h-8" />,
      action: "Cliquez sur une catégorie pour voir ses produits"
    },
    {
      title: "3. Découvrez les bonnes affaires 💰",
      description: "La section 'Bonnes Affaires du Moment' vous montre les produits les moins chers toutes catégories confondues.",
      icon: <FiDollarSign className="w-8 h-8" />,
      action: "Soyez le premier à profiter de ces offres"
    },
    {
      title: "4. Partagez et gagnez ensemble 🤝",
      description: "Invitez vos amis et partagez les bonnes affaires que vous trouvez. Plus on est nombreux, plus on économise!",
      icon: <FiShare2 className="w-8 h-8" />,
      action: "Cliquez sur 'Inviter d'autres personnes'"
    },
    {
      title: "5. Profitez des économies! 🎉",
      description: "Vous êtes maintenant prêt à faire des économies substantielles sur tous vos achats. Bon shopping!",
      icon: <FiShoppingBag className="w-8 h-8" />,
      action: "Commencez vos économies dès maintenant!"
    }
  ];

  // Fonction pour obtenir les 6 produits les moins chers
  const getCheapestProducts = useMemo(() => {
    const productsWithPrices = produits.map(product => {
      const productPieces = pieces.filter(p => p.id_produit === product.id);
      const minPrice = productPieces.length > 0 
        ? Math.min(...productPieces.map(p => p.prix))
        : 0;
      
      const productCategory = categories.find(c => c.id === product.id_type);
      
      return {
        ...product,
        minPrice,
        categoryName: productCategory?.nom || 'Non catégorisé',
        pieces: productPieces
      };
    });
    
    // Filtrer les produits avec un prix valide (supérieur à 0)
    const validProducts = productsWithPrices.filter(product => product.minPrice > 0);
    
    // Trier par prix croissant et prendre les 6 premiers
    const sortedProducts = [...validProducts].sort((a, b) => a.minPrice - b.minPrice);
    return sortedProducts.slice(0, 6);
  }, []);

  // Fonction de recherche intelligente
  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    const query = searchQuery.toLowerCase().trim();
    
    // Rechercher d'abord dans les catégories
    const matchedCategory = categories.find(category => 
      category.nom.toLowerCase().includes(query)
    );

    if (matchedCategory) {
      // Si on trouve une catégorie, naviguer vers la page des produits de cette catégorie
      navigate('/produits', { 
        state: { 
          id: matchedCategory.id || 1, 
          nom: matchedCategory.nom 
        } 
      });
      return;
    }

    // Si pas de catégorie, rechercher dans les produits
    const matchedProducts = produits.filter(product => 
      product.nom.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    );

    if (matchedProducts.length > 0) {
      // Si on trouve des produits, prendre la catégorie du premier produit
      const firstProduct = matchedProducts[0];
      const productCategory = categories.find(c => c.id === firstProduct.id_type);
      
      // Naviguer vers la page des produits avec la catégorie du produit trouvé
      navigate('/produits', { 
        state: { 
          id: firstProduct.id_type,
          nom: productCategory?.nom || 'Résultats de recherche'
        } 
      });
    } else {
      // Si aucune correspondance, afficher un message
      alert(`Aucun résultat trouvé pour "${searchQuery}". Essayez avec d'autres mots-clés.`);
    }
  };

  // Fonction pour gérer le changement de recherche et générer les suggestions
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    
    if (!value.trim()) {
      setSearchSuggestions([]);
      return;
    }

    const query = value.toLowerCase().trim();
    const suggestions = [];


    const categoryMatches = categories
      .filter(category => category.nom.toLowerCase().includes(query))
      .slice(0, 3) // Limiter à 3 catégories
      .map(category => ({
        type: 'categorie' as const,
        id: category.id || 1,
        nom: category.nom
      }));

    // Rechercher dans les produits
    const productMatches = produits
      .filter(product => 
        product.nom.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      )
      .slice(0, 3) // Limiter à 3 produits
      .map(product => {
        const productCategory = categories.find(c => c.id === product.id_type);
        return {
          type: 'produit' as const,
          id: product.id,
          nom: product.nom,
          categoryName: productCategory?.nom
        };
      });

    // Combiner les résultats (catégories d'abord, puis produits)
    suggestions.push(...categoryMatches, ...productMatches);
    
    // Limiter le total à 5 suggestions
    setSearchSuggestions(suggestions.slice(0, 5));
  }, []);

  // Fonction pour gérer le clic sur une suggestion
  const handleSuggestionClick = (suggestion: {
    type: 'produit' | 'categorie';
    id: number;
    nom: string;
    categoryName?: string;
  }) => {
    if (suggestion.type === 'categorie') {
      // Navigation vers la catégorie
      navigate('/produits', { 
        state: { 
          id: suggestion.id, 
          nom: suggestion.nom 
        } 
      });
    } else {
      // Navigation vers le produit (via sa catégorie)
      const product = produits.find(p => p.id === suggestion.id);
      if (product) {
        navigate('/produits', { 
          state: { 
            id: product.id_type,
            nom: suggestion.categoryName || 'Produit'
          } 
        });
      }
    }
    setSearchQuery('');
    setSearchSuggestions([]);
  };

  // Fonction pour partager le lien
  const shareLink = (platform: string) => {
    const url = window.location.href;
    const message = "Découvrez BonPlanFinder, le site pour trouver les meilleures offres près de chez vous !";
    
    switch(platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(message + " " + url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(message)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message + " " + url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        alert("Lien copié dans le presse-papier !");
        break;
    }
    setShowShareModal(false);
  };

  // Fonctions de navigation
  const goToCatalogues = () => navigate('/catalogues');
  const goToProducts = (categorieId: number, categorieNom: string) => {
    navigate('/produits', { state: { id: categorieId, nom: categorieNom } });
  };

  // Fonctions du tutoriel
  const startTutorial = () => {
    setShowTutorial(true);
    setCurrentStep(0);
  };

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      finishTutorial();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const finishTutorial = () => {
    setShowTutorial(false);
    setCurrentStep(0);
    setIsAutoPlaying(false);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  // Auto-play du tutoriel
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    
    if (isAutoPlaying && showTutorial) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < tutorialSteps.length - 1) {
            return prev + 1;
          } else {
            setIsAutoPlaying(false);
            return prev;
          }
        });
      }, 3000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoPlaying, showTutorial, tutorialSteps.length]);

  return (
    <div className={`pt-16 pb-10 space-y-10 min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      
      {/* Tutoriel Overlay */}
      <AnimatePresence>
        {showTutorial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
          >
            {/* Overlay sombre */}
            <div className="absolute inset-0 bg-black/70" onClick={finishTutorial} />
            
            {/* Guide interactif */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={`relative max-w-2xl w-full rounded-2xl shadow-2xl overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}
                onClick={(e) => e.stopPropagation()}
              >
                {/* En-tête du tutoriel */}
                <div className={`p-6 ${isDark ? 'bg-gray-900' : 'bg-linear-to-r from-[#F47D1C] to-[#F9A826]'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-white/20'}`}>
                        {tutorialSteps[currentStep].icon}
                      </div>
                      <div>
                        <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-white'}`}>
                          Guide d'utilisation
                        </h3>
                        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-white/90'}`}>
                          Étape {currentStep + 1} sur {tutorialSteps.length}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={finishTutorial}
                      className={`p-2 rounded-full ${isDark ? 'hover:bg-gray-700' : 'hover:bg-white/20'}`}
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Barre de progression */}
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
                      transition={{ duration: 0.3 }}
                      className="h-full bg-white"
                    />
                  </div>
                </div>

                {/* Contenu du tutoriel */}
                <div className="p-6">
                  <div className="text-center mb-6">
                    <h4 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {tutorialSteps[currentStep].title}
                    </h4>
                    <p className={`text-lg mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {tutorialSteps[currentStep].description}
                    </p>
                    
                    {/* Indicateur d'action */}
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <FiArrowRight className="w-5 h-5 animate-pulse" />
                      <span className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                        {tutorialSteps[currentStep].action}
                      </span>
                    </div>
                  </div>

                  {/* Indicateur visuel (style jeu vidéo) */}
                  <div className="flex justify-center mb-8">
                    <div className="relative">
                      <div className={`w-20 h-20 rounded-full flex items-center justify-center border-4 ${
                        isDark ? 'border-[#F47D1C]' : 'border-[#F47D1C]'
                      }`}>
                        <div className={`text-2xl font-bold ${isDark ? 'text-[#F47D1C]' : 'text-[#F47D1C]'}`}>
                          {currentStep + 1}
                        </div>
                      </div>
                      <div className="absolute -top-2 -right-2">
                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                          isDark ? 'bg-[#5AA136] text-white' : 'bg-[#5AA136] text-white'
                        }`}>
                          NEW!
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contrôles */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={toggleAutoPlay}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                      >
                        {isAutoPlaying ? (
                          <>
                            <FiPause className="w-4 h-4" />
                            <span>Pause</span>
                          </>
                        ) : (
                          <>
                            <FiPlay className="w-4 h-4" />
                            <span>Lecture auto</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={prevStep}
                        disabled={currentStep === 0}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${currentStep === 0 ? 'opacity-50 cursor-not-allowed' : ''} ${
                          isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        <FiSkipBack className="w-4 h-4" />
                        <span>Précédent</span>
                      </button>

                      {currentStep < tutorialSteps.length - 1 ? (
                        <button
                          onClick={nextStep}
                          className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium ${
                            isDark ? 'bg-[#F47D1C] hover:bg-[#e56d0c]' : 'bg-[#F47D1C] hover:bg-[#e56d0c]'
                          } text-white`}
                        >
                          <span>Suivant</span>
                          <FiArrowRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={finishTutorial}
                          className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium ${
                            isDark ? 'bg-[#5AA136] hover:bg-[#4a8a2d]' : 'bg-[#5AA136] hover:bg-[#4a8a2d]'
                          } text-white`}
                        >
                          <span>Commencer à économiser!</span>
                          <FiShoppingBag className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Points de progression */}
                <div className={`p-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex justify-center gap-2">
                    {tutorialSteps.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentStep(index)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          index === currentStep
                            ? isDark ? 'bg-[#F47D1C]' : 'bg-[#F47D1C]'
                            : isDark ? 'bg-gray-600' : 'bg-gray-300'
                        } ${index <= currentStep ? 'scale-110' : 'scale-100'}`}
                        aria-label={`Aller à l'étape ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`py-8 md:py-12 px-4 ${isDark ? 'bg-gray-800' : 'bg-[#F47D1C]'}`}
      >
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-4 md:gap-6">
          <motion.p 
            variants={itemVariants}
            className="text-sm sm:text-base md:text-lg lg:text-xl text-center max-w-4xl text-[#FFF1F1]"
          >
            BonPlanFinder le site aux produits à prix imbattables,
            trouvez votre bonheur parmi nos meilleures offres.
          </motion.p>

          {/* Barre de recherche avec suggestions */}
          <motion.div 
            variants={itemVariants}
            className="relative w-full max-w-2xl"
          >
            <div className="flex w-full overflow-hidden rounded-lg shadow-lg">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Rechercher un produit ou une catégorie..."
                className={`flex-1 py-3 px-4 outline-none text-sm md:text-base ${isDark ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-white text-gray-900'}`}
              />
              <button 
                onClick={handleSearch}
                className={`px-4 md:px-6 font-semibold transition-all duration-300 active:scale-95 flex items-center justify-center ${isDark ? 'bg-[#4a8a2d] hover:bg-[#3a7a1d]' : 'bg-[#5AA136] hover:bg-[#4a8a2d]'} text-white`}
              >
                <FiSearch size={18} className="md:w-5 md:h-5" />
              </button>
            </div>

            {/* Suggestions de recherche */}
            <AnimatePresence>
              {searchSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`absolute top-full mt-1 w-full rounded-lg shadow-xl z-50 overflow-hidden ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}
                >
                  {searchSuggestions.map((suggestion, index) => (
                    <motion.button
                      key={`${suggestion.type}-${suggestion.id}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={`w-full text-left px-4 py-3 hover:bg-opacity-80 transition-colors duration-200 flex items-center gap-3 ${isDark ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-100 text-gray-800'}`}
                    >
                      {suggestion.type === 'categorie' ? (
                        <>
                          <FiTag className={`w-4 h-4 ${isDark ? 'text-[#F47D1C]' : 'text-[#F47D1C]'}`} />
                          <div>
                            <div className="font-medium">{suggestion.nom}</div>
                            <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                              Catégorie
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <FiShoppingBag className={`w-4 h-4 ${isDark ? 'text-[#5AA136]' : 'text-[#5AA136]'}`} />
                          <div>
                            <div className="font-medium">{suggestion.nom}</div>
                            <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                              {suggestion.categoryName || 'Produit'}
                            </div>
                          </div>
                        </>
                      )}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Indicateur de recherche */}
          <motion.div 
            variants={itemVariants}
            className={`text-xs md:text-sm mt-2 ${isDark ? 'text-gray-300' : 'text-[#FFF1F1]'}`}
          >
            <p className="text-center">
              Recherchez un produit spécifique ou explorez par catégorie
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap justify-center gap-2 md:gap-3"
          >
            {categories.map((c, index) => (
              <motion.span
                key={c.id}
                variants={itemVariants}
                onMouseEnter={() => setHoveredCategory(index)}
                onMouseLeave={() => setHoveredCategory(null)}
                onClick={() => goToProducts(c.id || 1, c.nom)}
                className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm cursor-pointer transition-all duration-300 hover:scale-105 ${
                  isDark 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-[#F9F4F4] hover:bg-[#f0e8e8] text-gray-800'
                } ${hoveredCategory === index ? 'ring-2 ring-[#F47D1C]' : ''}`}
              >
                {c.nom}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Main Content Section */}
      <section className="px-4 md:px-6 lg:px-8 py-8 md:py-14 space-y-8 md:space-y-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="pr-0 lg:pr-12"
          >
            <div className="grid gap-4 md:gap-6">
              <motion.div 
                whileHover={{ y: -5 }}
                className={`rounded-xl overflow-hidden ${isDark ? 'bg-gray-800 shadow-lg' : 'bg-white shadow-md shadow-gray'} hover:shadow-xl transition-all duration-500 group`}
              >
                <div className="h-56 sm:h-64 md:h-72 overflow-hidden">
                  <img
                    src="/fashion-shoes-sneakers.jpg"
                    alt="Produit"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>

                <div className="p-4 md:p-5 flex flex-col gap-3 md:gap-4">
                  <p className="text-[#F47D1C] text-xs md:text-sm font-medium">Boissons</p>

                  <h3 className={`font-semibold text-base md:text-lg group-hover:text-[#F47D1C] transition-colors duration-300 ${isDark ? 'text-white' : ''}`}>
                    Bouteille de Oranana
                  </h3>

                  <div className="flex items-center gap-3 md:gap-6 flex-wrap">
                    <p className="text-[#7EBA41] font-bold text-base md:text-lg">
                      500 fcfa
                    </p>
                    <p className={`font-semibold text-sm line-through ${isDark ? 'text-gray-400' : 'text-[#979090]'}`}>
                      -300 fcfa
                    </p>
                    <div className="bg-[#ECC988] px-2 md:px-3 py-1 rounded">
                      <p className="text-[#B87207] font-bold text-xs md:text-sm">
                        Économisez 600 fcfa
                      </p>
                    </div>
                  </div>

                  <p className={`text-xs md:text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Disponible chez ElectroMax, Rue du Commerce.
                    Signalé par Pierre L.
                  </p>

                  <p className={`text-xs md:text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} flex items-center gap-1`}>
                    <FiMapPin className="w-4 h-4" />
                    Pointe-noire
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Mission Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="pl-0 lg:pl-12 mt-8 md:mt-14 lg:mt-0"
          >
            <h1 className={`text-2xl md:text-3xl font-bold mb-3 md:mb-4 ${isDark ? 'text-white' : ''}`}>
              Notre Mission : Vous Faire Économiser
            </h1>

            <hr className="w-24 md:w-32 mb-4 md:mb-6 border-[#F47D1C] border-2 md:border-4" />

            <p className={`max-w-4xl text-base md:text-lg mb-6 md:mb-10 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Vous avez repéré un produit trop cher dans une boutique ?
              Notre communauté vous aide à trouver le même article à un
              prix bien inférieur ailleurs. BonPlanFinder est la plateforme
              collaborative qui connecte les acheteurs avisés pour partager
              les bonnes affaires et éviter les surpayages.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 md:gap-x-12 gap-y-6 md:gap-y-8">
              <div className="space-y-4 md:space-y-6">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="flex items-start gap-3 group"
                >
                  <div className={`p-2 rounded-lg group-hover:bg-[#F47D1C] transition-all duration-300 ${isDark ? 'bg-gray-700' : 'bg-[#FEF3E2]'}`}>
                    <FiUsers className="w-6 h-6 md:w-8 md:h-8 text-[#F47D1C] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div>
                    <h2 className={`font-semibold text-base md:text-lg group-hover:text-[#F47D1C] transition-colors duration-300 ${isDark ? 'text-white' : ''}`}>
                      Communauté active
                    </h2>
                    <p className={`text-sm md:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Des milliers d'utilisateurs partagent leurs trouvailles chaque jour.
                    </p>
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="flex items-start gap-3 group"
                >
                  <div className={`p-2 rounded-lg group-hover:bg-[#5AA136] transition-all duration-300 ${isDark ? 'bg-gray-700' : 'bg-[#ECF7E1]'}`}>
                    <FiCheckCircle className="w-6 h-6 md:w-8 md:h-8 text-[#5AA136] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div>
                    <h2 className={`font-semibold text-base md:text-lg group-hover:text-[#5AA136] transition-colors duration-300 ${isDark ? 'text-white' : ''}`}>
                      Fiabilité
                    </h2>
                    <p className={`text-sm md:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Les bons plans sont vérifiés par la communauté.
                    </p>
                  </div>
                </motion.div>
              </div>

              <div className="space-y-4 md:space-y-6">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="flex items-start gap-3 group"
                >
                  <div className={`p-2 rounded-lg group-hover:bg-[#F9A826] transition-all duration-300 ${isDark ? 'bg-gray-700' : 'bg-[#FFF8E1]'}`}>
                    <FiMapPin className="w-6 h-6 md:w-8 md:h-8 text-[#F9A826] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div>
                    <h2 className={`font-semibold text-base md:text-lg group-hover:text-[#F9A826] transition-colors duration-300 ${isDark ? 'text-white' : ''}`}>
                      Géolocalisation
                    </h2>
                    <p className={`text-sm md:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Trouvez les meilleures offres près de chez vous.
                    </p>
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="flex items-start gap-3 group"
                >
                  <div className={`p-2 rounded-lg group-hover:bg-[#7EBA41] transition-all duration-300 ${isDark ? 'bg-gray-700' : 'bg-[#E8F5E9]'}`}>
                    <FiShoppingBag className="w-6 h-6 md:w-8 md:h-8 text-[#7EBA41] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div>
                    <h2 className={`font-semibold text-base md:text-lg group-hover:text-[#7EBA41] transition-colors duration-300 ${isDark ? 'text-white' : ''}`}>
                      Économies réelles
                    </h2>
                    <p className={`text-sm md:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Moins de dépenses, plus de pouvoir d'achat.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="mt-8 md:mt-10 pl-0 md:pl-8">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startTutorial}
                className={`h-auto w-full sm:w-auto px-6 py-3 rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group ${
                  isDark ? 'bg-[#e56d0c] hover:bg-[#d55c00]' : 'bg-[#F47D1C] hover:bg-[#e56d0c]'
                } text-white`}
              >
                <FiHelpCircle className="w-5 h-5" />
                Comment ça marche
                <FiChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Best Deals Section - Produits les moins chers */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className={`px-4 md:px-6 lg:px-8 py-8 md:py-14 space-y-5 ${isDark ? 'bg-gray-800' : 'bg-[#EBE7E7]'}`}
      >
        <div className="flex justify-center">
          <div className="text-center">
            <h1 className={`font-bold text-xl md:text-2xl ${isDark ? 'text-white' : ''}`}>Bonnes Affaires du Moment</h1>
            <div className="flex justify-center pt-2">
              <hr className="w-20 md:w-24 border-2 border-[#F47D1C]" />
            </div>
            <p className={`mt-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Les produits les moins chers toutes catégories confondues
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pt-4 md:pt-6">
          {getCheapestProducts.map((product, index) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              onClick={() => goToProducts(product.id_type, product.categoryName)}
              className={`rounded-xl overflow-hidden hover:shadow-xl transition-all duration-500 group cursor-pointer ${
                isDark ? 'bg-gray-700 shadow-lg' : 'bg-white shadow-md shadow-gray'
              }`}
            >
              <div className="h-48 sm:h-56 md:h-64 lg:h-72 p-4 overflow-hidden relative">
                <img
                  src={product.image}
                  alt={product.nom}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-[#F47D1C] text-white text-xs font-bold px-3 py-1 rounded-full">
                  MEILLEUR PRIX
                </div>
              </div>
              
              <div className="p-4 md:p-5 flex flex-col gap-3 md:gap-4">
                <p className="text-[#F47D1C] text-xs md:text-sm font-medium">{product.categoryName}</p>
                <h3 className={`font-medium text-base md:text-lg group-hover:text-[#F47D1C] transition-colors duration-300 ${isDark ? 'text-white' : ''}`}>
                  {product.nom}
                </h3>
                <div className="flex items-center gap-3 md:gap-6 flex-wrap">
                  <p className="text-[#7EBA41] font-bold text-base md:text-lg">
                    {product.minPrice} fcfa
                  </p>
                  <p className={`font-semibold text-sm line-through ${isDark ? 'text-gray-400' : 'text-[#979090]'}`}>
                    -{Math.floor(product.minPrice * 0.3)} fcfa
                  </p>
                  <div className="bg-[#ECC988] px-2 md:px-3 py-1 rounded">
                    <p className="text-[#B87207] font-bold text-xs md:text-sm">
                      Économisez {Math.floor(product.minPrice * 0.6)} fcfa
                    </p>
                  </div>
                </div>
                <p className={`text-xs md:text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {product.description}
                </p>
                <p className={`text-xs md:text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} flex items-center gap-1`}>
                  <FiMapPin className="w-4 h-4" />
                  Disponible dans votre région
                </p>
                
                <div className="flex items-center gap-2 mt-2">
                  <div className={`text-xs px-2 py-1 rounded ${isDark ? 'bg-gray-600' : 'bg-gray-100'}`}>
                    {product.pieces.length} options
                  </div>
                  {product.pieces.length > 0 && (
                    <div className={`text-xs px-2 py-1 rounded ${isDark ? 'bg-gray-600' : 'bg-gray-100'}`}>
                      À partir de {Math.min(...product.pieces.map(p => p.nombre_de_pieces))} pcs
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="flex justify-center pt-4 md:pt-6">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToCatalogues}
            className={`px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl ${
              isDark ? 'bg-[#4a8a2d] hover:bg-[#3a7a1d]' : 'bg-[#5AA136] hover:bg-[#4a8a2d]'
            } text-white`}
          >
            Voir toutes les bonnes affaires
          </motion.button>
        </div>
      </motion.section>

      {/* Community Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="px-4 md:px-6 lg:px-8 grid grid-cols-1 gap-4 md:gap-6"
      >
        <div className="flex justify-center">
          <div className="text-center">
            <h1 className={`font-bold text-xl md:text-2xl ${isDark ? 'text-white' : ''}`}>
              Rejoignez Notre Communauté <br className="hidden sm:block" /> d'Acheteurs Avisés
            </h1>
            <div className="flex justify-center pt-2">
              <hr className="w-20 md:w-24 border-2 border-[#F47D1C]" />
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <p className={`text-base md:text-xl leading-relaxed ${isDark ? 'text-gray-300' : 'text-[#063A5F]'}`}>
            Partagez vos bonnes affaires, aidez les autres à économiser <br className="hidden md:block" />
            et bénéficiez en retour des trouvailles de notre communauté.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 md:gap-8 justify-center items-center">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToCatalogues}
            className={`rounded-xl px-6 py-3 md:px-8 md:py-4 font-bold transition-all duration-300 shadow-lg hover:shadow-xl w-full sm:w-auto ${
              isDark ? 'bg-[#e56d0c] hover:bg-[#d55c00]' : 'bg-[#F47D1C] hover:bg-[#e56d0c]'
            } text-white`}
          >
            Voir les catalogues
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowShareModal(true)}
            className={`rounded-xl font-bold text-white px-6 py-3 md:px-8 md:py-4 transition-all duration-300 shadow-lg hover:shadow-xl w-full sm:w-auto ${
              isDark ? 'bg-[#4a8a2d] hover:bg-[#3a7a1d]' : 'bg-[#5AA136] hover:bg-[#4a8a2d]'
            }`}
          >
            Inviter d'autres personnes
          </motion.button>
        </div>
      </motion.section>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`rounded-xl p-6 max-w-md w-full ${isDark ? 'bg-gray-800' : 'bg-white'}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Partager le site
                </h3>
                <button 
                  onClick={() => setShowShareModal(false)}
                  className={`p-2 rounded-full ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              
              <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Partagez BonPlanFinder avec vos amis et famille pour les aider à économiser !
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => shareLink('whatsapp')}
                  className="flex flex-col items-center justify-center p-4 rounded-lg bg-green-100 hover:bg-green-200 transition-colors"
                >
                  <FiMessageCircle className="w-8 h-8 text-green-600 mb-2" />
                  <span className="text-sm font-medium">WhatsApp</span>
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => shareLink('facebook')}
                  className="flex flex-col items-center justify-center p-4 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors"
                >
                  <FiFacebook className="w-8 h-8 text-blue-600 mb-2" />
                  <span className="text-sm font-medium">Facebook</span>
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => shareLink('twitter')}
                  className="flex flex-col items-center justify-center p-4 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors"
                >
                  <FiTwitter className="w-8 h-8 text-blue-400 mb-2" />
                  <span className="text-sm font-medium">Twitter</span>
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => shareLink('copy')}
                  className="flex flex-col items-center justify-center p-4 rounded-lg bg-purple-100 hover:bg-purple-200 transition-colors"
                >
                  <FiLink className="w-8 h-8 text-purple-600 mb-2" />
                  <span className="text-sm font-medium">Copier</span>
                </motion.button>
              </div>
              
              <div className="mt-6 flex gap-2">
                <input 
                  type="text" 
                  readOnly 
                  value={window.location.href}
                  className={`flex-1 px-3 py-2 rounded border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300'}`}
                />
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => shareLink('copy')}
                  className={`px-4 py-2 rounded font-medium ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  Copier
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}