import { Box, Text, Grid, Group, Stack, Image } from "@mantine/core";
import { forwardRef } from "react";
import GLogo from "@assets/images/government_seal_of_bangladesh.svg";
import TBLogo from "@assets/images/tb_logo.png";
import CustomDivider from "@components/core-component/CustomDivider";
import "@/index.css";
import DashedDivider from "@/common/components/core-component/DashedDivider";
import { getLoggedInUser } from "@/common/utils";
import { t } from "i18next";
import useDoaminHospitalConfigData from "@hooks/config-data/useHospitalConfigData";
import useDataWithoutStore from "@hooks/useDataWithoutStore";
import {HOSPITAL_DATA_ROUTES} from "@/constants/routes";

const PAPER_HEIGHT = 1122;
const PAPER_WIDTH = 793;

// =============== default data structure for opd a4 document ================
const defaultData = {
	id: 1,
	invoice: "INV-987654321",
	patient_id: "PT-987654321",
	health_id: "HID-987654321",
	name: "John Doe",
	mobile: "01717171717",
	gender: "Male",
	year: 25,
	month: 1,
	day: 1,
	dob: "2000-01-01",
	payment_mode_name: "Cash",
	total: 100,
	mode_name: "OPD",
	room_name: "100",
	json_content: {
		medicines: [
			{
				medicineName: "Paracetamol 500mg",
				dosage: "1+1+1",
				by_meal: "After meal",
				duration: "7 days",
				count: "21 tablets",
			},
			{
				medicineName: "Amoxicillin 250mg",
				dosage: "1+0+1",
				by_meal: "After meal",
				duration: "5 days",
				count: "10 capsules",
			},
		],
		patient_report: {
			basic_info: {
				bp: "120/80",
				weight: "70",
				bloodGroup: "A+",
			},
			patient_examination: {
				chief_complaints: {
					fever: "High fever for 2 days",
					cough: "Dry cough",
					headache: "Severe headache",
				},
				ho_past_illness: {
					diabetes: true,
					hypertension: false,
					asthma: true,
				},
				diagnosis: {
					viral_fever: true,
					upper_respiratory_infection: true,
				},
				icd_11_listed_diseases: ["J06.9", "R50.9"],
				comorbidity: {
					diabetes: true,
					hypertension: false,
				},
				treatment_history: {
					previous_treatment: "None",
				},
				on_examination: {
					temperature: "102°F",
					pulse: "90 bpm",
					blood_pressure: "120/80 mmHg",
				},
				investigation: ["CBC", "Blood Sugar", "Chest X-ray"],
			},
		},
	},
};

const OPDDocument = forwardRef(({ data = defaultData }, ref) => {
	const user = getLoggedInUser();
	const patientInfo = data?.json_content || {};
	const invoiceDetails = data?.invoice_details || {};
	const patientReport = patientInfo?.patient_report || {};
	const basicInfo = patientReport?.basic_info || {};
	const patientExamination = patientReport?.patient_examination || {};
	const medicines = patientInfo?.medicines || [];
	const { hospitalConfigData } = useDoaminHospitalConfigData();
	const getValue = (value, defaultValue = "") => {
		return value || defaultValue;
	};
	const { data: prescriptionData } = useDataWithoutStore({
		url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.PRESCRIPTION.INDEX}/50`,
	});

	return (
		<Box>
			<Box
				ref={ref}
				p="md"
				w={PAPER_WIDTH}
				h={PAPER_HEIGHT}
				style={{ overflow: "hidden" }}
				className="watermark"
				ff="Arial, sans-serif"
				lh={1.5}
				fz={12}
				bd="1px solid black"
			>
				{/* =============== header section with doctor information in bengali and english ================ */}
				<Box mb="xs">
					<Grid gutter="md">
						<Grid.Col span={4}>
							<Group ml="md" align="center" h="100%" py="xs">
								<Image src={GLogo} alt="logo" width={80} height={80} />
							</Group>
						</Grid.Col>
						<Grid.Col span={4}>
							<Text ta="center" fw="bold" size="lg" c="#1e40af" mt="2">
								{getValue(hospitalConfigData?.organization_name, "")}
							</Text>
							<Text ta="center" size="xs" c="gray" mt="2">
								{getValue(hospitalConfigData?.address, "")}
							</Text>
							<Text ta="center" size="xs" c="gray" mb="2">
								{t("হটলাইন")} {getValue(hospitalConfigData?.hotline, "")}
							</Text>
						</Grid.Col>
						<Grid.Col span={4}>
							<Group mr="md" justify="flex-end" align="center" h="100%" py="xs">
								<Image src={TBLogo} alt="logo" width={80} height={80} />
							</Group>
						</Grid.Col>
					</Grid>
				</Box>

				{/* =============== patient information section ================ */}
				<Box mb="xs">
					<Grid columns={12} gutter="xs" px={4}>
						<Grid.Col bd="1px solid #555" span={6} px="xs">
							<Group gap="xs">
								<Text size="md" fw={600}>
									{t("মোড")} {getValue(data?.mode_name, "")}
								</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={6} px="xs">
							<Group gap="xs">
								<Text size="md" fw={600}>
									{t("বহির্বিভাগ কক্ষ")}
								</Text>
								<Text size="md">{getValue(data?.room_name, "")}</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={3} px="xs">
							<Group gap="xs">
								<Text size="xs">{getValue(data?.invoice, "")}</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={3} px="xs">
							<Group gap="xs">
								<Text size="xs">{getValue(data?.patient_id, "")}</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={3} px="xs">
							<Group gap="xs">
								<Text size="xs" fw={600}>
									{t("HID")}
								</Text>
								<Text size="xs">{getValue(data?.health_id, "")}</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={3} px="xs">
							<Group gap="xs" />
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={6} px="xs">
							<Group gap="xs">
								<Text size="xs" fw={600}>
									{t("নাম")}
								</Text>
								<Text size="xs">{getValue(data?.name, "")}</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={3} px="xs">
							<Group gap="xs">
								<Text size="xs" fw={600}>
									{t("মোবাইল")}
								</Text>
								<Text size="xs">{getValue(data?.mobile, "")}</Text>
							</Group>
						</Grid.Col>

						<Grid.Col bd="1px solid #555" span={3} px="xs">
							<Group gap="xs">
								<Text size="xs" fw={600}>
									{t("লিঙ্গ")}
								</Text>
								<Text size="xs">{getValue(data?.gender, "Male")}</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={3} px="xs">
							<Group gap="xs">
								<Text size="xs" fw={600}>
									{t("বয়স")}
								</Text>
								<Text size="xs">
									{getValue(data?.year, 25)} Y, {getValue(data?.month, 1)} M, {getValue(data?.day, 1)}{" "}
									D
								</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={3} px="xs">
							<Group gap="xs">
								<Text size="xs" fw={600}>
									{t("জন্ম তারিখ")}
								</Text>
								<Text size="xs">{getValue(data?.dob, "")}</Text>
							</Group>
						</Grid.Col>

						<Grid.Col bd="1px solid #555" span={3} px="xs">
							<Group gap="xs">
								<Text size="xs">{getValue(data?.payment_mode_name, "Cash")}</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={3} px="xs">
							<Group gap="xs">
								<Text size="xs" fw={600}>
									{t("ফি পরিমাণ")}
								</Text>
								<Text size="xs">{getValue(data?.total, 0)}</Text>
							</Group>
						</Grid.Col>
					</Grid>
				</Box>

				{/* =============== medical notes and prescription area with rx symbol ================ */}
				<Box style={{ position: "relative", minHeight: "350px" }} mb="lg">
					<Grid columns={12} gutter="md">
						<Grid.Col span={4}>
							<Stack gap="0px">
								{patientExamination?.chief_complaints && (
									<Box>
										<Text size="xs" fw={600}>
											{t("ChiefComplaints")}
										</Text>
										<CustomDivider mb="es" borderStyle="dashed" w="90%" />
										<Text size="xs" c="gray" mt="-xs" mb="xs">
											{Object.entries(patientExamination?.chief_complaints || {})
												.map(([, value]) => value)
												.join(", ") || "Headache, Fever"}
										</Text>
									</Box>
								)}
								{patientExamination?.ho_past_illness && (
									<Box>
										<Text size="xs" fw={600}>
											{t("HOPastIllness")}
										</Text>
										<CustomDivider borderStyle="dashed" w="90%" />
										<Text size="xs" c="gray" mt="xs">
											{Object.entries(patientExamination?.ho_past_illness || {})
												.filter(([, value]) => value)
												.map(([key]) => key)
												.join(", ") || "Headache, Fever"}
										</Text>
									</Box>
								)}
								{patientExamination?.diagnosis && (
									<Box>
										<Text size="xs" fw={600}>
											{t("Diagnosis")}
										</Text>
										<CustomDivider borderStyle="dashed" w="90%" />
										<Text size="xs" c="gray" mt="xs">
											N/A
										</Text>
									</Box>
								)}

								{patientExamination?.icd_11_listed_diseases && (
									<Box>
										<Text size="xs" fw={600}>
											{t("ICD11ListedDiseases")}
										</Text>
										<CustomDivider borderStyle="dashed" w="90%" />
										<Text size="xs" c="gray" mt="xs">
											{(patientExamination?.icd_11_listed_diseases || []).join(", ") || "N/A"}
										</Text>
									</Box>
								)}

								{patientExamination?.comorbidity && (
									<Box>
										<Text size="xs" fw={600}>
											{t("Comorbidity")}
										</Text>
										<CustomDivider mb="es" borderStyle="dashed" w="90%" />
										<Text size="xs" c="gray" mt="-xs" mb="xs">
											{Object.entries(patientExamination?.comorbidity || {})
												.filter(([, value]) => value)
												.map(([key]) => key)
												.join(", ") || "N/A"}
										</Text>
									</Box>
								)}
								{patientExamination?.treatment_history && (
									<Box>
										<Text size="xs" fw={600}>
											{t("TreatmentHistory")}
										</Text>
										<CustomDivider mb="es" borderStyle="dashed" w="90%" />
										<Text size="xs" c="gray" mt="-xs" mb="xs">
											N/A
										</Text>
									</Box>
								)}
								{patientExamination?.on_examination && (
									<Box>
										<Text size="xs" fw={600}>
											{t("OnExamination")}
										</Text>
										<CustomDivider mb="es" borderStyle="dashed" w="90%" />
										<Text size="xs" c="gray" mt="-xs" mb="xs">
											N/A
										</Text>
									</Box>
								)}
								{patientExamination?.investigation && (
									<Box>
										<Text size="xs" fw={600}>
											{t("Investigation")}
										</Text>
										<CustomDivider mb="es" borderStyle="dashed" w="90%" />
										<Text size="xs" c="gray" mt="-xs" mb="xs">
											{(patientExamination?.investigation || []).join(", ") || "N/A"}
										</Text>
									</Box>
								)}
							</Stack>
						</Grid.Col>
						<Grid.Col span={8} style={{ borderLeft: "2px solid #555", paddingLeft: "20px" }}>
							<Stack gap="xs" h={PAPER_HEIGHT - 330} justify="space-between">
								<Box>
									<Text fz="xl" fw="bold" pl="sm">
										Rx.
									</Text>
									{medicines.map((medicine, index) => (
										<Box key={index}>
											<Text size="xs" fw={600} mb="xs">
												{index + 1}. {getValue(medicine.medicineName)}
											</Text>
											<Text size="xs" c="var(--theme-tertiary-color-8)" ml="md">
												{getValue(medicine.dosage)} {getValue(medicine.by_meal)}{" "}
												{getValue(medicine.duration)} {getValue(medicine.count)}
											</Text>
										</Box>
									))}
								</Box>
								<Box p="les">
									<DashedDivider mb="0" mt="0" />
									{/* =============== top section with printed by and signature ================ */}
									<Grid columns={12} gutter="md">
										<Grid.Col span={6}>
											<Text mt="md" size="sm" fw={600}>
												{t("ডাক্তারের নাম")}: .................................
											</Text>
										</Grid.Col>
										<Grid.Col span={6}>
											<Text mt="md" size="sm" fw={600}>
												{t("পদবি")}: ..........................
											</Text>
										</Grid.Col>
									</Grid>
								</Box>
							</Stack>
						</Grid.Col>
					</Grid>
				</Box>
				<DashedDivider mt={0} mb={0} />
				<Box ta="center">
					<Text size="xs" c="gray" mt="xs">
						<strong>{t("প্রিন্ট")}: </strong>
						{user?.name}
					</Text>
					<Text fz={8}>
						{t("প্রিন্টের সময়")}: {new Date().toLocaleString()}
					</Text>
				</Box>
			</Box>
		</Box>
	);
});

OPDDocument.displayName = "OPDDocument";

export default OPDDocument;
