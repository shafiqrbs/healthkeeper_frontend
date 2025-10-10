import { getDataWithoutStore } from "@/services/apiService";
import {Box, Text, ScrollArea, Stack, Button, Flex, Grid,Tabs,ActionIcon,Select} from "@mantine/core";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { IconHelpOctagon,IconPlus } from "@tabler/icons-react";
import {getLoggedInHospitalUser, getUserRole} from "@utils/index";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import InputNumberForm from "@components/form-builders/InputNumberForm";
import {useForm} from "@mantine/form";
import {getFormValues} from "@modules/hospital/lab/helpers/request";
import {modals} from "@mantine/modals";
import {updateEntityData} from "@/app/store/core/crudThunk";
import {setRefetchData} from "@/app/store/core/crudSlice";
import {successNotification} from "@components/notification/successNotification";
import {ERROR_NOTIFICATION_COLOR, SUCCESS_NOTIFICATION_COLOR} from "@/constants";
import {errorNotification} from "@components/notification/errorNotification";


const ALLOWED_BILLING_ROLES = [ "billing_manager","billing_cash","admin_hospital", "admin_administrator"];
export default function Invoice({entity}) {
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const test = entity;
	const { id } = useParams();
	const navigate = useNavigate();
	const userHospitalConfig = getLoggedInHospitalUser();
	const userRoles = getUserRole();
	const userId = userHospitalConfig?.employee_id;
	const handleTest = (transactionId) => {
		navigate(`${HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.BILLING.VIEW}/${id}/payment/${transactionId}`);
	};
	const form = useForm(getFormValues(t));
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
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.BILLING.UPDATE}/${transactionId}`,
				data: values,
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
			} else if (updateEntityData.fulfilled.match(resultAction)) {
				dispatch(setRefetchData({ module, refetching: true }));
				successNotification(t("UpdateSuccessfully"), SUCCESS_NOTIFICATION_COLOR);
			}
		} catch (error) {
			errorNotification(error.message, ERROR_NOTIFICATION_COLOR);
		}
	}

	return (
		<Box className="borderRadiusAll" bg="white">
			<Box bg="var(--theme-primary-color-0)" p="sm">
				<Text fw={600} fz="sm" py="es">
					{t("InvoiceTransaction")}
				</Text>
			</Box>
				{id ? (
					<>
					<ScrollArea scrollbars="y" type="never" h={mainAreaHeight - 320}>
					<Stack className="form-stack-vertical" p="xs">
						{test?.invoice_transaction?.map((item, index) => (
							<Box key={index} className="borderRadiusAll" bg={"white"} p="sm">
								<Text fz="sm">{item.invoice_created}</Text>
								<Text fz="xs">Status:{item?.process}</Text>
								<Text fz="xs">Amount:{Number(item?.total,2)}</Text>
								<Flex align="center" gap="sm">
									{userRoles.some((role) => ALLOWED_BILLING_ROLES.includes(role)) && (
										<>
											{item?.process === "New" && userRoles.some((role) => ALLOWED_BILLING_ROLES.includes(role)) && (
												<Button
													onClick={() => handleTest(item.hms_invoice_transaction_id)}
													size="xs"
													bg="var(--theme-primary-color-6)"
													color="white"
												>
													{t("Process")}
												</Button>
											)}
											{item?.process === "Done" &&(
												<>
													<Button
														onClick={() => handleTest(item.hms_invoice_transaction_id)}
														size="xs"
														bg="var(--theme-primary-color-6)"
														color="white"
													>
														{t("Show")}
													</Button>
													<Button
														onClick={() => handleTest(item.hms_invoice_transaction_id)}
														size="xs"
														bg="var(--theme-secondary-color-6)"
														color="white"
													>
														{t("Print")}
													</Button>
												</>
											)}
										</>
									)}
								</Flex>
							</Box>
						))}
					</Stack>
					</ScrollArea>
					<Box gap={0} justify="space-between" mt="xs"  >
						<form onSubmit={form.onSubmit(handleSubmit)}>
							<Box >
								<Box bg="var(--theme-primary-color-0)" pl={"xs"} pr={"xs"} pb={'xs'}>
									<Tabs defaultValue="gallery">
										<Tabs.List>
											<Tabs.Tab value="investigation">
											{t("Investigation")}
											</Tabs.Tab>
											<Tabs.Tab value="room">
												{t("Bed/Room")}
											</Tabs.Tab>
										</Tabs.List>
										<Tabs.Panel value="investigation" bg="white" >
											<Grid align="center" columns={20} mt={'xs'} ml={'xs'} mr={'xs'} >
												<Grid.Col span={20}>
													<Select
														placeholder="Pick value"
														data={['React', 'Angular', 'Vue', 'Svelte']}
														rightSection={ <ActionIcon variant="filled" aria-label="Settings">
															<IconPlus style={{ width: '70%', height: '70%' }} stroke={1.5} />
														</ActionIcon>}
													/>
												</Grid.Col>
											</Grid>
										</Tabs.Panel>
										<Tabs.Panel value="room" bg="white" >
											<Grid mt={'xs'} ml={'xs'} mr={'xs'}  align="center" columns={20} >
												<Grid.Col span={14}>
													<Select
														label=""
														placeholder="Pick value"
														data={['React', 'Angular', 'Vue', 'Svelte']}
													/>
												</Grid.Col>
												<Grid.Col span={6}>
													<InputNumberForm
														form={form}
														label=""
														tooltip={t("EnterPatientMobile")}
														placeholder="quantitiy"
														name="mobile"
														id="mobile"
														nextField="dob"
														value=''
													/>
												</Grid.Col>
											</Grid>
										</Tabs.Panel>
									</Tabs>
									<Box w="100%" bg={'white'} >
										<Box>
											<Grid columns={18} gutter="xs"  >
												<Grid.Col span={18} className="animate-ease-out"  px="xs">
													<ScrollArea scrollbars="y" type="never" h={'116'} ml={'xs'} mr={'xs'}>
														<Box>asdasdasd</Box>
													</ScrollArea>
													<Box mt={'xs'}>
														<Button.Group>
															<Button
																id="EntityFormSubmit"
																w="100%"
																size="compact-sm"
																bg="var(--theme-pos-btn-color)"
																type="button"
															>
																<Stack gap={0} align="center" justify="center">
																	<Text fz="xs">{t("Print")}</Text>
																</Stack>
															</Button>
															<Button
																w="100%"
																size="compact-sm"
																bg="var(--theme-save-btn-color)">
																<Stack gap={0} align="center" justify="center">
																	<Text fz="xs">{t("Save")}</Text>
																</Stack>
															</Button>
														</Button.Group>
													</Box>
												</Grid.Col>
											</Grid>
										</Box>
									</Box>
								</Box>
							</Box>
						</form>
					</Box>
						</>
				) : (
					<Stack
						h={mainAreaHeight-62}
						bg="var(--mantine-color-body)"
						align="center"
						justify="center"
						gap="md"
					>
					<Box>{t('NoPatientSelected')}</Box>
					</Stack>
				)}

		</Box>
	);
}
