import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getIndexEntityData } from "@/app/store/core/crudThunk";

const useDoaminHospitalConfigData = () => {
	const dispatch = useDispatch();
	const hospitalConfigData = useSelector((state) => state.crud.hospitalConfig.data?.data);

	const fetchData = () => {
		dispatch(
			getIndexEntityData({
				url: "hospital/config",
				module: "hospitalConfig",
			})
		);
	};

	useEffect(() => {
		if (!hospitalConfigData?.id) {
			fetchData();
		}
	}, [dispatch]);

	return { hospitalConfigData: hospitalConfigData, fetchData };
};

export default useDoaminHospitalConfigData;
