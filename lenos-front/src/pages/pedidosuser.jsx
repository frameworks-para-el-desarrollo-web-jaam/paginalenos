import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/navbar";
import { createPedidoRequest } from "../api/pedidos";
import { useCart } from "../context/CartContext";
import { API_ORIGIN } from "../config/api";

const initialCustomerData = {
  nombre: "",
  telefono: "",
  direccion: "",
};

const whatsappPhone = "524181004824";

const buildWhatsappMessage = (cartItems, quantityProducts, total, direccion) => {
  const productSummary = cartItems
    .map((item) => `${item.quantity}x ${item.nombreProducto}`)
    .join(", ");

  return `Hola, me gustaria pedir ${quantityProducts} productos: ${productSummary}. Total: $${Number(
    total
  ).toFixed(2)}. Direccion: ${direccion}.`;
};

function CarritoPage() {
  const {
    cartItems,
    cartTotal,
    clearCart,
    removeFromCart,
    updateQuantity,
  } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [customerData, setCustomerData] = useState(initialCustomerData);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [lastSavedOrder, setLastSavedOrder] = useState(null);

  const openCheckout = () => {
    setSuccessMessage("");
    setIsCheckoutOpen(true);
  };

  const closeCheckout = () => {
    setIsCheckoutOpen(false);
    setCustomerData(initialCustomerData);
  };

  const handleCustomerChange = (event) => {
    const { name, value } = event.target;
    setCustomerData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleCheckoutSubmit = async (event) => {
    event.preventDefault();

    const quantityProducts = cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
    const whatsappMessage = buildWhatsappMessage(
      cartItems,
      quantityProducts,
      cartTotal,
      customerData.direccion
    );
    const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
      whatsappMessage
    )}`;
    const whatsappWindow = window.open("about:blank", "_blank");

    try {
      setSubmitting(true);
      const payload = {
        ...customerData,
        items: cartItems.map((item) => ({
          productId: item._id,
          nombreProducto: item.nombreProducto,
          precioUnitario: Number(item.precio),
          cantidad: item.quantity,
          imagen: item.imagen || "",
        })),
      };

      await createPedidoRequest(payload);
      if (whatsappWindow) {
        whatsappWindow.location.assign(whatsappUrl);
      } else {
        window.open(whatsappUrl, "_blank");
      }
      setLastSavedOrder({
        nombre: customerData.nombre,
        telefono: customerData.telefono,
        direccion: customerData.direccion,
        cantidadProductos: quantityProducts,
        total: cartTotal,
      });
      clearCart();
      closeCheckout();
      setSuccessMessage("Pedido guardado correctamente. Muy pronto seguiremos con el flujo completo.");
    } catch (requestError) {
      if (whatsappWindow) {
        whatsappWindow.close();
      }
      console.error(requestError);
      const backendMessage = requestError.response?.data?.message;
      const message = Array.isArray(backendMessage)
        ? backendMessage.join(", ")
        : backendMessage || "No se pudo guardar el pedido";
      alert(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
              Carrito de compras
            </p>
            <h1 className="mt-3 text-4xl font-black text-stone-900">
              Tus productos listos para el siguiente paso
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-stone-600">
              Agrega productos, ajusta cantidades y cuando estes listo guarda el
              pedido con tus datos de entrega.
            </p>
          </div>

          {cartItems.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="rounded-full border border-red-300 px-5 py-3 font-semibold text-red-600 transition hover:bg-red-50"
            >
              Vaciar carrito
            </button>
          )}
        </div>

        {successMessage && (
          <div className="mb-6 rounded-3xl bg-green-100 p-5 text-green-700 shadow-sm">
            {successMessage}
          </div>
        )}

        {lastSavedOrder && cartItems.length === 0 && (
          <section className="mb-6 rounded-[2rem] bg-white p-8 shadow-lg">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-green-600">
              Pedido confirmado
            </p>
            <h2 className="mt-3 text-3xl font-black text-stone-900">
              Tu pedido fue guardado y WhatsApp ya fue preparado
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl bg-stone-50 p-5">
                <p className="text-sm text-stone-500">Cliente</p>
                <p className="mt-2 text-lg font-bold text-stone-900">
                  {lastSavedOrder.nombre}
                </p>
                <p className="mt-1 text-sm text-stone-600">
                  {lastSavedOrder.telefono}
                </p>
              </div>
              <div className="rounded-3xl bg-stone-50 p-5">
                <p className="text-sm text-stone-500">Entrega</p>
                <p className="mt-2 text-sm leading-6 text-stone-700">
                  {lastSavedOrder.direccion}
                </p>
                <p className="mt-3 text-sm font-semibold text-orange-600">
                  {lastSavedOrder.cantidadProductos} productos
                </p>
                <p className="mt-1 text-xl font-black text-stone-900">
                  ${Number(lastSavedOrder.total).toFixed(2)}
                </p>
              </div>
            </div>
          </section>
        )}

        {cartItems.length === 0 ? (
          <section className="rounded-[2rem] bg-white p-10 text-center shadow-lg">
            <h2 className="text-3xl font-bold text-stone-900">
              Tu carrito esta vacio
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-stone-600">
              Todavia no agregas productos. Entra al catalogo y empieza a armar tu
              pedido.
            </p>
            <Link
              to="/catalogo"
              className="mt-8 inline-flex rounded-full bg-orange-500 px-6 py-3 font-bold text-stone-950 transition hover:bg-orange-400"
            >
              Ir al catalogo
            </Link>
          </section>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="space-y-4">
              {cartItems.map((item) => {
                const imageSrc = item.imagen
                  ? `${API_ORIGIN}${item.imagen}`
                  : "https://placehold.co/400x300/F5E6C8/6B4F3A?text=Sin+imagen";

                return (
                  <article
                    key={item._id}
                    className="grid gap-4 rounded-[1.75rem] bg-white p-5 shadow-lg sm:grid-cols-[140px_1fr]"
                  >
                    <img
                      src={imageSrc}
                      alt={item.nombreProducto}
                      className="h-36 w-full rounded-2xl object-cover"
                    />

                    <div className="flex flex-col justify-between gap-4">
                      <div>
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h2 className="text-2xl font-bold text-stone-900">
                              {item.nombreProducto}
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-stone-600">
                              {item.descripcion || "Producto sin descripcion disponible."}
                            </p>
                          </div>
                          <p className="text-2xl font-black text-orange-600">
                            ${Number(item.precio).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 text-xl font-bold text-stone-700 transition hover:border-orange-400 hover:text-orange-500"
                          >
                            -
                          </button>
                          <span className="min-w-8 text-center text-lg font-bold text-stone-900">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 text-xl font-bold text-stone-700 transition hover:border-orange-400 hover:text-orange-500"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item._id)}
                          className="rounded-full border border-red-200 px-4 py-2 font-semibold text-red-600 transition hover:bg-red-50"
                        >
                          Quitar del carrito
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>

            <aside className="h-fit rounded-[1.75rem] bg-stone-950 p-6 text-white shadow-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-300">
                Resumen
              </p>
              <h2 className="mt-3 text-3xl font-black">Tu carrito actual</h2>

              <div className="mt-8 space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={`${item._id}-summary`}
                    className="flex items-center justify-between gap-4 border-b border-white/10 pb-4 text-sm"
                  >
                    <div>
                      <p className="font-semibold text-orange-100">
                        {item.nombreProducto}
                      </p>
                      <p className="text-stone-300">
                        {item.quantity} x ${Number(item.precio).toFixed(2)}
                      </p>
                    </div>
                    <p className="font-bold text-white">
                      ${(Number(item.precio) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-center justify-between text-lg">
                <span className="text-stone-300">Total</span>
                <span className="text-3xl font-black text-orange-300">
                  ${cartTotal.toFixed(2)}
                </span>
              </div>

              <button
                type="button"
                onClick={openCheckout}
                className="mt-8 w-full rounded-full bg-orange-500 px-6 py-4 font-bold text-stone-950 transition hover:bg-orange-400"
              >
                Guardar pedido
              </button>
            </aside>
          </div>
        )}
      </main>

      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-xl rounded-[2rem] bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-black text-stone-900">
                Datos para guardar tu pedido
              </h2>
              <button
                type="button"
                onClick={closeCheckout}
                className="text-sm font-semibold text-stone-500 hover:text-stone-900"
              >
                Cerrar
              </button>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="grid gap-4">
              <div>
                <label className="mb-2 block font-medium text-stone-700">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={customerData.nombre}
                  onChange={handleCustomerChange}
                  className="w-full rounded-xl border border-stone-300 px-4 py-3 text-stone-900 outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-stone-700">Telefono</label>
                <input
                  type="text"
                  name="telefono"
                  value={customerData.telefono}
                  onChange={handleCustomerChange}
                  className="w-full rounded-xl border border-stone-300 px-4 py-3 text-stone-900 outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-stone-700">Direccion</label>
                <textarea
                  name="direccion"
                  value={customerData.direccion}
                  onChange={handleCustomerChange}
                  rows="3"
                  className="w-full rounded-xl border border-stone-300 px-4 py-3 text-stone-900 outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div className="rounded-2xl bg-orange-50 p-4 text-sm text-stone-700">
                Se guardaran {cartItems.reduce((total, item) => total + item.quantity, 0)} productos
                con un total de ${cartTotal.toFixed(2)}.
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeCheckout}
                  className="rounded-full bg-stone-200 px-5 py-2 font-semibold text-stone-700 hover:bg-stone-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full bg-orange-500 px-5 py-2 font-semibold text-stone-950 transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Guardando..." : "Confirmar pedido"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CarritoPage;
