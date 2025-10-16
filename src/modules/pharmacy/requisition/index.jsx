import { Box, Button, Flex, Grid, Progress, ScrollArea, Stack, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";

import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import CoreHeaderNavbar from "@modules/core/CoreHeaderNavbar";
import Navigation from "@components/layout/Navigation";
import { useForm } from "@mantine/form";
import { useOutletContext } from "react-router-dom";
import { ERROR_NOTIFICATION_COLOR, MODULES_PHARMACY, SUCCESS_NOTIFICATION_COLOR } from "@/constants";
import { IconDeviceFloppy } from "@tabler/icons-react";
import InputForm from "@components/form-builders/InputForm";
import TextAreaForm from "@components/form-builders/TextAreaForm";

import { modals } from "@mantine/modals";
import { MASTER_DATA_ROUTES } from "@/constants/routes";
import { storeEntityData } from "@/app/store/core/crudThunk";
import { setRefetchData } from "@/app/store/core/crudSlice";
import { successNotification } from "@components/notification/successNotification";
import { errorNotification } from "@components/notification/errorNotification";
import __FromTable from "./form/__FormTable";
import { getInitialAddItem } from "@modules/pharmacy/requisition/helpers/request";

const module = MODULES_PHARMACY.REQUISITION;

export default function Index() {
	const { t } = useTranslation();
	const form = useForm(getInitialAddItem(t));
	const progress = useGetLoadingProgress();
	const matches = useMediaQuery("(max-width: 64em)");
	const [opened, { open, close }] = useDisclosure(false);
	const { mainAreaHeight } = useOutletContext();

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
			errorNotification(error.message, ERROR_NOTIFICATION_COLOR);
		}
	}

	return (
		<>
			{progress !== 100 ? (
				<Progress
					color="var(--theme-reset-btn-color)"
					size="sm"
					striped
					animated
					value={progress}
					transitionDuration={200}
				/>
			) : (
				<>
					<CoreHeaderNavbar
						module="core"
						pageTitle={t("ManageRequisition")}
						roles={t("Roles")}
						allowZeroPercentage=""
						currencySymbol=""
					/>
					<Box p="8">
						<Grid columns={36} gutter={{ base: 8 }}>
							{!matches && (
								<Grid.Col span={6}>
									<Navigation
										menu="base"
										subMenu={"basePharmacySubmenu"}
										mainAreaHeight={mainAreaHeight}
									/>
								</Grid.Col>
							)}
							<Grid.Col span={matches ? 10 : 10}>
								<Box bg="white" p="xs" className="borderRadiusAll">
									<form onSubmit={form.onSubmit(handleSubmit)}>
										<Box p={"xxs"} bg="var(--theme-primary-color-1)">
											<Stack align="flex-start">{t("AddProduct")}</Stack>
										</Box>
										<ScrollArea h={mainAreaHeight - 140}>
											<Box p={"xxs"}>
												<Grid align="center">
													<Grid.Col span={12} pb={0}></Grid.Col>
												</Grid>
												<Grid align="center">
													<Grid.Col span={12} pb={0}>
														<InputForm
															form={form}
															label={t("Name")}
															tooltip={t("NameValidationMessage")}
															placeholder={t("ParameterName")}
															name="name"
															id="name"
															nextField="sample_value"
															value={form.values.name}
															required={true}
														/>
													</Grid.Col>
												</Grid>
												<Grid align="center">
													<Grid.Col span={12} pb={0}>
														<InputForm
															form={form}
															label={t("SampleValue")}
															tooltip={t("SampleValue")}
															placeholder={t("SampleValue")}
															name="sample_value"
															id="sample_value"
															nextField="unit_name"
															value={form.values.sample_value}
														/>
													</Grid.Col>
												</Grid>
												<Grid align="center">
													<Grid.Col span={12} pb={0}>
														<InputForm
															form={form}
															label={t("UnitName")}
															tooltip={t("UnitName")}
															placeholder={t("UnitName")}
															name="unit_name"
															id="unit_name"
															nextField="reference_value"
															value={form.values.unit_name}
														/>
													</Grid.Col>
												</Grid>
												<Grid align="center">
													<Grid.Col span={12} pb={0}>
														<TextAreaForm
															form={form}
															label={t("ReferenceValue")}
															tooltip={t("ReferenceValue")}
															placeholder={t("ReferenceValue")}
															name="reference_value"
															id="reference_value"
															nextField=""
															value={form.values.reference_value}
														/>
													</Grid.Col>
												</Grid>
											</Box>
										</ScrollArea>
										<Box p={"xxs"} bg="var(--theme-primary-color-1)">
											<Stack right align="flex-end">
												<Button
													size="xs"
													bg="var(--theme-secondary-color-6)"
													type="submit"
													id="EntityFormSubmit"
													leftSection={<IconDeviceFloppy size={16} />}
												>
													<Flex direction={`column`} gap={0}>
														<Text fz={14} fw={400}>
															{t("Add")}
														</Text>
													</Flex>
												</Button>
											</Stack>
										</Box>
									</form>
								</Box>
							</Grid.Col>
							<Grid.Col span={matches ? 20 : 20}>
								<Box bg="white" p="xs" className="borderRadiusAll">
									<__FromTable module={module} open={open} close={close} />
								</Box>
							</Grid.Col>
						</Grid>
					</Box>
				</>
			)}
		</>
	);
}
