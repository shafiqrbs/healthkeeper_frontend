import { hasLength } from "@mantine/form";

const initialValues = {
	particular_type_master_id: 18,
	patient_type_id: "",
	payment_mode_id: "",
	financial_service_id: "",
	gender_mode_id: "",
	cabin_mode_id: "",
	name: "",
	price: "",
};

export const getInitialValues = (t) => {
	return {
		initialValues,
		validate: {
			name: hasLength({ min: 1}),

			/*financial_service_id: (value) => {
				if (!value) return t("FinancialServiceValidationRequired");
				return null;
			},*/
			patient_type_id: (value) => {
				if (!value) return t("PatientTypeValidationRequired");
				return null;
			},
			payment_mode_id: (value) => {
				if (!value) return t("PaymentModeValidationRequired");
				return null;
			},
			cabin_mode_id: (value) => {
				if (!value) return t("CabinModeValidationRequired");
				return null;
			}

		},
	};
};

