import EmergencyPatientForm from "../../common/__EmergencyPatientForm";
import { useTranslation } from "react-i18next";
import { useForm } from "@mantine/form";
import { getVendorFormInitialValues } from "../helpers/request";

export default function _Form({ module }) {
	const { t } = useTranslation();
	const form = useForm(getVendorFormInitialValues(t));

	return <EmergencyPatientForm form={form} module={module} />;
}
