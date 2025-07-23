import { Box, Flex, Text } from "@mantine/core";
import { IconDoor, IconUsers } from "@tabler/icons-react";

export default function RoomCard({ room, selectedRoom, handleRoomClick }) {
	return (
		<Box
			p="xs"
			bg="var(--theme-tertiary-color-0)"
			mb="les"
			className={`borderRadiusAll cursor-pointer ${selectedRoom === room ? "active-box" : ""}`}
			onClick={() => handleRoomClick(room)}
		>
			<Flex justify="space-between" mb="xxxs">
				<Text fw={500} c="var(--theme-tertiary-color-6)" fz="sm">
					Patient
				</Text>
				<Flex align="center" gap="xxxs">
					<IconUsers color="var(--theme-primary-color-6)" size={16} stroke={1.5} />
					<Text fz="sm">234</Text>
				</Flex>
			</Flex>
			<Flex justify="space-between">
				<Text fw={500} c="var(--theme-tertiary-color-6)" fz="sm">
					Room
				</Text>
				<Flex align="center" gap="xxxs">
					<IconDoor color="var(--theme-primary-color-6)" size={16} stroke={1.5} />
					<Text fz="sm">001</Text>
				</Flex>
			</Flex>
		</Box>
	);
}
