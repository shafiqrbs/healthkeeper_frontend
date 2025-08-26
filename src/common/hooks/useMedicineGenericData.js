import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getIndexEntityData } from "@/app/store/core/crudThunk";

const useMedicineGenericData = ({ term = "" }) => {
	const dispatch = useDispatch();
	const medicineGenericData = useSelector((state) => state.crud.medicineGeneric.data?.data);

	const fetchData = () => {
		dispatch(
			getIndexEntityData({
				url: "hospital/select/medicine-generic",
				module: "medicineGeneric",
				params: { term },
			})
		);
	};

	useEffect(() => {
		fetchData();
	}, [term]);

	return { medicineGenericData, fetchData };
};

export default useMedicineGenericData;
