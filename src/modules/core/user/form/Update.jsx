import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
	Button,
	Grid,
	Box,
	ScrollArea,
	Text,
	LoadingOverlay,
	Title,
	Flex,
	Stack,
	Tooltip,
	Image,
	SegmentedControl,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconArrowsExchange, IconDeviceFloppy } from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { setInsertType } from "@/app/store/core/crudSlice";
import PasswordInputForm from "@components/form-builders/PasswordInputForm";
import SelectForm from "@components/form-builders/SelectForm";
import InputForm from "@components/form-builders/InputForm";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import PhoneNumber from "@components/form-builders/PhoneNumberInput";
import Shortcut from "../../../shortcut/Shortcut.jsx";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import accessControlRoleStaticData from "@/common/json/accessControlRole.json";
import { updateEntityData, updateEntityDataWithFile } from "@/app/store/core/crudThunk.js";
import SwitchForm from "@components/form-builders/SwitchForm.jsx";
import { getUserEditFormData } from "../helpers/request.js";
import useGlobalDropdownData from "@hooks/dropdown/useGlobalDropdownData.js";
import { CORE_DROPDOWNS } from "@/app/store/core/utilitySlice.js";
import { MASTER_DATA_ROUTES } from "@/constants/routes.js";
import { showNotificationComponent } from "@components/core-component/showNotificationComponent.jsx";
import DateSelectorForm from "@components/form-builders/DateSelectorForm";
import dayjs from "dayjs";

export default function Update({ module }) {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { isOnline, mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 100;
	const [saveCreateLoading, setSaveCreateLoading] = useState(false);
	const [setFormData, setFormDataForUpdate] = useState(false);
	const [formLoad, setFormLoad] = useState(true);
	const entityEditData = useSelector((state) => state.crud[module].editData);
	const formLoading = useSelector((state) => state.crud[module].isLoading);
	const navigate = useNavigate();

	const [employeeGroupData, setEmployeeGroupData] = useState(null);
	const [departmentData, setDepartmentData] = useState(null);
	const [designationData, setDesignationData] = useState(null);

	const form = useForm(getUserEditFormData(entityEditData, t));

	useEffect(() => {
		setFormLoad(true);
		setFormDataForUpdate(true);
	}, [dispatch, formLoading]);

	const handleFormReset = () => {
		if (entityEditData) {
			const originalValues = {
				name: entityEditData?.name || "",
				username: entityEditData?.username || "",
				email: entityEditData?.email || "",
				mobile: entityEditData?.mobile || "",
				password: "",
				confirm_password: "",
			};
			form.setValues(originalValues);
		}
	};

	useEffect(() => {
		if (entityEditData) {
			form.setValues({
				employee_group_id: entityEditData?.employee_group_id || "",
				name: entityEditData?.name || "",
				employee_id: entityEditData?.employee_id || "",
				username: entityEditData?.username || "",
				email: entityEditData?.email || "",
				mobile: entityEditData?.mobile || "",
				enabled: entityEditData?.enabled || 0,
				alternative_email: entityEditData?.alternative_email || null,
				designation_id: entityEditData?.designation_id || null,
				department_id: entityEditData?.department_id || null,
				address: entityEditData?.address || null,
				about_me: entityEditData?.about_me || null,
				gender: entityEditData?.gender || "male",
				dob: new Date() || null,
			});
		}
		console.log(form.values.dob)
		setTimeout(() => {
			setFormLoad(false);
			setFormDataForUpdate(false);
		}, 500);
	}, [dispatch, entityEditData]);

	useHotkeys(
		[
			[
				"alt+n",
				() => {
					document.getElementById("name").focus();
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
					document.getElementById("EntityFormSubmit").click();
				},
			],
		],
		[]
	);

	// Access control role management - FIXED VERSION
	const [accessControlRole, setAccessControlRole] = useState([]);

	const [defaultGroupData] = useState([
		{ Group: "Operator", actions: [] },
		{ Group: "Doctor", actions: [] },
		{ Group: "Nurse", actions: [] },
		{ Group: "Medicine", actions: [] },
		{ Group: "Billing", actions: [] },
		{ Group: "Reports", actions: [] },
		{ Group: "Admin", actions: [] },
		{ Group: "Accounting", actions: [] },
	]);

	const [selectedAccessControlRoleData, setSelectedAccessControlRoleData] = useState([...defaultGroupData]);

	// Initialize access control roles when component mounts
	useEffect(() => {
		if (accessControlRoleStaticData && accessControlRoleStaticData.length > 0) {
			setAccessControlRole([...accessControlRoleStaticData]);
		}
	}, []);

	// Handle entity edit data loading
	useEffect(() => {
		if (entityEditData?.access_control_roles && Array.isArray(entityEditData.access_control_roles)) {
			if (entityEditData.access_control_roles.length > 0) {
				// Set the selected data from entityEditData
				setSelectedAccessControlRoleData([...entityEditData.access_control_roles]);
			} else {
				// Reset to default if no roles are assigned
				setSelectedAccessControlRoleData([...defaultGroupData]);
			}
		} else {
			// Initialize with default empty structure if no data
			setSelectedAccessControlRoleData([...defaultGroupData]);
		}
	}, [entityEditData?.access_control_roles]);

	// Remove matching actions from available list when selected data changes
	useEffect(() => {
		if (selectedAccessControlRoleData.length > 0 && accessControlRoleStaticData) {
			const result = removeMatchingActions([...accessControlRoleStaticData], selectedAccessControlRoleData);
			setAccessControlRole(result);
		}
	}, [selectedAccessControlRoleData]);

	// Fixed removeMatchingActions function
	const removeMatchingActions = (sourceData, selectedData) => {
		return sourceData.map((group1) => {
			const matchingGroup = selectedData.find((group2) => group2.Group === group1.Group);

			if (matchingGroup && matchingGroup.actions && matchingGroup.actions.length > 0) {
				return {
					...group1,
					actions: group1.actions.filter((action1) => {
						return !matchingGroup.actions.some((action2) => action2.id === action1.id);
					}),
				};
			}
			return { ...group1 };
		});
	};

	// Fixed select handler
	const handleSelectAccessControlRoleData = (group, action) => {
		// Remove from available (accessControlRole)
		setAccessControlRole((prevAvailable) =>
			prevAvailable.map((g) => {
				if (g.Group === group.Group) {
					return {
						...g,
						actions: g.actions.filter((a) => a.id !== action.id),
					};
				}
				return g;
			})
		);

		// Add to selected (selectedAccessControlRoleData)
		setSelectedAccessControlRoleData((prevSelected) =>
			prevSelected.map((g) => {
				if (g.Group === group.Group) {
					return {
						...g,
						actions: [...g.actions, action],
					};
				}
				return g;
			})
		);
	};

	// Fixed deselect handler
	const handleDeselectAccessControlRoleData = (group, action) => {
		// Remove from selected (selectedAccessControlRoleData)
		setSelectedAccessControlRoleData((prevSelected) =>
			prevSelected.map((g) => {
				if (g.Group === group.Group) {
					return {
						...g,
						actions: g.actions.filter((a) => a.id !== action.id),
					};
				}
				return g;
			})
		);

		// Add back to available (accessControlRole)
		setAccessControlRole((prevAvailable) =>
			prevAvailable.map((g) => {
				if (g.Group === group.Group) {
					return {
						...g,
						actions: [...g.actions, action],
					};
				}
				return g;
			})
		);
	};

	// Image handling
	const [profileImage, setProfileImage] = useState([]);
	const [digitalSignature, setDigitalSignature] = useState([]);

	const renderImagePreview = (imageArray, fallbackSrc = null) => {
		if (imageArray.length > 0) {
			const imageUrl = URL.createObjectURL(imageArray[0]);
			return (
				<Flex h={150} justify={"center"} align={"center"} mt={"xs"}>
					<Image h={150} w={150} fit="cover" src={imageUrl} onLoad={() => URL.revokeObjectURL(imageUrl)} />
				</Flex>
			);
		} else if (fallbackSrc) {
			return (
				<Flex h={150} justify={"center"} align={"center"} mt={"xs"}>
					<Image h={150} w={150} fit="cover" src={fallbackSrc} />
				</Flex>
			);
		}
		return null;
	};

	// Dropdown data
	const { data: employeeGroupDropdown } = useGlobalDropdownData({
		path: CORE_DROPDOWNS.EMPLOYEE_GROUP.PATH,
		utility: CORE_DROPDOWNS.EMPLOYEE_GROUP.UTILITY,
		params: { "dropdown-type": CORE_DROPDOWNS.EMPLOYEE_GROUP.TYPE },
	});

	const { data: designationDropdown } = useGlobalDropdownData({
		path: CORE_DROPDOWNS.DESIGNATION.PATH,
		utility: CORE_DROPDOWNS.DESIGNATION.UTILITY,
		params: { "dropdown-type": CORE_DROPDOWNS.DESIGNATION.TYPE },
	});

	const { data: departmentDropdown } = useGlobalDropdownData({
		path: CORE_DROPDOWNS.DEPARTMENT.PATH,
		utility: CORE_DROPDOWNS.DEPARTMENT.UTILITY,
		params: { "dropdown-type": CORE_DROPDOWNS.DEPARTMENT.TYPE },
	});

	const handleGenderChange = (val) => {
		form.setFieldValue("gender", val);
	};
	const handleSubmit = (values) => {
		const formattedDOB = dayjs(values.dob).format("YYYY-MM-DD");

		const formData = {
			...values,
			access_control_role: selectedAccessControlRoleData,
			dob: formattedDOB,
		};

		modals.openConfirmModal({
			title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
			children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
			labels: { confirm: t("Submit"), cancel: t("Cancel") },
			confirmProps: { color: "red" },
			onCancel: () => console.info("Cancel"),
			onConfirm: async () => {
				setSaveCreateLoading(true);
				const value = {
					url: `${MASTER_DATA_ROUTES.API_ROUTES.USER.UPDATE}/${entityEditData.id}`,
					data: formData,
					module,
				};

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
					setSaveCreateLoading(false);
				} else if (updateEntityData.fulfilled.match(resultAction)) {
					showNotificationComponent(t("UpdateSuccessfully"), "teal", "lightgray");
					setTimeout(() => {
						form.reset();
						dispatch(setInsertType({ insertType: "create", module }));
						setSaveCreateLoading(false);
						navigate(MASTER_DATA_ROUTES.NAVIGATION_LINKS.USER.INDEX, { replace: true });
					}, 700);
				}
			},
		});
	};

	const handleProfileImageDrop = (files) => {
		if (files.length > 0) {
			const value = {
				url: `core/user/image-inline/${entityEditData.id}`,
				data: {
					profile_image: files[0],
				},
				module,
			};
			dispatch(updateEntityDataWithFile(value));
			setProfileImage(files);
		}
	};

	const handleDigitalSignatureDrop = (files) => {
		if (files.length > 0) {
			const value = {
				url: `core/user/image-inline/${entityEditData.id}`,
				data: {
					digital_signature: files[0],
				},
				module,
			};
			dispatch(updateEntityDataWithFile(value));
			setDigitalSignature(files);
		}
	};


	return (
		<Box>
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Box>
					<Grid columns={24} gutter={{ base: 8 }}>
						{/* User Information */}
						<Grid.Col span={7}>
							<Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
								<Box bg={"white"}>
									<Box
										p={`xs`}
										pr={8}
										pt={"6"}
										pb={"6"}
										mb={"4"}
										className={"boxBackground borderRadiusAll"}
									>
										<Grid>
											<Grid.Col span={6}>
												<Title order={6} pt={"6"} pb={4}>
													{t("UpdateUser")}
												</Title>
											</Grid.Col>
										</Grid>
									</Box>
									<Box pl={`xs`} pr={"xs"} className={"borderRadiusAll"}>
										<ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
											<Box>
												<LoadingOverlay
													visible={formLoad}
													zIndex={1000}
													overlayProps={{ radius: "sm", blur: 2 }}
													loaderProps={{ color: "red.6" }}
												/>
												<Box>
													<Grid gutter={{ base: 6 }}>
														<Grid.Col span={12}>
															<Box mt={"8"}>
																<SelectForm
																	tooltip={t("EmployeeGroup")}
																	label={t("EmployeeGroup")}
																	placeholder={t("ChooseEmployeeGroup")}
																	required={true}
																	nextField={"employee_id"}
																	name={"employee_group_id"}
																	form={form}
																	dropdownValue={employeeGroupDropdown}
																	mt={8}
																	id={"employee_group_id"}
																	searchable={false}
																	value={
																		employeeGroupData
																			? employeeGroupData
																			: String(
																					entityEditData?.employee_group_id ||
																						""
																			  )
																	}
																	changeValue={setEmployeeGroupData}
																/>
															</Box>
														</Grid.Col>
													</Grid>
												</Box>
												<Box mt={"xs"}>
													<InputForm
														tooltip={t("EmployeeIDValidateMessage")}
														label={t("EmployeeID")}
														placeholder={t("EmployeeID")}
														required={false}
														nextField={"name"}
														form={form}
														name={"employee_id"}
														mt={0}
														id={"employee_id"}
													/>
												</Box>
												<Box mt={"xs"}>
													<InputForm
														tooltip={t("UserNameValidateMessage")}
														label={t("Name")}
														placeholder={t("Name")}
														required={true}
														nextField={"email"}
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
														nextField={"username"}
														name={"mobile"}
														form={form}
														mt={8}
														id={"mobile"}
													/>
												</Box>
												<Box ml={"-xs"} mr={"-xs"} className={"inner-title-box"}>
													<Title order={6}>{t("LoginCredential")}</Title>
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
														nextField={"password"}
														mt={8}
													/>
												</Box>
												<Box mt={"xs"}>
													<PasswordInputForm
														form={form}
														tooltip={t("RequiredPassword")}
														label={t("Password")}
														placeholder={t("Password")}
														required={false}
														name={"password"}
														id={"password"}
														nextField={"confirm_password"}
														mt={8}
													/>
												</Box>
												<Box mt={"xs"}>
													<PasswordInputForm
														form={form}
														tooltip={t("ConfirmPasswordValidateMessage")}
														label={t("ConfirmPassword")}
														placeholder={t("ConfirmPassword")}
														required={false}
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

						{/* Access Control */}
						<Grid.Col span={9}>
							<Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
								<Box bg={"white"}>
									<Box
										pl={`xs`}
										pr={8}
										pt={"6"}
										pb={"6"}
										mb={4}
										className={"boxBackground borderRadiusAll"}
									>
										<Grid>
											<Grid.Col span={6}>
												<Title order={6} pt={4} pb={4}>
													{t("Enable&ACLInformation")}
												</Title>
											</Grid.Col>
										</Grid>
									</Box>
								</Box>
								<Box pl={`xs`} pr={"xs"} className={"borderRadiusAll"}>
									<ScrollArea h={height + 1} scrollbarSize={2} scrollbars="y" type="never">
										<Grid columns={12} gutter={0}>
											<Grid.Col span={6}>
												<Box mt={"md"} ml={"xs"}>
													<LoadingOverlay
														visible={formLoad}
														zIndex={1000}
														overlayProps={{ radius: "sm", blur: 2 }}
														loaderProps={{ color: "red.6" }}
													/>
													<Grid gutter={{ base: 1 }}>
														<Grid.Col span={2}>
															<SwitchForm
																tooltip={t("Status")}
																label=""
																nextField={"EntityFormSubmit"}
																name={"enabled"}
																form={form}
																color="red"
																id={"enabled"}
																position={"left"}
																checked={entityEditData?.enabled || false}
															/>
														</Grid.Col>
														<Grid.Col ml={"xs"} span={6} fz={"sm"} pt={"1"}>
															{t("Enabled")}
														</Grid.Col>
													</Grid>
												</Box>
											</Grid.Col>
										</Grid>
										<Box mt={"sm"}>
											<Text fz={14} fw={400}>
												{t("AccessControlRole")}
											</Text>
										</Box>
										<Grid columns={24} gutter={0}>
											<Grid.Col span={11}>
												<Box mt={"xs"} className={"borderRadiusAll"} bg={"white"}>
													<ScrollArea
														h={height - 98}
														scrollbarSize={2}
														scrollbars="y"
														type="always"
														pb={"xs"}
													>
														{accessControlRole
															.filter((group) => group.actions.length > 0)
															.map((group) => (
																<Box key={group.Group} p={"sm"}>
																	<Text fz={"14"} fw={400} c={"dimmed"}>
																		{t(group.Group)}
																	</Text>
																	{group.actions.map((action) => (
																		<Box
																			key={action.id}
																			pl={"xs"}
																			pb={0}
																			mb={0}
																			pt={"8"}
																			onClick={() =>
																				handleSelectAccessControlRoleData(
																					group,
																					action
																				)
																			}
																		>
																			<Text
																				style={{
																					borderBottom: " 1px solid #e9ecef",
																					cursor: "pointer",
																				}}
																				pb={2}
																				fz={"14"}
																				fw={400}
																			>
																				{t(action.label)}
																			</Text>
																		</Box>
																	))}
																</Box>
															))}
													</ScrollArea>
												</Box>
											</Grid.Col>
											<Grid.Col span={2}>
												<Flex h={height - 98} mt={"xs"} align={"center"} justify={"center"}>
													<IconArrowsExchange
														style={{ width: "70%", height: "70%" }}
														stroke={1}
													/>
												</Flex>
											</Grid.Col>
											<Grid.Col span={11}>
												<Box mt={"xs"} className={"borderRadiusAll"} bg={"white"}>
													<ScrollArea
														h={height - 98}
														scrollbarSize={2}
														scrollbars="y"
														type="always"
														pb={"xs"}
													>
														{selectedAccessControlRoleData
															.filter((group) => group.actions.length > 0)
															.map((group) => (
																<Box key={group.Group} p={"sm"}>
																	<Text fz={"14"} fw={400} c={"dimmed"}>
																		{t(group.Group)}
																	</Text>
																	{group.actions.map((action) => (
																		<Box
																			key={action.id}
																			pl={"xs"}
																			pb={0}
																			mb={0}
																			pt={"8"}
																			onClick={() =>
																				handleDeselectAccessControlRoleData(
																					group,
																					action
																				)
																			}
																		>
																			<Text
																				style={{
																					borderBottom: " 1px solid #e9ecef",
																					cursor: "pointer",
																				}}
																				pb={2}
																				fz={"14"}
																				fw={400}
																			>
																				{t(action.label)}
																			</Text>
																		</Box>
																	))}
																</Box>
															))}
													</ScrollArea>
												</Box>
											</Grid.Col>
										</Grid>
									</ScrollArea>
								</Box>
							</Box>
						</Grid.Col>

						{/* Additional Information */}
						<Grid.Col span={7}>
							<Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
								<Box bg={"white"}>
									<Box
										pl={`xs`}
										pr={8}
										pt={"6"}
										pb={"6"}
										mb={4}
										className={"boxBackground borderRadiusAll"}
									>
										<Grid>
											<Grid.Col span={6}>
												<Title order={6} pt={4} pb={4}>
													{t("Address&Others")}
												</Title>
											</Grid.Col>
											<Grid.Col span={6}>
												<Stack right align="flex-end">
													{/*{!saveCreateLoading && isOnline && (*/}
													<Button
														bg="var(--theme-primary-color-6)"
														size="xs"
														type="submit"
														id="EntityFormSubmit"
														leftSection={<IconDeviceFloppy size={16} />}
													>
														<Flex direction={`column`} gap={0}>
															<Text fz={14} fw={400}>
																{t("UpdateAndSave")}
															</Text>
														</Flex>
													</Button>
													{/*)}*/}
												</Stack>
											</Grid.Col>
										</Grid>
									</Box>
								</Box>
								<Box pl={`xs`} pr={"xs"} className={"borderRadiusAll"}>
									<ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
										<Box>
											<LoadingOverlay
												visible={formLoad}
												zIndex={1000}
												overlayProps={{ radius: "sm", blur: 2 }}
												loaderProps={{ color: "red.6" }}
											/>
											<Box mb={"xs"} mt={"xs"}>
												<Grid align="center" columns={20}>
													<Grid.Col span={6}>
														<Text mt={"xs"} fz="sm">
															{t("Gender")}
														</Text>
													</Grid.Col>
													<Grid.Col span={12} pb={0}>
														<SegmentedControl
															fullWidth
															color="var(--theme-primary-color-6)"
															value={form.values.gender || "male"}
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
											<Box mt={"xs"}>
												<DateSelectorForm
													key={form.values.dob ? form.values?.dob : "dob-empty"}
													form={form}
													label={t("DateOfBirth")}
													placeholder="01-01-2020"
													tooltip={t("enterDateOfBirth")}
													name="dob"
													id="dob"
													nextField="alternative_email"
													value={new Date()}
													required={false}
													disabledFutureDate
												/>
											</Box>
											<Box mt={"xs"}>
												<InputForm
													form={form}
													tooltip={
														form.errors.alternative_email
															? form.errors.alternative_email
															: t("RequiredAndInvalidEmail")
													}
													label={t("AlternativeEmail")}
													placeholder={t("AlternativeEmail")}
													required={false}
													name={"alternative_email"}
													id={"alternative_email"}
													nextField={"designation_id"}
													mt={8}
												/>
											</Box>
											<Box>
												<Grid gutter={{ base: 2 }}>
													<Grid.Col span={12}>
														<Box mt={"8"}>
															<SelectForm
																tooltip={t("Designation")}
																label={t("Designation")}
																placeholder={t("ChooseDesignation")}
																required={false}
																nextField={"department_id"}
																name={"designation_id"}
																form={form}
																dropdownValue={designationDropdown}
																mt={8}
																id={"designation_id"}
																searchable={false}
																value={
																	designationData
																		? designationData
																		: String(entityEditData?.designation_id || "")
																}
																changeValue={setDesignationData}
															/>
														</Box>
													</Grid.Col>
												</Grid>
											</Box>
											<Box>
												<Grid gutter={{ base: 2 }}>
													<Grid.Col span={12}>
														<Box mt={"8"}>
															<SelectForm
																tooltip={t("Department")}
																label={t("Department")}
																placeholder={t("ChooseDepartment")}
																required={false}
																nextField={"address"}
																name={"department_id"}
																form={form}
																dropdownValue={departmentDropdown}
																mt={8}
																id={"department_id"}
																searchable={false}
																value={
																	departmentData
																		? departmentData
																		: String(entityEditData?.department_id || "")
																}
																changeValue={setDepartmentData}
															/>
														</Box>
													</Grid.Col>
												</Grid>
											</Box>
											<Box mt={"xs"}>
												<TextAreaForm
													tooltip={t("Address")}
													label={t("Address")}
													placeholder={t("Address")}
													required={false}
													nextField={"about_me"}
													name={"address"}
													form={form}
													mt={8}
													id={"address"}
												/>
											</Box>
											<Box mt={"xs"}>
												<TextAreaForm
													tooltip={t("AboutMe")}
													label={t("AboutMe")}
													placeholder={t("AboutMe")}
													required={false}
													nextField={"EntityFormSubmit"}
													name={"about_me"}
													form={form}
													mt={8}
													id={"about_me"}
												/>
											</Box>
											<Box mt={"sm"}>
												<Text fz={14} fw={400} mb={2}>
													{t("ProfileImage")}
												</Text>
												<Tooltip
													label={t("ChooseImage")}
													opened={
														"profile_image" in form.errors && !!form.errors["profile_image"]
													}
													px={16}
													py={2}
													position="top-end"
													color="red"
													withArrow
													offset={2}
													zIndex={999}
													transitionProps={{
														transition: "pop-bottom-left",
														duration: 500,
													}}
												>
													<Dropzone
														label={t("ChooseImage")}
														accept={IMAGE_MIME_TYPE}
														onDrop={handleProfileImageDrop}
													>
														<Text ta="center">
															{profileImage &&
															profileImage.length > 0 &&
															profileImage[0].name ? (
																profileImage[0].name
															) : (
																<span>{t("DropProfileImageHere")} (150 * 150)</span>
															)}
														</Text>
													</Dropzone>
												</Tooltip>
												{renderImagePreview(profileImage, entityEditData?.path)}
											</Box>
											<Box mt={"sm"}>
												<Text fz={14} fw={400} mb={2}>
													{t("DigitalSignature")}
												</Text>
												<Tooltip
													label={t("ChooseImage")}
													opened={
														"digital_signature" in form.errors &&
														!!form.errors["digital_signature"]
													}
													px={16}
													py={2}
													position="top-end"
													color="red"
													withArrow
													offset={2}
													zIndex={999}
													transitionProps={{
														transition: "pop-bottom-left",
														duration: 500,
													}}
												>
													<Dropzone
														label={t("ChooseImage")}
														accept={IMAGE_MIME_TYPE}
														onDrop={handleDigitalSignatureDrop}
													>
														<Text ta="center">
															{digitalSignature &&
															digitalSignature.length > 0 &&
															digitalSignature[0].name ? (
																digitalSignature[0].name
															) : (
																<span>{t("DropDigitalSignatureHere")} (150 * 150)</span>
															)}
														</Text>
													</Dropzone>
												</Tooltip>
												{renderImagePreview(digitalSignature, entityEditData?.signature_path)}
											</Box>
										</Box>
									</ScrollArea>
								</Box>
							</Box>
						</Grid.Col>

						{/* Shortcuts */}
						<Grid.Col span={1}>
							<Box bg={"white"} className={"borderRadiusAll"} pt={"16"}>
								<Shortcut
									handleFormReset={handleFormReset}
									entityEditData={entityEditData}
									form={form}
									FormSubmit={"EntityFormSubmit"}
									Name={"name"}
									inputType="select"
								/>
							</Box>
						</Grid.Col>
					</Grid>
				</Box>
			</form>
		</Box>
	);
}
