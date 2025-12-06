import { useEffect, useState } from "react";
import { getDataWithoutStore } from "@/services/apiService";
import { getLoggedInHospitalUser } from "@utils/index";
import useAppLocalStore from "@hooks/useAppLocalStore";
import { CONFIGURATION_ROUTES } from "@/constants/routes";

export default function useHospitalUserData() {
	const { getLoggedInUser } = useAppLocalStore();
	const [error, setError] = useState(null);
	const [data, setData] = useState(null);
	const user = getLoggedInUser();
	const existHospitalUser = getLoggedInHospitalUser();
	const url = `${CONFIGURATION_ROUTES.API_ROUTES.HOSPITAL_CONFIG.USER_INFO}/${user.id}`;

	const fetchData = async () => {
		setError(null);
		setData(null);
		try {
			if (existHospitalUser?.id) {
				setData(existHospitalUser);
			} else {
				const response = await getDataWithoutStore({ url });
				setData(response);
				localStorage.setItem("hospital-user", JSON.stringify(response.data));
			}
		} catch (error) {
			setError(error);
		}
	};

	const refetch = async () => {
		await fetchData();
	};

	useEffect(() => {
		if (!user?.id) return;
		fetchData();
	}, [user?.id]);

	return { error, userInfo: data, refetch };
}
