import { Box, Text, Stack, Checkbox } from "@mantine/core";
import { useTranslation } from "react-i18next";

const OLE_OPTIONS = ["Investigation", "Investigation", "Investigation", "Investigation"];

export default function OLE({ ole, handleOleChange }) {
	const { t } = useTranslation();
	return (
		<Box bg="var(--theme-primary-color-0)" p="xs" mt="xxxs" mb="xxxs" className="borderRadiusAll">
			<Text fw={600} fz="sm" mb="xxxs">
				{t("ole")}
			</Text>
			<Stack gap="xxxs" bg="white" p="sm" className="borderRadiusSmall">
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
