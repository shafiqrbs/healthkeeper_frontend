import { useState } from "react";
import { modals } from "@mantine/modals";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconAlertCircle } from "@tabler/icons-react";
import { rem, Text } from "@mantine/core";
import { ERROR_NOTIFICATION_COLOR } from "@/constants";
import { updateEntityData } from "@/app/store/core/crudThunk";
import { useParams, useNavigate } from "react-router-dom";
import useVendorDataStoreIntoLocalStorage from "@/common/hooks/local-storage/useVendorDataStoreIntoLocalStorage";
import { setInsertType } from "@/app/store/core/crudSlice";
import { HOSPITAL_DATA_ROUTES } from "@/constants/appRoutes";
import Form from "@modules/hospital/customer/form/___Form";

export default function __Update({ module, form, close }) {
	const [isLoading, setIsLoading] = useState(false);
	const [indexData, setIndexData] = useState(null);
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { id } = useParams();
	const indexUpdateData = useSelector((state) => state.crud[module].editData);

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
			const value = {
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.CUSTOMER.UPDATE}/${id}`,
				data: values,
				module,
			};

			const resultAction = await dispatch(updateEntityData(value));

			if (updateEntityData.rejected.match(resultAction)) {
				const fieldErrors = resultAction.payload.errors;

				// Check if there are field validation errors and dynamically set them
				if (fieldErrors) {
					const errorObject = {};
					Object.keys(fieldErrors).forEach((key) => {
						errorObject[key] = fieldErrors[key][0]; // Assign the first error message for each field
					});
					// Display the errors using your form's `setErrors` function dynamically
					form.setErrors(errorObject);
				}
			} else if (updateEntityData.fulfilled.match(resultAction)) {
				notifications.show({
					color: "teal",
					title: t("UpdateSuccessfully"),
					icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
					loading: false,
					autoClose: 700,
					style: { backgroundColor: "lightgray" },
				});

				setTimeout(() => {
					useVendorDataStoreIntoLocalStorage();
					form.reset();
					dispatch(setInsertType({ insertType: "create", module }));
					setIsLoading(false);
					close(); // close the drawer
					navigate(HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.CUSTOMER.INDEX, { replace: true });
					setIndexData(null);
				}, 700);
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
		}
	}

	return (
		<Form
			type="update"
			form={form}
			data={indexUpdateData}
			handleSubmit={handleSubmit}
			indexData={indexData}
			setIndexData={setIndexData}
			isLoading={isLoading}
			setIsLoading={setIsLoading}
		/>
	);
}
