import { useState } from "react";
import { ActionIcon, Box, Button, Flex, Grid, LoadingOverlay, Popover, Text, Tooltip } from "@mantine/core";
import { IconPlus, IconRefreshDot, IconUserCircle, IconX } from "@tabler/icons-react";
import InputForm from "@components/form-builders/InputForm";
import { useTranslation } from "react-i18next";
import { useForm } from "@mantine/form";
import { storeEntityData } from "@/app/store/core/crudThunk";
import { useDispatch } from "react-redux";
import { SUCCESS_NOTIFICATION_COLOR, ERROR_NOTIFICATION_COLOR, MODULES_CORE } from "@/constants";
import { HOSPITAL_DATA_ROUTES, MASTER_DATA_ROUTES } from "@/constants/routes";
import { errorNotification } from "@components/notification/errorNotification";
import { useAuthStore } from "@/store/useAuthStore";
import useAppLocalStore from "@hooks/useAppLocalStore";
import SelectForm from "@components/form-builders/SelectForm";
import { showNotificationComponent } from "@components/core-component/showNotificationComponent";

const module = MODULES_CORE.PARTICULAR;

export default function AddGenericPopover({ bd = "auto", dbMedicines, setDbMedicines, prescription_id }) {
	const { dosages } = useAppLocalStore();
	const [key, setKey] = useState(0);

	const { t } = useTranslation();
	const dispatch = useDispatch();

	// =============== form state management ================
	const [advanceSearchFormOpened, setAdvanceSearchFormOpened] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const advanceSearchForm = useForm({
		initialValues: {
			name: "",
			generic_name: "",
			dosage: "",
		},
		validate: {
			name: (value) => {
				if (!value || value.trim() === "") {
					return t("FieldIsRequired");
				}
				return null;
			},
		},
	});

	const handleReset = () => {
		advanceSearchForm.reset();
		setKey(key + 1);
	};

	const handleSubmit = async (values) => {
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
					advanceSearchForm.setErrors(errorObject);
				}
			} else if (storeEntityData.fulfilled.match(resultAction)) {
				advanceSearchForm.reset();
				setAdvanceSearchFormOpened(false);
				setKey(key + 1);

				const value = {
					url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.MEDICINE_UPDATE}`,
					data: {
						medicine_name: values.name,
						generic: values.generic_name,
						medicine_dosage_id: values.dosage,
						prescription_id,
						mode: "new",
					},
					module,
				};

				const resultAction = await dispatch(storeEntityData(value));

				if (storeEntityData.rejected.match(resultAction)) {
					showNotificationComponent(resultAction.payload.message, "red", "lightgray", true, 700, true);
				} else {
					const data = resultAction?.payload?.data?.data || {};
					const newMedicineData = {
						company: data?.company || "",
						medicine_name: data?.medicine_name || "",
						generic: data?.generic || "",
						generic_id: data?.generic_id,
						medicine_id: data?.medicine_id,
						stock_item_id: data?.stock_item_id,
						medicine_dosage_id: data?.medicine_dosage_id || null,
						medicine_bymeal_id: data?.medicine_bymeal_id || null,
						dose_details: data?.dose_details || "",
						dose_details_bn: data?.dose_details_bn || "",
						daily_quantity: data?.daily_quantity || 0,
						by_meal: data?.by_meal || "",
						by_meal_bn: data?.by_meal_bn || "",
						is_active: data?.is_active || 0,
						id: data?.id,
					};
					showNotificationComponent(t("InsertSuccessfully"), SUCCESS_NOTIFICATION_COLOR);
					const updateNestedState = useAuthStore.getState()?.updateNestedState;
					updateNestedState(
						"hospitalConfig.localMedicines",
						resultAction.payload?.data?.data?.localMedicines
					);
					setDbMedicines([...dbMedicines, newMedicineData]);
				}
			}
		} catch (error) {
			errorNotification(error.message, ERROR_NOTIFICATION_COLOR);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Box style={{ pointerEvents: "auto" }}>
			<Popover
				width="650"
				trapFocus
				position="bottom"
				withArrow
				shadow="xl"
				onDismiss={() => setAdvanceSearchFormOpened(false)}
				opened={advanceSearchFormOpened}
			>
				<Popover.Target>
					<Tooltip
						multiline
						bg="var(--theme-error-color)"
						offset={{ crossAxis: "-52", mainAxis: "5" }}
						position="top"
						ta="center"
						withArrow
						transitionProps={{ duration: 200 }}
						label={t("AddGeneric")}
					>
						<ActionIcon
							c="var(--mantine-color-white)"
							onMouseDown={(event) => {
								event.stopPropagation();
								setAdvanceSearchFormOpened((prev) => !prev);
							}}
							bd={bd}
							style={{ pointerEvents: "auto", cursor: "pointer" }}
						>
							<IconPlus size={16} stroke={1.5} />
						</ActionIcon>
					</Tooltip>
				</Popover.Target>
				<Popover.Dropdown>
					<form
						onSubmit={(event) => {
							event.stopPropagation();
							advanceSearchForm.onSubmit(handleSubmit)(event);
						}}
					>
						<Box mt="es" pos="relative">
							<LoadingOverlay
								visible={isLoading}
								zIndex={1000}
								overlayProps={{ radius: "sm", blur: 1 }}
							/>
							<Box className="boxBackground borderRadiusAll" pt="les" mb="es" pb="les">
								<Text ta="left" fw={600} pl={"md"} fz="sm">
									{t("AddGeneric")}
								</Text>
							</Box>
							<Box className="borderRadiusAll" bg="var(--mantine-color-white)">
								<Box p="xs">
									<Grid columns={20} gutter={{ base: "3xs" }}>
										<Grid.Col span={6}>
											<Text ta="left" fw={600} fz="sm" mt="3xs">
												{t("Name")}{" "}
												<Text component="span" c="red">
													*
												</Text>
											</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<InputForm
												key={key}
												tooltip={t("NameValidateMessage")}
												label=""
												placeholder={t("Name")}
												nextField={"generic_name"}
												form={advanceSearchForm}
												name={"name"}
												id={"name"}
												leftSection={<IconUserCircle size={16} opacity={0.5} />}
												rightIcon={""}
											/>
										</Grid.Col>
									</Grid>
								</Box>
								<Box p="xs">
									<Grid columns={20} gutter={{ base: "3xs" }}>
										<Grid.Col span={6}>
											<Text ta="left" fw={600} fz="sm" mt="3xs">
												{t("GenericName")}
											</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<InputForm
												key={key}
												tooltip={t("NameBanglaValidateMessage")}
												label=""
												placeholder={t("GenericName")}
												nextField={"generic_name"}
												form={advanceSearchForm}
												name={"generic_name"}
												id={"generic_name_bn"}
												rightIcon={""}
											/>
										</Grid.Col>
									</Grid>
								</Box>
								<Box p="xs">
									<Grid columns={20} gutter={{ base: "3xs" }}>
										<Grid.Col span={6}>
											<Text ta="left" fw={600} fz="sm" mt="3xs">
												{t("Dosage")}
											</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<SelectForm
												clearable
												form={advanceSearchForm}
												tooltip={t("DosageValidateMessage")}
												placeholder={t("Dosage")}
												name={"dosage"}
												id={"dosage"}
												nextField={"EntityFormSubmit"}
												dropdownValue={dosages?.map((dosage) => ({
													value: dosage.id?.toString(),
													label: dosage.name,
												}))}
												comboboxProps={{ withinPortal: false }}
											/>
										</Grid.Col>
									</Grid>
								</Box>
							</Box>
						</Box>
						<Box className="" p="les">
							<Grid columns={20} gutter={{ base: "3xs" }}>
								<Grid.Col span={6} />
								<Grid.Col span={14}>
									<Flex gap="es" align="left" justify="left">
										<Flex gap="es" align="center">
											<Button
												size="xs"
												color="var(--theme-primary-color-6)"
												type="submit"
												id={"EntityFormSubmit"}
												leftSection={<IconPlus size={16} />}
												onClick={(event) => {
													event.stopPropagation();
												}}
											>
												<Text fz="sm" fw={400}>
													{t("Add")}
												</Text>
											</Button>
											<Button
												variant="transparent"
												size="sm"
												bg="var(--theme-green-color-6)"
												onClick={handleReset}
											>
												<IconRefreshDot size={16} stroke={1.5} />
											</Button>
											<Button
												variant="transparent"
												c="var(--theme-error-color)"
												bg="white"
												size="xs"
												onClick={() => setAdvanceSearchFormOpened(false)}
												leftSection={<IconX size={16} stroke={1.5} />}
											>
												<Text fz="sm" fw={400}>
													{t("Close")}
												</Text>
											</Button>
										</Flex>
									</Flex>
								</Grid.Col>
							</Grid>
						</Box>
					</form>
				</Popover.Dropdown>
			</Popover>
		</Box>
	);
}
