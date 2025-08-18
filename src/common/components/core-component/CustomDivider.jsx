import { Box } from "@mantine/core";

export default function CustomDivider({ w = "100%", borderStyle = "solid" }) {
	return <Box w={w} mt="xs" mb="md" style={{ borderBottom: `1px ${borderStyle} #444` }} />;
}
