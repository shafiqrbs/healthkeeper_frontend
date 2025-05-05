import React from "react";
import { useTranslation } from "react-i18next";
import InputForm from "@components/form-builders-filter/InputForm.jsx";
import { useHotkeys } from "@mantine/hooks";

function CustomerFilterForm({ module }) {
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

	return (
		<>
			<InputForm
				label={t("Name")}
				placeholder={t("EnterName")}
				nextField={"mobile"}
				id={"name"}
				name={"name"}
				module={module}
			/>

			<InputForm
				label={t("Mobile")}
				placeholder={t("EnterMobile")}
				nextField={"submit"}
				id={"mobile"}
				name={"mobile"}
				module={module}
			/>
		</>
	);
}

export default CustomerFilterForm;
