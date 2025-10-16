import useDataWithoutStore from "@hooks/useDataWithoutStore";
import { Box, Button, LoadingOverlay, Stack } from "@mantine/core";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { IconPlus } from "@tabler/icons-react";

export default function HistoryPrescription({ setMedicines, closeHistoryMedicine }) {
	const { t } = useTranslation();
	const { dischargeId } = useParams();

	const { data: prescriptionData, isLoading } = useDataWithoutStore({
		url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.PRESCRIPTION.INDEX}/${dischargeId}`,
	});

	const initialFormValues = JSON.parse(prescriptionData?.data?.json_content || "{}");
	const existingMedicines = initialFormValues?.medicines || [];

	const pushMedicineToForm = () => {
		setMedicines(existingMedicines);
		closeHistoryMedicine();
	};

	return (
		<Box my="sm" pos="relative">
			<LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
			<Stack bd="1px solid var(--theme-tertiary-color-4)" px="sm" py="md" style={{ borderRadius: "4px" }}>
				{existingMedicines.map((medicine) => (
					<Box key={medicine.id}>{medicine.medicine_name}</Box>
				))}
			</Stack>
			<Button
				leftSection={<IconPlus size={16} />}
				mt="md"
				variant="filled"
				color="var(--theme-primary-color-6)"
				onClick={pushMedicineToForm}
			>
				{t("Insert")}
			</Button>
		</Box>
	);
}
