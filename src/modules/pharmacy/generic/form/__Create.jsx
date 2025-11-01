import { useState } from "react";
import { modals } from "@mantine/modals";
import { storeEntityData } from "@/app/store/core/crudThunk";
import { useDispatch } from "react-redux";
import { setRefetchData } from "@/app/store/core/crudSlice";
import { useTranslation } from "react-i18next";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconAlertCircle } from "@tabler/icons-react";
import { rem, Text } from "@mantine/core";
import { SUCCESS_NOTIFICATION_COLOR, ERROR_NOTIFICATION_COLOR } from "@/constants";
import useCustomerDataStoreIntoLocalStorage from "@hooks/local-storage/useCustomerDataStoreIntoLocalStorage";
import { PHARMACY_DATA_ROUTES } from "@/constants/routes";
import Form from "./___Form";
import {successNotification} from "@components/notification/successNotification";
import {errorNotification} from "@components/notification/errorNotification";

export default function __Create({ module, form, close }) {
	const [isLoading, setIsLoading] = useState(false);
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const [indexData, setIndexData] = useState(null);

	const handleSubmit = (values) => {
		modals.openConfirmModal({
			title: <Text size="md"> {t("FormConfirmationTitle")}</Text>,
			children: <Text size="sm"> {t("FormConfirmationMessage")}</Text>,
			labels: { confirm: t("Submit"), cancel: t("Cancel") },
			confirmProps: { color: "red" },
			onCancel: () => console.info("Cancel"),
			onConfirm: () => handleConfirmModal(values),
		});
	};
	async function handleConfirmModal(values) {
		try {
			setIsLoading(true);
			const value = {
				url: PHARMACY_DATA_ROUTES.API_ROUTES.STOCK.CREATE,
				data: values,
				module,
			};

			const resultAction = await dispatch(storeEntityData(value));
			if (storeEntityData.rejected.match(resultAction)) {
				const fieldErrors = resultAction.payload.errors;
				if (fieldErrors) {
					const errorObject = {};
					Object.keys(fieldErrors).forEach((key) => {
						errorObject[key] = fieldErrors[key][0];
					});
					form.setErrors(errorObject);
				}
			} else if (storeEntityData.fulfilled.match(resultAction)) {
				form.reset();
				close(); // close the drawer
				setIndexData(null);
				dispatch(setRefetchData({ module, refetching: true }));
				successNotification(t("InsertSuccessfully"),SUCCESS_NOTIFICATION_COLOR);
			}
		} catch (error) {
			errorNotification(error.message,ERROR_NOTIFICATION_COLOR);
		} finally {
			setIsLoading(false);
		}
	}
	return (
		<Form
			form={form}
			handleSubmit={handleSubmit}
			data={indexData}
			setIndexData={setIndexData}
			isLoading={isLoading}
			setIsLoading={setIsLoading}
		/>
	);
}
