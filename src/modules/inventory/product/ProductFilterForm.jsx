import React from "react";
import { useTranslation } from "react-i18next";
import InputForm from "@components/form-builders-filter/InputForm.jsx";
import { useHotkeys } from "@mantine/hooks";

function ProductFilterForm({ module }) {
	const { t } = useTranslation();

	useHotkeys(
		[
			[
				"alt+n",
				() => {
					document.getElementById("Name").focus();
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
				nextField={"alternative_name"}
				id={"Name"}
				name={"name"}
				module={module}
			/>

			<InputForm
				label={t("AlternativeProductName")}
				placeholder={t("AlternativeProductName")}
				nextField={"sku"}
				id={"alternative_name"}
				name={"alternative_name"}
				module={module}
			/>

			<InputForm
				label={t("ProductSku")}
				placeholder={t("ProductSku")}
				nextField={"sales_price"}
				id={"sku"}
				name={"sku"}
				module={module}
			/>

			<InputForm
				label={t("SalesPrice")}
				placeholder={t("SalesPrice")}
				id={"sales_price"}
				name={"sales_price"}
				module={module}
			/>
		</>
	);
}

export default ProductFilterForm;
