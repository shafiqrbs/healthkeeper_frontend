import { hasLength } from "@mantine/form";

const initialValues = {
	particular_type_master_id: 17,
	patient_mode_id: "",
	gender_mode_id: "",
	payment_mode_id: "",
	room_id: "",
	name: "",
	price: "",
};

export const getInitialValues = (t) => {
	return {
		initialValues,
		validate: {
			name: hasLength({ min: 2}),
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

