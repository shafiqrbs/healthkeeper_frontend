import { Box, Flex, Image, Text, Badge, Group, Stack, Divider } from "@mantine/core";
import {
	IconDoor,
	IconUsers,
	IconCreditCard,
	IconGenderFemale,
	IconGenderMale,
	IconStethoscope,
	IconBed,
	IconActivity,
} from "@tabler/icons-react";
import imgActive from "@assets/images/status/active.gif";

export default function DetailedRoomCard({ room, selectedRoom, handleRoomClick, closeRoom }) {
	// =============== get status color and text based on room status ================
	const getStatusInfo = (status) => {
		switch (status) {
			case 1:
				return { color: "green", text: "Active", variant: "filled" };
			case 0:
				return { color: "red", text: "Inactive", variant: "filled" };
			default:
				return { color: "gray", text: "Unknown", variant: "outline" };
		}
	};

	// =============== get gender icon based on gender mode ================
	const getGenderIcon = (gender) => {
		switch (gender?.toLowerCase()) {
			case "female":
				return <IconGenderFemale size={16} stroke={1.5} />;
			case "male":
				return <IconGenderMale size={16} stroke={1.5} />;
			default:
				return <IconUsers size={16} stroke={1.5} />;
		}
	};

	// =============== get payment mode color ================
	const getPaymentModeColor = (paymentMode) => {
		switch (paymentMode?.toLowerCase()) {
			case "non-paying":
				return "red";
			case "paying":
				return "green";
			case "insurance":
				return "blue";
			default:
				return "gray";
		}
	};

	const statusInfo = getStatusInfo(room?.status);

	return (
		<Box
			p="xs"
			bg="var(--theme-tertiary-color-0)"
			mb="xs"
			className={`borderRadiusAll cursor-pointer transition-all duration-200 hover:shadow-md ${
				selectedRoom === room ? "active-box" : ""
			}`}
			onClick={() => {
				handleRoomClick(room);
				if (closeRoom) closeRoom();
			}}
			style={{
				border:
					selectedRoom === room
						? "2px solid var(--theme-primary-color-6)"
						: "1px solid var(--theme-tertiary-color-2)",
			}}
		>
			{/* =============== header section with room name and status ================ */}
			<Text fw={500} c="var(--theme-primary-color-6)" fz="sm" mb="xs">
				{room?.display_name || room?.name}
			</Text>

			{/* =============== main content grid ================ */}
			<Stack gap="xxxs">
				{/* =============== compact information rows ================ */}


{/*				<Group justify="space-between" align="center">
					<Flex align="center" gap="xxxs">
						<IconStethoscope color="var(--theme-primary-color-6)" size={14} stroke={1.5} />
						<Text fw={400} c="var(--theme-tertiary-color-6)" fz="xs">
							Type
						</Text>
					</Flex>
					<Group gap="xxxs">
						<Badge size="xs" variant="outline" color="blue">
							{room?.patient_type_name}
						</Badge>
						<Badge size="xs" variant="outline" color="purple">
							{room?.patient_mode_name || "N/A"}
						</Badge>
					</Group>
				</Group>

				<Group justify="space-between" align="center">
					<Flex align="center" gap="xxxs">
						<IconCreditCard color="var(--theme-primary-color-6)" size={14} stroke={1.5} />
						<Text fw={400} c="var(--theme-tertiary-color-6)" fz="xs">
							Payment
						</Text>
					</Flex>
					<Group gap="xxxs" align="center">
						<Badge size="xs" variant="filled" color={getPaymentModeColor(room?.payment_mode_name)}>
							{room?.payment_mode_name}
						</Badge>
						<Flex align="center" gap="xxxs">
							 {getGenderIcon(room?.gender_mode_name)}
							<Text fz="xs" fw={500}>
								{room?.gender_mode_name}
							</Text>
						</Flex>
					</Group>
				</Group>

				<Group justify="space-between" align="center">
					<Flex align="center" gap="xxxs">
						<IconBed color="var(--theme-primary-color-6)" size={14} stroke={1.5} />
						<Text fw={400} c="var(--theme-tertiary-color-6)" fz="xs">
							Bed
						</Text>
					</Flex>
					<Badge size="xs" variant="light" color="teal">
						{room?.particular_type_name}
					</Badge>
				</Group>*/}

				{/*{room?.treatment_mode_name && (
					<Group justify="space-between" align="center">
						<Flex align="center" gap="xxxs">
							<IconActivity color="var(--theme-primary-color-6)" size={14} stroke={1.5} />
							<Text fw={400} c="var(--theme-tertiary-color-6)" fz="xs">
								Treatment
							</Text>
						</Flex>
						<Badge size="xs" variant="outline" color="orange">
							{room?.treatment_mode_name}
						</Badge>
					</Group>
				)}*/}

				{/*{room?.opd_referred !== undefined && (
					<Group justify="space-between" align="center">
						<Text fw={400} c="var(--theme-tertiary-color-6)" fz="xs">
							OPD Referred
						</Text>
						<Badge
							size="xs"
							variant={room?.opd_referred ? "filled" : "outline"}
							color={room?.opd_referred ? "green" : "gray"}
						>
							{room?.opd_referred ? "Yes" : "No"}
						</Badge>
					</Group>
				)}*/}
				<Divider />
				<Group justify="space-between" align="center">
					<Flex align="center" gap="xxxs">
						<IconDoor color="var(--theme-primary-color-6)" size={14} stroke={1.5} />
						<Text fw={400} c="var(--theme-tertiary-color-6)" fz="xs">
							{room?.room_name || room?.name}
						</Text>
					</Flex>
					<Flex align="center" gap="xxxs">
						<Text fw={500} fz="xs">
							{room?.price || room?.price}
						</Text>
						<Badge color={statusInfo.color} variant={statusInfo.variant} size="xs">
							{statusInfo.text}
						</Badge>
					</Flex>
				</Group>

			</Stack>
		</Box>
	);
}
