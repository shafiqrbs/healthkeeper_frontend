import { ActionIcon, Box, Flex, Select, Stack, Text } from "@mantine/core";
import { IconX } from "@tabler/icons-react";

const INVESTIGATION_OPTIONS = [
	{ label: "Chest X-Ray P/A", value: "Chest X-Ray P/A" },
	{ label: "CBC", value: "CBC" },
	{ label: "ECG", value: "ECG" },
];

export default function Investigation({
	investigation,
	setInvestigation,
	investigationList,
	handleInvestigationAdd,
	handleInvestigationRemove,
}) {
	return (
		<Box bg="var(--theme-primary-color-0)" p="xs" mt="xxxs" className="borderRadiusAll">
			<Text fw={600} fz="sm" mb="xxxs">
				Investigation
			</Text>
			<Select
				placeholder="Search"
				data={INVESTIGATION_OPTIONS}
				value={investigation}
				onChange={setInvestigation}
				searchable
				nothingFoundMessage="No test found"
				size="xs"
				mb="xxxs"
				onKeyDown={(e) => {
					if (e.key === "Enter" && investigation) handleInvestigationAdd(investigation);
				}}
				onBlur={() => handleInvestigationAdd(investigation)}
			/>
			<Stack gap={0} bg="white" px="sm" className="borderRadiusAll">
				{investigationList.map((item, idx) => (
					<Flex
						key={idx}
						align="center"
						justify="space-between"
						px="es"
						py="xs"
						style={{
							borderBottom:
								idx !== investigationList.length - 1
									? "1px solid var(--theme-tertiary-color-4)"
									: "none",
						}}
					>
						<Text fz="sm">
							{idx + 1}. {item}
						</Text>
						<ActionIcon
							color="red"
							size="xs"
							variant="subtle"
							onClick={() => handleInvestigationRemove(idx)}
						>
							<IconX size={16} />
						</ActionIcon>
					</Flex>
				))}
			</Stack>
		</Box>
	);
}
