import { useNavigate } from 'react-router-dom';
import { useTheme } from '../Context/Theme';
import { bgOrange, textOrange } from '../Constantes';

export default function NonTrouvé() {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  return (
    <div className={` flex items-center justify-center px-4  ${
      isDark ? 'text-white' : 'text-gray-900'
    }`}>
      <div className="text-center h-full">
        <h1 className={`text-3xl md:text-4xl xl:text-5xl font-bold ${textOrange} mb-8`}>
          404
        </h1>
        
        <h2 className="text-lg md:text-xl xl:text-3xl font-semibold mb-4">
          Page non trouvée
        </h2>
        
        <p className={`text-base md:text-lg mb-8 ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          La page que vous recherchez n'existe pas.
        </p>
        
        <button
          onClick={() => navigate('/')}
          className={`${bgOrange} text-white font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity`}
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}