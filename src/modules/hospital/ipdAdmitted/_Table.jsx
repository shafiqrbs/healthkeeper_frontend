import { useNavigate, useOutletContext, useParams, useLocation } from "react-router-dom";
import {
	IconCalendarWeek,
	IconUser,
	IconArrowNarrowRight,
	IconBed,
	IconArrowRight,
	IconChevronUp,
	IconSelector,
} from "@tabler/icons-react";
import {
	Box,
	Flex,
	Grid,
	Text,
	ScrollArea,
	ActionIcon,
	LoadingOverlay,
	Group,
	Button,
	SegmentedControl,
	Tabs,
} from "@mantine/core";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { MODULES } from "@/constants";
import { useDispatch, useSelector } from "react-redux";
import { formatDate, getUserRole } from "@utils/index";
import useInfiniteTableScroll from "@hooks/useInfiniteTableScroll";
import { useTranslation } from "react-i18next";
import { useForm } from "@mantine/form";
import { showEntityData } from "@/app/store/core/crudThunk";
import { showNotificationComponent } from "@components/core-component/showNotificationComponent";
import KeywordSearch from "@hospital-components/KeywordSearch";
import { DataTable } from "mantine-datatable";
import tableCss from "@assets/css/Table.module.css";
import DataTableFooter from "@components/tables/DataTableFooter";

const module = MODULES.ADMISSION;
const PER_PAGE = 500;

const ALLOWED_CONFIRMED_ROLES = ["doctor_opd", "admin_administrator"];

const tabs = [
	{ label: "Prescription", value: "prescription" },
	{ label: "Manage", value: "manage" },
];

export default function _Table({ setSelectedPrescriptionId, ipdMode, setIpdMode }) {
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { state } = useLocation();
	const filterData = useSelector((state) => state.crud[module].filterData);
	const { id } = useParams();
	const height = mainAreaHeight - 100;
	const userRoles = getUserRole();

	const form = useForm({
		initialValues: {
			keywordSearch: "",
			created: formatDate(new Date()),
		},
	});

	const { records, fetching, sortStatus, setSortStatus, handleScrollToBottom, scrollRef } = useInfiniteTableScroll({
		module,
		fetchUrl: HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.INDEX,
		filterParams: {
			name: filterData?.name,
			patient_mode: "ipd",
			term: filterData.keywordSearch,
			prescription_mode: ipdMode,
			created: filterData.created,
		},
		perPage: PER_PAGE,
		sortByKey: "created_at",
		direction: "desc",
	});

	const handleManageOverview = (prescriptionId, id) => {
		setSelectedPrescriptionId(prescriptionId);
		navigate(`${HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.IPD_ADMITTED.INDEX}/${id}?tabs=true&redirect=prescription`, {
			state: { prescriptionId: prescriptionId },
		});
	};

	const handleChangeIpdMode = () => {
		navigate(HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.IPD_ADMITTED.INDEX);
	};

	const handleProcessConfirmation = async (id) => {
		const resultAction = await dispatch(
			showEntityData({
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.PRESCRIPTION.SEND_TO_PRESCRIPTION}/${id}`,
				module,
				id,
			})
		).unwrap();
		const prescription_id = resultAction?.data?.data.id;
		const isPrescribed = resultAction?.data?.data?.json_content;

		if (isPrescribed) {
			navigate(
				`${HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.IPD_ADMITTED.INDEX}/${id}?tabs=true&redirect=prescription`,
				{
					state: { prescriptionId: prescription_id },
				}
			);
		} else if (prescription_id) {
			navigate(
				`${HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.IPD_ADMITTED.IPD_PRESCRIPTION}/${prescription_id}?redirect=prescription&ipd=${id}`
			);
		} else {
			console.error(resultAction);
			showNotificationComponent(t("SomethingWentWrongPleaseTryAgain"), "red.6", "lightgray");
		}
	};

	return (
		<Box pos="relative">
			{/* ------------------------------------ start here ----------------------------------- */}
			{/* <Flex justify="space-between" align="center" px="sm">
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
				</Flex>
			</Flex> */}
			<Flex align="center" justify="space-between">
				<KeywordSearch form={form} module={module} />

				<SegmentedControl
					w={220}
					size="sm"
					color="var(--theme-primary-color-6)"
					value={ipdMode}
					onChange={(value) => {
						setIpdMode(value);
						if (value === "non-prescription") {
							handleChangeIpdMode();
						}
					}}
					data={[
						{ label: t("Prescription"), value: "non-prescription" },
						{ label: t("Manage"), value: "prescription" },
					]}
				/>
			</Flex>
			<Box className="borderRadiusAll border-top-none">
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
								<Text fz="xs" className="activate-link">
									{formatDate(item.created_at)}
								</Text>
							),
						},
						{ accessor: "patient_id", title: t("patientId") },
						{ accessor: "name", title: t("Name") },
						{ accessor: "mobile", title: t("Mobile") },
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
										{ipdMode === "non-prescription" && (
											<Button
												rightSection={<IconArrowNarrowRight size={18} />}
												onClick={() => handleProcessConfirmation(values.id)}
												variant="filled"
												color="var(--theme-primary-color-6)"
												radius="xs"
												aria-label="Settings"
												size="compact-xs"
												fw={400}
											>
												{t("Process")}
											</Button>
										)}
										{ipdMode === "prescription" && values.prescription_id && (
											<Button
												rightSection={<IconArrowNarrowRight size={18} />}
												onClick={() => handleManageOverview(values.prescription_id, values.id)}
												variant="filled"
												color="var(--theme-primary-color-6)"
												radius="xs"
												aria-label="Settings"
												size="compact-xs"
												fw={400}
											>
												{t("Manage")}
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
			<DataTableFooter indexData={records} module="ipd" />
		</Box>
	);
}
