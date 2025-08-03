export const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_URL || "http://localhost:8080";
export const API_KEY = import.meta.env.VITE_API_KEY;
export const SUCCESS_NOTIFICATION_COLOR = "#008080";
export const ERROR_NOTIFICATION_COLOR = "#FA5252";

export const DISEASE_PROFILE = ["Diabetic", "Hypertension", "Asthma", "Allergy", "Other"];

export const MODULES = {
	PRODUCTION: "production",
	PROCUREMENT: "procurement",
	INVENTORY: "inventory",
	REPORTING: "reporting",
	VISIT: "visit",
	ADMISSION: "admission",
	EMERGENCY: "emergency",
	PRESCRIPTION: "prescription",
	CUSTOMER: "customer",
	DOMAIN: "domain",
	HOSPITAL_CONFIG: "hospitalConfig",
};

//==================== Module Name ===========

export const MODULE_LABUSESR = "labUser";

// =============== all 64 districts of bangladesh in alphabetical order ================

export const DISTRICT_LIST = [
	"Bagerhat",
	"Bandarban",
	"Barguna",
	"Barisal",
	"Bhola",
	"Bogra",
	"Brahmanbaria",
	"Chandpur",
	"Chapainawabganj",
	"Chittagong",
	"Chuadanga",
	"Comilla",
	"Cox's Bazar",
	"Dhaka",
	"Dinajpur",
	"Faridpur",
	"Feni",
	"Gaibandha",
	"Gazipur",
	"Gopalganj",
	"Habiganj",
	"Jamalpur",
	"Jessore",
	"Jhalokati",
	"Jhenaidah",
	"Joypurhat",
	"Khagrachari",
	"Khulna",
	"Kishoreganj",
	"Kurigram",
	"Kushtia",
	"Lakshmipur",
	"Lalmonirhat",
	"Madaripur",
	"Magura",
	"Manikganj",
	"Meherpur",
	"Moulvibazar",
	"Munshiganj",
	"Mymensingh",
	"Naogaon",
	"Narail",
	"Narayanganj",
	"Narsingdi",
	"Natore",
	"Netrokona",
	"Nilphamari",
	"Noakhali",
	"Pabna",
	"Panchagarh",
	"Patuakhali",
	"Pirojpur",
	"Rajbari",
	"Rajshahi",
	"Rangamati",
	"Rangpur",
	"Satkhira",
	"Shariatpur",
	"Sherpur",
	"Sirajganj",
	"Sunamganj",
	"Sylhet",
	"Tangail",
	"Thakurgaon",
];

export const ADVANCED_FILTER_SEARCH_OPERATOR = {
	INPUT_PARAMETER: {
		equal: "=",
		not_equal: "!=",
		in: "in",
		not_in: "not_in",
		starts_with: "starts_with",
		ends_with: "ends_with",
	},
	SELECT_PARAMETER: { equal: "=", not_equal: "!=", in: "in", not_in: "not_in" },
	DATE_PARAMETER: { equal: "=", not_equal: "!=", in: "in", not_in: "not_in" },
	NUMBER_PARAMETER: { equal: "=", not_equal: "!=", in: "in", not_in: "not_in" },
	TEXT_PARAMETER: { equal: "=", not_equal: "!=", in: "in", not_in: "not_in" },
	BOOLEAN_PARAMETER: { equal: "=", not_equal: "!=", in: "in", not_in: "not_in" },
	ARRAY_PARAMETER: { equal: "=", not_equal: "!=", in: "in", not_in: "not_in" },
	OBJECT_PARAMETER: { equal: "=", not_equal: "!=", in: "in", not_in: "not_in" },
};
