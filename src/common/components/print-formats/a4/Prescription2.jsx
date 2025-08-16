import { Box, Text, Grid, Group, Stack, Image } from "@mantine/core";
import { forwardRef } from "react";
import GLogo from "@assets/images/government_seal_of_bangladesh.svg";
import TBLogo from "@assets/images/tb_logo.png";
import DashedDivider from "@components/core-component/DashedDivider";

const Prescription2 = forwardRef((props, ref) => {
	return (
		<Box display="none">
			<Box
				ref={ref}
				p="md"
				bg="var(--theme-primary-color-0)"
				miw="210mm"
				mih="100vh"
				className="borderRadiusAll watermark"
				style={{
					fontFamily: "Arial, sans-serif",
					lineHeight: 1.4,
				}}
			>
				{/* =============== header section with doctor information in bengali and english ================ */}
				<Box bd="2px solid var(--theme-primary-color-9)" mb="md">
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

							<Text ta="center" mt="les" fw="bold" size="md" c="#1e40af">
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
				<Box>
					<Grid>
						<Grid.Col bd="1px solid black" span={3}>
							<Group>
								<Text size="sm" fw={500}>
									রোগীর নাম:
								</Text>
								<Text size="sm">[Patient Name]</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid black" span={3}>
							<Group>
								<Text size="sm" fw={500}>
									বয়স:
								</Text>
								<Text size="sm">[Age]</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid black" span={3}>
							<Group>
								<Text size="sm" fw={500}>
									রোগীর আইডি:
								</Text>
								<Text size="sm">[Patient Id]</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid black" span={3}>
							<Group>
								<Text size="sm" fw={500}>
									লিঙ্গ:
								</Text>
								<Text size="sm">[Gender]</Text>
							</Group>
						</Grid.Col>
					</Grid>
				</Box>

				{/* =============== medical notes and prescription area with rx symbol ================ */}
				<Box mb="lg" style={{ position: "relative", minHeight: "400px" }}>
					{/* Medical Notes Section - positioned to the right of Rx symbol */}
					<Box mb="md">
						<Stack gap={8}>
							<Group gap="xs" mt="md">
								<Text size="sm" fw={500} miw={35}>
									C/C:
								</Text>
								<Text size="sm">[Chief Complaint]</Text>
							</Group>
							<Group gap="xs" mt={60}>
								<Text size="sm" fw={500} miw={35}>
									O/E:
								</Text>
								<Text size="sm">[On Examination]</Text>
							</Group>
							<Group gap="xs" my={60}>
								<Text size="sm" fw={500} miw={35}>
									InV:
								</Text>
								<Text size="sm">[Investigations]</Text>
							</Group>
						</Stack>
					</Box>

					{/* Large Prescription Writing Area - takes most of the space */}
					<Box
						mt="md"
						mih={120}
						bd="1px solid #bdc3c7"
						p="sm"
						bg="white"
						className="borderRadiusAll"
						style={{
							borderRadius: "4px",
						}}
					>
						{/* Prescription content placeholder */}
						<Text size="sm" lh={1.8}>
							[Prescription details will be written here...]
						</Text>

						{/* Additional prescription lines for better visual representation */}
						<Box mt="md">
							<Text size="sm" lh={2}>
								[Medicine 1] - [Dosage] - [Frequency]
							</Text>
							<Text size="sm" lh={2}>
								[Medicine 2] - [Dosage] - [Frequency]
							</Text>
							<Text size="sm" lh={2}>
								[Medicine 3] - [Dosage] - [Frequency]
							</Text>
						</Box>
					</Box>
				</Box>

				{/* =============== footer section with clinic information and visiting hours ================ */}
				<Box mt={50}>
					<Grid>
						{/* Left side - Clinic Information */}
						<Grid.Col span={6}>
							<Stack gap="les">
								<Text size="sm" fw={500} c="var(--theme-error-color)">
									চেম্বার:
								</Text>
								<Group gap="xs">
									<Text size="md" fw={600} c="#27ae60">
										দিল্যাব এইড ডায়াগনোস্টিক সেন্টার
									</Text>
								</Group>
								<Text size="sm" c="#27ae60">
									সদর রোড, গাইবান্ধা, রংপুর।
								</Text>
							</Stack>
						</Grid.Col>

						{/* Right side - Visiting Hours */}
						<Grid.Col span={6}>
							<Stack gap={4} ta="right">
								<Text size="sm" fw={500}>
									রোগী দেখার সময়:
								</Text>
								<Text size="sm" c="var(--theme-error-color)">
									বিকাল ৪টা থেকে রাত ৯টা
								</Text>
								<Text size="sm">শুক্রবার ও মঙ্গলবার</Text>
								<Text size="sm" c="var(--theme-error-color)">
									সিরিয়ালের জন্য।
								</Text>
							</Stack>
						</Grid.Col>
					</Grid>
				</Box>

				<DashedDivider my="sm" />

				<Box
					mt="md"
					mih={120}
					bd="1px solid #bdc3c7"
					p="sm"
					bg="white"
					className="borderRadiusAll"
					style={{
						borderRadius: "4px",
					}}
				>
					{/* Prescription content placeholder */}
					<Text size="sm" lh={1.8}>
						[Prescription details will be written here...]
					</Text>

					{/* Additional prescription lines for better visual representation */}
					<Box mt="md">
						<Text size="sm" lh={2}>
							[Medicine 1] - [Dosage] - [Frequency]
						</Text>
						<Text size="sm" lh={2}>
							[Medicine 2] - [Dosage] - [Frequency]
						</Text>
						<Text size="sm" lh={2}>
							[Medicine 3] - [Dosage] - [Frequency]
						</Text>
					</Box>
				</Box>
			</Box>
		</Box>
	);
});

Prescription2.displayName = "Prescription2";

export default Prescription2;
