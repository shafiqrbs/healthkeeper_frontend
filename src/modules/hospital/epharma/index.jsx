import {useEffect, useState} from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext, useParams } from "react-router-dom";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import DefaultSkeleton from "@components/skeletons/DefaultSkeleton";
import Navigation from "@components/layout/Navigation";
import {ActionIcon, Box, Flex, Grid, Select, Stack, Text, TextInput} from "@mantine/core";
import {getDataWithoutStore} from "@/services/apiService";
import {HOSPITAL_DATA_ROUTES} from "@/constants/routes";
import {IconSearch, IconX,IconBarcode} from "@tabler/icons-react";
import PatientSearchResult from "@modules/hospital/common/PatientSearchResult";
import InputForm from "@components/form-builders/InputForm";
import {useForm} from "@mantine/form";
import {getFormValues} from "@modules/hospital/epharma/helpers/request";
import Medicine from "@modules/hospital/epharma/Medicine";
import {formatDate} from "@utils/index";

export default function Index() {
	const { t } = useTranslation();
	const progress = useGetLoadingProgress();
	const { id } = useParams();
	const { mainAreaHeight } = useOutletContext();
	const [isOpenPatientInfo, setIsOpenPatientInfo] = useState(true);
	const [diagnosticReport, setDiagnosticReport] = useState([]);
	useEffect(() => {
		if (id) {
			(async () => {
				const res = await getDataWithoutStore({
					url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.EPHARMA.INDEX}/${id}`,
				});
				setDiagnosticReport(res?.data);
			})();
		}
	}, [id]);
	const safe = (value) => (value === null || value === undefined || value === "" ? "-" : String(value));
	const entity = diagnosticReport || {};
	const sales = diagnosticReport?.sales || {};
	const col1 = [

		{ label: "Patient ID", value: safe(entity.patient_id) },
		{ label: "Health ID", value: safe(entity.health_id) },
		{ label: "Prescription ID", value: safe(entity.invoice) },

	];

	const col2 = [
		{ label: "Name", value: safe(entity.name) },
		{ label: "Mobile", value: safe(entity.mobile) },
		{ label: "Gender", value: safe(entity.gender) },
	];

	const col3 = [
		{ label: "Prescription Created", value: safe(entity.prescription_created) },
		{ label: "Prescription ID", value: safe(entity.prescription_doctor_id) },
		{ label: "Prescription Doctor", value: safe(entity.prescription_doctor_name) },
	];

	const col4 = [
		{ label: "Process", value: safe(entity.process) },
		{ label: "Created By", value: safe(entity.created_by_name ?? entity.created_by_user_name) },
	];

	const columns = [col1, col2, col3, col4];
	const form = useForm(getFormValues(t));

	const handleSearch = (searchData) => {
		const data = searchData || {
			keywordSearch,
			created: date ? formatDate(date) : "",
			room_id: form.values.room_id,
		};

		if (onSearch) {
			onSearch(data);
		}
	};

	return (
		<>
			{progress !== 100 ? (
				<DefaultSkeleton />
			) : (
				<Box p="md">
					<Flex w="100%" gap="sm">
						<Navigation module="home" mainAreaHeight={mainAreaHeight} />
						<Grid w="100%" gutter="xs" columns={24}>
							<Grid.Col span={6} pos="relative" className="animate-ease-out" >
								<Box px="sm" py="md"  h={mainAreaHeight-12} bg="var(--theme-secondary-color-0)">
									<Box bg="white">
										<InputForm
											label=""
											form={form}
											tooltip={t("PatientBarcodeScan")}
											placeholder={t("PatientBarcodeScan")}
											name="patient"
											id="patientName"
											leftSection={
												<IconBarcode
													size={20}
													color="var(--theme-tertiary-color-6)"
												/>
											}
											rightSection={
												<ActionIcon variant="filled" bg="var(--theme-primary-color-6)"  onClick={() => handleSearch()}>
													<IconSearch size={16} stroke={1.5} />
												</ActionIcon>
											}
										/>
									</Box>
									<Box p="sm">
									<Grid columns={24}>
										{columns.map((rows, colIdx) => (
											<Grid.Col key={colIdx} span={24}>
												<Stack gap={2}>
													{rows.map((row, idx) => (
														<Text key={idx} fz="sm">{`${row.label}: ${row.value}`}</Text>
													))}
												</Stack>
											</Grid.Col>
										))}
									</Grid>
								</Box>
								</Box>
							</Grid.Col>
							<Grid.Col span={18} className="animate-ease-out">
								<Medicine entity={sales} />
							</Grid.Col>

						</Grid>
					</Flex>
				</Box>
			)}
		</>
	);
}
