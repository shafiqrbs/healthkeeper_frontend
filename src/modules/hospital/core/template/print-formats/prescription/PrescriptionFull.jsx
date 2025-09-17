import { Box, Text, Grid, Group, Stack, Image } from "@mantine/core";
import { forwardRef } from "react";
import GLogo from "@assets/images/government_seal_of_bangladesh.svg";
import TBLogo from "@assets/images/tb_logo.png";
import DashedDivider from "@components/core-component/DashedDivider";
import CustomDivider from "@components/core-component/CustomDivider";
import { formatDate } from "@/common/utils";
import "@/index.css";
import useDoaminHospitalConfigData from "@hooks/config-data/useHospitalConfigData";
import { t } from "i18next";

const patientInfo = {
	advise: "Take medicine after you take food",
	is_completed: true,
	created_by_id: 15,
	follow_up_date: "2025-09-10T05:30:54.021Z",
	prescription_date: "2025-09-14",
};
const basicInfo = {
	bp: null,
	weight: "60",
	bloodGroup: "O+",
};
const patientExamination = {
	comorbidity: [
		{
			id: 930,
			name: "DM",
			value: true,
		},
		{
			id: 931,
			name: "HTN",
			value: true,
		},
	],
	investigation: [
		{
			id: 698,
			name: "CBC",
			value: "CBC",
		},
		{
			id: 737,
			name: "S.Creatinine",
			value: "S.Creatinine",
		},
	],
	ho_past_illness: [
		{
			id: 936,
			name: "PTB",
			value: false,
		},
		{
			id: 937,
			name: "Asthma",
			value: true,
		},
		{
			id: 939,
			name: "COVID-19",
			value: true,
		},
	],
	chief_complaints: [
		{
			id: 940,
			name: "Fever",
			value: "1",
			duration: "Day",
		},
		{
			id: 941,
			name: "Cough",
			value: "2",
			duration: "Day",
		},
	],
};
const medicines = [
	{
		id: 5,
		dosage: "3+0+0",
		period: null,
		status: 1,
		by_meal: "( IN EMPTY STOMACH )",
		generic: "PARACETAMOL BP 10MG/ML INFUSION",
		duration: "Day",
		quantity: 1,
		config_id: 2,
		is_delete: 0,
		created_at: "2025-09-14T03:19:04.000000Z",
		updated_at: "2025-09-14T03:19:04.000000Z",
		dosage_form: null,
		instruction: null,
		medicine_id: 16833,
		medicine_name: "Inf. Napa 10MG/ML",
		total_quantity: null,
		medicine_dosage_id: null,
		treatment_template_id: 1096,
	},
	{
		id: 6,
		dosage: "2 PUFFS / NOSTRIL DAILY",
		period: null,
		status: 1,
		by_meal: "GURGLE AFTER USES",
		generic: "PARACETAMOL 125 MG SUPP.",
		duration: "Day",
		quantity: 1,
		config_id: 2,
		is_delete: 0,
		created_at: "2025-09-14T03:19:23.000000Z",
		updated_at: "2025-09-14T03:19:23.000000Z",
		dosage_form: null,
		instruction: null,
		medicine_id: 17259,
		medicine_name: "SUPP. NAPA 125MG",
		total_quantity: null,
		medicine_dosage_id: null,
		treatment_template_id: 1096,
	},
	{
		id: 7,
		dosage: "1+1+1",
		period: null,
		status: 1,
		by_meal: "( After meal )",
		generic: "PARACETAMOL 500MG TAB",
		duration: "Day",
		quantity: 3,
		config_id: 2,
		is_delete: 0,
		created_at: "2025-09-14T03:19:33.000000Z",
		updated_at: "2025-09-14T03:19:33.000000Z",
		dosage_form: null,
		instruction: null,
		medicine_id: 18100,
		medicine_name: "Tab. Napa Rapid 500mg",
		total_quantity: null,
		medicine_dosage_id: null,
		treatment_template_id: 1096,
	},
	{
		times: null,
		by_meal: "( IN EMPTY STOMACH )",
		company: null,
		generic: "TRANEXAMIC ACID 500mg CAP",
		duration: "day",
		quantity: 5,
		generic_id: "611",
		treatments: "1096",
		medicine_id: "16451",
		dose_details: "1+0+1",
		medicine_name: "CAP. ANAXYL 500MG",
	},
];
const customerInformation = {
	id: 43,
	invoice_id: 64,
	created: "10-09-25",
	appointment: "10-09-25",
	invoice: null,
	total: "0",
	comment: null,
	customer_id: 186,
	name: "Md. Ibrahim Kabir",
	mobile: "01759228885",
	guardian_name: null,
	guardian_mobile: "01759228885",
	patient_id: "PID-092500016",
	health_id: null,
	gender: "male",
	year: null,
	month: null,
	day: 46,
	doctor_name: "hospital",
	designation_name: null,
	blood_pressure: null,
	diabetes: null,
	json_content:
		'{"advise": "Take medicine after you take food", "medicines": [{"id": 5, "dosage": "3+0+0", "period": null, "status": 1, "by_meal": "( IN EMPTY STOMACH )", "generic": "PARACETAMOL BP 10MG/ML INFUSION", "duration": "Day", "quantity": 1, "config_id": 2, "is_delete": 0, "created_at": "2025-09-14T03:19:04.000000Z", "updated_at": "2025-09-14T03:19:04.000000Z", "dosage_form": null, "instruction": null, "medicine_id": 16833, "medicine_name": "Inf. Napa 10MG/ML", "total_quantity": null, "medicine_dosage_id": null, "treatment_template_id": 1096}, {"id": 6, "dosage": "2 PUFFS / NOSTRIL DAILY", "period": null, "status": 1, "by_meal": "GURGLE AFTER USES", "generic": "PARACETAMOL 125 MG SUPP.", "duration": "Day", "quantity": 1, "config_id": 2, "is_delete": 0, "created_at": "2025-09-14T03:19:23.000000Z", "updated_at": "2025-09-14T03:19:23.000000Z", "dosage_form": null, "instruction": null, "medicine_id": 17259, "medicine_name": "SUPP. NAPA 125MG", "total_quantity": null, "medicine_dosage_id": null, "treatment_template_id": 1096}, {"id": 7, "dosage": "1+1+1", "period": null, "status": 1, "by_meal": "( After meal )", "generic": "PARACETAMOL 500MG TAB", "duration": "Day", "quantity": 3, "config_id": 2, "is_delete": 0, "created_at": "2025-09-14T03:19:33.000000Z", "updated_at": "2025-09-14T03:19:33.000000Z", "dosage_form": null, "instruction": null, "medicine_id": 18100, "medicine_name": "Tab. Napa Rapid 500mg", "total_quantity": null, "medicine_dosage_id": null, "treatment_template_id": 1096}, {"times": null, "by_meal": "( IN EMPTY STOMACH )", "company": null, "generic": "TRANEXAMIC ACID 500mg CAP", "duration": "day", "quantity": 5, "generic_id": "611", "treatments": "1096", "medicine_id": "16451", "dose_details": "1+0+1", "medicine_name": "CAP. ANAXYL 500MG"}], "is_completed": true, "created_by_id": 15, "follow_up_date": "2025-09-10T05:30:54.021Z", "patient_report": {"basic_info": {"bp": null, "weight": "60", "bloodGroup": "O+"}, "patient_examination": {"comorbidity": [{"id": 930, "name": "DM", "value": true}, {"id": 931, "name": "HTN", "value": true}], "investigation": [{"id": 698, "name": "CBC", "value": "CBC"}, {"id": 737, "name": "S.Creatinine", "value": "S.Creatinine"}], "ho_past_illness": [{"id": 936, "name": "PTB", "value": false}, {"id": 937, "name": "Asthma", "value": true}, {"id": 939, "name": "COVID-19", "value": true, "duration": null}], "chief_complaints": [{"id": 940, "name": "Fever", "value": "1  day"}, {"id": 941, "name": "Cough", "value": "2 days"}]}}, "prescription_date": "2025-09-14"}',
	follow_up_date: null,
	weight: null,
	height: null,
	dob: null,
	identity_mode: "NID",
	nid: null,
	address: "Dhaka, Narayanganj, Sonargaon, Baridhi, Pailopara, Cengakandini,",
	created_by_user_name: "hospital",
	created_by_name: "hospital",
	created_by_id: 15,
	room_name: null,
	mode_name: "OPD",
	payment_mode_name: "Govt. Service",
	process: "Closed",
	patient_referred_id: null,
	referred_json_content: null,
	invoice_particular: [
		{
			id: 37,
			hms_invoice_id: 43,
			item_name: null,
			quantity: 1,
			price: 10,
		},
	],
};

const PrescriptionFull = forwardRef(({ data }, ref) => {
	const { hospitalConfigData } = useDoaminHospitalConfigData();

	const getValue = (value, defaultValue = "N/A") => {
		return value || defaultValue;
	};

	return (
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
					<Grid gutter="md">
						<Grid.Col span={4}>
							<Group ml="md" align="center" h="100%">
								<Image src={GLogo} alt="logo" width={80} height={80} />
							</Group>
						</Grid.Col>
						<Grid.Col span={4}>
							<Text ta="center" fw="bold" size="lg" c="#1e40af" mt="2">
								{hospitalConfigData?.organization_name || "Hospital"}
							</Text>
							<Text ta="center" size="sm" c="gray" mt="2">
								{hospitalConfigData?.address || "Uttara"}
							</Text>
							<Text ta="center" size="sm" c="gray" mb="2">
								{t("হটলাইন")} {hospitalConfigData?.hotline || "0987634523"}
							</Text>

							<Text ta="center" fw="bold" size="lg" c="#1e40af">
								{t("Prescription")}
							</Text>
						</Grid.Col>
						<Grid.Col span={4}>
							<Group mr="md" justify="flex-end" align="center" h="100%">
								<Image src={TBLogo} alt="logo" width={80} height={80} />
							</Group>
						</Grid.Col>
					</Grid>
				</Box>

				{/* =============== patient information section ================ */}
				<Box mb="sm">
					<Grid columns={12} gutter="xs" px={4}>
						<Grid.Col bd="1px solid #555" span={3} px="xs">
							<Group gap="xs">
								<Text size="sm">{getValue(customerInformation?.patient_id || "PT-987654321")}</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={5} px="xs">
							<Group gap="xs">
								<Text size="sm" fw={600}>
									{t("নাম")}:
								</Text>
								<Text size="sm">{getValue(customerInformation?.name, "John Doe")}</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={4} px="xs">
							<Group gap="xs">
								<Text size="sm" fw={600}>
									{t("মোবাইল")}:
								</Text>
								<Text size="sm">{getValue(customerInformation?.mobile || "01717171717")}</Text>
							</Group>
						</Grid.Col>

						<Grid.Col bd="1px solid #555" span={4} px="xs">
							<Group gap="xs">
								<Text size="xs" fw={600}>
									{t("বয়স")}:
								</Text>
								<Text size="sm">
									{" "}
									{customerInformation?.day || 1} D {customerInformation?.month || 1} M{" "}
									{customerInformation?.year || ""} Y
								</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={2} px="xs">
							<Group gap="xs">
								<Text size="xs" fw={600}>
									{t("লিঙ্গ")}:
								</Text>
								<Text size="xs">{getValue(customerInformation?.gender, "Male")}</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={2} px="xs">
							<Group gap="xs">
								<Text size="xs" fw={600}>
									{t("রক্তচাপ")}:
								</Text>
								<Text size="xs">{getValue(basicInfo?.bp || "120/80")}</Text>
							</Group>
						</Grid.Col>

						<Grid.Col bd="1px solid #555" span={2} px="xs">
							<Group gap="xs">
								<Text size="xs" fw={600}>
									{t("ওজন")}:
								</Text>
								<Text size="xs">
									{getValue(basicInfo?.weight || 70)} {t("KG")}
								</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={2} px="xs">
							<Group gap="xs">
								<Text size="xs" fw={600}>
									{t("রক্তের গ্রুপ")}:
								</Text>
								<Text size="xs">{getValue(basicInfo?.bloodGroup || "A+")}</Text>
							</Group>
						</Grid.Col>
					</Grid>
				</Box>

				{/* =============== medical notes and prescription area with rx symbol ================ */}
				<Box style={{ position: "relative", minHeight: "350px" }} mb="sm">
					<Grid columns={12} gutter="md">
						<Grid.Col span={4}>
							<Stack gap="0px">
								{patientExamination?.chief_complaints && (
									<Box>
										<Text size="sm" fw={600}>
											C/C:
										</Text>
										<CustomDivider mb="es" borderStyle="dashed" w="90%" />
										<Text size="sm" c="gray" mt="-xs" mb="xs">
											{(patientExamination?.chief_complaints || [])
												.map(
													(item) => `${item.name}: ${item.value} ${item.duration || "Day"}/s`
												)
												.join(", ") || "Headache, Fever"}
										</Text>
									</Box>
								)}
								{patientExamination?.ho_past_illness && (
									<Box>
										<Text size="sm" fw={600}>
											H/O Past Illness:
										</Text>
										<CustomDivider borderStyle="dashed" w="90%" mb="es" />
										<Text size="sm" c="gray" mt="xs">
											{(patientExamination?.ho_past_illness || [])
												.map((item) => `${item.name}`)
												.join(", ") || "Headache, Fever"}
										</Text>
									</Box>
								)}
								{patientExamination?.diagnosis && (
									<Box>
										<Text size="sm" fw={600}>
											Diagnosis:
										</Text>
										<CustomDivider borderStyle="dashed" w="90%" mb="es" />
										<Text size="sm" c="gray" mt="0">
											{(patientExamination?.diagnosis || [])
												.map((item) => item.value)
												.join(", ") || "Headache, Fever"}
										</Text>
									</Box>
								)}

								{patientExamination?.icd_11_listed_diseases && (
									<Box>
										<Text size="sm" fw={600}>
											ICD-11 listed diseases:
										</Text>
										<CustomDivider borderStyle="dashed" w="90%" mb="es" />
										<Text size="sm" c="gray" mt="xs">
											{(patientExamination?.icd_11_listed_diseases || []).join(", ") ||
												"Headache, Fever"}
										</Text>
									</Box>
								)}

								{patientExamination?.comorbidity && (
									<Box>
										<Text size="sm" fw={600}>
											Comorbidity:
										</Text>
										<CustomDivider mb="es" borderStyle="dashed" w="90%" />
										<Text size="sm" c="gray" mt="-xs" mb="xs">
											{(patientExamination?.comorbidity || [])
												.filter((item) => item.value)
												.map((item) => item.name)
												.join(", ") || "Headache, Fever"}
										</Text>
									</Box>
								)}
								{patientExamination?.["treatment-history"] && (
									<Box>
										<Text size="sm" fw={600}>
											Treatment History:
										</Text>
										<CustomDivider mb="es" borderStyle="dashed" w="90%" />
										<Text size="sm" c="gray" mt="-xs" mb="xs">
											{(patientExamination?.["treatment-history"] || [])
												.map((item) => item.value)
												.join(", ") || "Headache, Fever"}
										</Text>
									</Box>
								)}
								{patientExamination?.on_examination && (
									<Box>
										<Text size="sm" fw={600}>
											On/Examination:
										</Text>
										<CustomDivider mb="es" borderStyle="dashed" w="90%" />
										<Text size="sm" c="gray" mt="-xs" mb="xs">
											Headache, Fever
										</Text>
									</Box>
								)}
								{patientExamination?.investigation && (
									<Box>
										<Text size="sm" fw={600}>
											Investigation:
										</Text>
										<CustomDivider mb="es" borderStyle="dashed" w="90%" />
										<Text size="sm" c="gray" mt="-xs" mb="xs">
											{(patientExamination?.investigation || [])
												.map((item) => item.value)
												.join(", ") || "Headache, Fever"}
										</Text>
									</Box>
								)}
							</Stack>
						</Grid.Col>
						<Grid.Col span={8} style={{ borderLeft: "2px solid #555", paddingLeft: "20px" }}>
							<Stack gap="xs" mih={200}>
								{medicines.map((medicine, index) => (
									<Box key={index}>
										<Text size="sm" fw={600} mb="xs">
											{index + 1}. {getValue(medicine.medicine_name)}
										</Text>
										<Text size="sm" c="var(--theme-tertiary-color-8)" ml="md">
											{getValue(medicine.dose_details)} {getValue(medicine.by_meal)}{" "}
											{getValue(medicine.duration)} {getValue(medicine.quantity)}
										</Text>
									</Box>
								))}
							</Stack>

							<CustomDivider mt="xl" mb="md" />
							<Text size="sm" fw={600} mb="xs">
								অন্যান্য নির্দেশাবলী:
							</Text>
							<Text size="sm">{getValue(patientInfo.advise, "রিপোর্ট সংগ্রহ করে দেখা করবেন")}</Text>
						</Grid.Col>
					</Grid>
				</Box>

				{/* =============== new prescription layout matching the image ================ */}
				<Box p={20} bd="1px solid #555" style={{ borderRadius: "4px" }}>
					{/* =============== top section with printed by and signature ================ */}
					<Grid columns={12} gutter="md">
						<Grid.Col span={6}>
							<Stack gap="0px">
								<Text size="sm" fw={600}>
									Name:
								</Text>
								<CustomDivider w="80%" />
								<Text size="sm" fw={600}>
									Designation:
								</Text>
								<CustomDivider w="80%" />
							</Stack>
						</Grid.Col>
						<Grid.Col span={6}>
							<Text pt="50px" size="sm" fw={600}>
								Signature:
							</Text>
							<CustomDivider w="80%" />
						</Grid.Col>
					</Grid>
				</Box>
				<DashedDivider mb="xs" />

				{/* =============== bottom section with patient info and medication table ================ */}
				<Grid columns={12} gutter="md" mb="lg">
					<Grid.Col span={4}>
						<Stack gap="6px">
							<Text size="sm" fw={500}>
								Patient Name: {getValue(customerInformation?.name, "John Doe")}
							</Text>
							<Text size="sm">
								Age: {getValue(customerInformation?.year, "25")} Y. Sex:{customerInformation?.gender}
							</Text>
							<Text size="sm" fw={600} mt="sm">
								Doctor Comments:
							</Text>
							<Text size="sm" c="gray">
								{getValue(patientInfo?.advise, "Headache, Fever")}
							</Text>
						</Stack>
					</Grid.Col>
					<Grid.Col span={8}>
						{/* =============== medication table ================ */}
						<Box style={{ border: "1px solid #333", borderRadius: "4px", overflow: "hidden" }}>
							<Grid columns={4}>
								<Grid.Col
									span={3}
									p={10}
									bg="#f8f9fa"
									style={{
										borderRight: "1px solid #333",
										borderBottom: "1px solid #333",
									}}
								>
									<Text size="sm" fw={600} pl={4} ta="left">
										Generic
									</Text>
								</Grid.Col>
								<Grid.Col
									span={1}
									p={10}
									bg="#f8f9fa"
									style={{
										borderBottom: "1px solid #333",
									}}
								>
									<Text size="sm" fw={600} ta="center">
										Quantity
									</Text>
								</Grid.Col>
								{medicines?.map((medicine, index) => (
									<>
										<Grid.Col
											key={`name-${index}`}
											span={3}
											p={10}
											style={{
												borderRight: "1px solid #333",
												borderBottom: index < medicines.length - 1 ? "1px solid #333" : "none",
											}}
										>
											<Text size="sm" pl={4}>
												{index + 1}. {getValue(medicine.generic)}
											</Text>
										</Grid.Col>
										<Grid.Col
											key={`count-${index}`}
											span={1}
											p={10}
											style={{
												borderBottom: index < medicines.length - 1 ? "1px solid #333" : "none",
											}}
										>
											<Text size="sm" ta="center" fw={500}>
												{getValue(medicine.amount, "1")}
											</Text>
										</Grid.Col>
									</>
								))}
								{medicines?.length === 0 && (
									<>
										<Grid.Col span={3} p={10} style={{ borderRight: "1px solid #333" }}>
											<Text size="sm" pl={4}>
												No medicines
											</Text>
										</Grid.Col>
										<Grid.Col span={1} p={10}>
											<Text size="sm" ta="center" fw={500}>
												-
											</Text>
										</Grid.Col>
									</>
								)}
							</Grid>
						</Box>
					</Grid.Col>
				</Grid>

				{/* =============== footer with prescribed by ================ */}
				<Box ta="center" mt="xs">
					<Text size="sm" fw={600} c="#1e40af">
						Prescribed By: Doctor ID {getValue(data?.doctor_id, "DOC-987654321")}
					</Text>
					<Text size="sm" c="gray" mt="xs">
						Prescription Date: {formatDate(new Date())}
					</Text>
					{patientInfo?.follow_up_date && (
						<Text size="sm" c="gray" mt="xs">
							Follow Up Date: {formatDate(new Date())}
						</Text>
					)}
				</Box>
			</Box>
		</Box>
	);
});

PrescriptionFull.displayName = "Prescription2";

export default PrescriptionFull;
