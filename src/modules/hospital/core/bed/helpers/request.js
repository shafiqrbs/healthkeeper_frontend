import { hasLength } from "@mantine/form";

const initialValues = {
	particular_type_master_id: 17,
	patient_type_id: "",
	patient_mode_id: "",
	gender_mode_id: "",
	financial_service_id: "",
	payment_mode_id: "",
	room_id: "",
	name: "",
	price: "",
};

export const getInitialValues = (t) => {
	return {
		initialValues,
		validate: {
			name: hasLength({ min: 1}),

			patient_type_id: (value) => {
				if (!value) return t("PatientTypeValidationRequired");
				return null;
			},
			patient_mode_id: (value) => {
				if (!value) return t("PatientModeValidationRequired");
				return null;
			},
			gender_mode_id: (value) => {
				if (!value) return t("GenderModeValidationRequired");
				return null;
			},
			payment_mode_id: (value) => {
				if (!value) return t("PaymentModeValidationRequired");
				return null;
			},
			room_id: (value) => {
				if (!value) return t("RoomNoValidationRequired");
				return null;
			}


		},
	};
};

