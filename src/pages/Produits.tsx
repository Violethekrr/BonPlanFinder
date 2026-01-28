import { useLocation } from "react-router-dom";
import { produits, pieces } from "../Constantes"


type produitsProps={
  id:number;
  nom:string;
}
export default function Produits() {
   const location = useLocation(); 

    const { id } = location.state || {};
    const { nom } = location.state || {};

  return (
    <div className="flex flex-col gap-4 text-xs md:text-sm xl:text-base">
     
        <h2 className="text-lg md:text-xl xl:text-2xl font-bold">{nom}</h2>
        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iure inventore minima, doloremque magni reprehenderit, fuga aut corporis dolor, ipsam repellendus ex! Quia hic sint illo labore, minus voluptatem? Accusantium, maxime!</p>
     
      
    </div>
  )
}
