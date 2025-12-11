import { Box, Flex, Image, Text } from "@mantine/core";
import { IconDoor, IconUsers } from "@tabler/icons-react";
import imgActive from "@assets/images/status/active.gif";

export default function RoomCard({ room, selectedRoom, handleRoomClick, closeRoom }) {
	return (
		<Box
			p="xs"
			bg="var(--theme-tertiary-color-0)"
			mb="les"
			className={`borderRadiusAll cursor-pointer ${selectedRoom?.id === room?.id ? "active-box" : ""}`}
			onClick={() => {
				handleRoomClick(room);
				closeRoom();
			}}
		>
			<Flex justify="space-between" mb="3xs">
				<Text fw={500} c="var(--theme-tertiary-color-6)" fz="sm">
					Patient
				</Text>
				<Flex align="center" gap="3xs">
					<IconUsers color="var(--theme-primary-color-6)" size={16} stroke={1.5} />
					<Text fz="sm">{room?.invoice_count}</Text>
				</Flex>
				<Flex align="center" gap="3xs">
					<Image radius="xl" src={imgActive} />
					<Text fz="sm">{room?.invoice_count}</Text>
				</Flex>
			</Flex>
			<Flex justify="space-between">
				<Text fw={500} c="var(--theme-tertiary-color-6)" fz="sm">
					Room
				</Text>
				<Flex align="center" gap="3xs">
					<IconDoor color="var(--theme-primary-color-6)" size={16} stroke={1.5} />
					<Text fz="sm">{room?.name}</Text>
				</Flex>
			</Flex>
		</Box>
	);
}
