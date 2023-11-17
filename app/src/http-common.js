import axios from "axios";

const token = localStorage.getItem('token')

export default axios.create({
  baseURL: `${process.env.VUE_APP_API_URL}api/`,
  headers: {
    "Content-type": "application/json",
    'x-access-token': token
  }
});