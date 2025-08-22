import { isNotEmpty } from "@mantine/form";

const initialValues = {
	employee_group_id: "",
	department_id: "",
	employee_id: "",
	name: "",
	gender: "",
	designation_id: "",
	dob: "",
	mobile: "",
	email: "",
	address: "",
	username: "",
	password: "",
	confirm_password: "",
};

export const getUserFormValues = (t) => {
	return {
		initialValues,

		validate: {
			employee_group_id: (value) => {
				if (!value) return t("ChooseEmployeeGroup");
			},
			name: (value) => {
				if (!value) return t("NameRequiredMessage");
				if (value.length < 2) return t("NameLengthMessage");
				return null;
			},
			username: (value) => {
				if (!value) return t("UserNameRequiredMessage");
				if (value.length < 2 || value.length > 20) return t("NameLengthMessage");
				if (/[A-Z]/.test(value)) return t("NoUppercaseAllowedMessage");
				return null;
			},
			email: (value) => {
				if (!value) return t("EnterEmail");
				const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				if (!emailRegex.test(value)) return t("EmailValidationInvalid");

				return null;
			},
			mobile: (value) => {
				if (!value) return t("MobileValidationRequired");
				return null;
			},
			password: (value) => {
				if (!value) return t("PasswordRequiredMessage");
				if (value.length < 6) return t("PasswordValidateMessage");
				return null;
			},
			confirm_password: (value, values) => {
				if (values.password && value !== values.password) return t("PasswordNotMatch");
				return null;
			},
		},
	};
};

const editInitialData = (entityEditData) => {
	return {
		employee_group_id: entityEditData?.employee_group_id || "",
		name: entityEditData?.name || "",
		username: entityEditData?.username || "",
		email: entityEditData?.email || "",
		mobile: entityEditData?.mobile || "",
		enabled: entityEditData?.enabled || 0,
		alternative_email: entityEditData?.alternative_email || null,
		designation_id: entityEditData?.designation_id || null,
		department_id: entityEditData?.department_id || null,
		location_id: entityEditData?.location_id || null,
		address: entityEditData?.address || null,
		about_me: entityEditData?.about_me || null,
	};
};

export const getUserEditFormData = (entityEditData, t) => {
	return {
		initialValues: editInitialData(entityEditData),
		validate: {
			employee_group_id: isNotEmpty(),
			name: (value) => {
				if (!value) return t("NameRequiredMessage");
				if (value.length < 2) return t("NameLengthMessage");
				return null;
			},
			username: (value) => {
				if (!value) return t("UserNameRequiredMessage");
				if (value.length < 2 || value.length > 20) return t("NameLengthMessage");
				return null;
			},
			email: (value) => {
				if (!value) return true;

				const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				if (!emailRegex.test(value)) return t("EmailValidationInvalid");

				return null;
			},
			mobile: (value) => {
				if (!value) return t("MobileValidationRequired");
				return null;
			},
			password: (value) => {
				if (value && value.length < 6) return "Password must be at least 6 characters long";
				return null;
			},
			confirm_password: (value, values) => {
				if (values.password && !value) return "Confirm password is required";
				if (values.password && value !== values.password) return "Passwords do not match";
				return null;
			},
		},
	};
};
