import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import DataTableFooter from "@components/tables/DataTableFooter";
import { ActionIcon, Box, Button, Flex, FloatingIndicator, Group, Menu, Tabs, Text } from "@mantine/core";
import { IconArrowRight, IconChevronUp, IconDotsVertical, IconSelector, IconTrashX } from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useTranslation } from "react-i18next";
import { rem } from "@mantine/core";
import tableCss from "@assets/css/Table.module.css";
import filterTabsCss from "@assets/css/FilterTabs.module.css";

import KeywordSearch from "../../common/KeywordSearch";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import ConfirmModal from ".././confirm/__ConfirmModal";
import { getAdmissionConfirmFormInitialValues } from ".././helpers/request";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { useSelector } from "react-redux";
import {formatDate, getLoggedInHospitalUser, getUserRole} from "@/common/utils";
import useInfiniteTableScroll from "@hooks/useInfiniteTableScroll";
import DetailsDrawer from "@modules/hospital/visit/__DetailsDrawer";

const PER_PAGE = 20;


const tabs = [
	{ label: "New", value: "new" },
	{ label: "Confirmed", value: "confirmed" },
	{ label: "Admitted", value: "admitted" },
];

const ALLOWED_CONFIRMED_ROLES = ["doctor_opd", "admin_administrator"];

export default function _Table({ module }) {
	const { t } = useTranslation();
	const confirmForm = useForm(getAdmissionConfirmFormInitialValues());
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 158;
	const [opened, { open, close }] = useDisclosure(false);
	const [openedConfirm, { open: openConfirm, close: closeConfirm }] = useDisclosure(false);
	const [openedOverview, { open: openOverview, close: closeOverview }] = useDisclosure(false);
	const [rootRef, setRootRef] = useState(null);
	const [controlsRefs, setControlsRefs] = useState({});
	const filterData = useSelector((state) => state.crud[module].filterData);
	const navigate = useNavigate();
	const [selectedId, setSelectedId] = useState(null);
	const [processTab, setProcessTab] = useState("new");
	const [selectedPrescriptionId, setSelectedPrescriptionId] = useState(null);
	const userHospitalConfig = getLoggedInHospitalUser();
	const userRoles = getUserRole();
	const userId = userHospitalConfig?.employee_id;
	const form = useForm({
		initialValues: {
			keywordSearch: "",
			created: formatDate(new Date()),
			room_id: "",
		},
	});

	const handleDetailsAdmission = (id) => {
		navigate(`${HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.IPD.INDEX}/${id}`, { replace: true });
	};

	const setControlRef = (val) => (node) => {
		controlsRefs[val] = node;
		setControlsRefs(controlsRefs);
	};

	const { scrollRef, records, fetching, sortStatus, setSortStatus, handleScrollToBottom } = useInfiniteTableScroll({
		module,
		fetchUrl: HOSPITAL_DATA_ROUTES.API_ROUTES.OPD.INDEX,
		filterParams: {
			name: filterData?.name,
			referred_mode: "admission",
			ipd_mode: processTab,
			created: form.values.created,
			term: filterData.keywordSearch,
		},
		perPage: PER_PAGE,
		sortByKey: "created_at",
		direction: "desc",
	});

	const handleView = (id) => {
		setSelectedPrescriptionId(id);
		setTimeout(() => open(), 10);
	};

	const handleOpenViewOverview = () => {
		openOverview();
	};


	const handleConfirm = (id) => {
		setSelectedId(id);
		openConfirm();
	};

	return (
		<Box w="100%" bg="white" style={{ borderRadius: "4px" }}>
			<Flex justify="space-between" align="center" px="sm">
				<Text fw={600} fz="sm" py="xs">
					{t("AdmissionInformation")}
				</Text>
				<Flex gap="xs" align="center">
					<Tabs mt="xs" variant="none" value={processTab} onChange={setProcessTab}>
						<Tabs.List ref={setRootRef} className={filterTabsCss.list}>
							{tabs.map((tab) => (
								<Tabs.Tab
									value={tab.value}
									ref={setControlRef(tab)}
									className={filterTabsCss.tab}
									key={tab.value}
								>
									{t(tab.label)}
								</Tabs.Tab>
							))}
							<FloatingIndicator
								target={processTab ? controlsRefs[processTab] : null}
								parent={rootRef}
								className={filterTabsCss.indicator}
							/>
						</Tabs.List>
					</Tabs>
					<Button
						onClick={handleOpenViewOverview}
						size="xs"
						radius="es"
						rightSection={<IconArrowRight size={16} />}
						bg="var(--theme-success-color)"
						c="white"
					>
						{t("visitOverview")}
					</Button>
				</Flex>
			</Flex>
			<Box px="sm" mb="sm">
				<KeywordSearch form={form} module={module} />
			</Box>
			<Box className="borderRadiusAll border-top-none" px="sm">
				<DataTable
					striped
					highlightOnHover
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
					onRowClick={({ record }) => {
						if (!record?.prescription_id) return alert('NoPrescriptionGenerated');
						handleView(record?.prescription_id);
					}}
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
								<Text fz="xs" onClick={() => handleView(item.id)} className="activate-link">
									{formatDate(item.created_at)}
								</Text>
							),
						},
						{ accessor: "patient_id", title: t("patientId") },
						{ accessor: "name", title: t("Name") },
						{ accessor: "mobile", title: t("Mobile") },
						...(processTab === "admitted"
							? [
								{ accessor: "admit_consultant_name", title: t("Consultant") },
								{ accessor: "admit_unit_name", title: t("Unit") },
								{ accessor: "admit_department_name", title: t("Department") },
								{ accessor: "admit_doctor_name", title: t("Doctor") },
								{ accessor: "visiting_room", title: t("Cabin/Bed") },
							]
							: []),
						{
							accessor: "total",
							title: t("Amount"),
							render: (item) => t(item.total),
						},
						{
							accessor: "action",
							title: t("Action"),
							textAlign: "right",
							titleClassName: "title-right",
							render: (values) => (

								<>
									<Group onClick={(e) => e.stopPropagation()} gap={4} justify="right" wrap="nowrap">
										{userRoles.some((role) => ALLOWED_CONFIRMED_ROLES.includes(role)) && values.process == "ipd" && (
											<Button
												variant="filled"
												bg="var(--theme-primary-color-6)"
												c="white"
												size="compact-xs"
												onClick={() => handleConfirm(values.id)}
												radius="es"
												fw={400}
												rightSection={<IconArrowRight size={18} />}
											>
												{t("Confirm")}
											</Button>
										)}
									</Group>

								</>

							),
						},
					]}
					textSelectionDisabled
					fetching={fetching}
					loaderSize="xs"
					loaderColor="grape"
					height={height}
					onScrollToBottom={handleScrollToBottom}
					scrollViewportRef={scrollRef}
					sortStatus={sortStatus}
					onSortStatusChange={setSortStatus}
					sortIcons={{
						sorted: <IconChevronUp color="var(--theme-tertiary-color-7)" size={14} />,
						unsorted: <IconSelector color="var(--theme-tertiary-color-7)" size={14} />,
					}}
				/>
			</Box>
			<DataTableFooter indexData={records} module="visit" />
			<ConfirmModal
				opened={openedConfirm}
				close={() => {
					closeConfirm();
					setSelectedId(null);
				}}
				form={confirmForm}
				selectedId={selectedId}
				module={module}
			/>
			{selectedPrescriptionId && (
				<DetailsDrawer opened={opened} close={close} prescriptionId={selectedPrescriptionId} />
			)}
		</Box>
	);
}
