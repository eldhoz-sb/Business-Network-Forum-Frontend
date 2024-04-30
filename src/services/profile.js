import axios from "axios";
const baseUrl = `${import.meta.env.VITE_BACKEND_API_URL}/api/members`

const registration = async credentials => {
    const response = await axios.post(baseUrl, credentials,{
        headers: {
            "Content-Type": "application/json",
        },
        withCredentials: true,
    })
    return response
  }



export default { registration }