import React from "react";
import { useTranslation } from "react-i18next";
import InputForm from "@components/form-builders-filter/InputForm.jsx";
import { useHotkeys } from "@mantine/hooks";

function CategoryGroupFilterForm({ module }) {
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
				nextField={"submit"}
				id={"name"}
				name={"name"}
				module={module}
			/>
		</>
	);
}

export default CategoryGroupFilterForm;
