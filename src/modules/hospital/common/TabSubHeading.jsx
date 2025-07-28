import { Box, Text } from "@mantine/core";

export default function TabSubHeading({ bg = "white", title }) {
	return (
		<Box bg={bg} p="xxxs" className="borderBottomHeading">
			<Text>{title}</Text>
		</Box>
	);
}
