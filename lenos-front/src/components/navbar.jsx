import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();

  return (
    <nav className="bg-zinc-800 text-orange-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold hover:text-white">Leños</Link>
        <div className="flex space-x-4">
          {isAuthenticated ? (
            <>
              <Link to="/catalogo" className="hover:text-white">Catalogo</Link>
              <Link to="/carrito" className="hover:text-white">
                Carrito {cartCount > 0 ? `(${cartCount})` : ""}
              </Link>
              <Link to="/pedidos" className="hover:text-white">Pedidos Admin</Link>
              <Link to="/gestionarproductos" className="hover:text-white">Gestionar Productos</Link>
              <button onClick={logout} className="hover:text-white">Logout</button>
            </>
          ) : (
            <>
              <Link to="/catalogo" className="hover:text-white">Catalogo</Link>
              <Link to="/carrito" className="hover:text-white">
                Carrito {cartCount > 0 ? `(${cartCount})` : ""}
              </Link>
              <Link to="/login" className="hover:text-white">Login</Link>
              <Link to="/register" className="hover:text-white">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
