import {hasLength, isNotEmpty} from "@mantine/form";

const initialValues = {
	file_type: "",
	file: "",
};

export const getInitialValues = (t) => {
	return {
		initialValues,
		validate: {
			file_type: isNotEmpty(),
			file: isNotEmpty()
		},
	};
};

