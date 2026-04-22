import axios from "axios";
import { API_URL } from "../config/api";

export const getCatalogProductsRequest = () => axios.get(`${API_URL}/catalogo/productos`);

export const getManageProductsRequest = () =>
  axios.get(`${API_URL}/catalogo/productos`, {
    withCredentials: true,
  });

export const createProductRequest = (productData) => {
  // productData puede ser un objeto normal o FormData
  const config = {
    withCredentials: true,
    headers: {
      'Content-Type': productData instanceof FormData ? 'multipart/form-data' : 'application/json'
    }
  };
  return axios.post(`${API_URL}/productos`, productData, config);
};

export const updateProductRequest = (productId, productData) =>
  axios.put(`${API_URL}/productos/${productId}`, productData, {
    withCredentials: true,
    headers: {
      "Content-Type": productData instanceof FormData ? "multipart/form-data" : "application/json",
    },
  });

export const deleteProductRequest = (productId) =>
  axios.delete(`${API_URL}/productos/${productId}`, {
    withCredentials: true,
  });
