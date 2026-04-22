import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import {
  createProductRequest,
  deleteProductRequest,
  getManageProductsRequest,
  updateProductRequest,
} from "../api/products";
import { API_ORIGIN } from "../config/api";

const emptyForm = {
  nombreProducto: "",
  precio: "",
  promocion: "",
  descripcion: "",
};

function GestionarProductos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalMode, setModalMode] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState("");

  const loadProductos = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getManageProductsRequest();
      setProductos(res.data);
    } catch (requestError) {
      console.error(requestError);
      setError("No se pudieron cargar los productos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProductos();
  }, []);

  const resetModalState = () => {
    setModalMode(null);
    setEditingProduct(null);
    setFormData(emptyForm);
    setSelectedImage(null);
    setImagePreview(null);
    setImageError("");
  };

  const openCreateModal = () => {
    setModalMode("create");
    setEditingProduct(null);
    setFormData(emptyForm);
    setSelectedImage(null);
    setImagePreview(null);
    setImageError("");
  };

  const openEditModal = (producto) => {
    setModalMode("edit");
    setEditingProduct(producto);
    setFormData({
      nombreProducto: producto.nombreProducto || "",
      precio: producto.precio ?? "",
      promocion: producto.promocion ?? "",
      descripcion: producto.descripcion || "",
    });
    setSelectedImage(null);
    setImagePreview(producto.imagen ? `${API_ORIGIN}${producto.imagen}` : null);
    setImageError("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImageError("");

    if (!file) {
      setSelectedImage(null);
      setImagePreview(
        modalMode === "edit" && editingProduct?.imagen
          ? `${API_ORIGIN}${editingProduct.imagen}`
          : null
      );
      return;
    }

    if (!file.type.startsWith("image/")) {
      setImageError("Selecciona un archivo de imagen valido");
      setSelectedImage(null);
      event.target.value = "";
      return;
    }

    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = async (productId) => {
    const confirmed = window.confirm("Deseas eliminar este producto?");

    if (!confirmed) {
      return;
    }

    try {
      await deleteProductRequest(productId);
      setProductos((currentProducts) =>
        currentProducts.filter((producto) => producto._id !== productId)
      );
    } catch (requestError) {
      console.error(requestError);
      alert(requestError.response?.data?.message || "No se pudo eliminar el producto");
    }
  };

  const buildProductFormData = () => {
    const productFormData = new FormData();
    productFormData.append("nombreProducto", formData.nombreProducto);
    productFormData.append("precio", formData.precio);
    productFormData.append("promocion", formData.promocion);
    productFormData.append("descripcion", formData.descripcion);

    if (selectedImage) {
      productFormData.append("imagen", selectedImage);
    }

    return productFormData;
  };

  const upsertProductInState = (savedProduct) => {
    setProductos((currentProducts) => {
      const existingIndex = currentProducts.findIndex(
        (producto) => producto._id === savedProduct._id
      );

      if (existingIndex === -1) {
        return [savedProduct, ...currentProducts];
      }

      return currentProducts.map((producto) =>
        producto._id === savedProduct._id ? savedProduct : producto
      );
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (modalMode === "create" && !selectedImage) {
      setImageError("Selecciona una imagen para el producto");
      return;
    }

    try {
      const productFormData = buildProductFormData();
      const res =
        modalMode === "create"
          ? await createProductRequest(productFormData)
          : await updateProductRequest(editingProduct._id, productFormData);

      upsertProductInState(res.data);
      resetModalState();
    } catch (requestError) {
      console.error(requestError);
      const backendMessage = requestError.response?.data?.message;
      const message = Array.isArray(backendMessage)
        ? backendMessage.join(", ")
        : backendMessage || "No se pudo guardar el producto";
      alert(message);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-stone-800">Gestionar Productos</h1>
            <p className="mt-2 text-stone-600">
              Administra los productos existentes desde una sola tabla.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="rounded-full bg-orange-600 px-5 py-3 text-center font-semibold text-white hover:bg-orange-700"
          >
            Nuevo producto
          </button>
        </div>

        {loading && (
          <div className="rounded-2xl bg-white p-6 text-center text-stone-600 shadow-sm">
            Cargando productos...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl bg-red-100 p-6 text-center text-red-700 shadow-sm">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-stone-200">
                <thead className="bg-stone-900 text-left text-sm uppercase tracking-wide text-stone-100">
                  <tr>
                    <th className="px-4 py-3">Producto</th>
                    <th className="px-4 py-3">Imagen</th>
                    <th className="px-4 py-3">Descripcion</th>
                    <th className="px-4 py-3">Precio</th>
                    <th className="px-4 py-3">Promocion</th>
                    <th className="px-4 py-3">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 text-sm text-stone-700">
                  {productos.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-4 py-8 text-center text-stone-500">
                        No hay productos registrados.
                      </td>
                    </tr>
                  )}

                  {productos.map((producto) => (
                    <tr key={producto._id} className="align-top">
                      <td className="px-4 py-4 font-semibold text-stone-800">
                        {producto.nombreProducto}
                      </td>
                      <td className="px-4 py-4">
                        {producto.imagen ? (
                          <img
                            src={`${API_ORIGIN}${producto.imagen}`}
                            alt={producto.nombreProducto}
                            className="h-16 w-16 rounded-lg object-cover"
                          />
                        ) : (
                          <span className="text-stone-400">Sin imagen</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {producto.descripcion || "Sin descripcion"}
                      </td>
                      <td className="px-4 py-4">${Number(producto.precio).toFixed(2)}</td>
                      <td className="px-4 py-4">${Number(producto.promocion).toFixed(2)}</td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(producto)}
                            className="rounded-full bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(producto._id)}
                            className="rounded-full bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-stone-800">
                {modalMode === "create" ? "Nuevo Producto" : "Editar Producto"}
              </h2>
              <button
                type="button"
                onClick={resetModalState}
                className="text-sm font-semibold text-stone-500 hover:text-stone-800"
              >
                Cerrar
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4">
              <div>
                <label className="mb-2 block font-medium text-black">
                  Nombre del producto
                </label>
                <input
                  type="text"
                  name="nombreProducto"
                  value={formData.nombreProducto}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-stone-300 px-4 py-3 text-stone-900 outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block font-medium text-black">Precio</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="precio"
                    value={formData.precio}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-stone-300 px-4 py-3 text-stone-900 outline-none focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block font-medium text-black">Promocion</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="promocion"
                    value={formData.promocion}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-stone-300 px-4 py-3 text-stone-900 outline-none focus:border-orange-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block font-medium text-black">Descripcion</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  rows="4"
                  className="w-full rounded-xl border border-stone-300 px-4 py-3 text-stone-900 outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-black">
                  Imagen del producto
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full rounded-xl border border-stone-300 px-4 py-3 text-stone-900 outline-none focus:border-orange-500"
                />
                {imageError && <p className="mt-2 text-sm text-red-600">{imageError}</p>}
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Vista previa del producto"
                    className="mt-3 h-40 w-full rounded-xl object-cover"
                  />
                )}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={resetModalState}
                  className="rounded-full bg-stone-200 px-5 py-2 font-semibold text-stone-700 hover:bg-stone-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-orange-600 px-5 py-2 font-semibold text-white hover:bg-orange-700"
                >
                  {modalMode === "create" ? "Agregar producto" : "Guardar cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestionarProductos;
