import { useState, useRef, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { CSVLink } from "react-csv";

import DataTableFooter from "@components/tables/DataTableFooter";
import { Box, Button, Flex, Group, Text } from "@mantine/core";

import { DataTable } from "mantine-datatable";
import { useTranslation } from "react-i18next";
import tableCss from "@assets/css/Table.module.css";

import KeywordSearch from "../common/KeywordSearch";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { useSelector } from "react-redux";
import { formatDate } from "@utils/index";
import useAppLocalStore from "@hooks/useAppLocalStore";
import useInfiniteTableScroll from "@hooks/useInfiniteTableScroll";
import { useReactToPrint } from "react-to-print";
import VitalUpdateDrawer from "@hospital-components/drawer/VitalUpdateDrawer";

const PER_PAGE = 200;

const ALLOWED_DOCTOR_ROLES = ["doctor_emergency", "admin_administrator"];

const CSV_HEADERS = [
	{ label: "S/N", key: "sn" },
	{ label: "Created", key: "created" },
	{ label: "CreatedBy", key: "created_by" },
	{ label: "PatientID", key: "patient_id" },
	{ label: "Name", key: "name" },
	{ label: "Mobile", key: "mobile" },
	{ label: "Total", key: "total" },
];

export default function Table({ module }) {
	const csvLinkRef = useRef(null);
	const { t } = useTranslation();
	const listData = useSelector((state) => state.crud[module]?.data);
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 34;
	const [patientData, setPatientData] = useState(null);
	const [opened, { open, close }] = useDisclosure(false);
	const { user, userRoles } = useAppLocalStore();
	useDisclosure(false);
	const [openedVitalUpdate, { open: openVitalUpdate, close: closeVitalUpdate }] =
		useDisclosure(false);
	// removed unused 'today'

	const form = useForm({
		initialValues: {
			keywordSearch: "",
			created: formatDate(new Date()),
			room_id: "",
		},
	});

	const [printData, setPrintData] = useState({});
	const [type, setType] = useState(null);
	const posRef = useRef(null);
	const a4Ref = useRef(null);
	const prescriptionRef = useRef(null);
	const handlePos = useReactToPrint({
		content: () => posRef.current,
	});
	const handleA4 = useReactToPrint({
		content: () => a4Ref.current,
	});
	const handlePrescriptionOption = useReactToPrint({
		content: () => prescriptionRef.current,
	});

	const { scrollRef, records, fetching, sortStatus, setSortStatus, handleScrollToBottom } =
		useInfiniteTableScroll({
			module,
			fetchUrl: HOSPITAL_DATA_ROUTES.API_ROUTES.OPD.INDEX,
			filterParams: {
				term: form.values?.keywordSearch,
				room_id: form.values?.room_id,
				is_vital: 1,
				created: form.values.created,
			},
			perPage: PER_PAGE,
			sortByKey: "created_at",
			direction: "desc",
		});

	const handleView = () => {
		open();
	};

	const handlePatientDataClick = (values) => {
		setPatientData(values);
		requestAnimationFrame(openVitalUpdate);
	};

	const csvData =
		records?.map((item, index) => ({
			sn: index + 1,
			created: formatDate(item?.created_at),
			created_by: item?.created_by || "N/A",
			patient_id: item?.patient_id || "",
			name: item?.name || "",
			mobile: item?.mobile || "",
			total: item?.total || "",
		})) || [];

	const handleCSVDownload = () => {
		if (csvLinkRef?.current?.link) {
			csvLinkRef.current.link.click();
		}
	};

	useEffect(() => {
		if (type === "a4") {
			handleA4();
		} else if (type === "pos") {
			handlePos();
		} else if (type === "prescription") {
			handlePrescriptionOption();
		}
	}, [printData, type]);

	return (
		<Box w="100%" bg="var(--mantine-color-white)" style={{ borderRadius: "4px" }}>
			<Flex justify="space-between" align="center" px="sm">
				<Text fw={600} fz="sm" py="xs">
					{t("PatientVitals")}
				</Text>
			</Flex>
			<Box px="sm" mb="sm">
				<KeywordSearch form={form} module={module} handleCSVDownload={handleCSVDownload} />
			</Box>
			<Box className="borderRadiusAll border-top-none" px="sm">
				<DataTable
					striped
					pinFirstColumn
					pinLastColumn
					stripedColor="var(--theme-tertiary-color-1)"
					classNames={{
						root: tableCss.root,
						table: tableCss.table,
						header: tableCss.header,
						footer: tableCss.footer,
						pagination: tableCss.pagination,
					}}
					records={records}
					columns={[
						{
							accessor: "index",
							title: t("S/N"),
							textAlignment: "right",
							render: (_, index) => index + 1,
						},
						{
							accessor: "created_at",
							title: t("Created"),
							textAlignment: "right",
							render: (item) => (
								<Text
									fz="xs"
									onClick={() => handleView(item.id)}
									className="activate-link text-nowrap"
								>
									{formatDate(item.created_at)}
								</Text>
							),
						},
						{
							accessor: "created_by",
							title: t("CreatedBy"),
							render: (item) => item.created_by || "N/A",
						},
						{ accessor: "patient_id", title: t("patientId") },
						{ accessor: "name", title: t("Name") },
						{ accessor: "mobile", title: t("Mobile") },
						{ accessor: "bp", title: t("B/P") },
						{ accessor: "pulse", title: t("Pulse") },
						{ accessor: "sat_with_O2", title: t("SatWithO2") },
						{ accessor: "sat_without_O2", title: t("SatWithoutO2") },
						{ accessor: "respiration", title: t("Respiration") },
						{ accessor: "temperature", title: t("Temperature") },
						{
							title: t("Action"),
							textAlign: "right",
							titleClassName: "title-right",
							render: (values) => (
								<Flex justify="flex-end">
									<Group gap={4} justify="right" wrap="nowrap">
										{userRoles.some((role) =>
											ALLOWED_DOCTOR_ROLES.includes(role)
										) && (
											<Button
												miw={60}
												variant="filled"
												bg="var(--theme-primary-color-6)"
												c="white"
												size="compact-xs"
												onClick={() => handlePatientDataClick(values)}
												radius="es"
												fw="400"
											>
												{t("Vitals")}
											</Button>
										)}
									</Group>
								</Flex>
							),
						},
					]}
					textSelectionDisabled
					fetching={fetching}
					loaderSize="xs"
					loaderColor="grape"
					height={height - 118}
					onScrollToBottom={handleScrollToBottom}
					scrollViewportRef={scrollRef}
					sortStatus={sortStatus}
					onSortStatusChange={setSortStatus}
				/>
			</Box>
			<DataTableFooter indexData={listData} module="Vital" />
			{/* Hidden CSV link for exporting current table rows */}
			<CSVLink
				data={csvData}
				headers={CSV_HEADERS}
				filename={`emergency-${formatDate(new Date())}.csv`}
				style={{ display: "none" }}
				ref={csvLinkRef}
			/>
			<VitalUpdateDrawer
				opened={openedVitalUpdate}
				data={patientData}
				close={closeVitalUpdate}
			/>
		</Box>
	);
}
