import { Box, Text, Stack, Checkbox } from "@mantine/core";
import { useTranslation } from "react-i18next";

const OLE_OPTIONS = ["Investigation", "Investigation", "Investigation", "Investigation"];

export default function OLE({ ole, handleOleChange }) {
	const { t } = useTranslation();
	return (
		<Box bg="var(--theme-primary-color-0)" p="xs" mt="3xs" mb="3xs" className="borderRadiusAll">
			<Text fw={600} fz="sm" mb="3xs">
				{t("ole")}
			</Text>
			<Stack gap="3xs" bg="var(--mantine-color-white)" p="sm" className="borderRadiusSmall">
				{OLE_OPTIONS.map((label, idx) => (
					<Checkbox
						key={idx}
						label={label}
						size="sm"
						checked={ole[idx]}
						color="var(--theme-primary-color-6)"
						onChange={() => handleOleChange(idx)}
						styles={{ label: { fontSize: "sm" } }}
					/>
				))}
			</Stack>
		</Box>
	);
}
