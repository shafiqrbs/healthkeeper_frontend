import { hasLength } from "@mantine/form";

const initialValues = {
	vendor: "",
};

export const getInitialValues = (t) => {
	return {
		initialValues,
		validate: {
			vendor: (value) => {
				if (!value) return t("VendorValidationRequired");
				return null;
			}

		},
	};
};


const initialAddItemValues = {
	name: "",
};

export const getInitialAddItem = (t) => {
	return {
		initialAddItemValues,
		validate: {
			name: hasLength({ min: 1, max: 200 }),
		},
	};
};
