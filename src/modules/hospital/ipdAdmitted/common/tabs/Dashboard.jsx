import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import useDataWithoutStore from "@hooks/useDataWithoutStore";
import { Box, Divider, Grid, Group, Paper, Stack, Text, Button, ScrollArea } from "@mantine/core";
import { LineChart } from "@mantine/charts";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { modals } from "@mantine/modals";
import { getDataWithoutStore } from "@/services/apiService";
import { errorNotification } from "@components/notification/errorNotification";
import { ERROR_NOTIFICATION_COLOR } from "@/constants";
import { IconPointFilled } from "@tabler/icons-react";

export default function Dashboard() {
	const ipdRef = useRef(null);
	const { mainAreaHeight } = useOutletContext();
	const { t } = useTranslation();
	const { id } = useParams();
	const [vitalRecordList, setVitalRecordList] = useState([]);
	const [insulinRecordList, setInsulinRecordList] = useState([]);
	const ipdId = id;

	const getNumericValue = (value) => {
		const numericValue = Number(value);
		return Number.isFinite(numericValue) ? numericValue : null;
	};

	const printIPDFull = useReactToPrint({
		documentTitle: `ipd-${Date.now().toLocaleString()}`,
		content: () => ipdRef.current,
	});

	const { data: ipdData, refetch } = useDataWithoutStore({
		url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.INDEX}/${ipdId}`,
	});

	// =============== parse IPD data and handle null cases ================
	const ipd = ipdData?.data;
	const invoiceParticulars = ipd?.invoice_particular || [];
	const prescriptionMedicine = ipd?.prescription_medicine || [];
	const jsonContent = JSON.parse(ipd?.json_content || "{}");
	const patientReport = jsonContent?.patient_report || {};
	const patientExamination = patientReport?.patient_examination || {};
	const order = patientReport?.order || {};

	const renderExaminationSection = (key) => {
		const dataArray = patientExamination?.[key];
		if (!hasArrayWithLength(dataArray)) return null;

		switch (key) {
			case "chief_complaints": {
				return (
					<SectionWrapper label="C/C:">
						{renderNumberedList(
							dataArray,
							(item) => `${item.name}: ${item.value} ${item.duration || "Day"}/s`
						)}
						{renderOtherInstructions(key)}
					</SectionWrapper>
				);
			}
			case "investigation": {
				return (
					<SectionWrapper label="Investigation:">
						{renderNumberedList(dataArray, (item) => `${item.value}`)}
						{renderOtherInstructions(key)}
					</SectionWrapper>
				);
			}
			case "ho_past_illness": {
				return (
					<SectionWrapper label="H/O Past Illness:">
						{renderPlainJoined(dataArray, (item) => `${item.name}`)}
						{renderOtherInstructions(key)}
					</SectionWrapper>
				);
			}
			case "diagnosis": {
				return (
					<SectionWrapper label="Diagnosis:">
						{renderPlainJoined(dataArray, (item) => `${item.value}`)}
					</SectionWrapper>
				);
			}
			case "icd_11_listed_diseases": {
				return (
					<SectionWrapper label="ICD-11 listed diseases:">
						<Text size="xs" c="black.5" mt="0">
							{dataArray.join(", ") || "Headache, Fever"}
						</Text>
					</SectionWrapper>
				);
			}
			case "comorbidity": {
				return (
					<SectionWrapper label="Comorbidity:">
						{renderPlainJoined(
							dataArray.filter((item) => item.value),
							(item) => `${item.name}`
						)}
					</SectionWrapper>
				);
			}
			case "treatment-history": {
				return (
					<SectionWrapper label="Treatment History:">
						{renderPlainJoined(dataArray, (item) => `${item.value}`)}
					</SectionWrapper>
				);
			}

			default: {
				// Generic renderer: prefer value, fallback to name
				return (
					<SectionWrapper label={`${key.replaceAll("_", " ")}:`}>
						{renderPlainJoined(dataArray, (item) => `${item.value ?? item.name ?? ""}`)}
						{renderOtherInstructions(key)}
					</SectionWrapper>
				);
			}
		}
	};

	// Normalize order into an array of keys sorted by their index
	const normalizeOrder = (inputOrder) => {
		if (Array.isArray(inputOrder)) {
			const entries = inputOrder.flatMap((obj) => Object.entries(obj));
			return entries.sort((a, b) => a[1] - b[1]).map(([key]) => key);
		}
		if (inputOrder && typeof inputOrder === "object") {
			return Object.keys(inputOrder).sort((a, b) => (inputOrder?.[a] ?? 0) - (inputOrder?.[b] ?? 0));
		}
		return [];
	};

	const orderedExamKeys = normalizeOrder(order);
	const hasArrayWithLength = (arr) => Array.isArray(arr) && arr.length > 0;
	const SectionWrapper = ({ label, children }) => (
		<Box>
			<Text size="sm" fw={600}>
				{label}
			</Text>
			{/*<CustomDivider mb="es" borderStyle="dashed" w="90%" />*/}
			{children}
		</Box>
	);

	const renderNumberedList = (items, formatItem) => {
		return (
			<Stack gap="0px" mt="0">
				{items.map((item, idx) => (
					<Text key={idx} size="xs" c="black.5" mt="0">
						<IconPointFilled style={{ width: "10", height: "10" }} stroke={1.5} />
						{formatItem(item)}
					</Text>
				))}
			</Stack>
		);
	};

	const renderPlainJoined = (items, mapFn) => (
		<Text size="xs" c="black.5" mt="0">
			{items.map(mapFn).join(", ") || "Headache, Fever"}
		</Text>
	);
	const renderOtherInstructions = (key) => {
		const otherKey = `${key}_other_instructions`;
		const text = patientExamination?.[otherKey];
		if (!text) return null;
		return (
			<Text size="xs" c="gray" mt="xs">
				{text}
			</Text>
		);
	};

	const handleReleaseMode = (mode) => {
		modals.openConfirmModal({
			title: <Text size="md"> {t("FormConfirmationTitle")}</Text>,
			children: <Text size="sm"> {t("FormConfirmationMessage")}</Text>,
			labels: { confirm: t("Submit"), cancel: t("Cancel") },
			confirmProps: { color: "red" },
			onCancel: () => console.info("Cancel"),
			onConfirm: () => handleConfirmApproved(mode),
		});
	};

	const handleConfirmApproved = async (mode) => {
		try {
			await getDataWithoutStore({
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.RELEASE}/${id}/${mode}`,
			});
			refetch();
		} catch (err) {
			console.error(err);
			errorNotification(err?.message, ERROR_NOTIFICATION_COLOR);
		}
	};

	useEffect(() => {
		if (ipd) {
			setVitalRecordList(JSON.parse(ipd?.vital_chart_json || "[]"));
		}
	}, [ipd]);

	useEffect(() => {
		if (ipd) {
			setInsulinRecordList(JSON.parse(ipd?.insulin_chart_json || "[]"));
		}
	}, [ipd]);

	const admissionDay = ipd?.admission_day;
	const consumeDay = ipd?.consume_day;
	let dayDiff = null;
	if (admissionDay != null && consumeDay != null) {
		const diff = Math.abs(admissionDay - consumeDay);
		dayDiff = admissionDay > consumeDay ? `(${diff})` : diff;
	}

	const vitalChartData = useMemo(() => {
		if (!Array.isArray(vitalRecordList)) return [];

		return vitalRecordList
			.map((record, index) => {
				const date = record?.date ?? record?.createdAt ?? null;

				return {
					timestamp: date ? new Date(date).getTime() : Date.now() + index,
					chartLabel: date ? new Date(date).toLocaleString() : "Unknown",
					pulseRate: getNumericValue(record?.pulseRate),
					bloodPressure: getNumericValue(record?.bloodPressure),
					respirationRate: getNumericValue(record?.respirationRate),
					temperatureFahrenheit: getNumericValue(record?.temperatureFahrenheit),
					saturationWithOxygen: getNumericValue(record?.saturationWithOxygen),
					saturationWithoutOxygen: getNumericValue(record?.saturationWithoutOxygen),
				};
			})
			.filter((item) => Object.values(item).some((v) => v !== null))
			.sort((a, b) => a.timestamp - b.timestamp);
	}, [vitalRecordList]);

	const insulinChartData = useMemo(() => {
		if (!Array.isArray(insulinRecordList)) {
			return [];
		}

		return insulinRecordList
			.map((record) => {
				const chartLabelSource = record?.date || record?.createdAt || null;
				const chartLabel = chartLabelSource ? new Date(chartLabelSource).toLocaleDateString() : "Unknown";

				const mappedRecord = {
					chartLabel,
					fbs: getNumericValue(record?.fbs),
					twoHAFB: getNumericValue(record?.twoHAFB),
					twoHAL: getNumericValue(record?.twoHAL),
					twoHAD: getNumericValue(record?.twoHAD),
					bd: getNumericValue(record?.bd),
					bl: getNumericValue(record?.bl),
					insulinMorning: getNumericValue(record?.insulinMorning),
					insulinNoon: getNumericValue(record?.insulinNoon),
					insulinNight: getNumericValue(record?.insulinNight),
				};

				const hasPlottableValue = Object.entries(mappedRecord).some(
					([key, value]) => key !== "chartLabel" && value !== null
				);

				return hasPlottableValue ? mappedRecord : null;
			})
			.filter(Boolean);
	}, [insulinRecordList]);

	// =============== check if IPD data is available ================
	return (
		<Box>
			<Grid columns={12} h="100%" w="100%">
				{/* =============== Column 1: Patient Information =============== */}
				<Grid.Col span={4}>
					<ScrollArea>
						<Paper h={mainAreaHeight - 10} withBorder p="lg" radius="sm" bg="var(--theme-tertiary-color-0)">
							<Box style={{ position: "relative", minHeight: "550px" }}>
								{(orderedExamKeys.length > 0 ? orderedExamKeys : Object.keys(patientExamination || {}))
									.filter((key) => hasArrayWithLength(patientExamination?.[key]))
									.map((key) => (
										<Box key={key}>{renderExaminationSection(key)}</Box>
									))}
							</Box>
						</Paper>
					</ScrollArea>
				</Grid.Col>

				{/* =============== Column 2: Financial & Medical Information =============== */}
				<Grid.Col span={4} h="100%">
					<ScrollArea h={mainAreaHeight}>
						<Paper mih={mainAreaHeight - 10} withBorder p="lg" radius="sm" bg="white">
							<Stack gap="lg" h="100%">
								<Box>
									<Divider
										label={
											<Text size="xs" c="var(--theme-tertiary-color-7)" fw={500}>
												Medicine History
											</Text>
										}
										labelPosition="left"
									/>
									{prescriptionMedicine.length > 0 ? (
										prescriptionMedicine.map((item, index) => (
											<Grid columns={12} key={index}>
												<Grid.Col span={9}>
													<Text>
														<strong>
															{index + 1}. {item.medicine_name}
														</strong>
													</Text>
													<Text>{item.dose_details}</Text>
												</Grid.Col>
												<Grid.Col span={3}>
													<Text fw={"600"} c={item.is_active ? "green" : "red"}>
														{item.is_active ? "Active" : "Omit"}
													</Text>
												</Grid.Col>
											</Grid>
										))
									) : (
										<Text size="sm" c="var(--theme-tertiary-color-7)" fs="italic">
											No Medicine Found
										</Text>
									)}
								</Box>
								<Box>
									<Divider
										mt="xs"
										label={
											<Text size="xs" c="var(--theme-tertiary-color-7)" fw={500}>
												Investigations
											</Text>
										}
										labelPosition="left"
									/>
									{invoiceParticulars.length > 0 ? (
										invoiceParticulars.map((item, index) => (
											<Grid columns={12} key={index}>
												<Grid.Col span={9}>
													{index + 1}. {item.item_name}
												</Grid.Col>
												<Grid.Col span={3}>
													<Text size="xs"> {item.process}</Text>
												</Grid.Col>
											</Grid>
										))
									) : (
										<Text size="sm" c="var(--theme-tertiary-color-7)" fs="italic">
											No invoice particulars found
										</Text>
									)}
								</Box>
								{/*<Divider
								mt="xs"
								label={
									<Text size="xs" c="var(--theme-tertiary-color-7)" fw={500}>
										Payment Information
									</Text>
								}
								labelPosition="left"
							/>
							<Stack gap="3xs" mb="es">
								<Text fw={500} size="sm">
									Sub Total:{" "}
									<Text span fw={400}>
										{ipd?.sub_total ? `৳${ipd.sub_total}` : "-"}
									</Text>
								</Text>
								<Text fw={500} size="sm">
									Total:{" "}
									<Text span fw={400}>
										{ipd?.total ? `৳${ipd.total}` : "-"}
									</Text>
								</Text>
								<Text fw={500} size="sm">
									Due:{" "}
									<Text span fw={400}>
										{ipd?.due ? `৳${ipd.due}` : "-"}
									</Text>
								</Text>
								<Text fw={500} size="sm">
									Payment Status:{" "}
									<Text span fw={400}>
										{ipd?.payment_status || "-"}
									</Text>
								</Text>
							</Stack>
							<Divider
								mt="xs"
								label={
									<Text size="xs" c="var(--theme-tertiary-color-7)">
										Transaction History
									</Text>
								}
								labelPosition="left"
							/>*/}
							</Stack>
						</Paper>
					</ScrollArea>
				</Grid.Col>

				{/* =============== Column 3: Room & Doctor Information =============== */}
				<Grid.Col span={4} h="100%">
					<Box h={mainAreaHeight - 10} bg="var(--mantine-color-white)" className="borderRadiusAll">
						{ipd?.release_mode && ipd?.process?.toLowerCase() !== "paid" ? (
							<Paper
								m="md"
								p="md"
								withBorder
								radius="sm"
								bg="var(--theme-warn-color-1)"
								style={{ borderColor: "var(--theme-warn-color-4)" }}
							>
								<Text fw={600} size="md" c="var(--theme-warn-color-7)">
									{ipd.release_mode.charAt(0).toUpperCase() + ipd.release_mode.slice(1)}: waiting for
									the bill to be processed
								</Text>
							</Paper>
						) : ipd?.release_mode && ipd?.process?.toLowerCase() === "paid" ? (
							<Paper
								m="md"
								p="md"
								withBorder
								radius="sm"
								bg="var(--theme-secondary-color-1)"
								style={{ borderColor: "var(--theme-secondary-color-4)" }}
							>
								<Text fw={600} size="md" c="var(--theme-secondary-color-7)">
									{ipd.release_mode.charAt(0).toUpperCase() + ipd.release_mode.slice(1)}: Bill
									processed successfully
								</Text>
							</Paper>
						) : (
							<Group justify="center" py="md">
								<Button onClick={() => handleReleaseMode("discharge")}> For Discharge </Button>

								<Button variant="default" onClick={() => handleReleaseMode("death")}>
									For Death
								</Button>

								<Button variant="light" onClick={() => handleReleaseMode("referred")}>
									For Referred
								</Button>
							</Group>
						)}
						<ScrollArea h={mainAreaHeight - 110}>
							<Paper p="lg" pt={0} radius="sm" bg="var(--mantine-color-white)" h="100%">
								<Stack gap="md">
									<Divider
										label={
											<Text size="xs" c="var(--theme-tertiary-color-7)" fw={500}>
												Room/Cabin Status
											</Text>
										}
										labelPosition="left"
									/>
									<Stack gap="3xs" mb="es" p={"xs"}>
										<Grid columns={12} pl={"xs"}>
											<Grid.Col span={4}>
												<Text>Room/Cabin</Text>
											</Grid.Col>
											<Grid.Col span={8}>
												<Text>{ipd?.room_name || "-"}</Text>
											</Grid.Col>
										</Grid>
										<Grid columns={12} pl={"xs"}>
											<Grid.Col span={4}>
												<Text>Admission</Text>
											</Grid.Col>
											<Grid.Col span={2}>
												<Text>{admissionDay}</Text>
											</Grid.Col>
											<Grid.Col span={2}>
												<Text>Days</Text>
											</Grid.Col>
										</Grid>
										<Grid columns={12} pl={"xs"}>
											<Grid.Col span={4}>
												<Text>Consume</Text>
											</Grid.Col>
											<Grid.Col span={2}>
												<Text>{consumeDay}</Text>
											</Grid.Col>
											<Grid.Col span={2}>
												<Text>Days</Text>
											</Grid.Col>
										</Grid>
										<Grid columns={12} pl={"xs"} bg={admissionDay > consumeDay ? "red" : "green"}>
											<Grid.Col span={4}>
												<Text>Remaining</Text>
											</Grid.Col>
											<Grid.Col span={2}>
												<Text>{dayDiff}</Text>
											</Grid.Col>
											<Grid.Col span={2}>
												<Text>Days</Text>
											</Grid.Col>
										</Grid>
									</Stack>
									<Divider
										label={
											<Text size="xs" c="var(--theme-tertiary-color-7)" fw={500}>
												Room/Cabin Information
											</Text>
										}
										labelPosition="left"
									/>
									<Stack gap="3xs" mb="es">
										<Text fw={500} size="sm">
											Mode:{" "}
											<Text span fw={400}>
												{ipd?.mode_name || "-"}
											</Text>
										</Text>
										<Text fw={500} size="sm">
											Payment Mode:{" "}
											<Text span fw={400}>
												{ipd?.payment_mode_name || "-"}
											</Text>
										</Text>
										<Text fw={500} size="sm">
											Patient Mode:{" "}
											<Text span fw={400}>
												{ipd?.parent_patient_mode_name || "-"}
											</Text>
										</Text>
									</Stack>
									{/*<Divider
										mt="xs"
										label={
											<Text size="xs" c="var(--theme-tertiary-color-7)" fw={500}>
												Doctor Information
											</Text>
										}
										labelPosition="left"
									/>
									<Stack gap="3xs" mb="es">
										<Text fw={500} size="sm">
											Admit Consultant:{" "}
											<Text span fw={400}>
												{ipd?.admit_consultant_name || "-"}
											</Text>
										</Text>
										<Text fw={500} size="sm">
											Admit Doctor:{" "}
											<Text span fw={400}>
												{ipd?.admit_doctor_name || "-"}
											</Text>
										</Text>
										<Text fw={500} size="sm">
											Unit:{" "}
											<Text span fw={400}>
												{ipd?.admit_unit_name || "-"}
											</Text>
										</Text>
										<Text fw={500} size="sm">
											Department:{" "}
											<Text span fw={400}>
												{ipd?.admit_department_name || "-"}
											</Text>
										</Text>
										<Text fw={500} size="sm">
											Prescription Doctor:{" "}
											<Text span fw={400}>
												{ipd?.prescription_doctor_name || "-"}
											</Text>
										</Text>
									</Stack>*/}
								</Stack>
							</Paper>
						</ScrollArea>
					</Box>
				</Grid.Col>

				{/* <Grid.Col span={6}>
					<Paper withBorder p="lg" h={mainAreaHeight - 350} radius="sm" bg="var(--mantine-color-white)">
						<Stack gap="sm">
							<Text fw={600} size="lg">
								Vital Trend
							</Text>
							{vitalChartData.length > 0 ? (
								<LineChart
									h={280}
									styles={{
										legendItemName: { fontSize: "12px" },
										legendItemColor: {
											height: "10px",
											minHeight: "10px",
											width: "10px",
											minWidth: "10px",
										},
									}}
									data={vitalChartData}
									dataKey="chartLabel" // X axis = chartLabel string
									withLegend
									series={[
										{ name: "pulseRate", label: "Pulse Rate", color: "blue.6" },
										{ name: "bloodPressure", label: "Blood Pressure", color: "violet.6" },
										{ name: "respirationRate", label: "Respiration Rate", color: "green.6" },
										{ name: "temperatureFahrenheit", label: "Temperature (°F)", color: "red.6" },
										{ name: "saturationWithOxygen", label: "Sat With O₂", color: "orange.6" },
										{ name: "saturationWithoutOxygen", label: "Sat Without O₂", color: "teal.6" },
									]}
								/>
							) : (
								<Text size="sm" c="var(--theme-tertiary-color-7)">
									No vital records available
								</Text>
							)}
						</Stack>
					</Paper>
				</Grid.Col>

				<Grid.Col span={6}>
					<Paper withBorder p="lg" radius="sm" bg="var(--mantine-color-white)" h={mainAreaHeight - 350}>
						<Stack gap="sm">
							<Text fw={600} size="lg">
								Insulin Trend
							</Text>
							{insulinChartData.length > 0 ? (
								<LineChart
									h={280}
									data={insulinChartData}
									dataKey="chartLabel"
									withLegend
									styles={{
										legendItemName: { fontSize: "12px" },
										legendItemColor: {
											height: "10px",
											minHeight: "10px",
											width: "10px",
											minWidth: "10px",
										},
									}}
									series={[
										{ name: "fbs", label: "FBS", color: "blue.6" },
										{ name: "twoHAFB", label: "2H After Breakfast", color: "green.6" },
										{ name: "twoHAL", label: "2H After Lunch", color: "orange.6" },
										{ name: "twoHAD", label: "2H After Dinner", color: "grape.6" },
										{ name: "bd", label: "Before Dinner", color: "red.6" },
										{ name: "bl", label: "Before Lunch", color: "teal.6" },
										{ name: "insulinMorning", label: "Insulin Morning", color: "cyan.6" },
										{ name: "insulinNoon", label: "Insulin Noon", color: "indigo.6" },
										{ name: "insulinNight", label: "Insulin Night", color: "violet.6" },
									]}
								/>
							) : (
								<Box h="100%">
									<Text size="sm" c="var(--theme-tertiary-color-7)">
										No insulin records available
									</Text>
								</Box>
							)}
						</Stack>
					</Paper>
				</Grid.Col> */}
			</Grid>
		</Box>
	);
}
