import axios from "axios";

const API_URL = "http://localhost:5200/api/Favroit";

export const addFavorite = async (userId, itemId) => {
  return await axios.post(`${API_URL}/add`, { userId, itemId });
};

export const removeFavorite = async (userId, itemId) => {
  return await axios.post(`${API_URL}/remove`, { userId, itemId });
};

export const getFavorites = async (userId) => {
  const response = await axios.get(`${API_URL}/${userId}`);
  return response.data;
};
