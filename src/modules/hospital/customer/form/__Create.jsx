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
import { HOSPITAL_DATA_ROUTES } from "@/constants/appRoutes";
import Form from "./___Form";

export default function __Create({ module, form, close }) {
	const [isLoading, setIsLoading] = useState(false);
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const [customerData, setCustomerData] = useState(null);

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
				url: HOSPITAL_DATA_ROUTES.API_ROUTES.CUSTOMER.CREATE,
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
				useCustomerDataStoreIntoLocalStorage();
				form.reset();
				close(); // close the drawer
				setCustomerData(null);
				dispatch(setRefetchData({ module, refetching: true }));
				notifications.show({
					color: SUCCESS_NOTIFICATION_COLOR,
					title: t("CreateSuccessfully"),
					icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
					loading: false,
					autoClose: 1400,
					style: { backgroundColor: "lightgray" },
				});
			}
		} catch (error) {
			console.error(error);
			notifications.show({
				color: ERROR_NOTIFICATION_COLOR,
				title: error.message,
				icon: <IconAlertCircle style={{ width: rem(18), height: rem(18) }} />,
				loading: false,
				autoClose: 2000,
				style: { backgroundColor: "lightgray" },
			});
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Form
			form={form}
			handleSubmit={handleSubmit}
			customerData={customerData}
			setCustomerData={setCustomerData}
			isLoading={isLoading}
			setIsLoading={setIsLoading}
		/>
	);
}
