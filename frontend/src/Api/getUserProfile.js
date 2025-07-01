import axios from 'axios';
const getUserProfile = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
        throw new Error("No token found. Please log in.");
    }
    try {
        const response = await axios.get("http://localhost:5000/api/user/profile", {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        let errorMessage = "An error occurred";
        if (error.response) {
            errorMessage = `Server Error (${error.response.status}): ${error.response.data?.message || error.message}`;
        } else if (error.request) {
            errorMessage = "No response from server. Please check your connection.";
        } else {
            errorMessage = `Error: ${error.message}`;
        }
        throw new Error(errorMessage);
    }
};
export default getUserProfile;