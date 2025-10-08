import { useState } from "react";
import { modals } from "@mantine/modals";
import { storeEntityData } from "@/app/store/core/crudThunk";
import { useDispatch } from "react-redux";
import { setRefetchData } from "@/app/store/core/crudSlice";
import { useTranslation } from "react-i18next";
import { Box, Button, Flex, Grid, LoadingOverlay, ScrollArea, Stack, Text } from "@mantine/core";
import { SUCCESS_NOTIFICATION_COLOR, ERROR_NOTIFICATION_COLOR, MODULES_CORE } from "@/constants";
import { MASTER_DATA_ROUTES } from "@/constants/routes";
import { successNotification } from "@components/notification/successNotification";
import { errorNotification } from "@components/notification/errorNotification";
import RequiredAsterisk from "@components/form-builders/RequiredAsterisk";
import { hasLength, useForm } from "@mantine/form";
import SelectForm from "@components/form-builders/SelectForm";
import InputForm from "@components/form-builders/InputForm";
import { useOutletContext } from "react-router-dom";
import GlobalDrawer from "@components/drawers/GlobalDrawer";

const module = MODULES_CORE.DOSAGE;
const modes = ["Dosage", "Bymeal"];
const dosages = ["Cap", "Tab", "Injc"];

export default function CreateDosageDrawer({ opened, close }) {
	const form = useForm({
		initialValues: {
			mode: "",
			name: "",
			name_bn: "",
			dosage_form: "",
			quantity: "",
			instruction: "",
		},
		validate: {
			mode: (value) => {
				if (!value) return t("ModeTypeValidationRequired");
				return null;
			},
			name: hasLength({ min: 1 }),
			name_bn: hasLength({ min: 1 }),
		},
	});
	const [isLoading, setIsLoading] = useState(false);
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 180; //TabList height 104

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
				url: MASTER_DATA_ROUTES.API_ROUTES.DOSAGE.CREATE,
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
				dispatch(setRefetchData({ module, refetching: true }));
				dispatch(setRefetchData({ module: "byMeal", refetching: true }));
				successNotification(t("InsertSuccessfully"), SUCCESS_NOTIFICATION_COLOR);
			}
		} catch (error) {
			errorNotification(error.message, ERROR_NOTIFICATION_COLOR);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<GlobalDrawer opened={opened} close={close} title={t("CreateDosage")} size="32%">
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Grid columns={12} gutter={{ base: 8 }}>
					<Grid.Col span={12}>
						<Box bg="white" pos="relative" h={height}>
							<LoadingOverlay
								visible={isLoading}
								zIndex={1000}
								overlayProps={{ radius: "sm", blur: 1 }}
							/>
							<Stack justify="space-between" className="drawer-form-stack-vertical">
								<ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="hover">
									<Stack>
										<Grid align="center" columns={20} mt="xxxs">
											<Grid.Col span={6}>
												<Text fz="sm">
													{t("Mode")} <RequiredAsterisk />
												</Text>
											</Grid.Col>
											<Grid.Col span={14}>
												<SelectForm
													form={form}
													tooltip={t("ModeFormValidateMessage")}
													placeholder={t("Mode")}
													required={false}
													dropdownValue={modes}
													name="mode"
													id="mode"
													value={form.values.mode}
													nextField="dosage_form"
												/>
											</Grid.Col>
										</Grid>
										<Grid align="center" columns={20} mt="xxxs">
											<Grid.Col span={6}>
												<Text fz="sm">{t("DosageForm")}</Text>
											</Grid.Col>
											<Grid.Col span={14}>
												<SelectForm
													form={form}
													tooltip={t("DosageFormValidateMessage")}
													placeholder={t("DosageForm")}
													required={false}
													dropdownValue={dosages}
													name="dosage_form"
													id="dosage_form"
													value={form.values.dosage_form}
													nextField="name"
												/>
											</Grid.Col>
										</Grid>
										<Grid align="center" columns={20} mt="xxxs">
											<Grid.Col span={6}>
												<Text fz="sm">
													{t("Name")} <RequiredAsterisk />
												</Text>
											</Grid.Col>
											<Grid.Col span={14}>
												<InputForm
													form={form}
													tooltip={t("NameValidateMessage")}
													placeholder={t("Name")}
													required={false}
													name="name"
													id="name"
													nextField="name_bn"
												/>
											</Grid.Col>
										</Grid>
										<Grid align="center" columns={20} mt="xxxs">
											<Grid.Col span={6}>
												<Text fz="sm">
													{t("NameBangla")} <RequiredAsterisk />
												</Text>
											</Grid.Col>
											<Grid.Col span={14}>
												<InputForm
													form={form}
													tooltip={t("NameBanglaValidateMessage")}
													placeholder={t("NameBangla")}
													required={false}
													name="name_bn"
													id="name_bn"
													nextField="quantity"
												/>
											</Grid.Col>
										</Grid>
										<Grid align="center" columns={20} mt="xxxs">
											<Grid.Col span={6}>
												<Text fz="sm">{t("Quantity")}</Text>
											</Grid.Col>
											<Grid.Col span={14}>
												<InputForm
													form={form}
													tooltip={t("NameValidateMessage")}
													placeholder={t("Quantity")}
													required={false}
													name="quantity"
													id="quantity"
													nextField="instruction"
												/>
											</Grid.Col>
										</Grid>
										<Grid align="center" columns={20} mt="xxxs">
											<Grid.Col span={6}>
												<Text fz="sm">{t("Instruction")}</Text>
											</Grid.Col>
											<Grid.Col span={14}>
												<InputForm
													form={form}
													tooltip={t("PriceValidateMessage")}
													placeholder={t("Instruction")}
													required={false}
													name="instruction"
													id="instruction"
													nextField=""
												/>
											</Grid.Col>
										</Grid>
									</Stack>
								</ScrollArea>
								<Box className="drawer-sticky-footer">
									<Flex justify="space-between" align="center">
										<Button
											size="md"
											className="btnPrimaryResetBg"
											type="submit"
											id="EntityFormSubmit"
											/*leftSection={<IconRestore size={16} />}*/
										>
											<Flex direction={`column`} gap={0}>
												<Text>{t("Reset")}</Text>
												<Flex direction={`column`} align={"center"} fz={"12"} c={"gray.6"}>
													alt+r
												</Flex>
											</Flex>
										</Button>
										<Button
											size="md"
											className="btnPrimaryBg"
											type="submit"
											id="EntityFormSubmit"
											/*leftSection={<IconDeviceFloppy size={16} />}*/
										>
											<Flex direction={`column`} gap={0}>
												<Text>{t("CreateAndSave")}</Text>
												<Flex direction={`column`} align={"center"} fz={"12"} c={"white"}>
													alt+s
												</Flex>
											</Flex>
										</Button>
									</Flex>
								</Box>
							</Stack>
						</Box>
					</Grid.Col>
				</Grid>
			</form>
		</GlobalDrawer>
	);
}
