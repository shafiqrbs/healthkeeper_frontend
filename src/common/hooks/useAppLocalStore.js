import { useMemo } from "react";
import { useAuthStore } from "@/store/useAuthStore";

const HOOK_NAME = "useAppLocalStore";

// Prevent duplicate warnings
const missingPathWarnings = new Set();

/**
 * Logs a warning in dev mode when a path is missing.
 * @param {string} path
 */
function warnMissingPath(path) {
	if (import.meta.env.VITE_ENVIRONMENT !== "development") return;

	const key = `${HOOK_NAME}:${path}`;
	if (missingPathWarnings.has(key)) return;
	missingPathWarnings.add(key);

	console.warn(`[${HOOK_NAME}] Missing key at path: "${path}"`);
}

/**
 * Safely retrieves a nested property using dot notation.
 * @param {Object} root
 * @param {string} path
 * @param {*} fallback
 */
function safeGet(root, path, fallback) {
	if (!root || typeof root !== "object") {
		warnMissingPath(path);
		return fallback;
	}

	let current = root;

	for (const segment of path.split(".")) {
		if (current == null || typeof current !== "object" || !Object.prototype.hasOwnProperty.call(current, segment)) {
			warnMissingPath(path);
			return fallback;
		}
		current = current[segment];
	}

	return current === undefined ? fallback : current;
}

/* --------------------------------------------------------------------------
   TYPE DEFINITIONS (FOR AUTOCOMPLETE)
-------------------------------------------------------------------------- */

/**
 * @typedef {Object} ParticularModules
 * @property {Object|null} bedMode
 * @property {Object|null} bloodGroup
 * @property {Object|null} cabinMode
 * @property {Object|null} department
 * @property {Object|null} diagnosticDepartment
 * @property {Object|null} diagnosticRoom
 * @property {Object|null} gender
 * @property {Object|null} investigationGroup
 * @property {Object|null} labReportMode
 * @property {Object|null} medicineDuration
 * @property {Object|null} medicineGroup
 * @property {Object|null} operation
 * @property {Object|null} patientDiseases
 * @property {Object|null} patientMode
 * @property {Object|null} patientType
 * @property {Object|null} payingMode
 * @property {Object|null} prescriptionTemplate
 * @property {Object|null} print
 * @property {Object|null} treatmentModes
 * @property {Object|null} unitGroup
 *
 */

/**
 * @typedef {Object} AppLocalStore
 *
 * @property {Object|null} user Logged-in user object
 * @property {string|null} token JWT token
 * @property {Object|null} warehouse Warehouse data
 * @property {Array<string>} userRoles Parsed userRoles list
 *
 * @property {Object|null} hospitalConfig Full hospital config
 * @property {Object|null} coreConfig Main hospital info section
 *
 * @property {Array<Object>} departments
 * @property {Array<Object>} religions
 * @property {Array<Object>} advices
 * @property {Array<Object>} designations
 * @property {Array<Object>} particularModes
 * @property {Array<Object>} meals
 * @property {Array<Object>} dosages
 * @property {Array<Object>} opdReferredRooms
 * @property {Array<Object>} patients
 * @property {Array<Object>} medicines
 * @property {Array<Object>} localMedicines
 *
 * @property {Object} modules Raw particularModules object
 * @property {ParticularModules} features Flattened features structure {bedMode, bloodGroup etc}
 *
 * @property {Object|null} particularMatrix
 */

/* --------------------------------------------------------------------------
   MAIN HOOK
-------------------------------------------------------------------------- */

/**
 * Provides a memoized object containing all auth + hospital config data.
 * @returns {AppLocalStore}
 */
export default function useAppLocalStore() {
	const authStorage = useAuthStore((state) => state);

	const store = useMemo(() => {
		/* ---------------- Basic Fields ---------------- */

		const user = authStorage?.user ?? {};
		const token = authStorage?.token ?? null;
		const warehouse = authStorage?.warehouse ?? null;

		/* ---------------- Roles ---------------- */

		let userRoles = [];
		const rawRoles = user?.access_control_role;

		if (Array.isArray(rawRoles)) userRoles = rawRoles;
		else if (typeof rawRoles === "string") {
			try {
				if (rawRoles.trim() !== "") userRoles = JSON.parse(rawRoles);
			} catch {
				console.error("Error parsing access_control_role");
			}
		}

		/* ---------------- Build Final Store Object ---------------- */

		return {
			user,
			token,
			warehouse,
			userRoles,

			/** Root configs */
			hospitalConfig: safeGet(authStorage, "hospitalConfig", null),
			coreConfig: safeGet(authStorage, "hospitalConfig.config", null),

			/** Lists */
			departments: safeGet(authStorage, "hospitalConfig.departments", []),
			religions: safeGet(authStorage, "hospitalConfig.religions", []),
			advices: safeGet(authStorage, "hospitalConfig.advices", []),
			designations: safeGet(authStorage, "hospitalConfig.designations", []),
			particularModes: safeGet(authStorage, "hospitalConfig.particularModes", []),
			meals: safeGet(authStorage, "hospitalConfig.byMeals", []),
			dosages: safeGet(authStorage, "hospitalConfig.dosages", []),
			opdReferredRooms: safeGet(authStorage, "hospitalConfig.opdReferredRooms", []),
			patients: safeGet(authStorage, "hospitalConfig.patients", []),
			medicines: safeGet(authStorage, "hospitalConfig.medicines", []),
			localMedicines: safeGet(authStorage, "hospitalConfig.localMedicines", []),
			/** Raw modules */
			modules: safeGet(authStorage, "hospitalConfig.particularModules", {}),

			/** Flattened structured module list (editor-friendly) */
			features: {
				bedMode: safeGet(authStorage, "hospitalConfig.particularModules.bed-mode", null),
				bloodGroup: safeGet(authStorage, "hospitalConfig.particularModules.blood-group", null),
				cabinMode: safeGet(authStorage, "hospitalConfig.particularModules.cabin-mode", null),
				department: safeGet(authStorage, "hospitalConfig.particularModules.department", null),
				diagnosticDepartment: safeGet(
					authStorage,
					"hospitalConfig.particularModules.diagnostic-department",
					null
				),
				diagnosticRoom: safeGet(authStorage, "hospitalConfig.particularModules.diagnostic-room", null),
				gender: safeGet(authStorage, "hospitalConfig.particularModules.gender-mode", null),
				investigationGroup: safeGet(authStorage, "hospitalConfig.particularModules.investigation-group", null),
				labReportMode: safeGet(authStorage, "hospitalConfig.particularModules.lab-report-mode", null),
				medicineDuration: safeGet(authStorage, "hospitalConfig.particularModules.medicine-duration-mode", null),
				medicineGroup: safeGet(authStorage, "hospitalConfig.particularModules.medicine-group", null),
				operation: safeGet(authStorage, "hospitalConfig.particularModules.operation", null),
				patientDiseases: safeGet(authStorage, "hospitalConfig.particularModules.patient-diseases-mode", null),
				patientMode: safeGet(authStorage, "hospitalConfig.particularModules.patient-mode", null),
				patientType: safeGet(authStorage, "hospitalConfig.particularModules.patient-type", null),
				payingMode: safeGet(authStorage, "hospitalConfig.particularModules.paying-mode", null),
				prescriptionTemplate: safeGet(
					authStorage,
					"hospitalConfig.particularModules.prescription-template",
					null
				),
				print: safeGet(authStorage, "hospitalConfig.particularModules.print", null),
				treatmentModes: safeGet(authStorage, "hospitalConfig.particularModules.treatment-mode", null),
				unitGroup: safeGet(authStorage, "hospitalConfig.particularModules.unit-group", null),
			},

			/** Matrix */
			particularMatrix: safeGet(authStorage, "hospitalConfig.particularMatrix", null),
		};
	}, [authStorage]);

	return store;
}
