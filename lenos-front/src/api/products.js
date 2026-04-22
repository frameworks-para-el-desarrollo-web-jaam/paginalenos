import axios from "axios";
import { API_URL } from "../config/api";

export const getCatalogProductsRequest = () => axios.get(`${API_URL}/catalogo-productos`);

export const getManageProductsRequest = () =>
  axios.get(`${API_URL}/productos`, {
    withCredentials: true,
  });

export const createProductRequest = (productData) => {
  const config = {
    withCredentials: true,
  };

  if (!(productData instanceof FormData)) {
    config.headers = {
      "Content-Type": "application/json",
    };
  }

  return axios.post(`${API_URL}/productos`, productData, config);
};

export const updateProductRequest = (productId, productData) =>
  axios.put(
    `${API_URL}/productos/${productId}`,
    productData,
    productData instanceof FormData
      ? {
          withCredentials: true,
        }
      : {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        },
  );

export const deleteProductRequest = (productId) =>
  axios.delete(`${API_URL}/productos/${productId}`, {
    withCredentials: true,
  });
