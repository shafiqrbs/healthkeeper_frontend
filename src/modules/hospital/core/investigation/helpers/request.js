import { hasLength } from "@mantine/form";

const initialValues = {
	particular_type_master_id: 9,
	category_id: "",
	diagnostic_department_id: "",
	diagnostic_room_id: "",
	name: "",
	specimen: "",
	price: "",
};

export const getInitialValues = (t) => {
	return {
		initialValues,
		validate: {
			category_id: (value) => {
				if (!value) return t("NameValidationRequired");
				return null;
			},
			diagnostic_department_id: (value) => {
				if (!value) return t("NameValidationRequired");
				return null;
			},
			diagnostic_room_id: (value) => {
				if (!value) return t("NameValidationRequired");
				return null;
			},
			name: hasLength({ min: 1 }),
		},
	};
};

const initialReportValues = {
	parent_id: "",
	name: "",
	sample_value: "",
	reference_value: "",
	unit_name: "",
};

export const getInitialReportValues = () => {
	return {
		initialReportValues,
		validate: {
			name: hasLength({ min: 1 }),
		},
	};
};
