import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSettingDropdown } from "../../../store/utility/utilitySlice.js";

const useSettingModulesDropdownData = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		const value = {
			url: "utility/select/setting",
			param: { "dropdown-type": "module" },
		};
		dispatch(getSettingDropdown(value));
	}, [dispatch]);

	const moduleDropdownData = useSelector((state) => state.utilityUtilitySlice.moduleDropdownData);

	return moduleDropdownData;
};

export default useSettingModulesDropdownData;
