export const textBlue='text-[#34495E]'
export const textOrange='text-[#F07D00]'
export const bgBlue='bg-[#34495E]'
export const bgOrange='bg-[#F07D00]'
export const vert=['#5AA136']

export type typeProps={

    id: number;
    nom: string;
    description: string;
    image: string;
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

export const produits : produitsProps[] = [
    {id:1, id_type:1, nom: 'Sac à bec', description:'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quae quas dLorem ipsum dolor sit,', image:'/1.jpg'},
    {id:2, id_type:1, nom: 'pots bec', description:'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quae quas dLorem ipsum dolor sit,', image:'/1.jpg'},
    {id:3, id_type:2, nom: 'recipient bec', description:'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quae quas dLorem ipsum dolor sit,', image:'/1.jpg'},
    {id:4, id_type:1, nom: 'Sac à bec', description:'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quae quas dLorem ipsum dolor sit,', image:'/1.jpg'},
    {id:5, id_type:1, nom: 'Sac à bec', description:'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quae quas dLorem ipsum dolor sit,', image:'/1.jpg'},
    {id:6, id_type:2, nom: 'Sac à bec', description:'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quae quas dLorem ipsum dolor sit,', image:'/1.jpg'},
]

export const pieces : piecesProps[] = [
    {id:1, id_produit:1, nombre_de_pieces:50,prix:5000},
    {id:2, id_produit:1, nombre_de_pieces:100,prix:10000},
    {id:3, id_produit:2, nombre_de_pieces:100,prix:10000},
    {id:4, id_produit:2, nombre_de_pieces:50,prix:5000},
    {id:5, id_produit:3, nombre_de_pieces:100,prix:10000},
    {id:6, id_produit:3, nombre_de_pieces:50,prix:5000},
    {id:7, id_produit:4, nombre_de_pieces:100,prix:10000},
    {id:8, id_produit:4, nombre_de_pieces:50,prix:5000},
    {id:9, id_produit:5, nombre_de_pieces:100,prix:10000},
    {id:10, id_produit:5, nombre_de_pieces:50,prix:5000},
    {id:11, id_produit:6, nombre_de_pieces:100,prix:10000},
    {id:12, id_produit:6, nombre_de_pieces:50,prix:5000},

]

export const type_produits: typeProps[] = [

    {id:1, nom: 'Emballages', description:'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quae quas dLorem ipsum dolor sit,', image:'/1.jpg'}
]