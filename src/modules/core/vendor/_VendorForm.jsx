import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
	Button,
	rem,
	Flex,
	Grid,
	Box,
	ScrollArea,
	Text,
	Title,
	Stack,
	LoadingOverlay,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconCheck, IconDeviceFloppy, IconAlertCircle } from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";

import { setGlobalFetching } from "@/app/store/core/crudSlice";
import { storeEntityData, updateEntityData } from "@/app/store/core/crudThunk";

import InputForm from "@components/form-builders/InputForm";
import SelectForm from "@components/form-builders/SelectForm";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import PhoneNumber from "@components/form-builders/PhoneNumberInput";
import vendorDataStoreIntoLocalStorage from "@hooks/local-storage/useVendorDataStoreIntoLocalStorage.js";
import { ERROR_NOTIFICATION_COLOR, SUCCESS_NOTIFICATION_COLOR } from "@/constants";

function _VendorForm({ form, type = "create", customerDropDownData, setInsertType }) {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { isOnline, mainAreaHeight } = useOutletContext();
	const vendorUpdateData = useSelector((state) => state.crud.vendor.editData);
	const height = mainAreaHeight - 100; //TabList height 104
	const [isLoading, setIsLoading] = useState(false);
	const [customerData, setCustomerData] = useState(null);

	useEffect(() => {
		if (vendorUpdateData && type === "update") {
			setIsLoading(true);
			form.setValues({
				company_name: vendorUpdateData.company_name,
				name: vendorUpdateData.name,
				mobile: vendorUpdateData.mobile,
				email: vendorUpdateData.email,
				customer_id: vendorUpdateData.customer_id,
				address: vendorUpdateData.address,
			});
			setCustomerData(vendorUpdateData.customer_id);

			const timeoutId = setTimeout(() => {
				setIsLoading(false);
			}, 300);
			return () => clearTimeout(timeoutId);
		} else {
			form.reset();
		}
	}, [vendorUpdateData, type]);

	useHotkeys(
		[
			["alt+n", () => document.getElementById("company_name").focus()],
			["alt+r", () => form.reset()],
			["alt+s", () => document.getElementById("EntityFormSubmit").click()],
		],
		[]
	);

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
		if (type === "create") {
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
				url: `core/vendor/${vendorUpdateData.id}`,
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
					setInsertType("create");
					setIsLoading(false);
					navigate("/core/vendor", { replace: true });
					setCustomerData(null);
				}, 700);
			}
		}
	}

	return (
		<Box>
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Grid columns={12} gutter={{ base: 8 }}>
					<Grid.Col span={12}>
						<Box bg="white" p="xs" className="borderRadiusAll">
							<Box bg="white" pos="relative">
								<LoadingOverlay
									visible={isLoading}
									zIndex={1000}
									overlayProps={{ radius: "sm", blur: 1 }}
								/>
								<Box
									pl="xs"
									pr={8}
									py={6}
									mb={4}
									className="boxBackground borderRadiusAll"
								>
									<Grid>
										<Grid.Col span={6}>
											<Title order={6} pt={6}>
												{t(
													type === "create"
														? "CreateVendor"
														: "UpdateVendor"
												)}
											</Title>
										</Grid.Col>
										<Grid.Col span={6}>
											<Stack right align="flex-end">
												<>
													{isOnline && (
														<Button
															size="xs"
															className="btnPrimaryBg"
															type="submit"
															id="EntityFormSubmit"
															leftSection={
																<IconDeviceFloppy size={16} />
															}
														>
															<Flex direction="column" gap={0}>
																<Text fz={14} fw={400}>
																	{t(
																		type === "create"
																			? "CreateAndSave"
																			: "UpdateAndSave"
																	)}
																</Text>
															</Flex>
														</Button>
													)}
												</>
											</Stack>
										</Grid.Col>
									</Grid>
								</Box>
								<Box pl="xs" pr="xs" className="borderRadiusAll">
									<ScrollArea
										h={height}
										scrollbarSize={2}
										scrollbars="y"
										type="never"
									>
										<Box>
											<Box mt={8}>
												<InputForm
													tooltip={t("CompanyNameValidateMessage")}
													label={t("CompanyName")}
													placeholder={t("CompanyName")}
													required={true}
													nextField="name"
													form={form}
													name="company_name"
													mt={0}
													id="company_name"
												/>
											</Box>
											<Box mt="xs">
												<InputForm
													form={form}
													tooltip={t("VendorNameValidateMessage")}
													label={t("VendorName")}
													placeholder={t("VendorName")}
													required={true}
													name="name"
													id="name"
													nextField="mobile"
													mt={8}
												/>
											</Box>

											<Box mt="xs">
												<PhoneNumber
													form={form}
													tooltip={
														form.errors.mobile
															? form.errors.mobile
															: t("MobileValidateMessage")
													}
													label={t("VendorMobile")}
													placeholder={t("VendorMobile")}
													required={true}
													name="mobile"
													id="mobile"
													nextField="email"
													mt={8}
												/>
											</Box>
											<Box mt="xs">
												<InputForm
													form={form}
													tooltip={t("InvalidEmail")}
													label={t("Email")}
													placeholder={t("Email")}
													required={false}
													name="email"
													id="email"
													nextField="customer_id"
													mt={8}
												/>
											</Box>
											<Box mt="xs">
												<SelectForm
													tooltip={
														form.errors.customer_id
															? form.errors.customer_id
															: t("ChooseCustomer")
													}
													label={t("ChooseCustomer")}
													placeholder={t("ChooseCustomer")}
													required={false}
													nextField="address"
													name="customer_id"
													form={form}
													dropdownValue={customerDropDownData}
													mt={8}
													id="customer_id"
													searchable={true}
													value={customerData}
													changeValue={setCustomerData}
												/>
											</Box>
											<Box mt="xs">
												<TextAreaForm
													tooltip={t("AddressValidateMessage")}
													label={t("Address")}
													placeholder={t("Address")}
													required={false}
													nextField="EntityFormSubmit"
													name="address"
													form={form}
													mt={8}
													id="address"
												/>
											</Box>
										</Box>
									</ScrollArea>
								</Box>
							</Box>
						</Box>
					</Grid.Col>
				</Grid>
			</form>
		</Box>
	);
}
export default _VendorForm;
