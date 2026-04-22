import axios from "axios";
import { API_URL } from "../config/api";

export const createPedidoRequest = (pedidoData) =>
  axios.post(`${API_URL}/pedidos`, pedidoData, {
    withCredentials: true,
  });

export const getPedidosRequest = () =>
  axios.get(`${API_URL}/pedidos`, {
    withCredentials: true,
  });

export const updatePedidoRequest = (pedidoId, pedidoData) =>
  axios.put(`${API_URL}/pedidos/${pedidoId}`, pedidoData, {
    withCredentials: true,
  });

export const deletePedidoRequest = (pedidoId) =>
  axios.delete(`${API_URL}/pedidos/${pedidoId}`, {
    withCredentials: true,
  });
