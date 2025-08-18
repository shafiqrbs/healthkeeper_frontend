import { Box } from "@mantine/core";

export default function DashedDivider({ mt = "xl", mb = "md" }) {
	return <Box mt={mt} mb={mb} bd="1px dashed black" />;
}
