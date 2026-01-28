import {useLocation} from 'react-router-dom';
import NavBar from './NavBar';


interface Pros {
    children : React.ReactNode;
}
export default function Layout({ children } : Pros) {

    const location = useLocation();
    //La liste des routes où la Navbar et le Footer ne doivent pas apparaître
    const routesNav = ['/Conatct','*'];
    const routesFooter= ['/Contact','*'];
    //Verifier si la route actuelle est dans la list
    const hiddenNav = routesNav.includes(location.pathname);
    const hiddenFooter = routesFooter.includes(location.pathname);
   
  return (
    <div className={``}>
         
      <div className={``}>
        {!hiddenNav  && !hiddenFooter && <NavBar/>}
      </div>

      <main className={` `}>{children}</main>

      <div className={``}>
        {!hiddenNav  && !hiddenFooter && <NavBar/>}
      </div>
    </div>
  )
}