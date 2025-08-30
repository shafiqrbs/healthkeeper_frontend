import { Box, Text, Stack, Group, Image, Table } from "@mantine/core";
import { forwardRef } from "react";
import TbImage from "@assets/images/tb_logo.png";
import GovtLogo from "@assets/images/government_seal_of_bangladesh.svg";
import { getLoggedInUser } from "@/common/utils";

const DashedLine = () => (
	<Text size="xxs" ta="center" ff="monospace">
		-----------------------------------------------
	</Text>
);

const OPDPos = forwardRef(({ data }, ref) => {
	const user = getLoggedInUser();

	const free_for =
		data.patient_payment_mode_id === "31"
			? "Freedom Fighter"
			: data.patient_payment_mode_id === "32"
			? "Disabled"
			: data.patient_payment_mode_id === "33"
			? "Govt Service"
			: "";

	return (
		<Box display="none">
			<Box ref={ref} w="80mm" p={8} bg="white" mx="auto">
				<Stack gap={2}>
					{/* =============== header section with logo and hospital info =============== */}
					<Group justify="center" align="center" gap={30}>
						<Image src={GovtLogo} alt="Govt Logo" width={44} height={44} fit="contain" />
						<Stack gap={0} ta="left">
							<Text ta="center" size="sm" fw={700}>
								TB HOSPITAL
							</Text>
							<Text ta="center" size="xxs">
								Shyamoli, Dhaka-1207
							</Text>
							<Text ta="center" size="8px">
								Hotline: 01969910200
							</Text>
						</Stack>
						<Image src={TbImage} alt="TB Hospital" width={44} height={44} fit="contain" />
					</Group>
					<DashedLine />

					{/* =============== prescription title =============== */}
					<Text size="sm" fw={700} ta="center">
						TICKET - {data.payment_mode_name}
					</Text>
					<DashedLine />

					{/* =============== patient information section =============== */}

					{/* <Table fz="10px" verticalSpacing={2} withRowBorders={false}>
						<Table.Tbody>
							<Table.Tr>
								<Table.Td>
									<strong>Created:</strong> {data.created}
								</Table.Td>
								<Table.Td align="right">
									<strong>Appt. Date:</strong> {data.appointment}
								</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td>
									<strong>PID:</strong> {data.patient_id}
								</Table.Td>
								<Table.Td align="right">
									<strong>HID:</strong> {data.health_id}
								</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td>
									<strong>Mode:</strong> {data.mode_name}
								</Table.Td>
								<Table.Td align="right">
									<strong>Room:</strong> {data.room_name}
								</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td colSpan={2}></Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td colSpan={2}>
									<strong>Name:</strong> {data.name}
								</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td colSpan={2}>
									<strong>Mobile:</strong> {data.mobile}
								</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td>
									<strong>Age:</strong> {data.year}Y {data.month}M {data.day}D
								</Table.Td>
								<Table.Td miw={100} align="right">
									<strong>DOB:</strong> {data.dob}
								</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td colSpan={2}>
									<strong>Address:</strong> {data.address}
								</Table.Td>
							</Table.Tr>
							{data?.guardian_name && (
								<Table.Tr>
									<Table.Td colSpan={2}>
										<strong>Guardian Name:</strong> {data.guardian_name}
									</Table.Td>
								</Table.Tr>
							)}
							{data?.guardian_mobile && (
								<Table.Tr>
									<Table.Td colSpan={2}>
										<strong>Guardian Mobile:</strong> {data.guardian_mobile}
									</Table.Td>
								</Table.Tr>
							)}
							<Table.Tr>
								<Table.Td colSpan={2}></Table.Td>
							</Table.Tr>
						</Table.Tbody>
					</Table> */}

					<DashedLine />
					<Group justify="space-between" px={12}>
						<Text size="xs" fw={600}>
							Fee Amount:
						</Text>
						<Text size="xs" fw={600}>
							৳ {data.amount || 0}
						</Text>
					</Group>
					<DashedLine />

					{/* =============== footer section =============== */}
					<Table withRowBorders={false} fz={10}>
						<Table.Tbody>
							<Table.Tr>
								<Table.Td>
									<strong>Created By:</strong> {data?.created_by_name}
								</Table.Td>
								<Table.Td align="right">
									<strong>Printed By:</strong> {user?.name}
								</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td colSpan={2} align="center">
									<strong>Printed:</strong> {new Date().toLocaleString()}
								</Table.Td>
							</Table.Tr>
						</Table.Tbody>
					</Table>
					<Text size="xxs" ta="center">
						© {new Date().getFullYear()} TB Hospital. All rights reserved.
					</Text>
				</Stack>
			</Box>
		</Box>
	);
});

OPDPos.displayName = "OPDPos";

export default OPDPos;
