import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import DefaultSkeleton from "@components/skeletons/DefaultSkeleton";
import Navigation from "@components/layout/Navigation";
import { ActionIcon, Box, Flex, Grid, Input, LoadingOverlay, Stack, Text } from "@mantine/core";
import { getDataWithoutStore } from "@/services/apiService";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { IconSearch, IconBarcode } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { getFormValues } from "@modules/hospital/epharma/helpers/request";
import Medicine from "@modules/hospital/epharma/issue/Medicine";

const safe = (value) => (value === null || value === undefined || value === "" ? "-" : String(value));

export default function Index() {
	const { t } = useTranslation();
	const progress = useGetLoadingProgress();
	const { id } = useParams();
	const { mainAreaHeight } = useOutletContext();
	const [entity, setEntity] = useState([]);
	const navigate = useNavigate();
	const [fetching, setFetching] = useState(false);
	const [resetKey, setResetKey] = useState(0);
	const barcodeRef = useRef(null);

	useEffect(() => {
		if (id) {
			(async () => {
				setFetching(true);
				const res = await getDataWithoutStore({
					url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.EPHARMA.INDEX}/${id}`,
				});
				setEntity(res?.data);
				setFetching(false);
			})();
			form.setFieldValue("barcode", id);
		}
	}, [id]);

	useEffect(() => {
		if (barcodeRef.current) {
			barcodeRef.current.focus();
		}
	}, [id, resetKey]);

	const sales = entity?.sales || {};

	const col1 = [
		{ label: "Patient ID", value: safe(entity?.patient_id) },
		{ label: "Health ID", value: safe(entity?.health_id) },
		{ label: "Prescription ID", value: safe(entity?.invoice) },
	];

	const col2 = [
		{ label: "Name", value: safe(entity?.name) },
		{ label: "Mobile", value: safe(entity?.mobile) },
		{ label: "Gender", value: safe(entity?.gender) },
	];

	const col3 = [
		{ label: "Prescription Created", value: safe(entity?.prescription_created) },
		{ label: "Prescription ID", value: safe(entity?.prescription_doctor_id) },
		{ label: "Prescription Doctor", value: safe(entity?.prescription_doctor_name) },
	];

	const col4 = [
		{ label: "Process", value: safe(entity?.process) },
		{ label: "Created By", value: safe(entity?.created_by_name ?? entity?.created_by_user_name) },
	];

	const columns = [col1, col2, col3, col4];
	const form = useForm(getFormValues(t));

	const handleSearch = (values) => {
		const barcode = values.barcode;
		navigate(`${HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.EPHARMA.ISSUE}/${barcode}`);
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
							<Grid.Col span={6} pos="relative" className="animate-ease-out">
								<Box
									px="sm"
									py="md"
									h={mainAreaHeight - 12}
									bg="var(--theme-secondary-color-0)"
									pos="relative"
								>
									<LoadingOverlay
										visible={fetching}
										zIndex={1000}
										overlayProps={{ radius: "sm", blur: 1 }}
									/>
									<Box
										component="form"
										onSubmit={form.onSubmit(handleSearch)}
										bg="var(--mantine-color-white)"
										style={{ position: "relative" }}
									>
										<Input
											label=""
											key={resetKey}
											ref={barcodeRef}
											tooltip={t("PatientBarcodeScan")}
											placeholder={t("PatientBarcodeScan")}
											name="barcode"
											id="barcode"
											onChange={(e) => form.setFieldValue("barcode", e.target.value)}
											value={form.values.barcode}
											leftSection={
												<IconBarcode size={20} color="var(--theme-tertiary-color-6)" />
											}
											rightSection={
												<ActionIcon
													disabled={!form.values.barcode}
													variant="filled"
													bg="var(--theme-primary-color-6)"
													type="submit"
													className="cursor-pointer"
												>
													<IconSearch size={16} stroke={1.5} />
												</ActionIcon>
											}
											rightSectionPointerEvents="all"
										/>
									</Box>
									<Box p="sm">
										<Grid columns={24}>
											{columns.map((rows, colIdx) => (
												<Grid.Col key={colIdx} span={24}>
													<Stack gap={2}>
														{rows.map((row, idx) => (
															<Text
																key={idx}
																fz="sm"
															>{`${row.label}: ${row.value}`}</Text>
														))}
													</Stack>
												</Grid.Col>
											))}
										</Grid>
									</Box>
								</Box>
							</Grid.Col>
							<Grid.Col span={18} className="animate-ease-out">
								<Medicine
									setResetKey={setResetKey}
									barcodeForm={form}
									setEntity={setEntity}
									entity={sales}
								/>
							</Grid.Col>
						</Grid>
					</Flex>
				</Box>
			)}
		</>
	);
}
