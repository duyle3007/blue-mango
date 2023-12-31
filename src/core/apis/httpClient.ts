import axios from "axios";

const httpClient = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
});

export default httpClient;
