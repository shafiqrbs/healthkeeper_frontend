import React, { useEffect, useMemo, useState } from "react";
import VendorForm from "./__VendorForm";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { editEntityData } from "@/app/store/core/crudThunk";
import { setFilterData, setSearchKeyword, setInsertType } from "@/app/store/core/crudSlice";
import { modals } from "@mantine/modals";
import vendorDataStoreIntoLocalStorage from "@hooks/local-storage/useVendorDataStoreIntoLocalStorage.js";
import { ERROR_NOTIFICATION_COLOR, SUCCESS_NOTIFICATION_COLOR } from "@/constants";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconAlertCircle } from "@tabler/icons-react";
import { rem, Text } from "@mantine/core";
import { setGlobalFetching } from "@/app/store/core/crudSlice";
import { storeEntityData, updateEntityData } from "@/app/store/core/crudThunk";
import { useTranslation } from "react-i18next";

export default function _Form({ form }) {
	const { t } = useTranslation();
	const { id } = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(false);
	const [customerData, setCustomerData] = useState(null);
	
	// =============== selectors ================
	const insertType = useSelector((state) => state.crud.vendor.insertType);
	const vendorFilterData = useSelector((state) => state.crud.vendor.filterData);
	const vendorUpdateData = useSelector((state) => state.crud.vendor.editData);

	// =============== memoized values ================
	const isEditMode = useMemo(() => Boolean(id), [id]);
	const defaultFilterData = useMemo(() => ({
		name: "",
		mobile: "",
		company: "",
	}), []);

	// =============== handle edit mode initialization ================
	const handleEditMode = () => {
		dispatch(setInsertType({ insertType: "update", module: "vendor" }));
		dispatch(
			editEntityData({
				url: `core/vendor/${id}`,
				module: "vendor",
			})
		);
	};

	// =============== handle create mode initialization ================
	const handleCreateMode = () => {
		dispatch(setInsertType({ insertType: "create", module: "vendor" }));
		dispatch(setSearchKeyword(""));
		dispatch(
			setFilterData({
				module: "vendor",
				data: {
					...vendorFilterData,
					...defaultFilterData,
				},
			})
		);
		navigate("/core/vendor", { replace: true });
	};

	// =============== effect to handle mode switching ================
	useEffect(() => {
		if (isEditMode) {
			handleEditMode();
		} else {
			handleCreateMode();
		}
	}, [isEditMode]);

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
		if (insertType === "create") {
			try {
				setIsLoading(true);
				const value = {
					url: "core/vendor",
					data: values,
					module: "vendor",
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
					vendorDataStoreIntoLocalStorage();
					form.reset();
					setCustomerData(null);
					dispatch(setGlobalFetching(true));
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
		} else {
			const value = {
				url: `core/vendor/${id}`,
				data: values,
				module: "vendor",
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
					vendorDataStoreIntoLocalStorage();
					form.reset();
					dispatch(setInsertType({insertType: "create", module: "vendor"}));
					setIsLoading(false);
					navigate("/core/vendor", { replace: true });
					setCustomerData(null);
				}, 700);
			}
		}
	}

	// =============== render form based on mode ================
	if (insertType === "create") {
		return <VendorForm form={form} handleSubmit={handleSubmit} />;
	}

	return <VendorForm type="update" form={form} data={vendorUpdateData} handleSubmit={handleSubmit} />;
}
