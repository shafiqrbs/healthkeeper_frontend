import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getIndexEntityData } from "@/app/store/core/crudThunk";

const useParticularsData = ({ modeName }) => {
	const dispatch = useDispatch();
	const particularsData = useSelector((state) => state.crud.particularList.data?.data);
	const dataByMode = particularsData?.entities?.filter((item) => item.mode_name === modeName);

	const fetchData = () => {
		dispatch(
			getIndexEntityData({
				url: "hospital/setting/matrix",
				module: "particularList",
			})
		);
	};

	useEffect(() => {
		if (!particularsData?.length) {
			fetchData();
		}
	}, [dispatch]);

	return { particularsData: dataByMode, fetchData };
};

export default useParticularsData;
