export const textBlue='text-[#34495E]'
export const textOrange='text-[#F07D00]'
export const borderBlue='border-[#34495E]'
export const bgBlue='bg-[#34495E]'
export const bgOrange='bg-[#F07D00]'
export const vert=['#5AA136']
import type { IconName } from "./composants/CatalogueCarte";


export interface Catalogue {
  id: number;
  icone: IconName; // au lieu de string
  titre: string;
  description: string;
  image?: string;
}


export type produitsProps={

    id: number;
    id_type: number;
    nom: string;
    description: string;
    image: string;
}

export type piecesProps={

    id: number;
    id_produit: number;
    nombre_de_pieces: number;
    prix: number;
}




export const produits: produitsProps[] = [
  {id:1, id_type:1, nom: 'Sac à bec 200 ml', description:'Petit sac à bec en plastique, idéal pour boissons ou sauces en petite quantité.', image:'/200ml.jpg'},
  {id:2, id_type:1, nom: 'Sac à bec 250 ml', description:'Sac à bec pratique pour jus ou lait, format moyen pour usage quotidien.', image:'/25.jpg'},
  {id:3, id_type:1, nom: 'Sac à bec 300 ml', description:'Sac à bec résistant, parfait pour conditionner des liquides alimentaires.', image:'/300.jpg'},
  {id:4, id_type:1, nom: 'Sac à bec 500 ml', description:'Sac à bec grande capacité, adapté aux boissons familiales ou restauration.', image:'/500.jpg'},
  {id:5, id_type:1, nom: 'Pôt plastique 500 ml', description:'Pot plastique transparent avec couvercle, idéal pour desserts, glaces ou sauces.', image:'/pot500.jpg'},
  {id:6, id_type:1, nom: 'Pôt plastique 1000 ml', description:'Grand pot plastique alimentaire, parfait pour plats préparés ou stockage.', image:'/pot1000.jpg'},
  {id:7, id_type:1, nom: 'Barquette ronde aluminium 12 cm', description:'Barquette aluminium ronde, résistante à la chaleur, idéale pour pâtisseries.', image:'/rond.jpg'},
  {id:8, id_type:1, nom: 'Barquette aluminium 18,5*10,5', description:'Barquette rectangulaire en aluminium, parfaite pour plats cuisinés.', image:'/barquette18.jpg'},
  {id:9, id_type:1, nom: 'Barquette aluminium 20,5*14', description:'Barquette aluminium de taille moyenne, adaptée aux portions individuelles.', image:'/barquette20.jpg'},
  {id:10, id_type:1, nom: 'Barquette aluminium 16,5*17,5', description:'Barquette aluminium carrée, pratique pour quiches ou gratins.', image:'/barquette16.jpg'},
  {id:11, id_type:1, nom: 'Barquette aluminium 18*25', description:'Grande barquette aluminium, idéale pour plats familiaux ou traiteur.', image:'/barquette20.jpg'},
  {id:12, id_type:1, nom: 'Mini-pot avec couvercle rattaché 3,5*3,5 cm', description:'Mini pot plastique avec couvercle intégré, parfait pour sauces ou condiments.', image:'/potColé.jpg'},
  {id:13, id_type:1, nom: 'Mini-pot transparent avec couvercle 3,5*3,5 cm', description:'Mini pot transparent avec couvercle séparé, pratique pour dégustations.', image:'/potTransparent.jpg'},

  // --- Boîtes gâteaux ---
  {id:14, id_type:1, nom: 'Boîte gâteau 10*14/8 cm blanc', description:'Petite boîte pâtisserie blanche, idéale pour parts individuelles.', image:'/boiteGateaux.jpg'},
  {id:15, id_type:1, nom: 'Boîte gâteau 10*14/8 cm couleur', description:'Petite boîte pâtisserie colorée, présentation élégante pour gâteaux.', image:'/boiteGateauxCouleur.jpg'},
  {id:16, id_type:1, nom: 'Boîte gâteau 20*20/8 cm blanc', description:'Boîte pâtisserie blanche, adaptée aux gâteaux moyens.', image:'/boiteGateaux20.jpg'},
  {id:17, id_type:1, nom: 'Boîte gâteau 20*20/8 cm couleur', description:'Boîte pâtisserie colorée, idéale pour offrir un gâteau.', image:'/boiteGateaux20Couleur.jpg'},
  {id:18, id_type:1, nom: 'Boîte gâteau avec fenêtre 15*15*8 cm', description:'Boîte pâtisserie avec fenêtre transparente pour mettre en valeur le produit.', image:'/boiteGateauxTransparent.jpg'},

  // --- Bols papier ---
  {id:19, id_type:1, nom: 'Bol papier avec couvercle 500 ml', description:'Bol alimentaire en papier avec couvercle, parfait pour soupes ou salades.', image:'/bol500.jpg'},
  {id:20, id_type:1, nom: 'Bol papier avec couvercle 750 ml', description:'Bol papier résistant, adapté aux plats à emporter.', image:'/bol750.jpg'},
  {id:21, id_type:1, nom: 'Bol papier avec couvercle 1000 ml', description:'Bol papier grande capacité, idéal pour repas complets.', image:'/bol1000.jpg'},
  {id:22, id_type:1, nom: 'Bol papier avec couvercle 1100 ml', description:'Bol papier avec couvercle hermétique, parfait pour plats liquides.', image:'/bol1100.jpg'},
  {id:23, id_type:1, nom: 'Bol papier avec couvercle 1500 ml', description:'Bol papier XXL, conçu pour grandes portions ou partage.', image:'/bol1500.jpg'},

  // --- Produits de type 2 : Boissons ---
  {id:24, id_type:2, nom: 'Jus de bissap', description:'Boisson traditionnelle à base de fleurs d’hibiscus, rafraîchissante et riche en antioxydants.', image:'/bissap.jpg'},
  {id:25, id_type:2, nom: 'Jus de fruits ananas-mangue', description:'Mélange exotique d’ananas et de mangue, naturellement sucré et vitaminé.', image:'/ananas.jpg'},
  {id:26, id_type:2, nom: 'Limonade artisanale', description:'Boisson gazeuse légère et pétillante, préparée avec du citron frais.', image:'/limonade.jpg'},

  // --- Produits de type 2 : Cosmétiques ---
  {id:27, id_type:3, nom: 'Huile de cheveux naturelle', description:'Huile nourrissante pour cheveux, favorise la brillance et la santé capillaire.', image:'/huile.jpg'},
  {id:28, id_type:3, nom: 'Beurre de karité', description:'Produit cosmétique naturel, hydrate et protège la peau et les cheveux.', image:'/beurre.jpg'},
  {id:29, id_type:3, nom: 'Shampoing naturel', description:'Shampoing doux sans produits chimiques, adapté aux cheveux sensibles.', image:'/shampoing.jpg'},
];



export const pieces : piecesProps[] = [
    {id:1, id_produit:1, nombre_de_pieces:50,prix:5000},
    {id:2, id_produit:2, nombre_de_pieces:100,prix:6000},
    {id:3, id_produit:3, nombre_de_pieces:50,prix:5000},
    {id:4, id_produit:3, nombre_de_pieces:100,prix:7500},
    {id:5, id_produit:4, nombre_de_pieces:50,prix:6000},
    {id:6, id_produit:4, nombre_de_pieces:100,prix:9000},
    {id:7, id_produit:5, nombre_de_pieces:10,prix:6000},
    {id:8, id_produit:5, nombre_de_pieces:15,prix:8500},
    {id:9, id_produit:6, nombre_de_pieces:10,prix:8000},
    {id:10, id_produit:6, nombre_de_pieces:15,prix:10000},
    {id:11, id_produit:7, nombre_de_pieces:50,prix:6000},
    {id:12, id_produit:7, nombre_de_pieces:100,prix:10000},
    {id:13, id_produit:8, nombre_de_pieces:50,prix:6500},
    {id:14, id_produit:8, nombre_de_pieces:100,prix:11000},
    {id:15, id_produit:9, nombre_de_pieces:50,prix:7000},
    {id:16, id_produit:9, nombre_de_pieces:100,prix:12000},
    {id:17, id_produit:10, nombre_de_pieces:50,prix:8500},
    {id:18, id_produit:10, nombre_de_pieces:100,prix:15500},
    {id:19, id_produit:11, nombre_de_pieces:50,prix:11000},
    {id:20, id_produit:11, nombre_de_pieces:100,prix:20000},
    {id:21, id_produit:12, nombre_de_pieces:500,prix:8500},
    {id:22, id_produit:12, nombre_de_pieces:1000,prix:14500},
    {id:23, id_produit:13, nombre_de_pieces:500,prix:7500},
    {id:24, id_produit:13, nombre_de_pieces:1000,prix:12500},
    {id:25, id_produit:14, nombre_de_pieces:10, prix:2000},
    {id:26, id_produit:15, nombre_de_pieces:10, prix:2500},
    {id:27, id_produit:16, nombre_de_pieces:10, prix:3000},
    {id:28, id_produit:17, nombre_de_pieces:10, prix:3500},
    {id:29, id_produit:18, nombre_de_pieces:10, prix:4500},

    {id:30, id_produit:19, nombre_de_pieces:25, prix:5500},
    {id:31, id_produit:19, nombre_de_pieces:50, prix:10000},
    {id:32, id_produit:20, nombre_de_pieces:25, prix:6000},
    {id:33, id_produit:20, nombre_de_pieces:50, prix:11000},
    {id:34, id_produit:21, nombre_de_pieces:25, prix:6500},
    {id:35, id_produit:21, nombre_de_pieces:50, prix:11000},
    {id:36, id_produit:22, nombre_de_pieces:25, prix:7000},
    {id:37, id_produit:22, nombre_de_pieces:50, prix:13000},
    {id:38, id_produit:23, nombre_de_pieces:25, prix:8000},
    {id:39, id_produit:23, nombre_de_pieces:50, prix:14500},

    // {id:40, id_produit:24, nombre_de_pieces:10, prix:12500},
    // {id:41, id_produit:24, nombre_de_pieces:50, prix:13000},
    // {id:42, id_produit:25, nombre_de_pieces:25, prix:8000},
    // {id:43, id_produit:25, nombre_de_pieces:50, prix:14500},
    
    // {id:44, id_produit:26, nombre_de_pieces:10, prix:12500},
    // {id:45, id_produit:26, nombre_de_pieces:50, prix:13000},
    // {id:46, id_produit:27, nombre_de_pieces:25, prix:8000},
    // {id:47, id_produit:27, nombre_de_pieces:50, prix:14500},

]



export const catalogues: Catalogue[] = [
  {
    id: 1,
    icone: "package",
    titre: "Emballages",
    description: "Emballage de qualité, à pris exceptionnel et à la qualité incroyable",
    image: "./emballages.jpg",
  },
  {
    id: 2,
    icone: "boisson",
    titre: "Boissons",
    description: "Boisson rafraîchissant, à pris exceptionnel et à la qualité incroyable",
    image: "./boissons.jpg",
  },
  {
    id: 3,
    icone: "cosmetique",
    titre: "Cosmétiques",
    description: "Cosmétique de qualité, à pris exceptionnel et à la qualité incroyable",
    image: "./cosmetiques.jpg",
  },
];
