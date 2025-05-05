import { useTranslation } from "react-i18next";
import InputForm from "@components/form-builders-filter/InputForm.jsx";
import { useHotkeys } from "@mantine/hooks";

function CategoryFilterForm({ module }) {
	const { t } = useTranslation();

	useHotkeys(
		[
			[
				"alt+n",
				() => {
					document.getElementById("ParentName").focus();
				},
			],
		],
		[]
	);

	return (
		<>
			<InputForm
				label={t("Name")}
				placeHolder={t("Name")}
				nextField={"parentName"}
				id={"name"}
				name={"name"}
				module={module}
			/>
			<InputForm
				label={t("ParentName")}
				placeHolder={t("ParentName")}
				nextField={"submit"}
				id={"parent_name"}
				name={"parent_name"}
				module={module}
			/>
		</>
	);
}
export default CategoryFilterForm;
