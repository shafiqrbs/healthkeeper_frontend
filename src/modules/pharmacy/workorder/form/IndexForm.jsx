import Create from "./Create";
import Update from "./Update";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { getInitialValues } from "../helpers/request";
import { useState } from "react";
import { useParams } from "react-router-dom";
import useDataWithoutStore from "@hooks/useDataWithoutStore";
import { PHARMACY_DATA_ROUTES } from "@/constants/routes";

export default function IndexForm({ mode }) {
	const { id } = useParams();
	const [records, setRecords] = useState([]);
	const { t } = useTranslation();
	const form = useForm(getInitialValues(t));

	const { data } = useDataWithoutStore({
		url: `${PHARMACY_DATA_ROUTES.API_ROUTES.PURCHASE.VIEW}/${id}`,
	});

	const isEditMode = mode === "edit";

	return (
		<div>
			{isEditMode ? (
				<Update form={form} records={records} setRecords={setRecords} data={data} />
			) : (
				<Create form={form} records={records} setRecords={setRecords} />
			)}
		</div>
	);
}
