import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {Button, rem, Grid, Box, ScrollArea, Text, Title, Flex, Stack, SegmentedControl} from "@mantine/core";
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
import DateSelectorForm from "@components/form-builders/DateSelectorForm";

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

	const { data: employeeDesignations } = useGlobalDropdownData({
		path: CORE_DROPDOWNS.DESIGNATION.PATH,
		utility: CORE_DROPDOWNS.DESIGNATION.UTILITY,
		params: { "dropdown-type": CORE_DROPDOWNS.DESIGNATION.TYPE },
	});

	const { data: employeeDepartments } = useGlobalDropdownData({
		path: CORE_DROPDOWNS.DEPARTMENT.PATH,
		utility: CORE_DROPDOWNS.DEPARTMENT.UTILITY,
		params: { "dropdown-type": CORE_DROPDOWNS.DEPARTMENT.TYPE },
	});

	const handleGenderChange = (val) => {
		form.setFieldValue("gender", val);
	};


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
				<Grid columns={8} gutter={{ base: 8 }}>
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
												<Grid align="center" columns={20}>
													<Grid.Col span={6}>
														<Text mt={'xs'} fz="sm">{t("EmployeeGroup")}</Text>
													</Grid.Col>
													<Grid.Col span={14}>
														<Box mt={"8"}>
															<SelectForm
																tooltip={
																	form.errors.employee_group_id
																		? form.errors.employee_group_id
																		: t("EmployeeGroup")
																}
																placeholder={t("ChooseEmployeeGroup")}
																nextField={"name"}
																name={"employee_group_id"}
																form={form}
																value={form.values.employee_group_id}
																dropdownValue={employeeGroupDropdown}
																id={"employee_group_id"}
																searchable={false}
																required
															/>
														</Box>
													</Grid.Col>
												</Grid>
											</Box>
											<Box>
												<Grid align="center" columns={20}>
													<Grid.Col span={6}>
														<Text mt={'xs'} fz="sm">{t("Department")}</Text>
													</Grid.Col>
													<Grid.Col span={14}>
														<SelectForm
															tooltip={
																form.errors.department_id
																	? form.errors.department_id
																	: t("EmployeeGroup")
															}
															placeholder={t("ChooseEmployeeGroup")}
															nextField={"employee_id"}
															name={"department_id"}
															id={"department_id"}
															form={form}
															value={form.values.department_id}
															dropdownValue={employeeDepartments}
															searchable={false}
															required
														/>
													</Grid.Col>
												</Grid>
											</Box>
											<Box>
												<Grid align="center" columns={20}>
													<Grid.Col span={6}>
														<Text mt={'xs'} fz="sm">{t("EmployeeID")}</Text>
													</Grid.Col>
													<Grid.Col span={14}>
												<InputForm
													tooltip={
														form.errors.employee_id
															? form.errors.employee_id
															: t("EmployeeIDValidateMessage")
													}
													placeholder={t("EmployeeID")}
													required={true}
													nextField={"name"}
													form={form}
													name={"employee_id"}
													id={"employee_id"}
												/>
													</Grid.Col>
												</Grid>
											</Box>
											<Box>
												<Grid align="center" columns={20}>
													<Grid.Col span={6}>
														<Text mt={'xs'} fz="sm">{t("Name")}</Text>
													</Grid.Col>
													<Grid.Col span={14}>
												<InputForm
													tooltip={
														form.errors.name
															? form.errors.name
															: t("UserNameValidateMessage")
													}
													placeholder={t("Name")}
													required={true}
													nextField={"designation_id"}
													form={form}
													name={"name"}
													id={"name"}
												/>
													</Grid.Col>
												</Grid>
											</Box>
											<Box mb={"xs"}>
											<Grid align="center" columns={20}>
												<Grid.Col span={6}>
													<Text mt={'xs'} fz="sm">{t("Gender")}</Text>
												</Grid.Col>
												<Grid.Col span={12} pb={0}>
													<SegmentedControl
														fullWidth
														color="var(--theme-primary-color-6)"
														value={form.values.gender}
														id="gender"
														name="gender"
														onChange={(val) => handleGenderChange(val)}
														data={[
															{ label: t("male"), value: "male" },
															{ label: t("female"), value: "female" },
															{ label: t("other"), value: "other" },
														]}
													/>
												</Grid.Col>
											</Grid>
											</Box>
											<Box>

												<Grid align="center" columns={20}>
														<Grid.Col span={6}>
															<Text fz="sm">{t("Designation")}</Text>
														</Grid.Col>
														<Grid.Col span={14}>
															<SelectForm
																tooltip={
																	form.errors.designation_id
																		? form.errors.designation_id
																		: t("DesignationID")
																}
																placeholder={t("ChooseEmployeeGroup")}
																nextField={"dob"}
																name={"designation_id"}
																form={form}
																value={form.values.designation_id}
																dropdownValue={employeeDesignations}
																id={"designation_id"}
																searchable={false}
																required
															/>
													</Grid.Col>
												</Grid>
											</Box>
											<Box mb={'xs'}>
											<Grid align="center" columns={20}>
												<Grid.Col span={6}>
													<Text fz="sm">{t("dateOfBirth")}</Text>
												</Grid.Col>
												<Grid.Col span={14} pb={0}>
													<DateSelectorForm
														form={form}
														placeholder="01-01-2020"
														tooltip={t("enterDateOfBirth")}
														name="dob"
														id="dob"
														nextField="email"
														value={form.values.dob}
														required
														disabledFutureDate
													/>
												</Grid.Col>
											</Grid>
											</Box>

											<Box>
												<Grid align="center" columns={20}>
													<Grid.Col span={6}>
														<Text fz="sm">{t("eMailAddress")}</Text>
													</Grid.Col>
													<Grid.Col span={14}>
												<InputForm
													form={form}
													tooltip={
														form.errors.email
															? form.errors.email
															: t("RequiredAndInvalidEmail")
													}
													placeholder={t("Email")}
													required={true}
													name={"email"}
													id={"email"}
													nextField={"mobile"}
												/>
													</Grid.Col>
												</Grid>
											</Box>
											<Box>
												<Grid align="center" columns={20}>
													<Grid.Col span={6}>
														<Text fz="sm">{t("MobilNo")}</Text>
													</Grid.Col>
													<Grid.Col span={14}>
												<PhoneNumber
													tooltip={
														form.errors.mobile
															? form.errors.mobile
															: t("MobileValidateMessage")
													}
													placeholder={t("Mobile")}
													required={true}
													nextField={"username"}
													name={"mobile"}
													form={form}
													id={"mobile"}
												/>
													</Grid.Col>
												</Grid>
											</Box>
											<Box>
												<Grid align="center" columns={20}>
													<Grid.Col span={6}>
														<Text fz="sm">{t("Address")}</Text>
													</Grid.Col>
													<Grid.Col span={14}>
														<InputForm
															form={form}
															tooltip={
																form.errors.address
																	? form.errors.address
																	: t("RequiredAddress")
															}
															placeholder={t("EnterAddress")}
															required={true}
															name={"address"}
															id={"address"}
															nextField=''
														/>
													</Grid.Col>
												</Grid>
											</Box>
											<Box ml={'-xs'} mr={'-xs'} className={'inner-title-box'}>
												<Title order={6}>
													{t("LoginCredential")}
												</Title>
											</Box>
											<Box>
												<Grid align="center" columns={20}>
													<Grid.Col span={6}>
														<Text fz="sm">{t("UserName")}</Text>
													</Grid.Col>
													<Grid.Col span={14}>
														<InputForm
															form={form}
															tooltip={
																form.errors.username
																	? form.errors.username
																	: t("UserNameValidateMessage")
															}
															placeholder={t("UserName")}
															required={true}
															name={"username"}
															id={"username"}
															nextField={"email"}
														/>
													</Grid.Col>
												</Grid>
											</Box>
											<Box>
												<Grid align="center" columns={20}>
													<Grid.Col span={6}>
														<Text fz="sm">{t("Password")}</Text>
													</Grid.Col>
													<Grid.Col span={14}>
												<PasswordInputForm
													tooltip={
														form.errors.password
															? form.errors.password
															: t("RequiredPassword")
													}
													form={form}
													placeholder={t("Password")}
													required={true}
													name={"password"}
													id={"password"}
													nextField={"confirm_password"}
												/>
													</Grid.Col>
												</Grid>

											</Box>
											<Box>
												<Grid align="center" columns={20}>
													<Grid.Col span={6}>
														<Text fz="sm">{t("ConfirmPassword")}</Text>
													</Grid.Col>
													<Grid.Col span={14}>
												<PasswordInputForm
													form={form}
													tooltip={
														form.errors.confirm_password
															? form.errors.confirm_password
															: t("ConfirmPasswordValidateMessage")
													}
													placeholder={t("ConfirmPassword")}
													required={true}
													name={"confirm_password"}
													id={"confirm_password"}
													nextField={"EntityFormSubmit"}
												/>
													</Grid.Col>
												</Grid>
											</Box>

										</Box>
									</ScrollArea>
								</Box>
							</Box>
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
