import { API_BASE_URL, API_KEY } from "@/constants";
import axios from "axios";

const useCommonDataStoreIntoLocalStorage = async (user_id) => {
	const apiEndpoints = [
		{ url: "inventory/config", key: "config-data" },
		{ url: "inventory/stock-item", key: "core-products" },
		{ url: "core/customer/local-storage", key: "core-customers" },
		{ url: "core/vendor/local-storage", key: "core-vendors" },
		{ url: "core/user/local-storage", key: "core-users" },
		{ url: "accounting/transaction-mode/local-storage", key: "accounting-transaction-mode" },
		{ url: "hospital/select/mode?dropdown-type=operation", key: "particularMode" },
	];

	await Promise.all(
		apiEndpoints.map(async ({ url, key }) => {
			try {
				const response = await axios.get(`${API_BASE_URL}/${url}`, {
					headers: {
						Accept: `application/json`,
						"Content-Type": `application/json`,
						"Access-Control-Allow-Origin": "*",
						"X-Api-Key": API_KEY,
						"X-Api-User": user_id,
					},
				});

				if (response.data?.data) {
					localStorage.setItem(key, JSON.stringify(response.data.data));
				}
			} catch (error) {
				console.error(error);
			}
		})
	);
};

export default useCommonDataStoreIntoLocalStorage;
