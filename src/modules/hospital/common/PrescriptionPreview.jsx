import { Box, Modal } from "@mantine/core";

export default function PrescriptionPreview({ opened, close }) {
	return (
		<Modal opened={opened} onClose={close} title="Prescription Preview" centered>
			<Box>Preview data</Box>
		</Modal>
	);
}
