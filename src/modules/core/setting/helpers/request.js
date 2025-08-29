import { hasLength } from "@mantine/form";

const initialValues = {
	setting_type_id: '',
	name: "",
};

export const getInitialValues = (t) => {
	return {
		initialValues,
		validate: {
			name: hasLength({ min: 2}),
			setting_type_id: (value) => {
				if (!value) return t("SettingTypeValidationRequired");
				return null;
			}

		},
	};
};

