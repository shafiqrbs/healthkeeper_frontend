export const getLoggedInUser = () => {
	return JSON.parse(localStorage.getItem("user") || "{}");
};

export const getCoreVendors = () => {
	return JSON.parse(localStorage.getItem("core-vendors") || "[]");
};

export const getCustomers = () => {
	return JSON.parse(localStorage.getItem("core-customers") || "[]");
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
	const day = dob.split("-")[0];
	const month = dob.split("-")[1];
	const year = dob.split("-")[2];
	const birthDate = new Date(year, month - 1, day);
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

export const calculateDetailedAge = (dob) => {
	if (!dob) return { years: 0, months: 0, days: 0 };

	const day = dob.split("-")[0];
	const month = dob.split("-")[1];
	const year = dob.split("-")[2];

	const birthDate = new Date(year, month - 1, day);
	const today = new Date();

	// Calculate years
	let years = today.getFullYear() - birthDate.getFullYear();
	let months = today.getMonth() - birthDate.getMonth();
	let days = today.getDate() - birthDate.getDate();

	// Adjust for negative months or days
	if (days < 0) {
		months--;
		// Get the last day of the previous month
		const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
		days += lastMonth.getDate();
	}

	if (months < 0) {
		years--;
		months += 12;
	}

	return { years, months, days };
};

export const formatDate = (date) => {
	return new Date(date).toLocaleDateString("en-US", {
		year: "numeric",
		month: "numeric",
		day: "numeric",
	});
};

export const formatDateForMySQL = (date) => {
	if (!date) return null;
	try {
		const dateObj = new Date(date);
		if (isNaN(dateObj.getTime())) return null;

		const year = dateObj.getFullYear();
		const month = String(dateObj.getMonth() + 1).padStart(2, "0");
		const day = String(dateObj.getDate()).padStart(2, "0");
		const hours = String(dateObj.getHours()).padStart(2, "0");
		const minutes = String(dateObj.getMinutes()).padStart(2, "0");
		const seconds = String(dateObj.getSeconds()).padStart(2, "0");

		return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
	} catch (error) {
		console.error("Error formatting date:", error);
		return null;
	}
};

export const parseDateValue = (dateString) => {
	if (!dateString) return "";

	// If the value is already a Date object, return it
	if (dateString instanceof Date && !isNaN(dateString)) {
		return dateString;
	}

	try {
		// Try to parse the date string into a Date object
		const date = new Date(dateString);
		return isNaN(date.getTime()) ? "" : date;
	} catch (error) {
		console.error("Error parsing date:", error);
		return "";
	}
};
