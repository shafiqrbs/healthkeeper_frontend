const initialValues = {
	name: "",
	username: "",
	email: "",
	password: "",
	confirm_password: "",
	mobile: "",
	employee_group_id: "",
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
