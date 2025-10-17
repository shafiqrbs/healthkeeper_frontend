import { hasLength } from "@mantine/form";

const initialValues = {
	medicine_id: "",
	quantity: "",
	expected_date: "",
};

export const getInitialValues = (t) => {
	return {
		initialValues,
		validate: {
			medicine_id: (value) => {
				if (!value) return t("MedicineValidationRequired");
				return null;
			},
			quantity: (value) => {
				if (!value) return t("QuantityValidationRequired");
				return null;
			},
			expected_date: (value) => {
				if (!value) return t("ExpectedDateValidationRequired");
				return null;
			},
		},
	};
};
