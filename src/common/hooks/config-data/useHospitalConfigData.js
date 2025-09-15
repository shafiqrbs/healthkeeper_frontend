import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getIndexEntityData } from "@/app/store/core/crudThunk";
import { setItemData } from "@/app/store/core/crudSlice";

const localHospitalConfigData = JSON.parse(localStorage.getItem("hospital-config") || "{}");

const useHospitalConfigData = () => {
	const dispatch = useDispatch();
	const hospitalConfigData = useSelector((state) => state.crud.hospitalConfig.data?.data);

	const fetchData = () => {
		// available inside the localstorage then use that
		if (localHospitalConfigData?.id) {
			dispatch(setItemData({ module: "hospitalConfig", data: {data:localHospitalConfigData} }));
		} else {
			// fetch from the server
			dispatch(
				getIndexEntityData({
					url: "hospital/config",
					module: "hospitalConfig",
				})
			);
		}
	};

	useEffect(() => {
		if (!hospitalConfigData?.id) {
			fetchData();
		}
	}, [dispatch]);

	return { hospitalConfigData: hospitalConfigData, fetchData };
};

export default useHospitalConfigData;
