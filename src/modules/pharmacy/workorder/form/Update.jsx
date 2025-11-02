import { useEffect } from "react";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { PHARMACY_DATA_ROUTES } from "@/constants/routes";
import { updateEntityData } from "@/app/store/core/crudThunk";
import { modals } from "@mantine/modals";
import { Text, rem } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { ERROR_NOTIFICATION_COLOR, SUCCESS_NOTIFICATION_COLOR } from "@/constants";
import { IconAlertCircle, IconCheck } from "@tabler/icons-react";
import { formatDateForMySQL } from "@utils/index";
import { getWorkorderFormInitialValues } from "../helpers/request";
import Form from "./__Form";

export default function Update({ form, records = [], setRecords, data }) {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { id } = useParams();
	const workOrderForm = useForm(getWorkorderFormInitialValues(t));

	useEffect(() => {
		if (!data) return;

		const entity = data?.data ?? data;

		// bind header/work-order level fields
		workOrderForm.setValues({
			comment: entity?.remark || "",
			vendor_id: entity?.vendor_id ? String(entity.vendor_id) : "",
		});

		// bind line items into records
		const mappedRecords = Array.isArray(entity?.purchase_items)
			? entity.purchase_items.map((purchaseItem) => ({
					production_date: purchaseItem?.production_date ? new Date(purchaseItem.production_date) : "",
					expired_date: purchaseItem?.expired_date ? new Date(purchaseItem.expired_date) : "",
					medicine_id: purchaseItem?.stock_item_id ? String(purchaseItem.stock_item_id) : "",
					medicine_name: purchaseItem?.name || "",
					generic: null,
					quantity: purchaseItem?.quantity || "",
			  }))
			: [];

		setRecords(mappedRecords);
	}, [data]);

	const handleWorkOrderUpdate = (values) => {
		const validation = workOrderForm.validate();
		if (validation.hasErrors) return;

		modals.openConfirmModal({
			title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
			children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
			labels: { confirm: t("Submit"), cancel: t("Cancel") },
			confirmProps: { color: "red" },
			onCancel: () => console.info("Cancelled"),
			onConfirm: () => saveWorkOrderUpdate(values),
		});
	};

	async function saveWorkOrderUpdate(values) {
		modals.closeAll();
		try {
			const payload = {
				...values,
				items: records.map((recordItem) => ({
					...recordItem,
					production_date: formatDateForMySQL(recordItem.production_date),
					expired_date: formatDateForMySQL(recordItem.expired_date),
				})),
			};

			const requestData = {
				url: `${PHARMACY_DATA_ROUTES.API_ROUTES.PURCHASE.UPDATE}/${id}`,
				data: payload,
				module: "stock",
			};

			const result = await dispatch(updateEntityData(requestData));

			if (updateEntityData.rejected.match(result)) {
				const fieldErrors = result.payload?.errors;
				if (fieldErrors) {
					form.setErrors(
						Object.fromEntries(Object.entries(fieldErrors).map(([key, value]) => [key, value[0]]))
					);
				} else {
					notifications.show({
						color: ERROR_NOTIFICATION_COLOR,
						title: t("ServerError"),
						message: result.error?.message || t("UnexpectedError"),
						icon: <IconAlertCircle style={{ width: rem(18), height: rem(18) }} />,
					});
				}
			} else if (updateEntityData.fulfilled.match(result)) {
				notifications.show({
					color: SUCCESS_NOTIFICATION_COLOR,
					title: t("UpdateSuccessfully"),
					icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
					autoClose: 800,
					onClose: () => navigate(PHARMACY_DATA_ROUTES.NAVIGATION_LINKS.WORKORDER.INDEX),
				});
			}
		} catch (error) {
			console.error(error);
			notifications.show({
				color: ERROR_NOTIFICATION_COLOR,
				title: t("ErrorOccurred"),
				message: error.message,
				icon: <IconAlertCircle style={{ width: rem(18), height: rem(18) }} />,
				autoClose: 800,
			});
		}
	}

	return (
		<Form
			form={form}
			workOrderForm={workOrderForm}
			records={records}
			setRecords={setRecords}
			onSave={handleWorkOrderUpdate}
		/>
	);
}
