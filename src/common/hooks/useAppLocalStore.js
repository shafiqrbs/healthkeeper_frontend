import { useMemo } from "react";
import { useAuthStore } from "@/store/useAuthStore";

const HOOK_NAME = "useAppLocalStore";

// Keep track of which missing paths we already warned about (to avoid spam)
const missingPathWarnings = new Set();

/**
 * Logs a warning in development mode when a path is missing.
 * @param {string} path
 */
function warnMissingPath(path) {
	if (import.meta.env.VITE_ENVIRONMENT !== "development") return;

	const key = `${HOOK_NAME}:${path}`;
	if (missingPathWarnings.has(key)) return;
	missingPathWarnings.add(key);

	// eslint-disable-next-line no-console
	console.warn(`[${HOOK_NAME}] Missing key at path: "${path}"`);
}

/**
 * Safely retrieves a nested property using a dot-notation path.
 * Warns in dev mode when keys are missing.
 *
 * @param {Object} root
 * @param {string} path
 * @param {*} fallback
 */
function safeGet(root, path, fallback) {
	if (!root || typeof root !== "object") {
		warnMissingPath(path);
		return fallback;
	}

	const segments = path.split(".");
	let current = root;

	for (const segment of segments) {
		if (
			current == null ||
			(typeof current !== "object" && typeof current !== "function") ||
			!Object.prototype.hasOwnProperty.call(current, segment)
		) {
			warnMissingPath(path);
			return fallback;
		}
		current = current[segment];
	}

	return current === undefined ? fallback : current;
}

/**
 * Custom hook that provides safe accessors for all stored auth + hospital config data.
 * Returns memoized getter functions for better performance.
 */
export default function useAppLocalStore() {
	const authStorage = useAuthStore((state) => state);

	/** CORE LOGIC wrapped in memoization */
	const api = useMemo(() => {
		/**
		 * Gets the logged-in user object.
		 * @returns {Object|null} User object or null if not available.
		 */
		const getLoggedInUser = () => authStorage?.user ?? null;

		/**
		 * Gets the hospital configuration root object.
		 * @returns {Object|null} Hospital config or null.
		 */
		const getLoggedInHospitalUser = () => safeGet(authStorage, "hospitalConfig", null);

		/**
		 * Gets warehouse info for the logged-in user.
		 * @returns {Object|null} Warehouse object or null.
		 */
		const getLoggedInWarehouse = () => authStorage?.warehouse ?? null;

		/**
		 * Gets user roles as an array.
		 * Handles parsed and stringified arrays.
		 * @returns {Array<string>} Array of roles (empty if missing).
		 */
		const getLoggedInRoles = () => {
			const user = getLoggedInUser();
			const raw = user?.access_control_role;

			if (!raw) return [];
			if (Array.isArray(raw)) return raw;

			if (typeof raw === "string") {
				try {
					if (raw.trim() === "") return [];
					return JSON.parse(raw);
				} catch (err) {
					console.error("Error parsing access_control_role:", err);
					return [];
				}
			}

			return [];
		};

		/**
		 * Gets JWT token.
		 * @returns {string|null} Token or null.
		 */
		const getLoggedInToken = () => authStorage?.token ?? null;

		/** List getters (always return arrays, never null) */
		const getDepartments = () => safeGet(authStorage, "hospitalConfig.departments", []);
		const getReligions = () => safeGet(authStorage, "hospitalConfig.religions", []);
		const getAdvices = () => safeGet(authStorage, "hospitalConfig.advices", []);
		const getDesignations = () => safeGet(authStorage, "hospitalConfig.designations", []);
		const getParticularModes = () => safeGet(authStorage, "hospitalConfig.particularModes", []);
		const getByMeals = () => safeGet(authStorage, "hospitalConfig.byMeals", []);
		const getDosages = () => safeGet(authStorage, "hospitalConfig.dosages", []);

		/** Returns full particularModules object */
		const getParticularModules = () =>
			safeGet(authStorage, "hospitalConfig.particularModules", {});

		/** Helper */
		const getParticularModule = (key) =>
			safeGet(authStorage, `hospitalConfig.particularModules.${key}`, null);

		/** Module getters */
		const getBedModeModule = () => getParticularModule("bed-mode");
		const getBloodGroupModule = () => getParticularModule("blood-group");
		const getCabinModeModule = () => getParticularModule("cabin-mode");
		const getDepartmentModule = () => getParticularModule("department");
		const getDiagnosticDepartmentModule = () => getParticularModule("diagnostic-department");
		const getDiagnosticRoomModule = () => getParticularModule("diagnostic-room");
		const getGenderModeModule = () => getParticularModule("gender-mode");
		const getInvestigationGroupModule = () => getParticularModule("investigation-group");
		const getLabReportModeModule = () => getParticularModule("lab-report-mode");
		const getMedicineDurationModeModule = () => getParticularModule("medicine-duration-mode");
		const getMedicineGroupModule = () => getParticularModule("medicine-group");
		const getOperationModule = () => getParticularModule("operation");
		const getPatientDiseasesModeModule = () => getParticularModule("patient-diseases-mode");
		const getPatientModeModule = () => getParticularModule("patient-mode");
		const getPatientTypeModule = () => getParticularModule("patient-type");
		const getPayingModeModule = () => getParticularModule("paying-mode");
		const getPrescriptionTemplateModule = () => getParticularModule("prescription-template");
		const getPrintModule = () => getParticularModule("print");
		const getTreatmentModeModule = () => getParticularModule("treatment-mode");
		const getUnitGroupModule = () => getParticularModule("unit-group");

		/**
		 * Gets the particular matrix (organized modules)
		 * @returns {Object|null}
		 */
		const getParticularMatrix = () =>
			safeGet(authStorage, "hospitalConfig.particularMatrix", null);

		/**
		 * Gets core hospital info (id, name, address, settings).
		 * @returns {Object|null}
		 */
		const getHospitalConfig = () => safeGet(authStorage, "hospitalConfig.config", null);

		/** MEMOIZED API RETURN */
		return {
			getLoggedInUser,
			getLoggedInHospitalUser,
			getLoggedInWarehouse,
			getLoggedInRoles,
			getLoggedInToken,

			getDepartments,
			getReligions,
			getAdvices,
			getDesignations,
			getParticularModes,
			getParticularModules,
			getParticularMatrix,
			getByMeals,
			getDosages,
			getHospitalConfig,

			getBedModeModule,
			getBloodGroupModule,
			getCabinModeModule,
			getDepartmentModule,
			getDiagnosticDepartmentModule,
			getDiagnosticRoomModule,
			getGenderModeModule,
			getInvestigationGroupModule,
			getLabReportModeModule,
			getMedicineDurationModeModule,
			getMedicineGroupModule,
			getOperationModule,
			getPatientDiseasesModeModule,
			getPatientModeModule,
			getPatientTypeModule,
			getPayingModeModule,
			getPrescriptionTemplateModule,
			getPrintModule,
			getTreatmentModeModule,
			getUnitGroupModule,
		};
	}, [authStorage]); // recompute only when Zustand store changes

	return api;
}
