import { useOutletContext } from "react-router-dom";
import { Box, Text, ScrollArea, Stack, Paper } from "@mantine/core";
import { useState } from "react";
import DetailsDrawer from "@hospital-components/drawer/__DetailsDrawer";
import { useDisclosure } from "@mantine/hooks";
import { formatDate } from "@utils/index";

export default function PatientPrescriptionHistoryList({ historyList }) {
	const { mainAreaHeight } = useOutletContext();
	const [selectedPrescriptionId, setSelectedPrescriptionId] = useState(null);
	const [opened, { open, close }] = useDisclosure(false);

	const handleViewPrescription = (id) => {
		setSelectedPrescriptionId(id);
		setTimeout(() => open(), 10);
	};

	return (
		<ScrollArea pos="relative" h={mainAreaHeight - 68} bg="var(--mantine-color-white)" className="borderRadiusAll">
			<Stack p="xs" gap="xs">
				{historyList.map((item) => (
					<Paper
						key={item?.prescription_id}
						p="sm"
						radius="sm"
						style={{
							cursor: "pointer",
							border: "1px solid var(--mantine-color-gray-2)",
							transition: "all 0.2s ease",
						}}
						onClick={() => handleViewPrescription(item?.prescription_id)}
						onMouseEnter={(e) => {
							e.currentTarget.style.backgroundColor = "var(--mantine-color-gray-0)";
							e.currentTarget.style.borderColor = "var(--mantine-color-blue-3)";
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.backgroundColor = "transparent";
							e.currentTarget.style.borderColor = "var(--mantine-color-gray-2)";
						}}
					>
						<Box>
							<Text fz="xs" c="dimmed">
								Created: {formatDate(item?.created_at)}
							</Text>
							<Text fw={600} fz="sm">
								{item.name}
							</Text>
							<Text fz="xs" c="dimmed">
								Mobile: {item.mobile}
							</Text>
							<Text fz="xs" c="dimmed">
								Invoice: {item?.patient_invoice}
							</Text>
						</Box>
					</Paper>
				))}
			</Stack>
			{selectedPrescriptionId && (
				<DetailsDrawer opened={opened} close={close} prescriptionId={selectedPrescriptionId} />
			)}
		</ScrollArea>
	);
}
