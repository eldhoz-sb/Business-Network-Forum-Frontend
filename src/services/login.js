import axios from "axios";
const baseUrl = `${import.meta.env.VITE_LOCAL_API_URL}/api/login`

const login = async credentials => {
    const response = await axios.post(baseUrl, credentials)
    return response.data
}


export default { login }