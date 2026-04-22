import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Catalogo from "./pages/catalogo";
import GestionarProductos from "./pages/gestionarproductos";
import HomePage from "./pages/HomePage";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import CarritoPage from "./pages/pedidosuser";
import PedidosAdminPage from "./pages/pedidosadmin";
import Comentarios from "./pages/comentarios";


function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={<HomePage />}
            />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/carrito" element={<CarritoPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/gestionarproductos" element={<GestionarProductos />} />
            <Route path="/pedidos" element={<PedidosAdminPage />} />
            <Route path="/add-pedidos" element={<h1>Add Pedidos</h1>} />
            <Route path="/update-pedidos" element={<h1>Update Pedidos</h1>} />
            <Route path="/comentarios" element={<Comentarios />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
export default App;
