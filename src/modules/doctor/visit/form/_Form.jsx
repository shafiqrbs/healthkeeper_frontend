import PatientForm from "./__PatientForm";
import { useForm } from "@mantine/form";
import { getVendorFormInitialValues } from "../helpers/request";
import { useTranslation } from "react-i18next";

export default function Form({ form }) {
	const handleSubmit = (values) => {
		console.log(values);
	};

	return <PatientForm form={form} handleSubmit={handleSubmit} />;
}
