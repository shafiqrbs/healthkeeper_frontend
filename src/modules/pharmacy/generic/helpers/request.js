import { hasLength } from "@mantine/form";

const initialValues = {
	category_id: "",
	name: "",
	opd_quantity:"",
	medicine_dosage_id:"",
	medicine_bymeal_id:"",
};

export const getInitialValues = (t) => {
	return {
		initialValues,
		validate: {
			category_id: (value) => {
				if (!Number(value)) return t("CategoryIsRequired");
					return null;
				},
			name: (value) => {
				if (!value) return t("NameIsRequired");
					return null;
				},
		},
	};
};
