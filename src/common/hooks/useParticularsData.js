import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getIndexEntityData } from "@/app/store/core/crudThunk";

const useParticularsData = () => {
	const dispatch = useDispatch();
	const particularsData = useSelector((state) => state.crud.particularList.data?.data);

	const fetchData = () => {
		dispatch(
			getIndexEntityData({
				url: "hospital/select/particulars",
				module: "particularList",
			})
		);
	};

	useEffect(() => {
		if (!particularsData?.length) {
			fetchData();
		}
	}, [dispatch]);

	return { particularsData, fetchData };
};

export default useParticularsData;
