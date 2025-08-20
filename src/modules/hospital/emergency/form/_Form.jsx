import { notifications } from "@mantine/notifications";
import EmergencyPatientForm from "../../common/__EmergencyPatientForm";
import { useEffect } from "react";

export default function _Form({ form }) {
	useEffect(() => {
		if (Object.keys(form.errors)?.length > 0 && form.isDirty()) {
			notifications.show({
				title: "Error",
				message: "Please fill all the fields",
				color: "red",
				position: "top-right",
			});
		}
	}, [form]);

	const handleSubmit = (values) => {
		console.log(values);
	};

	return <EmergencyPatientForm form={form} handleSubmit={handleSubmit} />;
}
