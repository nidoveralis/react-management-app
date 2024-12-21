import axios from "axios";

const BASE_URL = 'https://reqres.in/api';
const headers = {
  "Content-Type": "multipart/form-data",
};

export const getUsers = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/users`, {
      headers
    });
    return response.data;
  } catch (err) {
    console.log(err);
  }
};