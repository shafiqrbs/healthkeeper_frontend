import useAppLocalStore from "@hooks/useAppLocalStore";

// TODO: Remove this hook after all the data is migrated to the new storage
// Fallback hook for the old storage
const useHospitalConfigData = () => {
	const { coreConfig } = useAppLocalStore();

	const fetchData = () => {
		return coreConfig;
	};

	return { hospitalConfigData: coreConfig ?? {}, fetchData };
};

export default useHospitalConfigData;
