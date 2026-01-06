import useAppLocalStore from "./useAppLocalStore";

const useParticularsData = ({ modeName }) => {
	const { particularMatrix } = useAppLocalStore();
	const dataByMode = particularMatrix?.entities?.filter(
		(item) => item.mode_name?.toLowerCase() === modeName?.toLowerCase()
	);

	const dataByModule = dataByMode.map((item) => ({
		...item,
		particular_type: {
			...(item?.particular_type || {}),
			data_type: item?.data_type || item?.particular_type?.data_type,
		},
	}));

	return { particularsData: dataByModule };
};

export default useParticularsData;
