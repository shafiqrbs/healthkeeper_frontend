import TabSubHeading from "@hospital-components/TabSubHeading";
import { ActionIcon, Autocomplete, Badge, Box, Flex, Grid, LoadingOverlay, Stack, Text } from "@mantine/core";
import { useOutletContext, useParams } from "react-router-dom";
import { IconCaretUpDownFilled, IconX } from "@tabler/icons-react";
import { useState } from "react";
import useParticularsData from "@hooks/useParticularsData";
import inputCss from "@assets/css/InputField.module.css";
import TabsActionButtons from "@hospital-components/TabsActionButtons";
import { useForm } from "@mantine/form";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { MODULES_CORE } from "@/constants";
import { useDispatch } from "react-redux";
import { storeEntityData } from "@/app/store/core/crudThunk";
import { successNotification } from "@components/notification/successNotification";
import { errorNotification } from "@components/notification/errorNotification";
import useDataWithoutStore from "@hooks/useDataWithoutStore";
import { useTranslation } from "react-i18next";

export default function Investigation() {
	const dispatch = useDispatch();
	const { id } = useParams();
	const { t } = useTranslation();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const form = useForm({
		initialValues: {
			investigation: [],
		},
	});

	const {
		data: investigationData,
		refetch: refetchInvestigationData,
		isLoading,
	} = useDataWithoutStore({
		url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.TRANSACTION}/${id}`,
		params: {
			mode: "investigation",
		},
	});

	const { mainAreaHeight } = useOutletContext();
	const { particularsData } = useParticularsData({ modeName: "Admission" });

	const investigationParticulars = particularsData?.find((item) => item.particular_type.name === "Investigation");

	const [autocompleteValue, setAutocompleteValue] = useState("");

	const handleAutocompleteOptionAdd = (value) => {
		const allParticulars = investigationParticulars?.particular_type?.particulars || [];
		const sectionParticulars = allParticulars.find((p) => p.name === value);

		if (sectionParticulars) {
			// =============== get current investigation list or initialize empty array ================
			const currentList = Array.isArray(form.values.investigation) ? form.values.investigation : [];

			// =============== check if this value already exists ================
			const existingIndex = currentList.findIndex(
				(item) => item.id === sectionParticulars.id && item.name === sectionParticulars.name
			);

			if (existingIndex === -1) {
				// =============== add new item to the list ================
				const newItem = {
					id: sectionParticulars.id,
					name: sectionParticulars.name,
					value: sectionParticulars.name,
				};

				const updatedList = [...currentList, newItem];
				form.setFieldValue("investigation", updatedList);
				return;
			}
		}
	};

	const handleAutocompleteOptionRemove = (idx) => {
		// =============== get current investigation list and remove item at index ================
		const currentList = Array.isArray(form.values.investigation) ? form.values.investigation : [];
		const updatedList = currentList.filter((_, index) => index !== idx);
		form.setFieldValue("investigation", updatedList);
	};

	const handleSubmit = async () => {
		setIsSubmitting(true);
		try {
			const formValue = {
				json_content: form.values?.investigation,
				ipd_module: "investigation",
			};

			const value = {
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.PROCESS}/${id}`,
				data: formValue,
				module: MODULES_CORE.INVESTIGATION,
			};

			const resultAction = await dispatch(storeEntityData(value)).unwrap();

			if (resultAction.status === 200) {
				successNotification(t("InvestigationAddedSuccessfully"));
				await refetchInvestigationData();
				form.reset();
			} else {
				errorNotification(t("InvestigationAddedFailed"));
			}
		} catch (err) {
			console.error(err);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Box h={mainAreaHeight - 63} p="xs">
			<Grid columns={24} gutter="xs" h="100%" styles={{ inner: { height: "100%" } }}>
				<Grid.Col span={9}>
					<Box className="borderRadiusAll" h="100%">
						<TabSubHeading title="Investigation" />
						<Box p="xxxs" h={mainAreaHeight - 200}>
							<Autocomplete
								label=""
								placeholder={`Pick value or enter Investigation`}
								data={investigationParticulars?.particular_type?.particulars?.map((particular) => ({
									value: particular.name,
									label: particular.name,
								}))}
								value={autocompleteValue}
								onChange={setAutocompleteValue}
								onOptionSubmit={(value) => {
									handleAutocompleteOptionAdd(value);
									setTimeout(() => {
										setAutocompleteValue("");
									}, 0);
								}}
								classNames={inputCss}
								rightSection={<IconCaretUpDownFilled size={16} />}
							/>
							<Stack gap={0} bg="white" px="sm" className="borderRadiusAll" mt="xxs">
								{form.values?.investigation?.map((item, idx) => (
									<Flex
										key={idx}
										align="center"
										justify="space-between"
										px="es"
										py="xs"
										style={{
											borderBottom:
												idx !== form.values?.investigation?.length - 1
													? "1px solid var(--theme-tertiary-color-4)"
													: "none",
										}}
									>
										<Text fz="sm">
											{idx + 1}. {item.name}
										</Text>
										<ActionIcon
											color="red"
											size="xs"
											variant="subtle"
											onClick={() => handleAutocompleteOptionRemove(idx)}
										>
											<IconX size={16} />
										</ActionIcon>
									</Flex>
								))}
							</Stack>
						</Box>
						<Box px="xs">
							<TabsActionButtons
								isSubmitting={isSubmitting}
								handleReset={() => {}}
								handleSave={handleSubmit}
							/>
						</Box>
					</Box>
				</Grid.Col>
				<Grid.Col span={15}>
					<Box className="borderRadiusAll" h="100%">
						<TabSubHeading title="Investigation Details" />
						<Box p="xs" pos="relative" h={mainAreaHeight - 138}>
							<LoadingOverlay
								visible={isLoading}
								zIndex={1000}
								overlayProps={{ radius: "sm", blur: 2 }}
							/>
							{investigationData?.data?.length === 0 && (
								<Flex h="100%" justify="center" align="center">
									<Text fz="sm">{t("NoDataAvailable")}</Text>
								</Flex>
							)}
							{investigationData?.data?.map((item, index) => (
								<Flex key={index} gap="xs" mb="xxxs">
									<Text>{index + 1}.</Text>
									<Box w="100%">
										<Badge variant="light" size="md" color="var(--theme-secondary-color-7)">
											{item.created}
										</Badge>
										<Box mt="es" fz="sm">
											{item?.invoice_particular?.map((particular, idx) => (
												<Flex key={idx} justify="space-between" align="center">
													<Text fz="xs">
														{idx + 1}. {particular.name}
													</Text>
													{/* <Group gap="xxxs">
														<Button
															variant="light"
															color="var(--theme-primary-color-5)"
															size="compact-xs"
														>
															Status
														</Button>
														<ActionIcon
															variant="light"
															color="var(--theme-secondary-color-5)"
															size="sm"
														>
															<IconEye size={16} stroke={1.5} />
														</ActionIcon>
														<ActionIcon
															variant="light"
															color="var(--theme-error-color)"
															size="sm"
														>
															<IconX size={16} stroke={1.5} />
														</ActionIcon>
													</Group> */}
												</Flex>
											))}
										</Box>
									</Box>
								</Flex>
							))}
						</Box>
					</Box>
				</Grid.Col>
			</Grid>
		</Box>
	);
}
