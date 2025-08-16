import { Box, Text, Grid, Group, Stack, Image } from "@mantine/core";
import { forwardRef } from "react";
import GLogo from "@assets/images/government_seal_of_bangladesh.svg";
import TBLogo from "@assets/images/tb_logo.png";

const Prescription3 = forwardRef((props, ref) => {
	const { prescriptionData } = props;

	return (
		<Box display="none">
			<Box ref={ref} p="md" className="watermark" ff="Arial, sans-serif">
				{/* =============== hospital header section ================ */}
				<Box bd="2px solid var(--theme-primary-color-9)" mb="md" pb="xxs">
					<Grid>
						<Grid.Col span={4}>
							<Group ml="sm" align="center" h="100%">
								<Image src={GLogo} alt="logo" width={90} height={90} />
							</Group>
						</Grid.Col>
						<Grid.Col span={4}>
							<Text ta="center" fw="bold" size="md" c="#1e40af" mt="md">
								250 Bedded TB Hospital
							</Text>
							<Text ta="center" size="sm" c="gray">
								Shyamolli, Dhaka-1207
							</Text>
							<Text ta="center" size="sm" c="gray">
								Hotline: 01969910200
							</Text>

							<Text ta="center" mt="es" fw="bold" size="md" c="#1e40af">
								Prescription
							</Text>
						</Grid.Col>
						<Grid.Col span={4}>
							<Group mr="sm" justify="flex-end" align="center" h="100%">
								<Image src={TBLogo} alt="logo" width={90} height={90} />
							</Group>
						</Grid.Col>
					</Grid>
				</Box>

				{/* =============== patient information section ================ */}
				<Grid mb="md">
					<Grid.Col span={6}>
						<Text fw="bold" size="sm">
							Patient Name:
						</Text>
						<Text size="sm">
							{prescriptionData?.patientName || "PARUL BEGUM"} (
							{prescriptionData?.patientId || "TBH20250729412"})
						</Text>
					</Grid.Col>
					<Grid.Col span={6}>
						<Text fw="bold" size="sm">
							Admission Date:
						</Text>
						<Text size="sm">{prescriptionData?.admissionDate || "7/29/2025 2:14:02 PM"}</Text>
					</Grid.Col>
					<Grid.Col span={6}>
						<Text fw="bold" size="sm">
							Date of Birth:
						</Text>
						<Text size="sm">{prescriptionData?.dateOfBirth || ""}</Text>
					</Grid.Col>
					<Grid.Col span={6}>
						<Text fw="bold" size="sm">
							Patient Age:
						</Text>
						<Text size="sm">{prescriptionData?.age || "40 Y, 0 M, 0 D"}</Text>
					</Grid.Col>
					<Grid.Col span={6}>
						<Text fw="bold" size="sm">
							Gender:
						</Text>
						<Text size="sm">{prescriptionData?.gender || "Female"}</Text>
					</Grid.Col>
					<Grid.Col span={6}>
						<Text fw="bold" size="sm">
							Pres. Date:
						</Text>
						<Text size="sm">{prescriptionData?.prescriptionDate || "29/07/2025"}</Text>
					</Grid.Col>
					<Grid.Col span={6}>
						<Text fw="bold" size="sm">
							Mobile Number:
						</Text>
						<Text size="sm">{prescriptionData?.mobileNumber || "01860601287"}</Text>
					</Grid.Col>
					<Grid.Col span={6}>
						<Text fw="bold" size="sm">
							Weight (KG):
						</Text>
						<Text size="sm">{prescriptionData?.weight || ""}</Text>
					</Grid.Col>
				</Grid>

				{/* =============== medical history and prescription section ================ */}
				<Grid>
					{/* =============== left column - medical history ================ */}
					<Grid.Col span={6} pr="md">
						<Stack gap="xs">
							<Box>
								<Text fw="bold" size="sm">
									C/C:
								</Text>
								<Text size="sm" mih={20} style={{ borderBottom: "1px solid #e5e7eb" }}>
									{prescriptionData?.chiefComplaint || ""}
								</Text>
							</Box>
							<Box>
								<Text fw="bold" size="sm">
									H/O Past Illness:
								</Text>
								<Text size="sm" mih={20} style={{ borderBottom: "1px solid #e5e7eb" }}>
									{prescriptionData?.pastIllness || ""}
								</Text>
							</Box>
							<Box>
								<Text fw="bold" size="sm">
									Asthma:
								</Text>
								<Text size="sm" mih={20} style={{ borderBottom: "1px solid #e5e7eb" }}>
									{prescriptionData?.asthma || ""}
								</Text>
							</Box>
							<Box>
								<Text fw="bold" size="sm">
									Diagnosis:
								</Text>
								<Text size="sm" mih={20} style={{ borderBottom: "1px solid #e5e7eb" }}>
									{prescriptionData?.diagnosis || ""}
								</Text>
							</Box>
							<Box>
								<Text fw="bold" size="sm">
									ICD-11 listed diseases:
								</Text>
								<Text size="sm" mih={20} style={{ borderBottom: "1px solid #e5e7eb" }}>
									{prescriptionData?.icd11Diseases || ""}
								</Text>
							</Box>
							<Box>
								<Text fw="bold" size="sm">
									Comorbidity:
								</Text>
								<Text size="sm" mih={20} style={{ borderBottom: "1px solid #e5e7eb" }}>
									{prescriptionData?.comorbidity || ""}
								</Text>
							</Box>
							<Box>
								<Text fw="bold" size="sm">
									Treatment History:
								</Text>
								<Text size="sm" mih={20} style={{ borderBottom: "1px solid #e5e7eb" }}>
									{prescriptionData?.treatmentHistory || ""}
								</Text>
							</Box>
							<Box>
								<Text fw="bold" size="sm">
									On/Examination:
								</Text>
								<Text size="sm" mih={20} style={{ borderBottom: "1px solid #e5e7eb" }}>
									{prescriptionData?.examination || ""}
								</Text>
							</Box>
							<Box>
								<Text fw="bold" size="sm">
									Investigation:
								</Text>
								<Text size="sm" mih={20} style={{ borderBottom: "1px solid #e5e7eb" }}>
									{prescriptionData?.investigation || ""}
								</Text>
							</Box>
						</Stack>
					</Grid.Col>

					{/* =============== right column - prescription medications ================ */}
					<Grid.Col span={6} pl="md">
						<Box>
							<Text fw="bold" size="sm" mb="xs">
								Rx:
							</Text>
							<Stack gap="xs">
								{prescriptionData?.medications?.map((med, index) => (
									<Box key={index} pb="xs" style={{ borderBottom: "1px solid #e5e7eb" }}>
										<Text size="sm" fw="bold">
											{med.name}:
										</Text>
										<Text size="sm">
											{med.dosage} --- {med.duration}
										</Text>
										{med.instructions && (
											<Text size="sm" c="gray">
												{med.instructions}
											</Text>
										)}
									</Box>
								)) || (
									<>
										<Box pb="xs" style={{ borderBottom: "1px solid #e5e7eb" }}>
											<Text size="sm" fw="bold">
												Nebulization with Budicort:
											</Text>
											<Text size="sm">-- 2 times --- 7 দিন</Text>
										</Box>
										<Box pb="xs" style={{ borderBottom: "1px solid #e5e7eb" }}>
											<Text size="sm" fw="bold">
												Nebulization with windel Plus:
											</Text>
											<Text size="sm">--- 3 times --- 7 দিন।</Text>
										</Box>
										<Box pb="xs" style={{ borderBottom: "1px solid #e5e7eb" }}>
											<Text size="sm" fw="bold">
												Tab LUMONA 10mg:
											</Text>
											<Text size="sm">0+0+1 --- 1 মাস</Text>
										</Box>
										<Box pb="xs" style={{ borderBottom: "1px solid #e5e7eb" }}>
											<Text size="sm" fw="bold">
												TAB. DOXIVA 200MG:
											</Text>
											<Text size="sm">1+0+1 --- 1 মাস</Text>
										</Box>
										<Box pb="xs" style={{ borderBottom: "1px solid #e5e7eb" }}>
											<Text size="sm" fw="bold">
												Inh. Seroxyn HFA 25/250:
											</Text>
											<Text size="sm">2 PUFF 12 HOURLY --- GURGLE AFTER USE --- 1 মাস</Text>
										</Box>
										<Box pb="xs" style={{ borderBottom: "1px solid #e5e7eb" }}>
											<Text size="sm" fw="bold">
												Inhaler Azmasol plus HFA:
											</Text>
											<Text size="sm">--- 2 puff 2-3 times if distress</Text>
										</Box>
										<Box pb="xs" style={{ borderBottom: "1px solid #e5e7eb" }}>
											<Text size="sm" fw="bold">
												TAB. CORTAN 20MG:
											</Text>
											<Text size="sm">1+0+0 --- (After meal) --- 5 দিন।</Text>
										</Box>
										<Box pb="xs" style={{ borderBottom: "1px solid #e5e7eb" }}>
											<Text size="sm" fw="bold">
												CAP. OMEP 20MG:
											</Text>
											<Text size="sm">1+0+1 --- (Before Meal) --- 10 দিন।</Text>
										</Box>
									</>
								)}
							</Stack>
						</Box>
					</Grid.Col>
				</Grid>

				{/* =============== other instructions section ================ */}
				<Box mt="md" mb="md">
					<Text fw="bold" size="sm">
						অন্যান্য নির্দেশাবলী (Other Instructions):
					</Text>
					<Text size="sm" mih={20} style={{ borderBottom: "1px solid #e5e7eb" }}>
						{prescriptionData?.otherInstructions || "রিপোর্ট সংগ্রহ করে দেখা করবেন।"}
					</Text>
				</Box>
			</Box>
		</Box>
	);
});

Prescription3.displayName = "Prescription3";

export default Prescription3;
