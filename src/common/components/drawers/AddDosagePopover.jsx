import { useState } from "react";
import { ActionIcon, Box, Button, Flex, Grid, LoadingOverlay, Popover, Text, Tooltip } from "@mantine/core";
import { IconPlus, IconRefreshDot, IconUserCircle, IconX } from "@tabler/icons-react";
import InputForm from "@components/form-builders/InputForm";
import { useTranslation } from "react-i18next";
import { useForm } from "@mantine/form";
import InputNumberForm from "@components/form-builders/InputNumberForm";
import { storeEntityData } from "@/app/store/core/crudThunk";
import { useDispatch } from "react-redux";
import { setRefetchData } from "@/app/store/core/crudSlice";
import { SUCCESS_NOTIFICATION_COLOR, ERROR_NOTIFICATION_COLOR, MODULES_CORE } from "@/constants";
import { MASTER_DATA_ROUTES } from "@/constants/routes";
import { successNotification } from "@components/notification/successNotification";
import { errorNotification } from "@components/notification/errorNotification";
import { useAuthStore } from "@/store/useAuthStore";
import useAppLocalStore from "@hooks/useAppLocalStore";

const module = MODULES_CORE.DOSAGE;

export default function AddDosagePopover({ form, bd = "auto" }) {
	const { dosages } = useAppLocalStore();
	const [ key, setKey ] = useState(0);

	const { t } = useTranslation();
	const dispatch = useDispatch();

	// =============== form state management ================
	const [ advanceSearchFormOpened, setAdvanceSearchFormOpened ] = useState(false);
	const [ isLoading, setIsLoading ] = useState(false);

	const advanceSearchForm = useForm({
		initialValues: {
			name: "",
			name_bn: "",
			quantity: "",
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
						errorObject[ key ] = fieldErrors[ key ][ 0 ];
					});
					advanceSearchForm.setErrors(errorObject);
				}
			} else if (storeEntityData.fulfilled.match(resultAction)) {
				advanceSearchForm.reset();
				setAdvanceSearchFormOpened(false);
				setKey(key + 1);
				dispatch(setRefetchData({ module, refetching: true }));
				dispatch(setRefetchData({ module: "byMeal", refetching: true }));
				successNotification(t("InsertSuccessfully"), SUCCESS_NOTIFICATION_COLOR);
				const updateNestedState = useAuthStore.getState()?.updateNestedState;

				updateNestedState("hospitalConfig.dosages", [ ...dosages, resultAction.payload?.data?.data ]);

				setTimeout(() => {
					form.setFieldValue("medicine_dosage_id", resultAction.payload?.data?.data?.id?.toString());
				}, 500);
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
						label={t("AddDosage")}
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
								<Text ta="left" fw={600} pl={'md'} fz="sm">
									{t("AddDosage")}
								</Text>
							</Box>
							<Box className="borderRadiusAll" bg="var(--mantine-color-white)">
								<Box p="xs">
									<Grid columns={20} gutter={{ base: "3xs" }}>
										<Grid.Col span={6}>
											<Text ta="left" fw={600} fz="sm" mt="3xs">
												{t("DosageName")}{" "}
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
												placeholder={t("DosageName")}
												nextField={"name_bn"}
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
												{t("DosageNameBangla")}
											</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<InputForm
												key={key}
												tooltip={t("NameBanglaValidateMessage")}
												label=""
												placeholder={t("DosageNameBangla")}
												nextField={"quantity"}
												form={advanceSearchForm}
												name={"name_bn"}
												id={"name_bn"}
												rightIcon={""}
											/>
										</Grid.Col>
									</Grid>
								</Box>
								<Box p="xs">
									<Grid columns={20} gutter={{ base: "3xs" }}>
										<Grid.Col span={6}>
											<Text ta="left" fw={600} fz="sm" mt="3xs">
												{t("Daily Quantity")}
											</Text>
										</Grid.Col>
										<Grid.Col span={4}>
											<InputNumberForm
												key={key}
												tooltip={t("QuantityValidateMessage")}
												label=""
												placeholder={t("Quantity")}
												nextField={"EntityFormSubmit"}
												form={advanceSearchForm}
												name={"quantity"}
												id={"quantity"}
												rightIcon={""}
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
												onClick={handleReset}>
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
