import { Link } from 'react-router-dom'
import { type_produits } from '../Constantes'


export default function Catalogues() {
  return (
    <div>
        {
          type_produits.map((type, i)=>(
            <div key={i}>
              <Link to="/Produits"  state={{ id: type.id, nom: type.nom  }}> <img src={type.image} alt="" /></Link>
            </div>
     
          ))}
    </div>
  )
}
