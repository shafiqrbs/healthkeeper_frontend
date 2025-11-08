import { Box, Checkbox, Stack, Text } from "@mantine/core";

const CHIEF_COMPLAINTS = ["Fever (For 2 days)", "Runny Nose", "Headache"];

export default function ChiefComplaints({ complaints, handleComplaintChange }) {
	return (
		<Box bg="var(--theme-primary-color-0)" p="xs" mt="3xs" mb="3xs" className="borderRadiusAll">
			<Text fw={600} fz="sm" mb="3xs">
				Chief Complaints
			</Text>
			<Stack gap="3xs" bg="var(--mantine-color-white)" p="sm" className="borderRadiusSmall">
				{CHIEF_COMPLAINTS.map((label, idx) => (
					<Checkbox
						key={idx}
						label={label}
						size="sm"
						checked={complaints[idx]}
						color="var(--theme-primary-color-6)"
						onChange={() => handleComplaintChange(idx)}
						styles={{ label: { fontSize: "sm" } }}
					/>
				))}
			</Stack>
		</Box>
	);
}
