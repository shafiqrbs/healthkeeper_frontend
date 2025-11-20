export const getLoggedInUser = () => {
	return JSON.parse(localStorage.getItem("user") || "{}");
};
export const getLoggedInHospitalUser = () => {
	return JSON.parse(localStorage.getItem("hospital-user") || "{}");
};

export const getCoreVendors = () => {
	return JSON.parse(localStorage.getItem("core-vendors") || "[]");
};

export const getCustomers = () => {
	return JSON.parse(localStorage.getItem("core-customers") || "[]");
};

export const formatDOB = (dob) => {
	try {
		if (!dob) return "";
		return new Date(dob)
			.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })
			.replace(/\//g, "-");
	} catch (err) {
		console.error(err);
		return "";
	}
};



export function capitalizeWords(text) {
	if (!text) return "";
	return text
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(" ");
}

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
	const [day, month, year] = dob.split("-").map(Number);

	const birthDate = new Date(year, month - 1, day);
	const isValid =
		birthDate.getFullYear() === year && birthDate.getMonth() === month - 1 && birthDate.getDate() === day;

	if (!isValid) return { years: 0, months: 0, days: 0 };

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
	if (!date) return null;
	const d = new Date(date);
	const day = String(d.getDate()).padStart(2, "0");
	const month = String(d.getMonth() + 1).padStart(2, "0"); // months are 0-based
	const year = d.getFullYear();
	return `${day}-${month}-${year}`;
};

export const formatDateTime = (date) => {
	if (!date) return null;
	const d = new Date(date);
	const day = String(d.getDate()).padStart(2, "0");
	const month = String(d.getMonth() + 1).padStart(2, "0"); // months are 0-based
	const year = d.getFullYear();
	const hours = String(d.getHours()).padStart(2, "0");
	const minutes = String(d.getMinutes()).padStart(2, "0");
	const seconds = String(d.getSeconds()).padStart(2, "0");
	return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};

export const formatDateTimeAmPm = (date) => {
	if (!date) return null;

	const d = new Date(date);
	const day = String(d.getDate()).padStart(2, "0");
	const month = String(d.getMonth() + 1).padStart(2, "0");
	const year = d.getFullYear();

	let hours = d.getHours();
	const minutes = String(d.getMinutes()).padStart(2, "0");

	const ampm = hours >= 12 ? "PM" : "AM";
	hours = hours % 12 || 12; // convert to 12-hour format
	hours = String(hours).padStart(2, "0");

	return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
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

export const formatUnixToAmPm = (unix) => {
	if (!unix) return "";

	const d = new Date(unix * 1000); // convert seconds → milliseconds

	const day = String(d.getDate()).padStart(2, "0");
	const month = String(d.getMonth() + 1).padStart(2, "0");
	const year = d.getFullYear();

	let hours = d.getHours();
	const minutes = String(d.getMinutes()).padStart(2, "0");

	const ampm = hours >= 12 ? "PM" : "AM";
	hours = hours % 12 || 12;
	hours = String(hours).padStart(2, "0");

	return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
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


export const capitalize = (text) => {
	if (!text) return "";
	return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const waitForDataAndPrint = (ref, printFun, maxAttempts = 50, currentAttempt = 0) => {
	console.log(`waitForDataAndPrint called with ref:`, ref, `attempt: ${currentAttempt}/${maxAttempts}`);

	// Prevent infinite waiting
	if (currentAttempt >= maxAttempts) {
		console.error("Max attempts reached, giving up on print");
		return;
	}

	// If ref is null, wait a bit more for the component to mount
	if (!ref?.current) {
		console.log("Ref is null, waiting for component to mount...");
		setTimeout(() => waitForDataAndPrint(ref, printFun, maxAttempts, currentAttempt + 1), 100);
		return;
	}

	// If component is ready, print
	if (ref.current.isReady) {
		console.log("Component is ready, printing...");
		printFun();
	} else if (ref.current.isLoading) {
		console.log("Component is still loading, waiting...");
		setTimeout(() => waitForDataAndPrint(ref, printFun, maxAttempts, currentAttempt + 1), 100);
	} else {
		console.log("Component not ready and not loading, retrying...");
		setTimeout(() => waitForDataAndPrint(ref, printFun, maxAttempts, currentAttempt + 1), 200);
	}
};

export const isEmpty = (v) => v === "" || v === null || v === undefined;
