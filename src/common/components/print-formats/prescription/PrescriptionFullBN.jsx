import { Box, Text, Grid, Group, Stack, Image, Flex } from "@mantine/core";
import { forwardRef } from "react";
import GLogo from "@assets/images/government_seal_of_bangladesh.svg";
import TBLogo from "@assets/images/tb_logo.png";
import DashedDivider from "@components/core-component/DashedDivider";
import CustomDivider from "@components/core-component/CustomDivider";
import { formatDate } from "@/common/utils";
import "@/index.css";
import useHospitalConfigData from "@hooks/config-data/useHospitalConfigData";
import { t } from "i18next";
import Barcode from "react-barcode";

const PrescriptionFullBN = forwardRef(({ data, preview = false }, ref) => {
	const patientInfo = data || {};
	const jsonContent = JSON.parse(patientInfo?.json_content || "{}");
	const patientReport = jsonContent?.patient_report || {};
	const order = patientReport?.order || {};
	const patientExamination = patientReport?.patient_examination || {};
	const medicines = jsonContent?.medicines || [];
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
			<CustomDivider mb="es" borderStyle="dashed" w="90%" />
			{children}
		</Box>
	);

	const renderNumberedList = (items, formatItem) => {
		return (
			<Stack gap="0px" mt="0">
				{items.map((item, idx) => (
					<Text key={idx} size="xs" c="black.5" mt="0">
						{idx + 1}. {formatItem(item)}
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
			<Box>
				<Box
					ref={ref}
					p="md"
					w="210mm"
					mih="1122px"
					className="watermark"
					ff="Arial, sans-serif"
					lh={1.5}
					fz={12}
					bd="1px solid black"
				>
					{/* =============== header section with doctor information in bengali and english ================ */}
					<Box mb="sm">
						<Flex gap="md" justify="center">
							<Box>
								<Group ml="md" align="center" h="100%">
									<Image src={GLogo} alt="logo" width={80} height={80} />
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

								<Text ta="center" fw="bold" size="lg" c="#1e40af">
									{t("Prescription")}
								</Text>
							</Box>
							<Box>
								<Group mr="md" justify="flex-end" align="center" h="100%">
									<Image src={TBLogo} alt="logo" width={80} height={80} />
								</Group>
							</Box>
						</Flex>
					</Box>

					{/* =============== patient information section ================ */}
					<Box mb="sm">
						<Grid columns={12} gutter="xs" px={4}>
							<Grid.Col bd="1px solid #555" span={2} px="xs">
								<Group gap="xs">
									<Text size="xs">{getValue(patientInfo?.invoice || "")}</Text>
								</Group>
							</Grid.Col>
							<Grid.Col bd="1px solid #555" span={2} px="xs">
								<Group gap="xs">
									<Text size="xs">{getValue(patientInfo?.patient_id || "")}</Text>
								</Group>
							</Grid.Col>
							<Grid.Col bd="1px solid #555" span={4} px="xs">
								<Group gap="xs">
									<Text size="xs" fw={600}>
										{t("Name")}:
									</Text>
									<Text size="sm">{getValue(patientInfo?.name, "")}</Text>
								</Group>
							</Grid.Col>
							<Grid.Col bd="1px solid #555" span={4} px="xs">
								<Group gap="xs">
									<Text size="xs" fw={600}>
										{t("Mobile")}:
									</Text>
									<Text size="xs">{getValue(patientInfo?.mobile || "")}</Text>
								</Group>
							</Grid.Col>

							<Grid.Col bd="1px solid #555" span={4} px="xs">
								<Group gap="xs">
									<Text size="xs" fw={600}>
										{t("Age")}:
									</Text>
									<Text size="xs">
										{patientInfo?.year || 0} Y {patientInfo?.month || 0} M {patientInfo?.day || 0} D
									</Text>
								</Group>
							</Grid.Col>
							<Grid.Col bd="1px solid #555" span={2} px="xs">
								<Group gap="xs">
									<Text size="xs" fw={600}>
										{t("Gender")}:
									</Text>
									<Text size="xs">
										{patientInfo?.gender &&
											patientInfo.gender[0].toUpperCase() + patientInfo.gender.slice(1)}
									</Text>
								</Group>
							</Grid.Col>
							<Grid.Col bd="1px solid #555" span={2} px="xs">
								{patientInfo?.dob && (
									<Group gap="xs">
										<Text size="xs" fw={600}>
											{t("DOB")}:
										</Text>
										<Text size="xs">{patientInfo?.dob || ""}</Text>
									</Group>
								)}
							</Grid.Col>
							<Grid.Col bd="1px solid #555" span={4} px="xs">
								<Group gap="xs">
									<strong>{t("Date")}:</strong> {patientInfo?.created || ""}
								</Group>
							</Grid.Col>
						</Grid>
					</Box>

					{/* =============== medical notes and prescription area with rx symbol ================ */}
					<Box style={{ position: "relative", minHeight: "350px" }} mb="sm">
						<Grid columns={12} gutter="md">
							<Grid.Col span={4}>
								<Stack gap="0px">
									{(orderedExamKeys.length > 0
										? orderedExamKeys
										: Object.keys(patientExamination || {})
									)
										.filter((key) => hasArrayWithLength(patientExamination?.[key]))
										.map((key) => (
											<Box key={key}>{renderExaminationSection(key)}</Box>
										))}
								</Stack>
							</Grid.Col>
							<Grid.Col span={8} style={{ borderLeft: "2px solid #555", paddingLeft: "20px" }}>
								<Stack gap="2" mih={200}>
									{exEmergencies.map((emergency, index) => (
										<Box key={index}>
											<Text size="xs" fw={600}>
												{index + 1}. {getValue(emergency.value)}
											</Text>
										</Box>
									))}
									{medicines.map((medicine, index) => (
										<Box key={index}>
											<Text size="xs" fw={600}>
												{exEmergencies.length + index + 1}.{" "}
												{getValue(
													medicine.medicine_id ? medicine.medicine_name : medicine.generic
												)}
											</Text>
											{medicine.dosages && medicine.dosages.length > 0 ? (
												(medicine.dosages || []).map((dose, dIdx) => (
													<Text
														key={dose.id ?? dIdx}
														size="xs"
														c="var(--theme-tertiary-color-8)"
														ml="md"
													>
														{getValue(dose.dose_details_bn, dose.dose_details)}{" "}
														{" ------- "}
														{getValue(dose.by_meal_bn, dose.by_meal)} {" ------- "}
														{getValue(dose.quantity)} {getValue(medicine.duration)}
													</Text>
												))
											) : (
												<Text size="xs" c="var(--theme-tertiary-color-8)" ml="md">
													{getValue(medicine.dose_details_bn, medicine.dose_details)}{" "}
													{" ------- "}
													{getValue(medicine.by_meal_bn, medicine.by_meal)} {" ------- "}
													{getValue(medicine.quantity)} {getValue(medicine.duration)}
												</Text>
											)}
										</Box>
									))}
								</Stack>
								<Box mt="4" mb={"4"} style={{ borderBottom: `1px solid #444` }} />
								<Text size="sm" fw={600}>
									উপদেশ: {getValue(jsonContent.advise, "রিপোর্ট সংগ্রহ করে দেখা করবেন")}
								</Text>
								{patientInfo?.referred_comment && (
									<>
										<Box mt="4" mb={"4"} style={{ borderBottom: `1px solid #444` }} />
										<Text size="xs" fw={400}>
											Note: {getValue(patientInfo?.referred_comment)}
										</Text>
									</>
								)}

								{jsonContent?.follow_up_date && (
									<Text size="sm" c="gray" mt="xs">
										Follow Up Date: {formatDate(jsonContent?.follow_up_date)}
									</Text>
								)}
							</Grid.Col>
						</Grid>
					</Box>

					{/* =============== new prescription layout matching the image ================ */}
					<Box bd="1px solid #555" style={{ borderRadius: "4px" }}>
						{/* =============== top section with printed by and signature ================ */}
						<Grid columns={12} gutter="0">
							<Grid.Col span={6} pl="xl" pt="sm">
								<Text fz={"sm"}>{t("PrescribedBy")}</Text>
								<Text fz={"xs"}>{patientInfo?.doctor_name}</Text>
								<Text fz={"xs"}>
									{t("Designation")}: {patientInfo?.designation_name}
								</Text>
								<Text fz="xs">
									{t("DoctorID")}: {getValue(patientInfo?.employee_id)}
								</Text>
							</Grid.Col>
							<Grid.Col span={6}>
								<Text size="sm" fw={600} mb="xs">
									{renderImagePreview([], patientInfo?.signature_path)}
								</Text>
							</Grid.Col>
						</Grid>
					</Box>
					<DashedDivider />
					<Box mb="sm">
						<Flex gap="md" justify="center">
							<Box>
								<Group ml="md" align="center" h="100%">
									<Image src={GLogo} alt="logo" width={46} height={46} />
								</Group>
							</Box>
							<Box>
								<Text ta="center" fw="bold" size="lg" c="#1e40af" mt="2">
									{hospitalConfigData?.organization_name || ""}
								</Text>
								<Text ta="center" size="sm" c="gray" mt="2">
									{hospitalConfigData?.address || ""}
									{(hospitalConfigData?.hotline && `, ${hospitalConfigData?.hotline}`) || ""}
								</Text>
							</Box>
							<Box>
								<Group mr="md" justify="flex-end" align="center" h="100%">
									<Image src={TBLogo} alt="logo" width={46} height={46} />
								</Group>
							</Box>
						</Flex>
					</Box>
					{/* =============== bottom section with patient info and medication table ================ */}
					<Grid columns={12} gutter="md" mb="lg">
						<Grid.Col span={4}>
							<Stack gap="2px">
								<Text size="xs" fw={500}>
									Name: {getValue(patientInfo?.name)}
								</Text>
								<Text size="xs" fw={500}>
									Mobile: {getValue(patientInfo?.mobile)}
								</Text>
								<Text size="xs">
									Age: {getValue(patientInfo?.year, "25")} Y. Sex:{patientInfo?.gender}
								</Text>
								<Text size="xs" fw={600} c="#1e40af">
									Prescribed By: {getValue(patientInfo?.doctor_name)}
								</Text>
								<Text size="xs">Doctor ID- {getValue(patientInfo?.employee_id)}</Text>
								<Text size="xs">Designation: {getValue(patientInfo?.designation_name)}</Text>
							</Stack>
						</Grid.Col>
						<Grid.Col span={8}>
							{/* =============== medication table ================ */}
							<Box style={{ border: "1px solid #333", borderRadius: "4px", overflow: "hidden" }}>
								<Grid
									columns={24}
									p={8}
									bg="#f8f9fa"
									style={{
										borderBottom: "1px solid #333",
									}}
								>
									<Grid.Col span={20} m={0} p={0}>
										<Text size="xs" pl={4}>
											Generic Name
										</Text>
									</Grid.Col>
									<Grid.Col span={4} m={0} p={0}>
										<Text size="sm" ta="center" fw={500}>
											Quantity
										</Text>
									</Grid.Col>
								</Grid>
								{medicines?.map((medicine, index) => (
									<>
										{medicine.medicine_id && medicine?.opd_quantity > 0 && (
											<Grid columns={24} m={4} p={4}>
												<Grid.Col span={20} m={0} p={0}>
													<Text size="xs" pl={4}>
														{index + 1}.{" "}
														{getValue(medicine.medicine_id ? medicine.generic : "")}
													</Text>
												</Grid.Col>
												<Grid.Col span={4} m={0} p={0}>
													<Text size="sm" ta="center" fw={500}>
														{getValue(medicine?.opd_quantity, 0)}
													</Text>
												</Grid.Col>
											</Grid>
										)}
									</>
								))}
							</Box>
							<Box mt="sm" align="center">
								<Barcode fontSize={"12"} width={"1"} height={"40"} value={patientInfo?.barcode} />
							</Box>
						</Grid.Col>
					</Grid>

					{/* =============== footer with prescribed by ================ */}
					<Box ta="center" mt="xs">
						<Text size="sm" c="gray" mt="xs">
							Prescription Date: {formatDate(new Date())}
						</Text>
					</Box>
				</Box>
			</Box>
		</Box>
	);
});

PrescriptionFullBN.displayName = "PrescriptionFullBN";

export default PrescriptionFullBN;
