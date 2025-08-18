import { Box, Text, Grid, Group, Stack, Image } from "@mantine/core";
import { forwardRef } from "react";
import GLogo from "@assets/images/government_seal_of_bangladesh.svg";
import TBLogo from "@assets/images/tb_logo.png";
import DashedDivider from "@components/core-component/DashedDivider";
import CustomDivider from "@components/core-component/CustomDivider";
import "@/index.css";

const Prescription3 = forwardRef((props, ref) => {
	const { prescriptionData } = props;

	return (
		<Box display="none">
			<Box
				ref={ref}
				p="md"
				bg="var(--mantine-color-green-1)"
				miw="210mm"
				mih="100vh"
				className="watermark"
				ff="Arial, sans-serif"
				lh={1.5}
				fz={12}
			>
				{/* =============== header section with doctor information in bengali and english ================ */}
				<Box bd="2px solid var(--mantine-color-green-9)" mb="sm" style={{ borderRadius: "6px" }}>
					<Grid gutter="md">
						<Grid.Col span={4}>
							<Group ml="md" align="center" h="100%">
								<Image src={GLogo} alt="logo" width={75} height={75} />
							</Group>
						</Grid.Col>
						<Grid.Col span={4}>
							<Text ta="center" fw="bold" size="lg" c="#1e40af" mt="xs">
								250 Bedded TB Hospital
							</Text>
							<Text ta="center" size="sm" c="gray" mt="xs">
								Shyamolli, Dhaka-1207
							</Text>
							<Text ta="center" size="sm" c="gray" mb="xs">
								Hotline: 01969910200
							</Text>

							<Text ta="center" fw="bold" size="lg" c="#1e40af">
								Prescription
							</Text>
						</Grid.Col>
						<Grid.Col span={4}>
							<Group mr="md" justify="flex-end" align="center" h="100%">
								<Image src={TBLogo} alt="logo" width={75} height={75} />
							</Group>
						</Grid.Col>
					</Grid>
				</Box>

				{/* =============== patient information section ================ */}
				<Box mb="sm">
					<Grid columns={12} gutter="xs" px={4}>
						<Grid.Col bd="1px solid #555" span={3} p="xs" style={{ borderRadius: "6px" }}>
							<Group gap="xs">
								<Text size="sm" fw={600}>
									রোগীর আইডি:
								</Text>
								<Text size="sm">{prescriptionData?.patientId || "TBH20"}</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={5} p="xs" style={{ borderRadius: "6px" }}>
							<Group gap="xs">
								<Text size="sm" fw={600}>
									রোগীর নাম:
								</Text>
								<Text size="sm">{prescriptionData?.patientName || "PARUL BEGUM"}</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={4} p="xs" style={{ borderRadius: "6px" }}>
							<Group gap="xs">
								<Text size="sm" fw={600}>
									মোবাইল:
								</Text>
								<Text size="sm">{prescriptionData?.mobileNumber || "01860601287"}</Text>
							</Group>
						</Grid.Col>

						<Grid.Col bd="1px solid #555" span={2} p="xs" style={{ borderRadius: "6px" }}>
							<Group gap="xs">
								<Text size="sm" fw={600}>
									বয়স:
								</Text>
								<Text size="sm">{prescriptionData?.age || "40"}</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={2} p="xs" style={{ borderRadius: "6px" }}>
							<Group gap="xs">
								<Text size="sm" fw={600}>
									লিঙ্গ:
								</Text>
								<Text size="sm">{prescriptionData?.gender || "Female"}</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={2} p="xs" style={{ borderRadius: "6px" }}>
							<Group gap="xs">
								<Text size="sm" fw={600}>
									রক্তচাপ:
								</Text>
								<Text size="sm">[BP]</Text>
							</Group>
						</Grid.Col>

						<Grid.Col bd="1px solid #555" span={2} p="xs" style={{ borderRadius: "6px" }}>
							<Group gap="xs">
								<Text size="sm" fw={600}>
									ওজন:
								</Text>
								<Text size="sm">{prescriptionData?.weight || ""}</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={2} p="xs" style={{ borderRadius: "6px" }}>
							<Group gap="xs">
								<Text size="sm" fw={600}>
									রক্তের গ্রুপ:
								</Text>
								<Text size="sm">[O+]</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={2} p="xs" style={{ borderRadius: "6px" }}>
							<Group gap="xs">
								<Text size="sm" fw={600}>
									ধরণ:
								</Text>
								<Text size="sm">[Type]</Text>
							</Group>
						</Grid.Col>
					</Grid>
				</Box>

				{/* =============== medical notes and prescription area with rx symbol ================ */}
				<Box style={{ position: "relative", minHeight: "350px" }} mb="lg">
					<Grid columns={12} gutter="md">
						<Grid.Col span={4}>
							<Stack gap="0px">
								<Box>
									<Text size="sm" fw={600}>
										C/C:
									</Text>
									<CustomDivider borderStyle="dashed" w="90%" />
								</Box>
								<Box>
									<Text size="sm" fw={600}>
										H/O Past Illness:
									</Text>
									<CustomDivider borderStyle="dashed" w="90%" />
								</Box>
								<Box>
									<Text size="sm" fw={600}>
										Asthma:
									</Text>
									<CustomDivider borderStyle="dashed" w="90%" />
								</Box>
								<Box>
									<Text size="sm" fw={600}>
										Diagnosis:
									</Text>
									<CustomDivider borderStyle="dashed" w="90%" />
								</Box>
								<Box>
									<Text size="sm" fw={600}>
										ICD-11 listed diseases:
									</Text>
									<CustomDivider borderStyle="dashed" w="90%" />
								</Box>
								<Box>
									<Text size="sm" fw={600}>
										Comorbidity:
									</Text>
									<CustomDivider borderStyle="dashed" w="90%" />
								</Box>
								<Box>
									<Text size="sm" fw={600}>
										Treatment History:
									</Text>
									<CustomDivider borderStyle="dashed" w="90%" />
								</Box>
								<Box>
									<Text size="sm" fw={600}>
										On/Examination:
									</Text>
									<CustomDivider borderStyle="dashed" w="90%" />
								</Box>
								<Box>
									<Text size="sm" fw={600}>
										Investigation:
									</Text>
									<CustomDivider borderStyle="dashed" w="90%" />
								</Box>
							</Stack>
						</Grid.Col>
						<Grid.Col span={8} style={{ borderLeft: "2px solid #555", paddingLeft: "20px" }}>
							<Stack gap="xs">
								{prescriptionData?.medications?.map((med, index) => (
									<Box key={index}>
										<Text size="sm" fw={600} mb="xs">
											{index + 1}. {med.name}
										</Text>
										<Text size="sm" c="var(--theme-tertiary-color-8)" ml="md">
											{med.dosage} --- {med.duration}
										</Text>
										{med.instructions && (
											<Text size="sm" c="var(--theme-tertiary-color-8)" ml="md">
												{med.instructions}
											</Text>
										)}
									</Box>
								)) || (
									<>
										<Box>
											<Text size="sm" fw={600} mb="xs">
												1. Nebulization with Budicort
											</Text>
											<Text size="sm" c="var(--theme-tertiary-color-8)" ml="md">
												-- 2 times --- 7 দিন
											</Text>
										</Box>
										<Box>
											<Text size="sm" fw={600} mb="xs">
												2. Nebulization with windel Plus
											</Text>
											<Text size="sm" c="var(--theme-tertiary-color-8)" ml="md">
												--- 3 times --- 7 দিন।
											</Text>
										</Box>
										<Box>
											<Text size="sm" fw={600} mb="xs">
												3. Tab LUMONA 10mg
											</Text>
											<Text size="sm" c="var(--theme-tertiary-color-8)" ml="md">
												0+0+1 --- 1 মাস
											</Text>
										</Box>
										<Box>
											<Text size="sm" fw={600} mb="xs">
												4. TAB. DOXIVA 200MG
											</Text>
											<Text size="sm" c="var(--theme-tertiary-color-8)" ml="md">
												1+0+1 --- 1 মাস
											</Text>
										</Box>
										<Box>
											<Text size="sm" fw={600} mb="xs">
												5. Inh. Seroxyn HFA 25/250
											</Text>
											<Text size="sm" c="var(--theme-tertiary-color-8)" ml="md">
												2 PUFF 12 HOURLY --- GURGLE AFTER USE --- 1 মাস
											</Text>
										</Box>
									</>
								)}
							</Stack>

							<CustomDivider mt="xl" mb="md" />
							<Text size="sm" fw={600} mb="xs">
								অন্যান্য নির্দেশাবলী:
							</Text>
							<Text size="sm">
								{prescriptionData?.otherInstructions || "রিপোর্ট সংগ্রহ করে দেখা করবেন।"}
							</Text>
						</Grid.Col>
					</Grid>
				</Box>

				{/* =============== new prescription layout matching the image ================ */}
				<Box p={20} bd="1px solid #555" style={{ borderRadius: "6px" }}>
					{/* =============== top section with printed by and signature ================ */}
					<Grid columns={12} gutter="md">
						<Grid.Col span={6}>
							<Stack gap="0px">
								<Text size="sm" fw={600}>
									Doctor Name:
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
				<DashedDivider mt="lg" mb="md" />

				{/* =============== bottom section with patient info and medication table ================ */}
				<Grid columns={12} gutter="md" mb="xs">
					<Grid.Col span={4}>
						<Stack gap="6px">
							<Text size="sm" fw={500}>
								Patient Name: {prescriptionData?.patientName || "PARUL BEGUM"}
							</Text>
							<Text size="sm">({prescriptionData?.patientId || "TBH20250729412"}).</Text>
							<Text size="sm">
								Age: {prescriptionData?.age || "40 Y, 0 M, 0 D"}. Sex:{" "}
								{prescriptionData?.gender || "Female"}.
							</Text>
							<Text size="sm" fw={600} mt="sm">
								Doctor Comments:
							</Text>
							<CustomDivider w="90%" />
						</Stack>
					</Grid.Col>
					<Grid.Col span={8}>
						{/* =============== medication table ================ */}
						<Box style={{ border: "1px solid #333", borderRadius: "6px", overflow: "hidden" }}>
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
								<Grid.Col
									span={3}
									p={10}
									style={{
										borderRight: "1px solid #333",
										borderBottom: "1px solid #333",
									}}
								>
									<Text size="sm" pl={4}>
										1. CETIRIZINE 10MG TAB
									</Text>
								</Grid.Col>
								<Grid.Col span={1} p={10} style={{ borderBottom: "1px solid #333" }}>
									<Text size="sm" ta="center" fw={500}>
										10
									</Text>
								</Grid.Col>
								<Grid.Col
									span={3}
									p={10}
									style={{
										borderRight: "1px solid #333",
										borderBottom: "1px solid #333",
									}}
								>
									<Text size="sm" pl={4}>
										2. OMEPRAZOLE 20MG CAP
									</Text>
								</Grid.Col>
								<Grid.Col span={1} style={{ borderBottom: "1px solid #333" }}>
									<Text size="sm" ta="center" fw={500}>
										10
									</Text>
								</Grid.Col>
								<Grid.Col span={3} p={10} style={{ borderRight: "1px solid #333" }}>
									<Text size="sm" pl={4}>
										3. CEFIXIME 200 MG CAP
									</Text>
								</Grid.Col>
								<Grid.Col span={1} p={10}>
									<Text size="sm" ta="center" fw={500}>
										10
									</Text>
								</Grid.Col>
							</Grid>
						</Box>
					</Grid.Col>
				</Grid>
			</Box>
		</Box>
	);
});

Prescription3.displayName = "Prescription3";

export default Prescription3;
