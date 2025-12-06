import { API_BASE_URL, API_KEY } from "@/constants";
import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

const useVendorDataStoreIntoLocalStorage = async () => {
	try {
		const user = useAuthStore.getState().user;

		const response = await axios.get(`${API_BASE_URL}/core/vendor/local-storage`, {
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
				"X-Api-Key": API_KEY,
				"X-Api-User": user.id,
			},
		});

		let { data } = response;

		if (data && data.data) {
			localStorage.setItem("core-vendors", JSON.stringify(data.data));
		}
	} catch (error) {
		console.error(error);
	}
};

export default useVendorDataStoreIntoLocalStorage;
