import axios from "axios";
import env from "./env.js";

const fonnte = axios.create({
  baseURL: "https://api.fonnte.com",
  headers: {
    Authorization: env.fonnte.token,
  },
});

export default fonnte;