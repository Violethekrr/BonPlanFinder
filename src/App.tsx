import React from "react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Accueil from "./pages/Accueil";
import Catalogues from "./pages/Catalogues";
import Produits from "./pages/Produits";
import Contact from "./pages/Contact";
import Panier from "./pages/Panier";
import Layout from "./composants/Layout";
import NonTrouvé from "./pages/NonTrouvé";


const App: React.FC = () => {
  return (
    <Router >
      <Layout>
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/Catalogues" element={<Catalogues />} />
          <Route path="/Produits" element={<Produits/>} />
          <Route path="/Panier" element={<Panier/>} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="*" element={<NonTrouvé />} />
        </Routes>
       </Layout>
    </Router>
   

  );
};

export default App;