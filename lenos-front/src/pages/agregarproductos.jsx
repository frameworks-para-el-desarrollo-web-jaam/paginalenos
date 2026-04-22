import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { createProductRequest } from "../api/products";
import Navbar from "../components/navbar";

function AgregarProductos() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageError("");

    if (!file) {
      setSelectedImage(null);
      setImagePreview(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setImageError("Por favor selecciona un archivo de imagen válido");
      setSelectedImage(null);
      setImagePreview(null);
      e.target.value = "";
      return;
    }

    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!selectedImage) {
        alert("Por favor selecciona una imagen");
        return;
      }

      const formData = new FormData();
      formData.append("nombreProducto", data.nombreProducto);
      formData.append("precio", data.precio);
      formData.append("promocion", data.promocion || "");
      formData.append("descripcion", data.descripcion);
      formData.append("imagen", selectedImage);
      await createProductRequest(formData);
      alert("Producto agregado exitosamente");
      reset();
      setSelectedImage(null);
      setImagePreview(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      const backendMessage = error.response?.data?.message;
      const message = Array.isArray(backendMessage)
        ? backendMessage.join(", ")
        : backendMessage || "Error al agregar producto";
      alert(message);
    }
  });

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Agregar Productos</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Agregar Producto
        </button>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-zinc-800 p-6 rounded shadow-lg max-w-md w-full">
              <h2 className="text-xl font-bold mb-4 text-black">Nuevo Producto</h2>
              <form onSubmit={onSubmit}>
                <div className="mb-4">
                  <label className="block text-black">Nombre del Producto</label>
                  <input
                    type="text"
                    {...register("nombreProducto", { required: true })}
                    className="w-full bg-zinc-500 text-white px-3 py-2 rounded"
                  />
                  {errors.nombreProducto && <p className="text-red-500">Requerido</p>}
                </div>
                <div className="mb-4">
                  <label className="block text-black">Precio</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("precio", { required: true })}
                    className="w-full bg-zinc-500 text-black px-3 py-2 rounded"
                  />
                  {errors.precio && <p className="text-red-500">Requerido</p>}
                </div>
                <div className="mb-4">
                  <label className="block text-black">Promoción</label>
                  <input
                    type="text"
                    {...register("promocion")}
                    className="w-full bg-zinc-500 text-black px-3 py-2 rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-black">Descripción</label>
                  <textarea
                    {...register("descripcion", { required: true })}
                    className="w-full bg-zinc-500 text-black px-3 py-2 rounded"
                  />
                  {errors.descripcion && <p className="text-red-500">Requerido</p>}
                </div>
                <div className="mb-4">
                  <label className="block text-black">Imagen del Producto</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full bg-zinc-500 text-black px-3 py-2 rounded cursor-pointer"
                  />
                  {imageError && <p className="text-red-500 text-sm mt-1">{imageError}</p>}
                  {imagePreview && (
                    <div className="mt-3">
                      <img
                        src={imagePreview}
                        alt="Vista previa"
                        className="w-full h-40 object-cover rounded"
                      />
                    </div>
                  )}
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-500 text-black px-4 py-2 rounded"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-black px-4 py-2 rounded"
                  >
                    Agregar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AgregarProductos;
