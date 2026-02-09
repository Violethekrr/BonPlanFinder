import React from "react";
import type { Catalogue } from "../Constantes";
import { bgBlue, textBlue, borderBlue } from "../Constantes"
import { Link } from "react-router-dom";
import { Package, Sparkles, CupSoda } from "lucide-react";
import { useTheme } from "../Context/Theme";

const iconsMap = {
  package: Package,
  cosmetique: Sparkles,
  boisson: CupSoda,
};

export type IconName = keyof typeof iconsMap;

interface DynamicIconProps {
  type: IconName;
  size?: number;
  color?: string;
}

function DynamicIcon({ type, size = 24, color = "black" }: DynamicIconProps) {
  const IconComponent = iconsMap[type];
  if (!IconComponent) {
    console.error(`Icône "${type}" introuvable dans iconsMap`);
    return <span>❓</span>; // fallback
  }
  return <IconComponent size={size} color={color} />;
}



type Props = {
  item: Catalogue;
};

const CatalogueCarte: React.FC<Props> = ({ item }) => {
  const { isDark } = useTheme();
  return (
    <article className={`relative flex-col border ${isDark ? bgBlue + ' '+ borderBlue : 'bg-gray-50 border-gray-50'} shadow-lg rounded-lg hover:scale-105 transition-all duration-300`}>
      <div className={`${isDark ? `bg-gray-50 ${textBlue}` : 'text-white ' + bgBlue} absolute w-[106%] left-[-3%] rounded-sm flex justify-center items-center py-2 md:py-3 xl:py-4 z-10 gap-4`}>
        <DynamicIcon type={item.icone} size={20} color={isDark ? "#34495E" : "white"} />
        <h4 className={`text-xs md:text-sm xl:text-base font-bold`}>{item.titre}</h4>
      </div>
      <div className="w-full h-28 md:h-42 xl:h-56">
        <img src={item.image?? "./carton.jpg"} alt="Illustration" className="w-full h-full object-cover"/>
      </div>
      <div className={`w-full flex justify-center items-center px-4 py-2 md:py-3 xl:py-4`}>
        <p className={`${isDark ? 'text-white' : textBlue} text-center text-xs md:text-sm xl:text-base my-2`}>{item.description}</p>
      </div>
      <div className="w-full flex justify-center items-center">
        <Link to="/Produits"  state={{ id: item.id, nom: item.titre }} className="text-xs md:text-sm xl:text-base text-[#5AA136] my-2 transition-all duration-300 hover:underline">Voir plus...</Link>
      </div>
    </article>
  );
};

export default CatalogueCarte;
