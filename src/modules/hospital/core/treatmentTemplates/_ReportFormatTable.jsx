import { useEffect, useState } from "react";
import { Box, Text, rem } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconAlertCircle } from "@tabler/icons-react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { MASTER_DATA_ROUTES } from "@/constants/routes";
import { deleteEntityData, storeEntityData, updateEntityData } from "@/app/store/core/crudThunk";
import { setRefetchData } from "@/app/store/core/crudSlice.js";
import { ERROR_NOTIFICATION_COLOR } from "@/constants/index.js";
import { useForm } from "@mantine/form";
import { getInitialReportValues } from "@modules/hospital/core/investigation/helpers/request";
import { successNotification } from "@components/notification/successNotification";
import { errorNotification } from "@components/notification/errorNotification";
import { SUCCESS_NOTIFICATION_COLOR } from "@/constants/index";
import { deleteNotification } from "@components/notification/deleteNotification";
import { setInsertType } from "@/app/store/core/crudSlice";
import useDataWithoutStore from "@hooks/useDataWithoutStore";
import AddMedicineForm from "../../common/AddMedicineForm";

export default function _ReportFormatTable({ module }) {
	const { t } = useTranslation();
	const form = useForm(getInitialReportValues(t));
	const [medicines, setMedicines] = useState([]);
	const dispatch = useDispatch();
	const { mainAreaHeight } = useOutletContext();
	const navigate = useNavigate();
	const { id } = useParams();
	const height = mainAreaHeight - 48;

	const [submitFormData, setSubmitFormData] = useState({});

	const { data: entity } = useDataWithoutStore({ url: `${MASTER_DATA_ROUTES.API_ROUTES.INVESTIGATION.VIEW}/${id}` });
	const entityData = entity?.data?.investigation_report_format;

	const parents =
		entityData
			?.map((p) => ({
				value: p?.id?.toString() || "", // keep everything string, handle null/undefined
				label: p?.name || "", // handle null/undefined name
			}))
			.filter((p) => p.value && p.label) || []; // filter out empty entries

	const handleDeleteSuccess = async (report, id) => {
		const res = await dispatch(
			deleteEntityData({
				url: `${MASTER_DATA_ROUTES.API_ROUTES.INVESTIGATION_REPORT_FORMAT.DELETE}/${id}`,
				module,
				id,
			})
		);

		if (deleteEntityData.fulfilled.match(res)) {
			dispatch(setRefetchData({ module, refetching: true }));
			deleteNotification(t("DeletedSuccessfully"), ERROR_NOTIFICATION_COLOR);
			navigate(`${MASTER_DATA_ROUTES.NAVIGATION_LINKS.INVESTIGATION.REPORT_FORMAT}/${report}`);
			dispatch(setInsertType({ insertType: "create", module }));
		} else {
			notifications.show({
				color: ERROR_NOTIFICATION_COLOR,
				title: t("Delete Failed"),
				icon: <IconAlertCircle style={{ width: rem(18), height: rem(18) }} />,
			});
		}
	};

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
				url: `${MASTER_DATA_ROUTES.API_ROUTES.INVESTIGATION_REPORT_FORMAT.CREATE}`,
				data: { ...values, particular_id: id },
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
				dispatch(setRefetchData({ module, refetching: true }));
				successNotification(t("InsertSuccessfully"), SUCCESS_NOTIFICATION_COLOR);
			}
		} catch (error) {
			console.error(error);
			errorNotification(error.message, ERROR_NOTIFICATION_COLOR);
		}
	}

	useEffect(() => {
		if (!entityData?.length) return;
		const initialFormData = entityData.reduce((acc, item) => {
			acc[item.id] = {
				name: item.name || "",
				parent_id: item.parent_id ? item.parent_id.toString() : "", // force string
				unit: item.unit || "",
				reference_value: item.reference_value || "",
				sample_value: item.sample_value || "",
			};
			return acc;
		}, {});

		setSubmitFormData(initialFormData);
	}, [entityData]);

	const handleDataTypeChange = (rowId, field, value) => {
		setSubmitFormData((prev) => ({
			...prev,
			[rowId]: {
				...prev[rowId],
				[field]: value,
			},
		}));
	};

	const handleRowSubmit = async (rowId) => {
		const formData = submitFormData[rowId];
		if (!formData) return;
		if (!formData.name || formData.name.trim() === "") {
			errorNotification(t("Name is required"), ERROR_NOTIFICATION_COLOR);
			return;
		}
		const value = {
			url: `${MASTER_DATA_ROUTES.API_ROUTES.INVESTIGATION_REPORT_FORMAT.UPDATE}/${rowId}`,
			data: formData,
			module,
		};
		try {
			const resultAction = await dispatch(updateEntityData(value));
			if (updateEntityData.rejected.match(resultAction)) {
				const fieldErrors = resultAction.payload.errors;
				if (fieldErrors) {
					const errorObject = {};
					Object.keys(fieldErrors).forEach((key) => {
						errorObject[key] = fieldErrors[key][0];
					});
					form.setErrors(errorObject);
				}
			} else if (updateEntityData.fulfilled.match(resultAction)) {
				successNotification(t("UpdateSuccessfully"), SUCCESS_NOTIFICATION_COLOR);
			}
		} catch (error) {
			errorNotification(error.message);
		}
	};

	return (
		<Box className="border-top-none">
			<AddMedicineForm medicines={medicines} setMedicines={setMedicines} baseHeight={height - 170} />
		</Box>
	);
}
