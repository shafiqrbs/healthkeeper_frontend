import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
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
	SimpleGrid,
	Image,
	Tooltip,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconCheck, IconDeviceFloppy, IconPlusMinus } from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import { useDispatch } from "react-redux";
import { hasLength, isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";

import { setFetching, setValidationData, storeEntityDataWithFile } from "../../../../store/accounting/crudSlice.js";

import Shortcut from "../../shortcut/Shortcut.jsx";
import InputForm from "../../../form-builders/InputForm";
import InputNumberForm from "../../../form-builders/InputNumberForm";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import getTransactionMethodDropdownData from "../../../global-hook/dropdown/getTransactionMethodDropdownData.js";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import getSettingAccountTypeDropdownData from "../../../global-hook/dropdown/getSettingAccountTypeDropdownData.js";
import getSettingAuthorizedTypeDropdownData from "../../../global-hook/dropdown/getSettingAuthorizedTypeDropdownData.js";
import SwitchForm from "../../../form-builders/SwitchForm.jsx";

function TransactionModeForm(props) {
	const { t, i18n } = useTranslation();
	const dispatch = useDispatch();
	const { isOnline, mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 100; //TabList height 104

	const [saveCreateLoading, setSaveCreateLoading] = useState(false);
	const [authorisedData, setAuthorisedData] = useState(null);
	const [methodData, setMethodData] = useState(null);
	const [accountTypeData, setAccountTypeData] = useState(null);

	const authorizedDropdown = getSettingAuthorizedTypeDropdownData();
	const accountDropdown = getSettingAccountTypeDropdownData();

	const [files, setFiles] = useState([]);

	const previews = files.map((file, index) => {
		const imageUrl = URL.createObjectURL(file);
		return <Image key={index} src={imageUrl} onLoad={() => URL.revokeObjectURL(imageUrl)} />;
	});

	const form = useForm({
		initialValues: {
			method_id: "",
			name: "",
			short_name: "",
			authorised_mode_id: "",
			account_mode_id: "",
			service_charge: "",
			account_owner: "",
			path: "",
			is_selected: 0,
		},
		validate: {
			method_id: isNotEmpty(),
			name: hasLength({ min: 2 }),
			short_name: hasLength({ min: 2 }),
			path: isNotEmpty(),
			service_charge: (value, values) => {
				if (value) {
					const isNumberOrFractional = /^-?\d+(\.\d+)?$/.test(value);
					if (!isNumberOrFractional) {
						return true;
					}
				}
				return null;
			},
		},
	});

	useHotkeys(
		[
			[
				"alt+n",
				() => {
					document.getElementById("method_id").click();
				},
			],
		],
		[]
	);

	useHotkeys(
		[
			[
				"alt+r",
				() => {
					form.reset();
				},
			],
		],
		[]
	);

	useHotkeys(
		[
			[
				"alt+s",
				() => {
					document.getElementById("EntityFormSubmit").click();
				},
			],
		],
		[]
	);

	return (
		<Box>
			<Grid columns={9} gutter={{ base: 8 }}>
				<Grid.Col span={8}>
					<form
						onSubmit={form.onSubmit((values) => {
							dispatch(setValidationData(false));
							modals.openConfirmModal({
								title: <Text size="md"> {t("FormConfirmationTitle")}</Text>,
								children: <Text size="sm"> {t("FormConfirmationMessage")}</Text>,
								labels: { confirm: "Confirm", cancel: "Cancel" },
								confirmProps: { color: "red" },
								onCancel: () => console.info("Cancel"),
								onConfirm: () => {
									const formValue = { ...form.values };
									formValue["path"] = files[0];
									formValue["is_selected"] = form.values.is_selected == true ? 1 : 0;

									const data = {
										url: "accounting/transaction-mode",
										data: formValue,
									};
									dispatch(storeEntityDataWithFile(data));

									notifications.show({
										color: "teal",
										title: t("CreateSuccessfully"),
										icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
										loading: false,
										autoClose: 700,
										style: { backgroundColor: "lightgray" },
									});

									setTimeout(() => {
										form.reset();
										setFiles([]);
										setMethodData(null);
										setAccountTypeData(null);
										setAuthorisedData(null);
										dispatch(setFetching(true));
									}, 700);
								},
							});
						})}
					>
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
												{t("CreateNewTransactionMode")}
											</Title>
										</Grid.Col>
										<Grid.Col span={6}>
											<Stack right align="flex-end">
												<>
													{!saveCreateLoading && isOnline && (
														<Button
															size="xs"
															className={"btnPrimaryBg"}
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
									<Grid columns={24}>
										<Grid.Col span={"auto"}>
											<ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
												<Box>
													<Box mt={"xs"}>
														<SelectForm
															tooltip={t("ChooseMethod")}
															label={t("Method")}
															placeholder={t("ChooseMethod")}
															required={true}
															nextField={"name"}
															name={"method_id"}
															form={form}
															dropdownValue={getTransactionMethodDropdownData()}
															mt={8}
															id={"method_id"}
															searchable={false}
															value={methodData}
															changeValue={setMethodData}
														/>
													</Box>
													<Box mt={"xs"}>
														<InputForm
															tooltip={t("TransactionModeNameValidateMessage")}
															label={t("Name")}
															placeholder={t("Name")}
															required={true}
															nextField={"short_name"}
															name={"name"}
															form={form}
															mt={0}
															id={"name"}
														/>
													</Box>
													<Box mt={"xs"}>
														<InputForm
															tooltip={t("ShortNameValidateMessage")}
															label={t("ShortName")}
															placeholder={t("ShortName")}
															required={true}
															nextField={"authorised_mode_id"}
															name={"short_name"}
															form={form}
															mt={0}
															id={"short_name"}
														/>
													</Box>
													<Box mt={"xs"}>
														<SelectForm
															tooltip={t("ChooseAuthorised")}
															label={t("Authorised")}
															placeholder={t("ChooseAuthorised")}
															required={false}
															nextField={"account_mode_id"}
															name={"authorised_mode_id"}
															form={form}
															dropdownValue={authorizedDropdown}
															mt={8}
															id={"authorised_mode_id"}
															searchable={false}
															value={authorisedData}
															changeValue={setAuthorisedData}
														/>
													</Box>
													<Box mt={"xs"}>
														<SelectForm
															tooltip={t("ChooseAccountType")}
															label={t("AccountType")}
															placeholder={t("ChooseAccountType")}
															required={false}
															nextField={"service_charge"}
															name={"account_mode_id"}
															form={form}
															dropdownValue={accountDropdown}
															mt={8}
															id={"account_mode_id"}
															searchable={false}
															value={accountTypeData}
															changeValue={setAccountTypeData}
														/>
													</Box>
													<Box mt={"xs"}>
														<InputForm
															tooltip={t("ServiceChargeValidationMessage")}
															label={t("ServiceCharge")}
															placeholder={t("ServiceCharge")}
															required={false}
															nextField={"account_owner"}
															name={"service_charge"}
															form={form}
															mt={"md"}
															id={"service_charge"}
															type={"number"}
															leftSection={<IconPlusMinus size={16} opacity={0.5} />}
														/>
													</Box>
													<Box mt={"xs"}>
														<InputForm
															tooltip={t("AccountOwnerValidateMessage")}
															label={t("AccountOwner")}
															placeholder={t("AccountOwner")}
															required={false}
															nextField={"is_selected"}
															name={"account_owner"}
															form={form}
															mt={8}
															id={"account_owner"}
														/>
													</Box>
													<Box mt={"xs"}>
														<SwitchForm
															tooltip={t("IsSelected")}
															label={t("IsSelected")}
															nextField={"is_selected"}
															name={"is_selected"}
															form={form}
															color="red"
															id={"is_selected"}
															position={"left"}
															defaultChecked={form.is_selected}
														/>
													</Box>
													<Box mt={"xs"}>
														<Tooltip
															label={t("ChooseImage")}
															opened={"path" in form.errors && !!form.errors["path"]}
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
																onDrop={(e) => {
																	setFiles(e);
																	form.setFieldError("path", false);
																	form.setFieldValue("path", true);
																}}
															>
																<Text ta="center">
																	{files && files.length > 0 && files[0].path ? (
																		files[0].path
																	) : (
																		<span>
																			{t("DropImagesHere")}{" "}
																			<span style={{ color: "red" }}>*</span>
																		</span>
																	)}
																</Text>
															</Dropzone>
														</Tooltip>

														<SimpleGrid
															cols={{ base: 1, sm: 4 }}
															mt={previews.length > 0 ? "xl" : 0}
														>
															{previews}
														</SimpleGrid>
													</Box>
												</Box>
											</ScrollArea>
										</Grid.Col>
									</Grid>
								</Box>
							</Box>
						</Box>
					</form>
				</Grid.Col>
				<Grid.Col span={1}>
					<Box bg={"white"} className={"borderRadiusAll"} pt={"16"}>
						<Shortcut form={form} FormSubmit={"EntityFormSubmit"} Name={"method_id"} inputType="select" />
					</Box>
				</Grid.Col>
			</Grid>
		</Box>
	);
}
export default TransactionModeForm;
