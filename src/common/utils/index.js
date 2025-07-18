export const getLoggedInUser = () => {
	return JSON.parse(localStorage.getItem("user") || "{}");
};

export const getCoreVendors = () => {
	return JSON.parse(localStorage.getItem("core-vendors") || "[]");
};

export const getUserRole = () => {
	try {
		const parsedUser = getLoggedInUser();

		if (!parsedUser.access_control_role) return [];

		if (Array.isArray(parsedUser.access_control_role)) {
			return parsedUser.access_control_role;
		}

		if (typeof parsedUser.access_control_role === "string") {
			try {
				if (parsedUser.access_control_role.trim() === "") return [];
				return JSON.parse(parsedUser.access_control_role);
			} catch (error) {
				console.error("Error parsing access_control_role:", error);
				return [];
			}
		}

		return [];
	} catch (error) {
		console.error("Error parsing user data from localStorage:", error);
		return [];
	}
};

export const calculateAge = (dob, type) => {
	if (!dob) return "";
	const birthDate = new Date(dob);
	const today = new Date();
	let value = 0;
	if (type === "year") {
		value = today.getFullYear() - birthDate.getFullYear();
		const m = today.getMonth() - birthDate.getMonth();
		if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
			value--;
		}
	} else if (type === "month") {
		value = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());
		if (today.getDate() < birthDate.getDate()) {
			value--;
		}
	} else if (type === "day") {
		const diff = today.getTime() - birthDate.getTime();
		value = Math.floor(diff / (1000 * 60 * 60 * 24));
	}
	return value;
};
