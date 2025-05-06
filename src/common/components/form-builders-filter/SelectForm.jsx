import React from "react";
import { Select } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { setFilterData } from "@/app/store/core/crudSlice.js";

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
		(state) => state.crud.production.settings.filterData
	);
	const fileUploadFilterData = useSelector((state) => state.crud.core.fileUpload.filterData);

	const handleChange = (e) => {
		if (module === "production-setting") {
			changeValue(e);
			dispatch(
				setFilterData({
					module: "settings",
					data: {
						...productionSettingFilterData,
						[name]: e,
					},
				})
			);
			document.getElementById(nextField).focus();
		}
		if (module === "file-upload") {
			changeValue(e);
			dispatch(
				setFilterData({
					module: "fileUpload",
					data: { ...fileUploadFilterData, [name]: e },
				})
			);
			document.getElementById(nextField).focus();
		}
	};

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
				onChange={(e) => handleChange(e)}
				withAsterisk={required}
				comboboxProps={props.comboboxProps}
				allowDeselect={allowDeselect === false ? false : true}
			/>
		</>
	);
}

export default SelectForm;
