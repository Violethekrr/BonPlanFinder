
import { Link } from 'react-router-dom'

export default function Catalogues() {
  return (
    <div>
     <Link to="/Produits"  state={{ id: 1, nom: 'Emballages' }}> Emballages</Link>
    </div>
  )
}
