import useAppLocalStore from "./useAppLocalStore";

const useParticularsData = ({ modeName }) => {
	const { particularMatrix } = useAppLocalStore();
	const dataByMode = particularMatrix?.entities?.filter(
		(item) => item.mode_name?.toLowerCase() === modeName?.toLowerCase()
	);
	return { particularsData: dataByMode };
};

export default useParticularsData;
