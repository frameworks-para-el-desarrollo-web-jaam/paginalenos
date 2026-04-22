import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import {
  deletePedidoRequest,
  getPedidosRequest,
  updatePedidoRequest,
} from "../api/pedidos";

const pedidoStatusOptions = ["Pendiente", "En proceso", "Completado"];

const statusClasses = {
  Pendiente: "bg-amber-100 text-amber-700",
  "En proceso": "bg-blue-100 text-blue-700",
  Completado: "bg-green-100 text-green-700",
};

function PedidosAdminPage() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusDrafts, setStatusDrafts] = useState({});
  const [savingId, setSavingId] = useState("");
  const [deletingId, setDeletingId] = useState("");

  useEffect(() => {
    const loadPedidos = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getPedidosRequest();
        setPedidos(res.data);
        setStatusDrafts(
          res.data.reduce((accumulator, pedido) => {
            accumulator[pedido._id] = pedido.estado || "Pendiente";
            return accumulator;
          }, {})
        );
      } catch (requestError) {
        console.error(requestError);
        setError(
          requestError.response?.status === 401
            ? "Inicia sesion para ver los pedidos realizados."
            : "No se pudieron cargar los pedidos."
        );
      } finally {
        setLoading(false);
      }
    };

    loadPedidos();
  }, []);

  const handleStatusChange = (pedidoId, nextStatus) => {
    setStatusDrafts((currentDrafts) => ({
      ...currentDrafts,
      [pedidoId]: nextStatus,
    }));
  };

  const handleStatusSave = async (pedidoId) => {
    try {
      setSavingId(pedidoId);
      const res = await updatePedidoRequest(pedidoId, {
        estado: statusDrafts[pedidoId],
      });

      setPedidos((currentPedidos) =>
        currentPedidos.map((pedido) =>
          pedido._id === pedidoId ? res.data : pedido
        )
      );
    } catch (requestError) {
      console.error(requestError);
      const backendMessage = requestError.response?.data?.message;
      const message = Array.isArray(backendMessage)
        ? backendMessage.join(", ")
        : backendMessage || "No se pudo actualizar el estado del pedido.";
      alert(message);
    } finally {
      setSavingId("");
    }
  };

  const handleDelete = async (pedidoId) => {
    const confirmed = window.confirm("¿Deseas eliminar este pedido?");

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(pedidoId);
      await deletePedidoRequest(pedidoId);
      setPedidos((currentPedidos) =>
        currentPedidos.filter((pedido) => pedido._id !== pedidoId)
      );
      setStatusDrafts((currentDrafts) => {
        const nextDrafts = { ...currentDrafts };
        delete nextDrafts[pedidoId];
        return nextDrafts;
      });
    } catch (requestError) {
      console.error(requestError);
      const backendMessage = requestError.response?.data?.message;
      const message = Array.isArray(backendMessage)
        ? backendMessage.join(", ")
        : backendMessage || "No se pudo eliminar el pedido.";
      alert(message);
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="min-h-screen bg-stone-100">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
            Panel de pedidos
          </p>
          <h1 className="mt-3 text-4xl font-black text-stone-900">
            Pedidos realizados
          </h1>
          <p className="mt-3 max-w-3xl text-lg text-stone-600">
            Revisa los pedidos guardados desde el carrito junto con los datos del
            comprador y el detalle de productos.
          </p>
        </div>

        {loading && (
          <div className="rounded-3xl bg-white p-8 text-center text-stone-600 shadow-lg">
            Cargando pedidos...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-3xl bg-red-100 p-8 text-center text-red-700 shadow-lg">
            {error}
          </div>
        )}

        {!loading && !error && pedidos.length === 0 && (
          <div className="rounded-3xl bg-white p-8 text-center text-stone-600 shadow-lg">
            Aun no se han registrado pedidos.
          </div>
        )}

        {!loading && !error && pedidos.length > 0 && (
          <section className="grid gap-6">
            {pedidos.map((pedido) => (
              <article
                key={pedido._id}
                className="rounded-[2rem] bg-white p-6 shadow-lg"
              >
                <div className="flex flex-col gap-4 border-b border-stone-200 pb-5 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
                        Pedido
                      </p>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          statusClasses[pedido.estado] || statusClasses.Pendiente
                        }`}
                      >
                        {pedido.estado || "Pendiente"}
                      </span>
                    </div>
                    <h2 className="mt-2 text-2xl font-black text-stone-900">
                      {pedido.nombre}
                    </h2>
                    <p className="mt-2 text-sm text-stone-600">
                      Telefono: {pedido.telefono}
                    </p>
                    <p className="mt-1 text-sm text-stone-600">
                      Direccion: {pedido.direccion}
                    </p>
                  </div>

                  <div className="rounded-3xl bg-stone-950 px-5 py-4 text-white">
                    <p className="text-sm uppercase tracking-[0.25em] text-orange-300">
                      Total
                    </p>
                    <p className="mt-2 text-3xl font-black">
                      ${Number(pedido.total || 0).toFixed(2)}
                    </p>
                    <p className="mt-2 text-sm text-stone-300">
                      {pedido.cantidadProductos || 0} productos
                    </p>
                    <p className="mt-2 text-sm text-stone-300">
                      {new Date(pedido.createdAt).toLocaleString("es-MX")}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 rounded-3xl bg-stone-50 p-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <label className="text-sm font-semibold text-stone-700">
                      Estado del pedido
                    </label>
                    <select
                      value={statusDrafts[pedido._id] || pedido.estado || "Pendiente"}
                      onChange={(event) =>
                        handleStatusChange(pedido._id, event.target.value)
                      }
                      className="rounded-xl border border-stone-300 px-4 py-2 text-stone-900 outline-none focus:border-orange-500"
                    >
                      {pedidoStatusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => handleStatusSave(pedido._id)}
                      disabled={savingId === pedido._id}
                      className="rounded-full bg-blue-600 px-5 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {savingId === pedido._id ? "Guardando..." : "Actualizar estado"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(pedido._id)}
                      disabled={deletingId === pedido._id}
                      className="rounded-full bg-red-600 px-5 py-2 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingId === pedido._id ? "Eliminando..." : "Eliminar pedido"}
                    </button>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {(pedido.items || []).map((item, index) => (
                    <div
                      key={`${pedido._id}-${item.productId || index}`}
                      className="rounded-3xl border border-stone-200 bg-stone-50 p-4"
                    >
                      <h3 className="text-lg font-bold text-stone-900">
                        {item.nombreProducto}
                      </h3>
                      <p className="mt-2 text-sm text-stone-600">
                        Cantidad: {item.cantidad}
                      </p>
                      <p className="mt-1 text-sm text-stone-600">
                        Precio unitario: ${Number(item.precioUnitario || 0).toFixed(2)}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-orange-600">
                        Subtotal: ${Number(item.subtotal || 0).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

export default PedidosAdminPage;
