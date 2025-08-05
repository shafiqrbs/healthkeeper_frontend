import { Grid, ScrollArea, Text } from "@mantine/core";
import { useOutletContext } from "react-router-dom";
import RoomCard from "../../common/RoomCard";

export default function Ward({ selectedRoom, handleRoomClick }) {
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 386;

	return (
		<Grid columns={24} gutter="xs">
			<Grid.Col span={12}>
				<Text mt="xxxs" ta="center" bg="var(--theme-primary-color-1)" px="xs" py="xxxs" fw={500} fz="sm">
					Paying
				</Text>
				<ScrollArea pt="xxxs" h={height} bg="white" pl="xxxs">
					{Array.from({ length: 20 }).map((_, index) => (
						<RoomCard
							key={index}
							room={index + 1}
							selectedRoom={selectedRoom}
							handleRoomClick={handleRoomClick}
						/>
					))}
				</ScrollArea>
			</Grid.Col>
			<Grid.Col span={12}>
				<Text mt="xxxs" ta="center" bg="var(--theme-primary-color-1)" px="xs" py="xxxs" fw={500} fz="sm">
					Non Paying
				</Text>
				<ScrollArea pt="xxxs" h={height} bg="white" pr="xxxs">
					{Array.from({ length: 13 }).map((_, index) => (
						<RoomCard
							key={index + 20}
							room={index + 20}
							selectedRoom={selectedRoom}
							handleRoomClick={handleRoomClick}
						/>
					))}
				</ScrollArea>
			</Grid.Col>
		</Grid>
	);
}
