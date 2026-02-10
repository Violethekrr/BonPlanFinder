import {useLocation} from 'react-router-dom';
import NavBar from './NavBar';
import Footer from './Footer';
import { useTheme } from '../Context/Theme';

interface Pros {
  children : React.ReactNode;
}

export default function Layout({ children } : Pros) {
  const location = useLocation();
  const routesNav = ['/','/Catalogues','/Produits'];
  const routesFooter= ['/','/Catalogues','/Produits'];

  const showNav = routesNav.includes(location.pathname);
  const showFooter = routesFooter.includes(location.pathname);
  const {isDark}= useTheme();

  return (
    <div className={`${isDark ? 'bg-gray-900': ''} h-full`}>
      {showNav && <NavBar />}
      <main className={`${showNav && showFooter ? 'pt-18' : 'h-full'}`}>
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  )
}
