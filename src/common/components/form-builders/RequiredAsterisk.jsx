import { Box } from "@mantine/core";
import React from "react";

export default function RequiredAsterisk() {
	return (
		<Box component="span" display="inline-block" c="var(--theme-error-color)" fz="sm">
			*
		</Box>
	);
}
