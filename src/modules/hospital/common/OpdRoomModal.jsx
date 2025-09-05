import { Box, Grid, Modal, Stack, Text, Badge } from "@mantine/core";
import { useTranslation } from "react-i18next";

export default function OpdRoomModal({ opened, close, userNidData }) {
	const { t } = useTranslation();

	// =============== helper function to format gender ================
	const formatGender = (gender) => {
		return gender === 1 ? t("Male") : gender === 2 ? t("Female") : t("Other");
	};

	// =============== helper function to format date ================
	const formatDate = (dateString) => {
		if (!dateString) return t("NotAvailable");
		try {
			const date = new Date(dateString);
			return date.toLocaleDateString();
		} catch {
			return dateString;
		}
	};

	return (
		<Modal opened={opened} onClose={close}  size="xl" fz="sm" fw={600}>
			<Text>adsasdasd</Text>
		</Modal>
	);
}
