import React, { useState, useEffect } from "react";
import DomainForm from "./___DomainForm";
import { modals } from "@mantine/modals";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconAlertCircle } from "@tabler/icons-react";
import { rem, Text } from "@mantine/core";
import { ERROR_NOTIFICATION_COLOR } from "@/constants";
import { updateEntityData } from "@/app/store/core/crudThunk";
import { useParams, useNavigate } from "react-router-dom";
import { setInsertType } from "@/app/store/core/crudSlice";

export default function __Update({ form, close }) {
	const [isLoading, setIsLoading] = useState(false);
	const [businessModelId, setBusinessModelId] = useState(null);
	const [moduleChecked, setModuleChecked] = useState([]);
	const [productTypeChecked, setProductTypeChecked] = useState([]);
	const [productTypeCheckbox, setProductTypeCheckbox] = useState([]);

	const dispatch = useDispatch();
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { id } = useParams();
	const domainUpdateData = useSelector((state) => state.crud.domain.editData);

	// =============== effect to handle product type checkbox data ================
	useEffect(() => {
		if (domainUpdateData) {
			// set product type checkbox data
			setProductTypeCheckbox(domainUpdateData?.product_types_checkbox || []);

			// handle modules data
			if (domainUpdateData?.modules) {
				const parsedModules = Array.isArray(domainUpdateData.modules)
					? domainUpdateData.modules
					: JSON.parse(domainUpdateData?.modules || "[]");
				setModuleChecked(parsedModules);
			}

			// handle product types data
			if (domainUpdateData?.product_types) {
				const parsedProductTypes = Array.isArray(domainUpdateData.product_types)
					? domainUpdateData.product_types
					: JSON.parse(domainUpdateData?.product_types || "[]");
				setProductTypeChecked(parsedProductTypes);
			}
		}
	}, [domainUpdateData]);

	const handleSubmit = (values) => {
		console.log(values);
		values["modules"] = moduleChecked;
		values["product_types"] = productTypeChecked;
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
				url: `domain/global/${id}`,
				data: values,
				module: "domain",
			};

			const resultAction = await dispatch(updateEntityData(value));

			if (updateEntityData.rejected.match(resultAction)) {
				const fieldErrors = resultAction.payload.errors;

				// check if there are field validation errors and dynamically set them
				if (fieldErrors) {
					const errorObject = {};
					Object.keys(fieldErrors).forEach((key) => {
						errorObject[key] = fieldErrors[key][0]; // assign the first error message for each field
					});
					// display the errors using your form's `setErrors` function dynamically
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
					form.reset();
					dispatch(setInsertType({ insertType: "create", module: "domain" }));
					setIsLoading(false);
					close(); // close the drawer
					navigate("/domain", { replace: true });
					setBusinessModelId(null);
					setModuleChecked([]);
					setProductTypeChecked([]);
					setProductTypeCheckbox([]);
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
		<DomainForm
			type="update"
			form={form}
			data={domainUpdateData}
			handleSubmit={handleSubmit}
			businessModelId={businessModelId}
			setBusinessModelId={setBusinessModelId}
			moduleChecked={moduleChecked}
			setModuleChecked={setModuleChecked}
			productTypeChecked={productTypeChecked}
			setProductTypeChecked={setProductTypeChecked}
			productTypeCheckbox={productTypeCheckbox}
			isLoading={isLoading}
			setIsLoading={setIsLoading}
		/>
	);
}
