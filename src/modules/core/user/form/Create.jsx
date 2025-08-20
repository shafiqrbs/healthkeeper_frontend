import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Button, rem, Grid, Box, ScrollArea, Text, Title, Flex, Stack } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconCheck, IconDeviceFloppy } from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import InputForm from "@components/form-builders/InputForm";
import PasswordInputForm from "@components/form-builders/PasswordInputForm";
import SelectForm from "@components/form-builders/SelectForm";
import PhoneNumber from "@components/form-builders/PhoneNumberInput";
import { useDispatch } from "react-redux";
import { modals } from "@mantine/modals";
import { setInsertType } from "@/app/store/core/crudSlice";
import { notifications } from "@mantine/notifications";
import Shortcut from "../../../shortcut/Shortcut.jsx";
import CustomerGroupDrawer from "../../customer/CustomerGroupDrawer";
import useGlobalDropdownData from "@hooks/dropdown/useGlobalDropdownData.js";
import { editEntityData, storeEntityData } from "@/app/store/core/crudThunk.js";
import useUserDataStoreIntoLocalStorage from "@/common/hooks/local-storage/useUserDataStoreIntoLocalStorage.js";
import { CORE_DROPDOWNS } from "@/app/store/core/utilitySlice.js";
import { MASTER_DATA_ROUTES } from "@/constants/routes.js";
import { getUserFormValues } from "../helpers/request.js";
import { useForm } from "@mantine/form";

export default function Create({ module }) {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { isOnline, mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 100; //TabList height 104
	const form = useForm(getUserFormValues(t));
	const [saveCreateLoading, setSaveCreateLoading] = useState(false);
	const navigate = useNavigate();

	const [groupDrawer, setGroupDrawer] = useState(false);

	useHotkeys(
		[
			[
				"alt+n",
				() => {
					!groupDrawer && document.getElementById("employee_group_id").click();
				},
			],

			[
				"alt+r",
				() => {
					form.reset();
				},
			],
			[
				"alt+s",
				() => {
					!groupDrawer && document.getElementById("EntityFormSubmit").click();
				},
			],
		],
		[]
	);

	const { data: employeeGroupDropdown } = useGlobalDropdownData({
		path: CORE_DROPDOWNS.EMPLOYEE_GROUP.PATH,
		utility: CORE_DROPDOWNS.EMPLOYEE_GROUP.UTILITY,
		params: { "dropdown-type": CORE_DROPDOWNS.EMPLOYEE_GROUP.TYPE },
	});

	const handleSubmit = (values) => {
		modals.openConfirmModal({
			title: <Text size="md"> {t("FormConfirmationTitle")}</Text>,
			children: <Text size="sm"> {t("FormConfirmationMessage")}</Text>,
			labels: { confirm: t("Submit"), cancel: t("Cancel") },
			confirmProps: { color: "red" },
			onCancel: () => console.log("Cancel"),
			onConfirm: async () => {
				const value = {
					url: MASTER_DATA_ROUTES.API_ROUTES.USER.CREATE,
					data: values,
					module,
				};

				const resultAction = await dispatch(storeEntityData(value));

				if (storeEntityData.rejected.match(resultAction)) {
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
				} else if (storeEntityData.fulfilled.match(resultAction)) {
					notifications.show({
						color: "teal",
						title: t("CreateSuccessfully"),
						icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
						loading: false,
						autoClose: 700,
						style: { backgroundColor: "lightgray" },
					});

					setTimeout(() => {
						useUserDataStoreIntoLocalStorage();
						form.reset();
						dispatch(
							setInsertType({
								insertType: "update",
								module,
							})
						);
						dispatch(
							editEntityData({
								url: `${MASTER_DATA_ROUTES.API_ROUTES.USER.UPDATE}/${resultAction?.payload?.data?.data?.id}`,
								module,
							})
						);
						navigate(
							`${MASTER_DATA_ROUTES.NAVIGATION_LINKS.USER.VIEW}/${resultAction?.payload?.data?.data?.id}`
						);
					}, 700);
				}
			},
		});
	};

	return (
		<Box>
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Grid columns={9} gutter={{ base: 8 }}>
					<Grid.Col span={8}>
						<Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
							<Box bg={"white"}>
								<Box
									pl={`xs`}
									pr={8}
									pt={"6"}
									pb={"6"}
									mb={"4"}
									className={"boxBackground borderRadiusAll"}
								>
									<Grid>
										<Grid.Col span={6}>
											<Title order={6} pt={"6"}>
												{t("CreateUser")}
											</Title>
										</Grid.Col>
										<Grid.Col span={6}>
											<Stack right align="flex-end">
												<>
													{!saveCreateLoading && isOnline && (
														<Button
															size="xs"
															bg="var(--theme-primary-color-6)"
															type="submit"
															id="EntityFormSubmit"
															leftSection={<IconDeviceFloppy size={16} />}
														>
															<Flex direction={`column`} gap={0}>
																<Text fz={14} fw={400}>
																	{t("CreateAndSave")}
																</Text>
															</Flex>
														</Button>
													)}
												</>
											</Stack>
										</Grid.Col>
									</Grid>
								</Box>
								<Box pl={`xs`} pr={"xs"} className={"borderRadiusAll"}>
									<ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
										<Box>
											<Box>
												<Grid gutter={{ base: 6 }}>
													<Grid.Col span={12}>
														<Box mt={"8"}>
															<SelectForm
																tooltip={
																	form.errors.employee_group_id
																		? form.errors.employee_group_id
																		: t("EmployeeGroup")
																}
																label={t("EmployeeGroup")}
																placeholder={t("ChooseEmployeeGroup")}
																nextField={"name"}
																name={"employee_group_id"}
																form={form}
																value={form.values.employee_group_id}
																dropdownValue={employeeGroupDropdown}
																mt={8}
																id={"employee_group_id"}
																searchable={false}
																required
															/>
														</Box>
													</Grid.Col>
													{/* <Grid.Col span={1}>
														<Box pt={'xl'}>
                                                            <Tooltip
                                                                ta="center"
                                                                multiline
                                                                bg={'orange.8'}
                                                                offset={{crossAxis: '-110', mainAxis: '5'}}
                                                                withArrow
                                                                transitionProps={{duration: 200}}
                                                                label={t('QuickEmployeeGroup')}
                                                            >
                                                                <ActionIcon variant="outline" bg={'white'}
                                                                            size={'lg'} color="red.5" mt={'1'}
                                                                            aria-label="Settings" onClick={() => {
                                                                    setGroupDrawer(true)
                                                                }}>
                                                                    <IconUsersGroup
                                                                        style={{width: '100%', height: '70%'}}
                                                                        stroke={1.5}/>
                                                                </ActionIcon>
                                                            </Tooltip>
                                                        </Box>
													</Grid.Col>*/}
												</Grid>
											</Box>
											<Box mt={"xs"}>
												<InputForm
													tooltip={
														form.errors.name
															? form.errors.name
															: t("UserNameValidateMessage")
													}
													label={t("Name")}
													placeholder={t("Name")}
													required={true}
													nextField={"username"}
													form={form}
													name={"name"}
													mt={0}
													id={"name"}
												/>
											</Box>
											<Box mt={"xs"}>
												<InputForm
													form={form}
													tooltip={
														form.errors.username
															? form.errors.username
															: t("UserNameValidateMessage")
													}
													label={t("UserName")}
													placeholder={t("UserName")}
													required={true}
													name={"username"}
													id={"username"}
													nextField={"email"}
													mt={8}
												/>
											</Box>
											<Box mt={"xs"}>
												<InputForm
													form={form}
													tooltip={
														form.errors.email
															? form.errors.email
															: t("RequiredAndInvalidEmail")
													}
													label={t("Email")}
													placeholder={t("Email")}
													required={true}
													name={"email"}
													id={"email"}
													nextField={"mobile"}
													mt={8}
												/>
											</Box>
											<Box mt={"xs"}>
												<PhoneNumber
													tooltip={
														form.errors.mobile
															? form.errors.mobile
															: t("MobileValidateMessage")
													}
													label={t("Mobile")}
													placeholder={t("Mobile")}
													required={true}
													nextField={"password"}
													name={"mobile"}
													form={form}
													mt={8}
													id={"mobile"}
												/>
											</Box>
											<Box mt={"xs"}>
												<PasswordInputForm
													tooltip={
														form.errors.password
															? form.errors.password
															: t("RequiredPassword")
													}
													form={form}
													label={t("Password")}
													placeholder={t("Password")}
													required={true}
													name={"password"}
													id={"password"}
													nextField={"confirm_password"}
													mt={8}
												/>
											</Box>
											<Box mt={"xs"}>
												<PasswordInputForm
													form={form}
													tooltip={
														form.errors.confirm_password
															? form.errors.confirm_password
															: t("ConfirmPasswordValidateMessage")
													}
													label={t("ConfirmPassword")}
													placeholder={t("ConfirmPassword")}
													required={true}
													name={"confirm_password"}
													id={"confirm_password"}
													nextField={"EntityFormSubmit"}
													mt={8}
												/>
											</Box>
										</Box>
									</ScrollArea>
								</Box>
							</Box>
						</Box>
					</Grid.Col>
					<Grid.Col span={1}>
						<Box bg={"white"} className={"borderRadiusAll"} pt={"16"}>
							<Shortcut form={form} FormSubmit={"EntityFormSubmit"} Name={"name"} inputType="select" />
						</Box>
					</Grid.Col>
				</Grid>
			</form>
			{groupDrawer && (
				<CustomerGroupDrawer
					groupDrawer={groupDrawer}
					setGroupDrawer={setGroupDrawer}
					saveId={"EntityDrawerSubmit"}
				/>
			)}
		</Box>
	);
}
