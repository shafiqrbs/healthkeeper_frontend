import { useState } from "react";
import { useTranslation } from "react-i18next";
import InputForm from "@components/form-builders-filter/InputForm.jsx";
import { useHotkeys } from "@mantine/hooks";
import SelectForm from "@components/form-builders-filter/SelectForm.jsx";
import React from "react";
import getParticularTypeDropdownData from "@hooks/dropdown/core/useSettingTypeDropdownData.js";

function __ProductionSettingFilterForm(props) {
	const { t } = useTranslation();

	useHotkeys(
		[
			[
				"alt+n",
				() => {
					document.getElementById("name").focus();
				},
			],
		],
		[]
	);

	const [settingTypeData, setSettingTypeData] = useState(null);

	return (
		<>
			<InputForm
				label={t("Name")}
				placeholder={t("EnterName")}
				nextField={"setting_type"}
				id={"name"}
				name={"name"}
				module={props.module}
			/>

			<SelectForm
				label={t("SettingType")}
				placeholder={t("ChooseSettingType")}
				mt={1}
				clearable={true}
				searchable={true}
				required={false}
				nextField={"submit"}
				name={"setting_type_id"}
				dropdownValue={getParticularTypeDropdownData()}
				id={"setting_type"}
				value={settingTypeData}
				changeValue={setSettingTypeData}
				comboboxProps={true}
				allowDeselect={false}
				module={props.module}
			/>
		</>
	);
}

export default __ProductionSettingFilterForm;
