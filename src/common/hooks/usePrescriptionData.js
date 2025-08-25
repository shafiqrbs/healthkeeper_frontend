import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getIndexEntityData } from "@/app/store/core/crudThunk";

const usePrescriptionData = ({ prescriptionId }) => {
	const dispatch = useDispatch();
	const prescriptionData = useSelector((state) => state.crud.prescription.data?.data);

	const fetchData = () => {
		dispatch(
			getIndexEntityData({
				url: `hospital/send-to-prescription/${prescriptionId}`,
				module: "prescription",
			})
		);
	};

	useEffect(() => {
		if (!prescriptionData?.length) {
			fetchData();
		}
	}, [dispatch]);

	return { prescriptionData, fetchData };
};

export default usePrescriptionData;
