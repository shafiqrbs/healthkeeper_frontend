import PatientForm from "../../common/__PatientForm";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { setInsertType } from "@/app/store/core/crudSlice";

export default function Form({ form }) {
	const params = useParams();
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(
			setInsertType({
				insertType: params.id ? "edit" : "create",
				module: "prescription",
			})
		);
	}, [params, dispatch]);

	const handleSubmit = (values) => {
		console.log(values);
	};

	return (
		<>
			<PatientForm form={form} handleSubmit={handleSubmit} canClose={true} />
		</>
	);
}
