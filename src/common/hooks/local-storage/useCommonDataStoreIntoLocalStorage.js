import { API_BASE_URL, API_KEY } from "@/constants";
import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore.js";
import { encryptData } from "@utils/crypto.js";

const useCommonDataStoreIntoLocalStorage = async (user_id) => {
	const apiEndpoints = [
		{ url: "hospital/select/mode?dropdown-type=operation", key: "particularMode" },
		{ url: "hospital/config", key: "hospital-config" },
	];

	await Promise.all(
		apiEndpoints.map(async ({ url, key }) => {
			try {
				const token = useAuthStore.getState().token;
				const response = await axios.get(`${API_BASE_URL}/${url}`, {
					headers: {
						Accept: `application/json`,
						"Content-Type": `application/json`,
						"Access-Control-Allow-Origin": "*",
						"X-Api-Key": API_KEY,
						"X-Api-User": user_id,
						Authorization: `Bearer ${token}`,
					},
				});

				// REMOVE WHEN JWT ACTIVE
				if (response.data?.data) {
					localStorage.setItem(key, JSON.stringify(response.data.data));
				}

				// FOR JWT
				/*if (response.data?.data) {
                    const encryptedData = encryptData(response.data.data);
                    localStorage.setItem(key, encryptedData);
                }*/
			} catch (error) {
				console.error(error);
			}
		})
	);
};

export default useCommonDataStoreIntoLocalStorage;
