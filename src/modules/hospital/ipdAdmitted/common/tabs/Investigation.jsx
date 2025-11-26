import TabSubHeading from "@hospital-components/TabSubHeading";
import {
	ActionIcon,
	Autocomplete,
	Badge,
	Box,
	Button,
	Divider,
	Flex,
	Grid,
	LoadingOverlay,
	ScrollArea,
	Stack,
	Text,
} from "@mantine/core";
import { useOutletContext, useParams } from "react-router-dom";
import { IconCaretUpDownFilled, IconPrinter, IconX } from "@tabler/icons-react";
import { Fragment, useRef, useState } from "react";
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
import InvestigationPosBN from "@hospital-components/print-formats/ipd/InvestigationPosBN";
import { useReactToPrint } from "react-to-print";
import { formatDateTimeAmPm, formatUnixToAmPm } from "@utils/index";

export default function Investigation() {
	const dispatch = useDispatch();
	const { id } = useParams();
	const { t } = useTranslation();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const investigationPosBNRef = useRef(null);

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
	const [investigationPrintData, setInvestigationPrintData] = useState(null);
	const investigationPrint = useReactToPrint({ content: () => investigationPosBNRef.current });

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

	const handleInvestigationPrint = (item) => {
		setInvestigationPrintData(item);
		requestAnimationFrame(investigationPrint);
	};

	return (
		<Box w="100%" h={mainAreaHeight - 63}>
			<Grid w="100%" columns={24} gutter="xs" h="100%" styles={{ inner: { height: "100%", width: "100%" } }}>
				<Grid.Col span={9}>
					<Box bg="var(--mantine-color-white)" className="borderRadiusAll" h="100%">
						<TabSubHeading title="Investigation" />
						<Box p="3xs" h={mainAreaHeight - 110}>
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
							<Stack gap={0} bg="var(--mantine-color-white)" px="sm" className="borderRadiusAll" mt="2xs">
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
					<Box className="borderRadiusAll" bg="var(--mantine-color-white)" h="100%">
						<TabSubHeading title="Investigation Details" />
						<ScrollArea p="xs" pos="relative" h={mainAreaHeight - 58}>
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
								<Fragment key={index}>
									<Flex py="xs" justify="space-between" gap="xs" mb="3xs">
										<Flex w="90%">
											<Box w="100%">
												<Badge
													variant="light"
													p="md"
													size="md"
													color="var(--theme-secondary-color-8)"
												>
													{/*{index + 1}. */}
													{formatUnixToAmPm(item.created)}
												</Badge>
												<Box mt="md" fz="sm" w={"100%"}>
													{item?.items?.map((particular, idx) => (
														<Flex key={idx} justify="space-between" align="center">
															<Text fz="xs">
																{idx + 1}. {particular.name}
															</Text>

															<Text fz="xs" ta="right">
																{particular.process === "New" && (
																	<Badge variant="light" size="xs" color="red">
																		{particular.process}
																	</Badge>
																)}
																{particular.process === "Done" && (
																	<Badge
																		variant="light"
																		size="xs"
																		color="var(--theme-primary-color-8)"
																	>
																		{particular.process}
																	</Badge>
																)}
															</Text>
														</Flex>
													))}
												</Box>
											</Box>
										</Flex>
										<Button
											variant="light"
											leftSection={<IconPrinter size={16} />}
											color="var(--theme-secondary-color-8)"
											size="xs"
											onClick={() => handleInvestigationPrint(item)}
										>
											{t("Print")}
										</Button>
									</Flex>
									<Divider />
								</Fragment>
							))}
						</ScrollArea>
					</Box>
				</Grid.Col>
			</Grid>

			{/*<InvestigationPosBN data={investigationPrintData} ref={investigationPosBNRef}  />*/}
		</Box>
	);
}
