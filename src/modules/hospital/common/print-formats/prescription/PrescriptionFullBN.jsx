import { Box, Text, Grid, Group, Stack, Image, Flex, Table } from "@mantine/core";
import { forwardRef } from "react";
import GLogo from "@assets/images/government_seal_of_bangladesh.svg";
import Rx from "@assets/images/rx.png";
import TBLogo from "@assets/images/tb_logo.png";
import DashedDivider from "@components/core-component/DashedDivider";
import { capitalize, formatDate } from "@/common/utils";
import "@/index.css";
import useHospitalConfigData from "@hooks/config-data/useHospitalConfigData";
import { t } from "i18next";
import Barcode from "react-barcode";
import { IconPointFilled, IconPhoneCall } from "@tabler/icons-react";

const PrescriptionFullBN = forwardRef(({ data, preview = false }, ref) => {
	const patientInfo = data || {};
	const jsonContent = JSON.parse(patientInfo?.json_content || "{}");
	const patientReport = jsonContent?.patient_report || {};
	const order = patientReport?.order || {};
	const patientExamination = patientReport?.patient_examination || {};
	//const medicines = patientInfo?.prescription_medicine || [];
	const medicines = jsonContent?.medicines || [];
	const exEmergencies = jsonContent?.exEmergency || [];
	const { hospitalConfigData } = useHospitalConfigData();
	const getValue = (value, defaultValue = "") => {
		return value || defaultValue;
	};

	// Normalize order into an array of keys sorted by their index
	const normalizeOrder = (inputOrder) => {
		// console.log(inputOrder);
		if (Array.isArray(inputOrder)) {
			// console.log(inputOrder);
			const entries = inputOrder.flatMap((obj) => Object.entries(obj));
			// console.log(entries);
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
			{items.map(mapFn).join(", ") || ""}
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
		// console.log(key);
		const dataArray = patientExamination?.[key];
		if (!hasArrayWithLength(dataArray)) return null;

		switch (key) {
			case "chief_complaints": {
				const filteredArray = Array.isArray(dataArray)
					? dataArray.filter((item) => item?.isActive === true)
					: dataArray;
				if (!hasArrayWithLength(filteredArray)) return null;

				return (
					<SectionWrapper label="C/C:">
						{renderNumberedList(
							filteredArray,
							(item) => `${item.name} ${item.value || ""} ${item.duration || ""}`
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
							{dataArray.join(", ") || ""}
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
					p="48px"
					w="210mm"
					mih="1122px"
					className="watermark"
					ff="Arial, sans-serif"
					lh={1.5}
					fz={12}
				>
					{/* =============== header section with doctor information in bengali and english ================ */}
					{/* =============== patient information section ================ */}
					<Table
						style={{
							borderCollapse: "collapse",
							width: "100%",
							border: "1px solid var(--theme-tertiary-color-8)",
						}}
						className="customTable"
					>
						<Table.Tbody>
							<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Table.Td colSpan={"6"}>
									<Box>
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
								<Table.Td
									style={{
										border: "1px solid var(--theme-tertiary-color-8)",
										paddingLeft: "4px",
										fontSize: "12px",
										width: "120px",
									}}
								>
									{getValue(patientInfo?.patient_id || "")}
								</Table.Td>
								<Table.Td
									style={{
										border: "1px solid var(--theme-tertiary-color-8)",
										paddingLeft: "4px",
										fontSize: "12px",
										width: "120px",
									}}
								>
									{getValue(patientInfo?.invoice || "")}
								</Table.Td>
								<Table.Td colSpan={"2"}>
									<Group gap="xs">
										<Text size="xs" fw={600}>
											{t("Name")}:
										</Text>
										<Text size="sm">{getValue(patientInfo?.name, "")}</Text>
									</Group>
								</Table.Td>
								<Table.Td colSpan={"2"}>
									<Group gap="xs">
										<Text size="xs" fw={600}>
											{t("Mobile")}:
										</Text>
										<Text size="xs">{getValue(patientInfo?.mobile || "")}</Text>
									</Group>
								</Table.Td>
							</Table.Tr>
							<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Table.Td
									colSpan={2}
									style={{
										border: "1px solid var(--theme-tertiary-color-8)",
										padding: "4px",
									}}
								>
									<Group gap="xs">
										<Text size="xs" fw={600}>
											{t("Age")}:
										</Text>
										<Text size="xs">
											{patientInfo?.year || 0} Years {patientInfo?.month || 0} Mon{" "}
											{patientInfo?.day || 0} Day
										</Text>
									</Group>
								</Table.Td>
								<Table.Td>
									<Group gap="4xs">
										<Text size="xs">{t("Gender")}:</Text>
										<Text size="xs">
											{patientInfo?.gender &&
												patientInfo.gender[0].toUpperCase() + patientInfo.gender.slice(1)}
										</Text>
									</Group>
								</Table.Td>
								<Table.Td px={"0"}>
									{patientInfo?.dob && (
										<Group gap="4xs">
											<Text size="xs">{t("DOB")}:</Text>
											<Text size="xs">{patientInfo?.dob || ""}</Text>
										</Group>
									)}
								</Table.Td>
								<Table.Td px={"0"}>
									{patientInfo?.weight && (
										<Group gap="4xs">
											<Text size="xs">{t("Wt.")}:</Text>
											<Text size="xs">{patientInfo?.weight || ""} KG</Text>
										</Group>
									)}
								</Table.Td>
								<Table.Td px={"0"}>
									<Group gap="4xs">
										<Text size="xs">{t("Date")}:</Text>{" "}
										<Text size="xs">{patientInfo?.created || ""}</Text>
									</Group>
								</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td
									colSpan={2}
									style={{
										borderRight: "1px solid var(--theme-tertiary-color-8)",
										padding: "4px",
										verticalAlign: "top",
									}}
								>
									<Box style={{ position: "relative", minHeight: "350px" }}>
										{(orderedExamKeys.length > 0
											? orderedExamKeys
											: Object.keys(patientExamination || {})
										)
											.filter((key) => hasArrayWithLength(patientExamination?.[key]))
											.map((key) => (
												<Box key={key}>{renderExaminationSection(key)}</Box>
											))}
									</Box>
									{patientInfo?.is_vital === 1 && (
										<Flex
											mih={50}
											gap="xs"
											justify="flex-start"
											align="flex-end"
											direction="row"
											wrap="nowrap"
										>
											<Box w={"100%"}>
												<Box style={{ borderBottom: `1px solid #444` }}>Vitals</Box>
												<Grid columns={24} gutter={"2"}>
													{patientInfo?.bp && (
														<Grid.Col span={14}>
															<Text style={{ fontSize: "11px" }}>
																{t("B/P")}: {patientInfo?.bp} mmHg
															</Text>
														</Grid.Col>
													)}
													{patientInfo?.pulse && (
														<Grid.Col span={10} fz="xs" align={"left"}>
															<Text style={{ fontSize: "11px" }}>
																{t("Pulse")}: {patientInfo?.pulse}
																/bpm
															</Text>
														</Grid.Col>
													)}
												</Grid>
												<Grid columns={24} gutter={"2"}>
													{patientInfo?.sat_without_O2 && (
														<Grid.Col span={14} fz="xs" align={"left"}>
															<Text style={{ fontSize: "11px" }}>
																{t("Sat")}: {patientInfo?.sat_without_O2} % w/o O₂
															</Text>
														</Grid.Col>
													)}
													{patientInfo?.temperature && (
														<Grid.Col span={10}>
															<Text style={{ fontSize: "11px" }}>
																{t("Temp")}: {patientInfo?.temperature} °F
															</Text>
														</Grid.Col>
													)}
												</Grid>
												<Grid columns={24} gutter={"2"}>
													{patientInfo?.sat_with_O2 && (
														<Grid.Col span={14}>
															<Text style={{ fontSize: "11px" }}>
																{t("Sat")}: {patientInfo?.sat_with_O2} % w/{" "}
																{patientInfo?.sat_liter || 0} L O₂
															</Text>
														</Grid.Col>
													)}
													{patientInfo?.respiration && (
														<Grid.Col span={10} fz="xs" align={"left"}>
															<Text style={{ fontSize: "11px" }}>
																{t("Res R.")}: {patientInfo?.respiration}/min
															</Text>
														</Grid.Col>
													)}
												</Grid>
											</Box>
										</Flex>
									)}
								</Table.Td>
								<Table.Td colSpan={4} style={{ verticalAlign: "top" }}>
									<Box style={{ position: "relative", minHeight: "350px" }}>
										<Box w={"36"}>
											<Image src={Rx} alt="logo" width={"32"} height={32} />
										</Box>
										{patientInfo?.referred_mode &&
											patientInfo.prescribe_doctor_id === patientInfo.referred_by_id && (
												<>
													<Box mt="4" mb={"md"} style={{ borderBottom: `1px solid #444` }}>
														{patientInfo?.referred_mode === "hospital" &&
														patientInfo?.referred_hospital ? (
															<Text size="xs" fw={700}>
																{capitalize(getValue(patientInfo?.referred_mode))} To :{" "}
																{getValue(patientInfo?.referred_hospital)}
															</Text>
														) : patientInfo?.referred_mode === "room" ? (
															<Text size="xs" fw={700}>
																{capitalize(getValue(patientInfo?.referred_mode))} To :{" "}
																{getValue(patientInfo?.referred_room)}
															</Text>
														) : null}
														<Text size="xs" fw={400}>
															Cause of Ref: {getValue(patientInfo?.referred_comment)}
														</Text>
													</Box>
												</>
											)}
										<Box gap="2">
											{exEmergencies.map((emergency, index) => (
												<Flex
													key={index}
													gap="2"
													justify="flex-start"
													align="center"
													direction="row"
													wrap="wrap"
													style={{
														fontSize: "13px",
													}}
												>
													<IconPointFilled
														style={{ width: "10", height: "10" }}
														stroke={1.5}
													/>
													{getValue(emergency.value)}
												</Flex>
											))}
											{medicines.map((medicine, index) => (
												<Box key={index}>
													<Flex
														gap="2"
														justify="flex-start"
														align="center"
														direction="row"
														wrap="wrap"
														fw={"600"}
														style={{
															fontSize: "12px",
														}}
													>
														<IconPointFilled
															style={{ width: "10", height: "10" }}
															stroke={1.5}
														/>
														{getValue(
															medicine.medicine_id
																? medicine.medicine_name
																: medicine.generic
														)}
													</Flex>
													{medicine.dosages && medicine.dosages.length > 0 ? (
														(medicine.dosages || []).map((dose, dIdx) => (
															<Text
																key={dIdx}
																style={{
																	fontSize: "11px",
																	color: "var(--theme-tertiary-color-8)",
																	marginLeft: "32px",
																}}
															>
																{getValue(dose.dose_details_bn, dose.dose_details)}{" "}
																{" ---- "}
																{getValue(dose.by_meal_bn, dose.by_meal)} {" ---- "}
																{dose?.quantity > 0 && getValue(dose.quantity)}{" "}
																{dose.duration &&
																	getValue(dose.duration_mode_bn, dose.duration)}
															</Text>
														))
													) : (
														<Text
															style={{
																fontSize: "11px",
																color: "var(--theme-tertiary-color-8)",
																marginLeft: "32px",
															}}
														>
															{getValue(medicine.dose_details_bn, medicine.dose_details)}{" "}
															{" ---- "}
															{getValue(medicine.by_meal_bn, medicine.by_meal)} {"----"}
															{medicine?.quantity > 0 && getValue(medicine.quantity)}{" "}
															{medicine?.duration &&
																getValue(medicine.duration_mode_bn, medicine.duration)}
														</Text>
													)}
												</Box>
											))}
										</Box>
									</Box>
									<Flex
										mih={50}
										gap="md"
										justify="flex-start"
										align="flex-end"
										direction="row"
										wrap="nowrap"
									>
										<Box>
											<Text size="sm" fw={500}>
												উপদেশ: {getValue(jsonContent.advise)}
											</Text>
											{jsonContent?.follow_up_date && (
												<Text size="sm" mt="xs">
													* Follow Up: {jsonContent?.follow_up_date}
												</Text>
											)}
											<Text size="sm" fz={"xs"} fw={600}>
												* রিপোর্ট (যদি থাকে ) সংগ্রহ করে দেখা করবেন।
											</Text>
										</Box>
										{patientInfo?.referred_mode === "admission" && (
											<Box>
												<Text size="sm" fw={500}>
													Room/Bed No........
												</Text>
											</Box>
										)}
									</Flex>
								</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td
									colSpan={2}
									style={{
										borderTop: "1px solid var(--theme-tertiary-color-8)",
										padding: "4px",
									}}
								>
									<Box align="center">
										{patientInfo?.patient_id && (
											<Barcode
												fontSize={"12"}
												width={"1"}
												height={"24"}
												value={patientInfo?.patient_id}
											/>
										)}
									</Box>
								</Table.Td>
								<Table.Td
									colSpan={4}
									style={{
										textAlign: "right",
										borderTop: "1px solid var(--theme-tertiary-color-8)",
										padding: "4px",
									}}
								>
									<Box pr={"md"}>
										<Text fz={"sm"} mt={"md"}>
											{t("PrescribedBy")}
										</Text>
										<Text fz={"xs"}>{patientInfo?.doctor_name}</Text>
									</Box>
								</Table.Td>
							</Table.Tr>
						</Table.Tbody>
					</Table>
					<DashedDivider />
					<Table
						style={{
							borderCollapse: "collapse",
							width: "100%",
							border: "1px solid var(--theme-tertiary-color-8)",
						}}
						className="customTable"
					>
						<Table.Tbody>
							<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Table.Td colSpan={"6"}>
									<Flex gap="md" align="center" justify="center">
										<Flex>
											<Image src={GLogo} alt="logo" width={46} height={46} />
											<Box pl={"xs"} pr={"xs"}>
												<Text ta="center" fw="bold" size="lg" c="#1e40af" mt="2">
													{hospitalConfigData?.organization_name || ""}
												</Text>
												<Text ta="center" size="sm" c="gray" mt="2">
													{hospitalConfigData?.address || ""},
													<IconPhoneCall
														style={{ width: "12", height: "12" }}
														stroke={1.5}
													/>{" "}
													{(hospitalConfigData?.hotline &&
														` ${hospitalConfigData?.hotline}`) ||
														""}
												</Text>
											</Box>
											<Image src={TBLogo} alt="logo" width={46} height={46} />
										</Flex>
									</Flex>
								</Table.Td>
							</Table.Tr>
							<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Table.Td
									w={"40%"}
									style={{
										borderRight: "1px solid var(--theme-tertiary-color-8)",
										padding: "4px",
										verticalAlign: "top",
									}}
								>
									<Box align="left">
										{patientInfo?.barcode && (
											<Barcode
												fontSize={"10"}
												width={"1"}
												height={"24"}
												value={patientInfo?.barcode}
											/>
										)}
									</Box>
									<Stack gap="1" ml={"xs"}>
										<Text size="xs" fw={500}>
											Name: {getValue(patientInfo?.name)}
										</Text>
										<Text size="xs" fw={500}>
											Mobile: {getValue(patientInfo?.mobile)}
										</Text>
										<Text size="xs">
											Age: {getValue(patientInfo?.year, "25")} Y. Sex:
											{patientInfo?.gender}
										</Text>
										<Text size="xs" fw={600} c="#1e40af">
											Prescribed By: {getValue(patientInfo?.doctor_name)}
										</Text>
										{jsonContent?.pharmacyInstruction && (
											<Text size="xs" fw={400}>
												Comment: {getValue(jsonContent?.pharmacyInstruction)}
											</Text>
										)}
										{/*<Text size="xs">Doctor ID- {getValue(patientInfo?.employee_id)}</Text>
								<Text size="xs">Designation: {getValue(patientInfo?.designation_name)}</Text>*/}
									</Stack>
								</Table.Td>
								<Table.Td w={"60%"} style={{ verticalAlign: "top" }}>
									<Box
										mt={"4"}
										style={{
											border: "1px solid var(--theme-tertiary-color-2)",
											overflow: "hidden",
										}}
									>
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
																<IconPointFilled
																	style={{
																		width: "10",
																		height: "10",
																	}}
																	stroke={1.5}
																/>
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
								</Table.Td>
							</Table.Tr>
						</Table.Tbody>
					</Table>

					{/* =============== bottom section with patient info and medication table ================ */}

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
