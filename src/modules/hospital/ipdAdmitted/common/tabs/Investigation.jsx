import TabSubHeading from "@hospital-components/TabSubHeading";
import {
	Badge,
	Box,
	Button,
	Checkbox,
	Divider,
	Flex,
	Grid,
	LoadingOverlay,
	ScrollArea,
	Text,
	TextInput,
} from "@mantine/core";
import { useOutletContext, useParams } from "react-router-dom";
import { IconPrinter, IconSearch, IconX } from "@tabler/icons-react";
import { Fragment, useRef, useState } from "react";
import useParticularsData from "@hooks/useParticularsData";
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
import { formatUnixToAmPm } from "@utils/index";

export default function Investigation({ ipdData }) {
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

	const [investigationPrintData, setInvestigationPrintData] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");
	const investigationPrint = useReactToPrint({ content: () => investigationPosBNRef.current });

	const filteredInvestigations =
		investigationParticulars?.particular_type?.particulars
			?.filter((particular) => particular.name?.toLowerCase().includes(searchQuery.toLowerCase()))
			?.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" })) || [];

	const handleCheckboxChange = (particular, checked) => {
		const currentList = Array.isArray(form.values.investigation) ? form.values.investigation : [];

		if (checked) {
			const newItem = {
				id: particular.id,
				name: particular.name,
				value: particular.name,
			};

			const existingIndex = currentList.findIndex(
				(item) => item.id === particular.id && item.name === particular.name
			);

			if (existingIndex === -1) {
				const updatedList = [...currentList, newItem];
				form.setFieldValue("investigation", updatedList);
			}
		} else {
			const updatedList = currentList.filter(
				(item) => !(item.id === particular.id && item.name === particular.name)
			);
			form.setFieldValue("investigation", updatedList);
		}
	};

	const isInvestigationSelected = (particular) => {
		const currentList = Array.isArray(form.values.investigation) ? form.values.investigation : [];
		return currentList.some((item) => item.id === particular.id && item.name === particular.name);
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
				<Grid.Col span={18}>
					<Box bg="var(--mantine-color-white)" className="borderRadiusAll" h="100%">
						<TabSubHeading title="Investigation" />
						<Box p="3xs">
							<TextInput
								placeholder="Search investigations..."
								value={searchQuery}
								onChange={(event) => setSearchQuery(event.currentTarget.value)}
								leftSection={<IconSearch size={16} />}
								mb="sm"
								rightSection={
									searchQuery ? (
										<IconX
											className="cursor-pointer"
											size={16}
											onClick={() => setSearchQuery("")}
										/>
									) : null
								}
							/>
							<ScrollArea h={mainAreaHeight - 170}>
								<Box
									style={{
										columnCount: 3,
										columnGap: "md",
									}}
								>
									{filteredInvestigations.map((particular) => (
										<Checkbox
											key={particular.id}
											label={particular.name}
											checked={isInvestigationSelected(particular)}
											onChange={(event) =>
												handleCheckboxChange(particular, event.currentTarget.checked)
											}
											size="sm"
											mb="sm"
										/>
									))}
								</Box>
							</ScrollArea>
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
				<Grid.Col span={6}>
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
									<Box mb="lg">
										<Flex py="xs" justify="space-between" gap="xs" mb="3xs">
											<Badge
												variant="light"
												p="md"
												size="md"
												color="var(--theme-secondary-color-8)"
											>
												{/*{index + 1}. */}
												{formatUnixToAmPm(item.created)}
											</Badge>

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
										<Box mt="md" px="xs" fz="sm" w={"100%"}>
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
									<Divider />
								</Fragment>
							))}
						</ScrollArea>
					</Box>
				</Grid.Col>
			</Grid>

			<InvestigationPosBN
				data={{ ...ipdData, investigations: investigationPrintData }}
				ref={investigationPosBNRef}
			/>
		</Box>
	);
}
