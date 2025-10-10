import { Box, Text, Grid, Group, Stack, Image } from "@mantine/core";
import { forwardRef } from "react";
import GLogo from "@assets/images/government_seal_of_bangladesh.svg";
import TBLogo from "@assets/images/tb_logo.png";
import CustomDivider from "@components/core-component/CustomDivider";
import "@/index.css";
import DashedDivider from "@components/core-component/DashedDivider";
import { getLoggedInUser } from "@/common/utils";
import { useTranslation } from "react-i18next";

const PAPER_HEIGHT = 1122;
const PAPER_WIDTH = 793;

const IPDDetails = forwardRef(({ data }, ref) => {
	const { t } = useTranslation();
	const user = getLoggedInUser();
	const patientInfo = data?.json_content || {};
	const invoiceDetails = data?.invoice_details || {};
	const patientReport = patientInfo?.patient_report || {};
	const basicInfo = patientReport?.basic_info || {};
	const patientExamination = patientReport?.patient_examination || {};
	const medicines = patientInfo?.medicines || [];
	// const data = data?.invoice_details?.customer_details || data;

	const getValue = (value, defaultValue = "") => {
		return value || defaultValue;
	};

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
								250 Bedded TB Hospital
							</Text>
							<Text ta="center" size="xs" c="gray" mt="2">
								Shyamolli, Dhaka-1207
							</Text>
							<Text ta="center" size="xs" c="gray" mb="2">
								Hotline: 01969910200
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
									{data?.mode_name || "OPD"}
								</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={6} px="xs">
							<Group gap="xs">
								<Text size="md" fw={600}>
									{t("Room")}
								</Text>
								<Text size="md">{getValue(data?.room_name || "100")}</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={3} px="xs">
							<Group gap="xs">
								<Text size="xs" fw={600}>
									{t("PatientID")}
								</Text>
								<Text size="xs">{getValue(data?.patient_id)}</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={3} px="xs">
							<Group gap="xs">
								<Text size="xs" fw={600}>
									{t("HID")}
								</Text>
								<Text size="xs">{getValue(data?.health_id)}</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={3} px="xs">
							<Group gap="xs">
								<Text size="xs" fw={600}>
									{t("OPDID")}
								</Text>
								<Text size="xs">{getValue(data?.invoice)}</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={3} px="xs">
							<Group gap="xs">
								<Text size="xs" fw={600}>
									{t("Room")}
								</Text>
								<Text size="xs">{getValue(data?.room_name)}</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={6} px="xs">
							<Group gap="xs">
								<Text size="xs" fw={600}>
									{t("PatientName")}
								</Text>
								<Text size="xs">{getValue(data?.name, "")}</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={3} px="xs">
							<Group gap="xs">
								<Text size="xs" fw={600}>
									{t("Mobile")}
								</Text>
								<Text size="xs">{getValue(data?.mobile)}</Text>
							</Group>
						</Grid.Col>

						<Grid.Col bd="1px solid #555" span={3} px="xs">
							<Group gap="xs">
								<Text size="xs" fw={600}>
									{t("Gender")}
								</Text>
								<Text size="xs">{getValue(data?.gender, "N/A")}</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={3} px="xs">
							<Group gap="xs">
								<Text size="xs" fw={600}>
									{t("Age")}
								</Text>
								<Text size="xs">
									{data?.year}Y, {data?.month}M, {data?.day}D
								</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={3} px="xs">
							<Group gap="xs">
								<Text size="xs" fw={600}>
									{t("DOB")}
								</Text>
								<Text size="xs">{getValue(data?.dob, "N/A")}</Text>
							</Group>
						</Grid.Col>

						<Grid.Col bd="1px solid #555" span={3} px="xs">
							<Group gap="xs">
								<Text size="xs" fw={600}>
									{t("PayMode")}
								</Text>
								<Text size="xs">{getValue(data?.payment_mode_name)}</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={3} px="xs">
							<Group gap="xs">
								<Text size="xs" fw={600}>
									{t("Fee")}
								</Text>
								<Text size="xs">{getValue(data?.amount, 0)}</Text>
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
												.join(", ") || "N/A"}
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
											{Object.entries(patientExamination?.h_o_past_illness || {})
												.filter(([, value]) => value)
												.map(([key]) => key)
												.join(", ") || "N/A"}
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
								{/* {medicines.length === 0 && (
									<Text size="xs" c="gray">
										No medicines prescribed
									</Text>
								)} */}

								<Box p="les">
									<DashedDivider mb="0" mt="0" />
									{/* =============== top section with printed by and signature ================ */}
									<Grid columns={12} gutter="md">
										<Grid.Col span={6}>
											<Text mt="md" size="sm" fw={600}>
												{t("DoctorName")}: .................................
											</Text>
										</Grid.Col>
										<Grid.Col span={6}>
											<Text mt="md" size="sm" fw={600}>
												{t("Designation")}: ..........................
											</Text>
										</Grid.Col>
									</Grid>
								</Box>
							</Stack>

							{/* <CustomDivider mt="xl" mb="md" /> */}
							{/* <Text size="xs" fw={600} mb="xs">
								অন্যান্য নির্দেশাবলী:
							</Text>
							<Text size="xs">{getValue(patientInfo.advise, "রিপোর্ট সংগ্রহ করে দেখা করবেন")}</Text> */}
						</Grid.Col>
					</Grid>
				</Box>

				{/* =============== new prescription layout matching the image ================ */}
				{/* <Box p={20} bd="1px solid #555" style={{ borderRadius: "4px" }}>
					<Grid columns={12} gutter="md">
						<Grid.Col span={6}>
							<Stack gap="0px">
								<Text size="xs" fw={600}>
									Name:
								</Text>
								<CustomDivider w="80%" />
								<Text size="xs" fw={600}>
									Designation:
								</Text>
								<CustomDivider w="80%" />
							</Stack>
						</Grid.Col>
						<Grid.Col span={6}>
							<Text pt="50px" size="xs" fw={600}>
								Signature:
							</Text>
							<CustomDivider w="80%" />
						</Grid.Col>
					</Grid>
				</Box>
				 */}
				{/* <DashedDivider mb="xs" /> */}
				{/* =============== bottom section with patient info and medication table ================ */}
				{/* <Grid columns={12} gutter="md" mb="lg">
					<Grid.Col span={4}>
						<Stack gap="6px">
							<Text size="xs" fw={500}>
								Patient Name: {getValue(patientInfo.name, "N/A")}
							</Text>
							<Text size="xs">({getValue(invoiceDetails.free_identification)}).</Text>
							<Text size="xs">Age: {getValue(data?.age, "N/A")} Y. Sex: N/A.</Text>
							<Text size="xs" fw={600} mt="xs">
								Doctor Comments:
							</Text>
							<Text size="xs" c="gray">
								{getValue(patientInfo.advise, "N/A")}
							</Text>
						</Stack>
					</Grid.Col>
				</Grid> */}

				{/* =============== footer with prescribed by ================ */}
				{/* <Box ta="center" mt="xs">
					<Text size="xs" fw={600} c="#1e40af">
						Prescribed By: Doctor ID {getValue(data?.doctor_id, "N/A")}
					</Text>
					<Text size="xs" c="gray" mt="xs">
						Prescription Date: {formatDate(patientInfo?.prescription_date)}
					</Text>
					{patientInfo?.follow_up_date && (
						<Text size="xs" c="gray" mt="xs">
							Follow Up Date: {formatDate(patientInfo?.follow_up_date)}
						</Text>
					)}
				</Box> */}

				<DashedDivider mt={0} mb={0} />
				<Box ta="center">
					<Text size="xs" c="gray" mt="xs">
						<strong>{t("PrintedBy")}: </strong>
						{user?.name}
					</Text>
					<Text fz={8}>
						{t("PrintDateAndTime")}: {new Date().toLocaleString()}
					</Text>
				</Box>
			</Box>
		</Box>
	);
});

IPDDetails.displayName = "IPDDetails";

export default IPDDetails;
