import { Box, Text, Grid, Group, Image, Table, Flex, Stack, Center } from "@mantine/core";
import { forwardRef } from "react";
import GLogo from "@assets/images/government_seal_of_bangladesh.svg";
import TBLogo from "@assets/images/tb_logo.png";
import "@/index.css";
import { formatDate } from "@/common/utils";
import useAppLocalStore from "@/common/hooks/useAppLocalStore";
import { t } from "i18next";
import useHospitalConfigData from "@hooks/config-data/useHospitalConfigData";
import Rx from "@assets/images/rx.png";
import Barcode from "react-barcode";
import { IconPointFilled } from "@tabler/icons-react";
import { capitalizeWords } from "@utils/index";

const PAPER_HEIGHT = 1122;
const PAPER_WIDTH = 793;

const IPDPrescriptionFullBN = forwardRef(({ data, preview = false }, ref) => {
	const { user } = useAppLocalStore();

	const admissionData = data || {};
	const patientInfo = data || {};

	const jsonContent = JSON.parse(patientInfo?.json_content || "{}");
	const patientReport = jsonContent?.patient_report || {};

	const order = patientReport?.order || {};
	const patientExamination = patientReport?.patient_examination || {};
	const medicines = patientInfo?.prescription_medicine || [];
	const sortedMedicines = medicines.sort((a, b) => a.order - b.order);

	const exEmergencies = jsonContent?.exEmergency || [];
	const { hospitalConfigData } = useHospitalConfigData();
	const getValue = (value, defaultValue = "") => {
		return value || defaultValue;
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

	const renderExaminationSection = (key) => {
		const dataArray = patientExamination?.[key];
		if (!hasArrayWithLength(dataArray)) return null;

		switch (key) {
			case "chief_complaints": {
				return (
					<SectionWrapper label="C/C:">
						{renderNumberedList(
							dataArray,
							(item) => `${item.name} ${item.value || ''} ${item.duration || ''}`
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
			case "cabin": {
				return (
					<SectionWrapper label="Cabin:">
						{renderPlainJoined(dataArray, (item) => `${item.name}: ${item.value}`)}
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
	const renderImagePreview = (imageArray, fallbackSrc = null) => {
		if (imageArray.length > 0) {
			const imageUrl = URL.createObjectURL(imageArray[0]);
			return (
				<Flex h={80} justify={"center"} align={"center"} mt={"xs"}>
					<Image h={80} w={80} fit="cover" src={imageUrl} onLoad={() => URL.revokeObjectURL(imageUrl)} />
				</Flex>
			);
		} else if (fallbackSrc) {
			return (
				<Flex h={80} justify={"center"} align={"center"} mt={"xs"}>
					<Image h={80} w={80} fit="cover" src={fallbackSrc} />
				</Flex>
			);
		}
		return null;
	};

	return (
		<Box display={preview ? "block" : "none"}>
			<style>
				{`@media print {
					#prescription-table table { border-collapse: collapse !important; }
					#prescription-table table, #prescription-table table th, #prescription-table table td { border: 1px solid #807e7e !important; }
				}`}
				{`@media  {
					#prescription-table table { border-collapse: collapse !important;border: 1px solid #807e7e !important; }
					#prescription-table table, #prescription-table table th, #prescription-table table td {  padding-top:0!important; padding-bottom:0!important; margin-top:0!important; margin-bottom:0!important; }
				}`}
			</style>
			<Stack
				ref={ref}
				w="210mm"
				mih="1122px"
				className="watermark"
				ff="Arial, sans-serif"
				lh={1.5}
				fz={12}
				align="stretch"
				justify="space-between"
				pl={'80'}
			>
				<Box id="prescription-table">
					<Table
						style={{
							borderCollapse: "collapse",
							width: "100%",
							height: "1122px",
						}}
						className="customTable"
					>
						<Table.Tbody>
							<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Table.Td colSpan={"3"}>
									<Box mb="sm">
										<Flex gap="md" justify="center">
											<Box>
												<Group ml="md" align="center" h="100%">
													<Image src={GLogo} alt="logo" width={60} height={60} />
												</Group>
											</Box>
											<Box>
												<Text ta="center" fw="bold" size="lg" c="#1e40af" mt="2">
													{hospitalConfigData?.organization_name || ""}
												</Text>
												<Text ta="center" size="sm" c="gray" mt="2">
													{hospitalConfigData?.address || ""}
												</Text>
												<Text ta="center" size="sm" c="gray" mb="2">
													{t("হটলাইন")} {hospitalConfigData?.hotline || ""}
												</Text>
											</Box>
											<Box>
												<Group mr="md" justify="flex-end" align="center" h="100%">
													<Image src={TBLogo} alt="logo" width={60} height={60} />
												</Group>
											</Box>
										</Flex>
									</Box>
								</Table.Td>
							</Table.Tr>
							<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Table.Td colSpan={3} valign="middle">
									<Center>
										<Text size="md" fw={600}>
											{t("Prescription - Indoor")}
										</Text>
									</Center>
								</Table.Td>
							</Table.Tr>
							<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Table.Td>
									<Group gap="xs">
										<Text size="xs" fw={600}>
											{t("PatientID")}:
										</Text>
										<Text size="sm">{getValue(patientInfo?.patient_id || "")}</Text>
									</Group>
								</Table.Td>
								<Table.Td>
									<Group gap="xs">
										<Text size="xs" fw={600}>
											{t("IPD ID")}:
										</Text>
										<Text size="sm">{getValue(patientInfo?.invoice || "")}</Text>
									</Group>
								</Table.Td>
								<Table.Td>
									<Group gap="xs">
										<Text size="xs" fw={600}>
											{t("Type")}:
										</Text>
										<Text size="sm">{getValue(patientInfo?.payment_mode_name, "")}</Text>
									</Group>
								</Table.Td>
							</Table.Tr>
							<Table.Tr
								style={{
									border: "1px solid var(--theme-tertiary-color-8)",
									padding: 0,
									margin: 0,
								}}
							>
								<Table.Td colspan={2}>
									<Group gap="xs">
										<Text size="xs" fw={600}>
											{t("Name")}:
										</Text>
										<Text size="sm">{getValue(patientInfo?.name, "")}</Text>
									</Group>
								</Table.Td>
								<Table.Td>
									<Group gap="xs">
										<Text size="xs" fw={600}>
											{t("Age")}:
										</Text>
										<Text size="xs">
											{patientInfo?.year ? `${patientInfo.year} ${t("Years")} ` : ""}
											{patientInfo?.month ? `${patientInfo.month} ${t("Mon")} ` : ""}
											{patientInfo?.day ? `${patientInfo.day} ${t("Day")}` : ""}
										</Text>
									</Group>
								</Table.Td>
							</Table.Tr>
							<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Table.Td>
									<Group gap="xs">
										<Text size="xs" fw={600}>
											{t("Gender")}:
										</Text>
										<Text size="xs">{capitalizeWords(patientInfo?.gender || "")}</Text>
									</Group>
								</Table.Td>
								<Table.Td>
									<Group gap="xs">
										<Text size="xs" fw={600}>
											{t("Religion")}:
										</Text>
										<Text size="sm">{getValue(patientInfo?.religion_name, "")}</Text>
									</Group>
								</Table.Td>
								<Table.Td>
									<Group gap="xs">
										<Text size="xs" fw={600}>
											{t("Weight")}:
										</Text>
										<Text size="sm">{getValue(patientInfo?.weight, "")}</Text>
									</Group>
								</Table.Td>
							</Table.Tr>
							<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Table.Td>
									<Group gap="xs">
										<Text size="xs" fw={600}>
											{t("DOB")}:
										</Text>
										<Text size="xs">{getValue(patientInfo?.dob, "")}</Text>
									</Group>
								</Table.Td>
								<Table.Td>
									<Group gap="xs">
										<Text size="xs" fw={600}>
											{t("NID/Birth")}:
										</Text>
										<Text size="xs">{getValue(patientInfo?.nid, "")}</Text>
									</Group>
								</Table.Td>
								<Table.Td>
									<Group gap="xs">
										<Text size="xs" fw={600}>
											{t("Add. Date")}:
										</Text>
										<Text size="sm">{getValue(patientInfo?.admission_date, "")}</Text>
									</Group>
								</Table.Td>
							</Table.Tr>
							<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Table.Td>
									<Group gap="xs">
										<Text size="xs" fw={600}>
											{t("F/M/H")}:
										</Text>
										<Text size="xs">{getValue(patientInfo?.guardian_name, "")}</Text>
									</Group>
								</Table.Td>
								<Table.Td>
									<Group gap="xs">
										<Text size="xs" fw={600}>
											{t("Relation")}:
										</Text>
										<Text size="xs">{getValue(patientInfo?.patient_relation, "")}</Text>
									</Group>
								</Table.Td>
								<Table.Td colSpan={2}>
									<Group gap="xs">
										<Text size="xs" fw={600}>
											{t("Mobile")}:
										</Text>
										<Text size="xs">
											{getValue(patientInfo?.mobile, "")}
											{/*{patientInfo?.guardian_mobile && (
												<> / {getValue(patientInfo?.guardian_mobile, "")}</>
											)}*/}
										</Text>
									</Group>
								</Table.Td>
							</Table.Tr>
							<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Table.Td colSpan={2}>
									<Group gap="xs">
										<Text size="xs" fw={600}>
											{t("Bed/Cabin")}:
										</Text>
										<Text size="sm">{getValue(patientInfo?.room_name, "")}</Text>
									</Group>
								</Table.Td>
								<Table.Td>
									<Group gap="xs">
										<Text size="xs" fw={600}>
											{t("Department")}:
										</Text>
										<Text size="xs">{getValue(patientInfo?.admit_department_name, "")}</Text>
									</Group>
								</Table.Td>
							</Table.Tr>
							<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Table.Td colSpan={2}>
									<Group gap="xs">
										<Text size="xs" fw={600}>
											{t("ConsultantDoctor")}:
										</Text>
										<Text size="sm">{getValue(patientInfo?.admit_consultant_name, "")}</Text>
									</Group>
								</Table.Td>
								<Table.Td>
									<Group gap="xs">
										<Text size="xs" fw={600}>
											{t("Unit")}:
										</Text>
										<Text size="xs">{getValue(patientInfo?.admit_unit_name, "")}</Text>
									</Group>
								</Table.Td>
							</Table.Tr>
							<Table.Tr style={{ borderBottom: "1px solid var(--theme-tertiary-color-8)" }}>
								<Table.Td
									style={{
										borderRight: "1px solid var(--theme-tertiary-color-8)",
										padding: "4px",
										verticalAlign: "top",
										width: "220px",
									}}
								>
									<Box style={{ position: "relative", minHeight: "550px" }}>
										{(orderedExamKeys.length > 0
											? orderedExamKeys
											: Object.keys(patientExamination || {})
										)
											.filter((key) => hasArrayWithLength(patientExamination?.[key]))
											.map((key) => (
												<Box key={key}>{renderExaminationSection(key)}</Box>
											))}
									</Box>
								</Table.Td>
								<Table.Td colSpan={2} style={{ verticalAlign: "top" }}>
									<Box style={{ position: "relative", minHeight: "550px" }}>
										<Box w={"36"}>
											<Image src={Rx} alt="logo" width={"32"} height={32} />
										</Box>
										<Box gap="2">
											{/* {exEmergencies.map((emergency, index) => (
												<Box key={index}>
													<Text fw={600}>* {getValue(emergency.value)}</Text>
												</Box>
											))} */}
											{sortedMedicines
												?.filter((medicine) => medicine?.is_active === 1)
												?.map((medicine, index) => (
													<>
														<Box style={{
															borderBottom: "1px solid #ddd",
														}}>
													<Flex
														align={"left"}/**/
														key={index}
													>
														<Text fw={600} fz={'14'} >
															{index + 1}.{" "}
															{getValue( medicine?.medicine_name || medicine?.generic)}
														</Text>
														<Text
															style={{
																color: "var(--theme-tertiary-color-8)",
																marginLeft: "8px",
															}}
														>
															{"--"}
															{getValue(medicine?.dose_details)}{" "}
															{getValue(medicine?.by_meal)} {getValue(medicine?.instruction)}
														</Text>
													</Flex>
															{medicine.generic && (
														<Flex align={"left"}>
														<Text mt={'-4'} fz={'11'}>{capitalizeWords(medicine?.generic)} [SF: {formatDate(medicine?.start_date)} ]</Text>
														</Flex>
															)}
														</Box>
													</>
												))}
										</Box>
									</Box>
								</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td colSpan={3}>
									<Box ta="center">
										<Grid columns={12} gutter="0">
											<Grid.Col span={6} align="left">
												<br />
												<br />
												<br />
												<Text fz="md">AdmittedBy</Text>
											</Grid.Col>
											<Grid.Col span={6} align={"right"}>
												<Text size="sm" fw={600} mb="xs">
													<Text mt={"md"}>
														<br />
													</Text>
													<Text mt={"md"}>
														<br />
													</Text>
													<Text>
														{t("Signature")}-----------------------------------------------
													</Text>
												</Text>
											</Grid.Col>
										</Grid>
									</Box>
								</Table.Td>
							</Table.Tr>
						</Table.Tbody>
					</Table>
				</Box>
			</Stack>
		</Box>
	);
});

IPDPrescriptionFullBN.displayName = "AdmissionFormBN";

export default IPDPrescriptionFullBN;
