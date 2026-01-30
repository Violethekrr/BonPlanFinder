import React from "react";
import type { Catalogue } from "../Constantes";
import { bgBlue, textBlue } from "../Constantes"
import { Link } from "react-router-dom";


type Props = {
  item: Catalogue;
};

const CatalogueCarte: React.FC<Props> = ({ item }) => {
  return (
    <article className="relative flex-col bg-gray-50 shadow-lg rounded-lg  border border-gray-50 hover:scale-105 transition-all duration-300">
      <div className={`${bgBlue} absolute w-[106%] left-[-3%] rounded-sm flex justify-center items-center py-2 md:py-3 xl:py-4 z-10`}>
        <h4 className={`text-xs md:text-sm xl:text-base text-white font-bold`}>{item.titre}</h4>
      </div>
      <div className="w-full h-28 md:h-42 xl:h-56">
        <img src={item.image?? "./carton.jpg"} alt="Illustration" className="w-full h-full object-cover"/>
      </div>
      <div className="w-full flex justify-center items-center">
        <p className={`text-center text-xs md:text-sm xl:text-base ${textBlue} my-2`}>{item.description}</p>
      </div>
      <div className="w-full flex justify-center items-center">
        <Link to="/Produits"  state={{ id: item.id, nom: item.titre }} className="text-xs md:text-sm xl:text-base text-[#5AA136] my-2 transition-all duration-300 hover:underline">Voir plus...</Link>
      </div>
    </article>
  );
};

export default CatalogueCarte;
