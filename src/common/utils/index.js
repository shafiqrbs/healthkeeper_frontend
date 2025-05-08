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
