import { Box } from "@mantine/core";

export default function RequiredAsterisk() {
	return (
		<Box component="span" display="inline-block" c="var(--theme-error-color)" fz="sm">
			*
		</Box>
	);
}
