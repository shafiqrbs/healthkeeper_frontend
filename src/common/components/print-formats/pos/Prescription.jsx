import { Box, Text, Stack, Group, Image } from "@mantine/core";
import { forwardRef } from "react";
import TbImage from "@assets/images/tb_logo.png";

const DashedLine = () => (
	<Text size="xxs" ta="center" ff="monospace">
		-----------------------------------------------
	</Text>
);

const Prescription = forwardRef((props, ref) => {
	return (
		<Box display="none">
			<Box ref={ref} w="80mm" p={8} bg="white" mx="auto">
				<Stack gap={2}>
					<Group justify="center" align="center" gap={10}>
						<Image src={TbImage} alt="TB Hospital" width={44} height={44} fit="contain" />
						<Stack gap={0} ta="left">
							<Text size="sm" fw={700}>
								TB HOSPITAL
							</Text>
							<Text size="xxs">123 Main Road, City</Text>
							<Text size="xxs">Phone: +880 1234567890</Text>
						</Stack>
					</Group>
					<DashedLine />
					<Text size="sm" fw={700} ta="center">
						PRESCRIPTION
					</Text>
					<DashedLine />
					<Text size="xs">Patient: [Name]</Text>
					<Text size="xs">Age: [Age] Gender: [M/F]</Text>
					<Text size="xs">ID: [Patient ID]</Text>
					<Text size="xs">Contact: [Phone]</Text>
					<Text size="xs">Address: [Address]</Text>
					<DashedLine />
					<Text size="xs">Diagnosis: [Diagnosis/Complaint]</Text>
					<DashedLine />
					<Text size="sm" fw={600}>
						Medicines
					</Text>
					<Stack gap={0}>
						<Text size="xs">1. [Medicine Name 1]</Text>
						<Text size="xs">2. [Medicine Name 2]</Text>
						<Text size="xs">3. [Medicine Name 3]</Text>
					</Stack>
					<DashedLine />
					<Text size="sm" fw={600}>
						Tests
					</Text>
					<Stack gap={0}>
						<Text size="xs">- [Test 1]</Text>
						<Text size="xs">- [Test 2]</Text>
					</Stack>
					<DashedLine />
					<Text size="xs">Instructions: [Instructions/Notes]</Text>
					<DashedLine />
					<Text size="xs">Doctor: [Doctor Name]</Text>
					<Text size="xs">Specialization: [Specialization]</Text>
					<Text size="xs">Date: {new Date().toLocaleDateString()}</Text>
					<Text size="xs">Next Visit: [Next Visit Date]</Text>
					<DashedLine />
					<Text size="xs" ta="center">
						Get well soon!
					</Text>
					<Text size="xxs" ta="center" mt={4}>
						© {new Date().getFullYear()} TB Hospital. All rights reserved.
					</Text>
				</Stack>
			</Box>
		</Box>
	);
});

Prescription.displayName = "Prescription";
export default Prescription;
