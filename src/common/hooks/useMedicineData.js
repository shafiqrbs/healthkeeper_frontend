import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getIndexEntityData } from "@/app/store/core/crudThunk";

const useMedicineData = ({ term = "" }) => {
	const dispatch = useDispatch();
	const medicineData = useSelector((state) => state.crud.medicines.data?.data);

	const fetchData = () => {
		dispatch(
			getIndexEntityData({
				url: "hospital/select/medicine",
				module: "medicines",
				params: { term },
			})
		);
	};

	useEffect(() => {
		if (!medicineData?.length) {
			fetchData();
		}
	}, [dispatch]);

	return { medicineData, fetchData };
};

export default useMedicineData;
