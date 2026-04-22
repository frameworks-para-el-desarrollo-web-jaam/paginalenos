import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import { getCatalogProductsRequest } from "../api/products";
import { useCart } from "../context/CartContext";
import { API_ORIGIN } from "../config/api";

function Catalogo() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    const loadProductos = async () => {
      try {
        setLoading(true);
        const res = await getCatalogProductsRequest();
        setProductos(res.data);
      } catch (requestError) {
        console.error(requestError);
        setError("No se pudo cargar el catalogo de productos");
      } finally {
        setLoading(false);
      }
    };

    loadProductos();
  }, []);

  const handleAddToCart = (producto) => {
    addToCart(producto);
    setFeedbackMessage(`${producto.nombreProducto} fue agregado al carrito.`);
  };

  return (
    <div className="min-h-screen bg-amber-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-stone-800">Catalogo de Productos</h1>
          <p className="mt-3 text-lg text-stone-600">
            Explora rapidamente nuestros productos disponibles.
          </p>
        </div>

        {feedbackMessage && (
          <div className="mb-6 rounded-3xl bg-green-100 p-4 text-center font-medium text-green-700 shadow-sm">
            {feedbackMessage}
          </div>
        )}

        {loading && (
          <p className="rounded-xl bg-white p-6 text-center text-stone-600 shadow-sm">
            Cargando productos...
          </p>
        )}

        {!loading && error && (
          <p className="rounded-xl bg-red-100 p-6 text-center text-red-700 shadow-sm">
            {error}
          </p>
        )}

        {!loading && !error && productos.length === 0 && (
          <p className="rounded-xl bg-white p-6 text-center text-stone-600 shadow-sm">
            Aun no hay productos publicados.
          </p>
        )}

        {!loading && !error && productos.length > 0 && (
          <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {productos.map((producto) => {
              const imageSrc = producto.imagen
                ? `${API_ORIGIN}${producto.imagen}`
                : "https://placehold.co/600x400/F5E6C8/6B4F3A?text=Sin+imagen";

              return (
                <article
                  key={producto._id}
                  className="overflow-hidden rounded-2xl bg-white shadow-lg transition-transform duration-200 hover:-translate-y-1"
                >
                  <img
                    src={imageSrc}
                    alt={producto.nombreProducto}
                    className="h-56 w-full object-cover"
                  />
                  <div className="space-y-4 p-5">
                    <div>
                      <h2 className="text-2xl font-semibold text-stone-800">
                        {producto.nombreProducto}
                      </h2>
                      <p className="mt-2 min-h-[72px] text-sm text-stone-600">
                        {producto.descripcion || "Producto sin descripcion disponible."}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <span className="text-2xl font-bold text-orange-600">
                        ${Number(producto.precio).toFixed(2)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAddToCart(producto)}
                        className="rounded-full bg-stone-900 px-5 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-orange-600"
                      >
                        Pedir ahora
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </main>
    </div>
  );
}

export default Catalogo;
