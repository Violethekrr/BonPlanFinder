import { useTheme } from "../Context/Theme";
import { textOrange, bgOrange, bgBlue, type panierProps } from "../Constantes";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ShoppingCart, Plus, Minus, ShoppingBag, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { urlToWebp } from "./Produits";


export default function Panier() {
  const { isDark, panier, setPanier } = useTheme();
  const [quantites, setQuantites] = useState<{ [key: number]: number }>({});

  // Fonction pour obtenir la quantité d'un item
  const getQuantite = (id: number) => quantites[id] || 1;

  // Fonction pour augmenter la quantité
  const augmenterQuantite = (id: number) => {
    setQuantites(prev => ({
      ...prev,
      [id]: (prev[id] || 1) + 1
    }));
  };

  // Fonction pour diminuer la quantité
  const diminuerQuantite = (id: number) => {
    setQuantites(prev => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) - 1)
    }));
  };

  // Fonction pour supprimer un item du panier
  const supprimerItem = (id: number) => {
    setPanier(panier.filter(item => item.id !== id));
    setQuantites(prev => {
      const newQuantites = { ...prev };
      delete newQuantites[id];
      return newQuantites;
    });
  };

  // Fonction pour vider le panier
  const viderPanier = () => {
    setPanier([]);
    setQuantites({});
  };

  // Calculer le total
  const calculerTotal = () => {
    return panier.reduce((total, item) => {
      const quantite = getQuantite(item.id);
      return total + (item.piece.prix * quantite);
    }, 0);
  };

  // Calculer le nombre total d'articles
  const getNombreArticles = () => {
    return panier.reduce((total, item) => total + getQuantite(item.id), 0);
  };

  // Fonction pour passer commande via WhatsApp - VERSION AMÉLIORÉE
  const passerCommande = () => {
    if (panier.length === 0) {
      alert("Votre panier est vide !");
      return;
    }

    const phoneNumber = "242066067237";
    let message = ` *NOUVELLE COMMANDE*%0A%0A`;
    message += ` *Détails de la commande:*%0A%0A`;

    panier.forEach((item, index) => {
      const quantite = getQuantite(item.id);
      const sousTotal = item.piece.prix * quantite;
      const unite = item.produit.id_type === 2 ? "ml" : "pcs";
      
      message += `${index + 1}. *${item.produit.nom}*%0A`;
      message += `   └ ${item.piece.nombre_de_pieces} ${unite} × ${quantite}%0A`;
      message += `   └ ${item.piece.prix} FCFA × ${quantite} = ${sousTotal} FCFA%0A%0A`;
    });

    message += `━━━━━━━━━━━━━━━━%0A`;
    message += ` *TOTAL:* ${calculerTotal()+1000} FCFA%0A`;
    message += ` *Nombre d'articles:* ${getNombreArticles()}`;
    message+=`*Livraison:* 1000 FCFA `

    const url = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(url, "_blank");
    
    // Optionnel : vider le panier après la commande
    // viderPanier();
  };

  // Variants pour les animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring"as const,
        stiffness: 300,
        damping: 25
      }
    },
    exit: {
      x: 100,
      opacity: 0,
      transition: {
        duration: 0.3
      }
    }
  };
function PanierItem ({id, produit,piece}: panierProps){
    const [webpImage, setWebpImage] = useState<string | null>(null);

    useEffect(() => { 
      let mounted = true; 
      (async () => { 
        const img = await urlToWebp(produit.image); 
        if (mounted) setWebpImage(img); })(); 
        return () => { mounted = false }; }, [produit.image]);
   return (
      <motion.div
          
          variants={itemVariants}
          layout
          exit="exit"
          className={`grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-4 p-4 rounded-lg shadow-lg ${
            isDark
              ? "bg-gray-800 bg-opacity-50 backdrop-blur-sm "
              : "bg-white"
          }`}
        >
          {/* Image du produit */}
          <div className="relative overflow-hidden rounded-lg h-32 sm:h-full">
            <img
              src={webpImage?? produit.image}
              loading="lazy"
              alt={produit.nom}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Détails du produit */}
          <div className="flex flex-col justify-between gap-3">
            <div>
              <h3
                className={`font-semibold text-base md:text-lg ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {produit.nom}
              </h3>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {produit.description}
              </p>
              <p
                className={`text-sm mt-1 ${
                  isDark ? "text-gray-500" : "text-gray-500"
                }`}
              >
                {piece.nombre_de_pieces*getQuantite(id)}{" "}
                {produit.id_type === 2 ? "ml" : "pcs"}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Contrôles de quantité */}
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => diminuerQuantite(id)}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    isDark
                      ? "bg-gray-700 hover:bg-gray-600 border border-gray-600"
                      : "bg-gray-100 hover:bg-gray-200 border border-gray-300"
                  }`}
                >
                  <Minus className="w-4 h-4" />
                </motion.button>

                <span
                  className={`px-4 py-2 font-medium ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {getQuantite(id)}
                </span>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => augmenterQuantite(id)}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    isDark
                      ? "bg-gray-700 hover:bg-gray-600 border border-gray-600"
                      : "bg-gray-100 hover:bg-gray-200 border border-gray-300"
                  }`}
                >
                  <Plus className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Prix et suppression */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    {piece.prix} FCFA × {getQuantite(id)}
                  </p>
                  <p className={`font-bold text-lg ${textOrange}`}>
                    {piece.prix * getQuantite(id)} FCFA
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => supprimerItem(id)}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    isDark
                      ? "bg-red-900/30 text-red-400 hover:bg-red-900/50"
                      : "bg-red-50 text-red-600 hover:bg-red-100"
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
   )
}

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`flex flex-col gap-6 min-h-screen text-xs md:text-sm xl:text-base mx-[5%] py-8 ${
        isDark ? "text-white" : ""
      }`}
    >
      {/* En-tête */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="flex flex-col items-center gap-4"
      >
        <div className="flex items-center gap-3">
          <ShoppingCart className={`w-10 h-10 ${textOrange}`} />
          <h1 className={`text-3xl md:text-4xl xl:text-5xl font-bold ${textOrange} text-center tracking-tight`}>
            Mon Panier
          </h1>
        </div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`flex items-center justify-center gap-2 text-sm ${
            isDark ? "text-gray-400" : "text-gray-500"
          }`}
        >
          <div className={`h-px w-12 ${isDark ? "bg-gray-600" : "bg-gray-300"}`}></div>
          <p className="font-medium">
            {panier.length} {panier.length > 1 ? "articles" : "article"}
          </p>
          <div className={`h-px w-12 ${isDark ? "bg-gray-600" : "bg-gray-300"}`}></div>
        </motion.div>
      </motion.div>

      {/* Contenu du panier */}
      {panier.length === 0 ? (
        // Panier vide
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`flex flex-col items-center justify-center w-full py-20 max-w-4xl mx-auto ${
            !isDark ? "text-gray-800" : "text-white"
          }`}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.2
            }}
            className={`mb-6 p-8 rounded-full ${isDark ? "bg-gray-800" : "bg-gray-100"}`}
          >
            <ShoppingBag
              className={`w-20 h-20 ${isDark ? "text-gray-600" : "text-gray-400"}`}
            />
          </motion.div>

          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl xl:text-3xl font-semibold mb-2"
          >
            Votre panier est vide
          </motion.h3>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={`text-sm md:text-base ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            Ajoutez des produits pour commencer vos achats
          </motion.p>
        </motion.div>
      ) : (
        // Panier avec articles
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Liste des articles */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2 flex flex-col gap-4"
          >
            <div className="flex justify-between items-center">
              <h2 className={`text-xl font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                Articles ({panier.length})
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={viderPanier}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isDark
                    ? "bg-red-900/30 text-red-400 hover:bg-red-900/50"
                    : "bg-red-50 text-red-600 hover:bg-red-100"
                }`}
              >
                <Trash2 className="w-4 h-4" />
                Vider le panier
              </motion.button>
            </div>

            <AnimatePresence mode="popLayout">
              {panier.map((item) => (
                <PanierItem key={item.id} id={item.id} produit={item.produit} piece={item.piece} />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Résumé de la commande */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div
              className={`sticky top-24 p-6 rounded-lg shadow-2xl ${
                isDark ? "bg-gray-800 " : `${bgBlue}`
              }`}
            >
              <h2
                className={`text-xl font-bold mb-6 text-white`}
              >
                Résumé de la commande
              </h2>

              <div className="flex flex-col gap-4 mb-6">
                <div
                  className={`flex justify-between pb-3 border-b ${
                    isDark ? "b" : "border-gray-200"
                  }`}
                >
                  <span className={`text-gray-400`}>
                    Montant total
                  </span>
                  <span className={`font-semibold text-white`}>
                    {calculerTotal()} FCFA
                  </span>
                </div>

                <div
                  className={`flex justify-between pb-3 border-b ${
                    isDark ? "" : "border-gray-200"
                  }`}
                >
                  <span className={`text-gray-400`}>
                    Nombre d'articles
                  </span>
                  <span className={`font-semibold ${textOrange}`}>
                    {getNombreArticles()}
                  </span>
                </div>

                <div
                  className={`flex justify-between pb-3 border-b ${
                    isDark ? "" : "border-gray-200"
                  }`}
                >
                  <span className={`text-gray-400`}>
                    Livraison
                  </span>
                  <span className={`font-semibold ${textOrange}`}>1000 FCFA</span>
                </div>

                <div className="flex justify-between pt-2">
                  <span className={`text-lg font-bold text-white`}>
                    Total
                  </span>
                  <span className={`text-2xl font-bold ${textOrange}`}>
                    {calculerTotal()+1000} FCFA
                  </span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={passerCommande}
                className={`${bgOrange} w-full py-3 rounded-xl font-semibold text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2`}
              >
                <Send className="w-5 h-5" />
                Commander via WhatsApp
              </motion.button>

              <p className={`text-xs text-center mt-4 text-gray-400`}>
                Vous serez redirigé vers WhatsApp pour finaliser votre commande
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}