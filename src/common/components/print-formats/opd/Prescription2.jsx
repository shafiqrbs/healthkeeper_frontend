import { Box, Text, Grid, Group, Stack, Image } from "@mantine/core";
import { forwardRef } from "react";
import GLogo from "@assets/images/government_seal_of_bangladesh.svg";
import TBLogo from "@assets/images/tb_logo.png";
import DashedDivider from "@components/core-component/DashedDivider";
import CustomDivider from "@components/core-component/CustomDivider";
import { formatDate } from "@/common/utils";
import "@/index.css";

const PrescriptionFull = forwardRef(({ data }, ref) => {
	const patientInfo = JSON.parse(data?.json_content || "{}");
	const patientReport = patientInfo?.patient_report || {};
	const basicInfo = patientReport?.basic_info || {};
	const patientExamination = patientReport?.patient_examination || {};
	const medicines = patientInfo?.medicines || [];
	const customerInformation = data?.invoice_details?.customer_details || data;

	const getValue = (value, defaultValue = "N/A") => {
		return value || defaultValue;
	};

	return (
		<Box display="none">
			<Box ref={ref} p="md" w="210mm" h="100vh" className="watermark" ff="Arial, sans-serif" lh={1.5} fz={12}>
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
								250 Bedded TB Hospital
							</Text>
							<Text ta="center" size="sm" c="gray" mt="2">
								Shyamolli, Dhaka-1207
							</Text>
							<Text ta="center" size="sm" c="gray" mb="2">
								Hotline: 01969910200
							</Text>

							<Text ta="center" fw="bold" size="lg" c="#1e40af">
								Prescription
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
								<Text size="sm">{getValue(customerInformation?.patient_id)}</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={5} px="xs">
							<Group gap="xs">
								<Text size="sm" fw={600}>
									রোগীর নাম:
								</Text>
								<Text size="sm">{getValue(customerInformation?.name, "N/A")}</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={4} px="xs">
							<Group gap="xs">
								<Text size="sm" fw={600}>
									মোবাইল:
								</Text>
								<Text size="sm">{getValue(customerInformation?.mobile)}</Text>
							</Group>
						</Grid.Col>

						<Grid.Col bd="1px solid #555" span={2} px="xs">
							<Group gap="xs">
								<Text size="sm" fw={600}>
									বয়স:
								</Text>
								<Text size="sm">
									{" "}
									{basicInfo?.year}Y, {basicInfo?.month || 0}M, {basicInfo?.day || 0}D
								</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={2} px="xs">
							<Group gap="xs">
								<Text size="sm" fw={600}>
									লিঙ্গ:
								</Text>
								<Text size="sm">{getValue(customerInformation?.gender, "N/A")}</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={2} px="xs">
							<Group gap="xs">
								<Text size="sm" fw={600}>
									রক্তচাপ:
								</Text>
								<Text size="sm">{getValue(basicInfo?.bp)}</Text>
							</Group>
						</Grid.Col>

						<Grid.Col bd="1px solid #555" span={2} px="xs">
							<Group gap="xs">
								<Text size="sm" fw={600}>
									ওজন:
								</Text>
								<Text size="sm">{getValue(basicInfo?.weight)}</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={2} px="xs">
							<Group gap="xs">
								<Text size="sm" fw={600}>
									রক্তের গ্রুপ:
								</Text>
								<Text size="sm">{getValue(basicInfo?.bloodGroup)}</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={2} px="xs">
							<Group gap="xs">
								<Text size="sm" fw={600}>
									ধরণ:
								</Text>
								<Text size="sm">N/A</Text>
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
												.map((item) => `${item.name}: ${item.value}`)
												.join(", ") || "N/A"}
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
												.map((item) => `${item.name} ${item.duration}`)
												.join(", ") || "N/A"}
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
												.join(", ") || "N/A"}
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
											{(patientExamination?.icd_11_listed_diseases || []).join(", ") || "N/A"}
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
												.join(", ") || "N/A"}
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
												.join(", ") || "N/A"}
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
											N/A
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
												.join(", ") || "N/A"}
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
								{/* {medicines.length === 0 && (
									<Text size="sm" c="gray">
										No medicines prescribed
									</Text>
								)} */}
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
								Patient Name: {getValue(customerInformation?.name, "N/A")}
							</Text>
							<Text size="sm">
								Age: {getValue(customerInformation?.year, "N/A")} Y. Sex:{customerInformation?.gender}
							</Text>
							<Text size="sm" fw={600} mt="sm">
								Doctor Comments:
							</Text>
							<Text size="sm" c="gray">
								{getValue(patientInfo?.advise, "N/A")}
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
						Prescribed By: Doctor ID {getValue(data?.doctor_id, "N/A")}
					</Text>
					<Text size="sm" c="gray" mt="xs">
						Prescription Date: {formatDate(patientInfo?.prescription_date)}
					</Text>
					{patientInfo?.follow_up_date && (
						<Text size="sm" c="gray" mt="xs">
							Follow Up Date: {formatDate(patientInfo?.follow_up_date)}
						</Text>
					)}
				</Box>
			</Box>
		</Box>
	);
});

PrescriptionFull.displayName = "Prescription2";

export default PrescriptionFull;
