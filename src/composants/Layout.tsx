import {useLocation} from 'react-router-dom';
import NavBar from './NavBar';
import Footer from './Footer';
import { useTheme } from '../Context/Theme';

interface Pros {
    children : React.ReactNode;
}
export default function Layout({ children } : Pros) {

    const location = useLocation();
    //La liste des routes où la Navbar et le Footer ne doivent pas apparaître
    const routesNav = ['/','/Catalogues','/Produits'];
    const routesFooter= ['/','/Catalogues','/Produits'];
    //Verifier si la route actuelle est dans la list
    const hiddenNav = routesNav.includes(location.pathname);
    const hiddenFooter = routesFooter.includes(location.pathname);
    const {isDark}= useTheme()

  return (
    <div className={` ${isDark? 'bg-gray-800': ''} h-full`}>
         
      <div className={``}>
        {hiddenNav  && hiddenFooter && <NavBar/>}
      </div>

      <main className={` pt-18 h-full`}>{children}</main>

      <div className={``}>
        {hiddenNav  && hiddenFooter && <Footer/>}
      </div>
    </div>
  )
}