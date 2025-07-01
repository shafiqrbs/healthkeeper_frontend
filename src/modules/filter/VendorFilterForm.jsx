import React from "react";
import { useTranslation } from "react-i18next";
import InputForm from "@components/form-builders-filter/InputForm.jsx";
import { useHotkeys } from "@mantine/hooks";

function VendorFilterForm({ module }) {
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
				placeholder={t("Name")}
				nextField={"mobile"}
				id={"name"}
				name={"name"}
				module={module}
			/>

			<InputForm
				label={t("Mobile")}
				placeholder={t("Mobile")}
				nextField={"company_name"}
				id={"mobile"}
				name={"mobile"}
				module={module}
			/>

			<InputForm
				label={t("CompanyName")}
				placeholder={t("CompanyName")}
				nextField={"submit"}
				id={"company_name"}
				name={"company_name"}
				module={module}
			/>
		</>
	);
}

export default VendorFilterForm;
