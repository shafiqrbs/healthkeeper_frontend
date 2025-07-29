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
					{/* =============== header section with logo and hospital info =============== */}
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

					{/* =============== prescription title =============== */}
					<Text size="sm" fw={700} ta="center">
						TICKET
					</Text>
					<DashedLine />

					{/* =============== patient information section =============== */}
					<Text size="xs" fw={600}>
						Patient Information:
					</Text>
					<Text size="xs">Name: [Patient Name]</Text>
					<Text size="xs">Patient ID: [Patient ID]</Text>
					<Text size="xs">Contact: [Phone]</Text>
					<Text size="xs">Address: [Address]</Text>
					<Text size="xs">Room No: [Room Number]</Text>
					<DashedLine />

					{/* =============== diagnosis section =============== */}
					<Text size="xs">Diagnosis: [Diagnosis/Complaint]</Text>
					<DashedLine />

					{/* =============== invoice and fees section =============== */}
					<Text size="sm" fw={600}>
						Invoice Details:
					</Text>
					<Text size="xs">Invoice No: [INV-001]</Text>
					<Text size="xs">Date: {new Date().toLocaleDateString()}</Text>
					<DashedLine />

					<Text size="xs" fw={600}>
						Fees Breakdown:
					</Text>
					<Group justify="space-between">
						<Text size="xs">Consultation Fee:</Text>
						<Text size="xs">৳[Amount]</Text>
					</Group>
					<Group justify="space-between">
						<Text size="xs">Room Charges:</Text>
						<Text size="xs">৳[Amount]</Text>
					</Group>
					<Group justify="space-between">
						<Text size="xs">Medicine Cost:</Text>
						<Text size="xs">৳[Amount]</Text>
					</Group>
					<Group justify="space-between">
						<Text size="xs">Test Charges:</Text>
						<Text size="xs">৳[Amount]</Text>
					</Group>
					<Group justify="space-between">
						<Text size="xs">Other Services:</Text>
						<Text size="xs">৳[Amount]</Text>
					</Group>
					<DashedLine />
					<Group justify="space-between">
						<Text size="xs" fw={600}>
							Total Amount:
						</Text>
						<Text size="xs" fw={600}>
							৳[Total]
						</Text>
					</Group>
					<Group justify="space-between">
						<Text size="xs">Discount:</Text>
						<Text size="xs">৳[Discount]</Text>
					</Group>
					<Group justify="space-between">
						<Text size="xs" fw={600}>
							Net Payable:
						</Text>
						<Text size="xs" fw={600}>
							৳[Net Amount]
						</Text>
					</Group>
					<DashedLine />

					{/* =============== footer section =============== */}
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
