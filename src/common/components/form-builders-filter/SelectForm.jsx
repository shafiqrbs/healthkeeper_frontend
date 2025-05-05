import React from "react";
import { Select } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { setProductionSettingFilterData } from "@/app/store/core/crudSlice.js";
import { setFileUploadFilterData } from "@/app/store/core/crudSlice.js";

function SelectForm({
	label,
	placeholder,
	required,
	nextField,
	name,
	mt,
	dropdownValue,
	searchable,
	value,
	changeValue,
	clearable,
	allowDeselect,
	module,
}) {
	const dispatch = useDispatch();
	const productionSettingFilterData = useSelector(
		(state) => state.productionCrudSlice.productionSettingFilterData
	);
	const fileUploadFilterData = useSelector((state) => state.crudSlice.fileUploadFilterData);

	return (
		<>
			<Select
				label={label}
				placeholder={placeholder}
				mt={mt}
				size="sm"
				data={dropdownValue}
				autoComplete="off"
				clearable={clearable === false ? false : true}
				searchable={searchable}
				value={value}
				onChange={(e) => {
					if (module === "production-setting") {
						changeValue(e);
						dispatch(
							setProductionSettingFilterData({
								...productionSettingFilterData,
								[name]: e,
							})
						);
						document.getElementById(nextField).focus();
					}
					if (module === "file-upload") {
						changeValue(e);
						dispatch(setFileUploadFilterData({ ...fileUploadFilterData, [name]: e }));
						document.getElementById(nextField).focus();
					}
				}}
				withAsterisk={required}
				comboboxProps={props.comboboxProps}
				allowDeselect={allowDeselect === false ? false : true}
			/>
		</>
	);
}

export default SelectForm;
