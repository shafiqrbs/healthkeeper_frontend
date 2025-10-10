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
	USER: "user",
	SETTING: "setting",
	STORE: "store",
	LAB_TEST: "labTest",
	BILLING: "billing",
};

export const MODULES_CORE = {
	OPD_ROOM: "opd_room",
	INVESTIGATION: "investigation",
	BED: "bed",
	ADVICE: "advice",
	TREATMENT_TEMPLATES: "treatment",
	CABIN: "cabin",
	DOCTOR: "doctor",
	NURSE: "nurse",
	LAB_USER: "lab_user",
	STAFF: "staff",
	DOSAGE: "dosage",
	PARTICULAR: "particular",
	CATEGORY: "category",
	PARTICULAR_MODE: "particular_mode",
	PARTICULAR_TYPE: "particular_type",
	PARTICULAR_MATRIX: "particular_matrix",
	DASHBOARD_DAILY_SUMMARY: "dashboardDailySummary",
};

export const MODULES_PHARMACY = {
	MEDICINE: "medicine",
	STOCK: "stock",
	REQUISTION: "requisition",
	WORKORDER: "workorder",
	STORE_REQUISTION: "store_requisition",
	STORE_ISSUE: "store_issue",
	ORDER_ISSUE: "order_issue",
	SHOP: "shop",
	DAMAGE: "damage",
	STORE_TRANSFER: "store_transfer",
	STORE: "store",
};

export const DATA_TYPES = [
	"Input",
	"Select",
	"Searchable",
	"Autocomplete",
	"LabelInput",
	"Checkbox",
	"RadioButton",
	"Textarea",
	"InputWithCheckbox",
];

export const DURATION_TYPES = ["Day", "Week", "Month", "Year"];

//==================== Module Name ===========

export const MODULE_LABUSESR = "labUser";
export const MODULE_PARTICULAR = "particular";

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
