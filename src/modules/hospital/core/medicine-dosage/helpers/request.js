import { hasLength } from "@mantine/form";

const initialValues = {
	mode: "",
	continue_mode: "",
	name: "",
	name_bn: "",
	dosage_form: "",
	quantity: "",
	instruction: "",
	duration: "",
	duration_mode: "",
};

export const getInitialValues = (t) => {
	return {
		initialValues,
		validate: {
			mode: (value) => {
				if (!value) return t("ModeTypeValidationRequired");
				return null;
			},
			name: hasLength({ min: 1}),
			name_bn: hasLength({ min: 1 }),
		},
	};
};
