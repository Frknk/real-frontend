import axios from "axios";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
//axios.defaults.baseURL = "http://localhost:8000";
if (typeof window !== 'undefined' && localStorage.getItem('token')) {
    axios.defaults.headers.common = {'Authorization': `bearer ${localStorage.getItem('token')}`};
}
//axios.defaults.headers.common = {'Authorization': `bearer ${localStorage.getItem('token')}`};

export default axios;