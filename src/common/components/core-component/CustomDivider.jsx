import { Box } from "@mantine/core";

export default function CustomDivider({ w = "100%", borderStyle = "solid" }) {
	return <Box w={w} mt="0" mb="0" style={{ borderBottom: `1px ${borderStyle} #444` }} />;
}
