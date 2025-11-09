import { useNavigate, useOutletContext } from "react-router-dom";
import {
	IconArrowNarrowRight,
	IconChevronUp,
	IconSelector,
	IconDotsVertical,
	IconPrinter,
	IconFileText,
} from "@tabler/icons-react";
import { Box, Flex, Text, ActionIcon, Group, Button, SegmentedControl, Menu, rem } from "@mantine/core";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { MODULES } from "@/constants";
import { useDispatch, useSelector } from "react-redux";
import { formatDate } from "@utils/index";
import useInfiniteTableScroll from "@hooks/useInfiniteTableScroll";
import { useTranslation } from "react-i18next";
import { useForm } from "@mantine/form";
import { showEntityData } from "@/app/store/core/crudThunk";
import { showNotificationComponent } from "@components/core-component/showNotificationComponent";
import KeywordSearch from "@hospital-components/KeywordSearch";
import { DataTable } from "mantine-datatable";
import tableCss from "@assets/css/Table.module.css";
import DataTableFooter from "@components/tables/DataTableFooter";
import IPDPrescriptionFullBN from "@hospital-components/print-formats/ipd/IPDPrescriptionFullBN";
import { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { getDataWithoutStore } from "@/services/apiService";
import DetailsInvoiceBN from "@hospital-components/print-formats/billing/DetailsInvoiceBN";
import DischargeA4BN from "@hospital-components/print-formats/discharge/DischargeA4BN";
import { modals } from "@mantine/modals";
import { useDisclosure } from "@mantine/hooks";
import IpdManageDrawer from "@hospital-components/drawer/IpdManageDrawer";
import AdmissionFormBN from "@hospital-components/print-formats/admission/AdmissionFormBN";

const module = MODULES.ADMISSION;
const PER_PAGE = 500;

export default function _Table({ setSelectedPrescriptionId, ipdMode, setIpdMode }) {
	const dischargePaperRef = useRef(null);
	const admissionFormRef = useRef(null);
	const prescriptionRef = useRef(null);
	const billingInvoiceRef = useRef(null);
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const filterData = useSelector((state) => state.crud[module].filterData);
	const [printData, setPrintData] = useState(null);
	const [billingPrintData, setBillingPrintData] = useState(null);
	const [dischargePaperPrintData, setDischargePaperPrintData] = useState(null);
	const [admissionFormPrintData, setAdmissionFormPrintData] = useState(null);
	const height = mainAreaHeight - 100;
	const [openedManageIpd, { open: openManageIpd, close: closeManageIpd }] = useDisclosure(false);
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

	const printPrescription = useReactToPrint({
		content: () => prescriptionRef.current,
	});

	const printBillingInvoice = useReactToPrint({
		content: () => billingInvoiceRef.current,
	});

	const printDischargePaper = useReactToPrint({
		content: () => dischargePaperRef.current,
	});

	const printAdmissionForm = useReactToPrint({
		content: () => admissionFormRef.current,
	});

	const handleDischargePaperPrint = async (id) => {
		const res = await getDataWithoutStore({
			url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.INDEX}/${id}`,
		});
		setDischargePaperPrintData(res.data);
		requestAnimationFrame(printDischargePaper);
	};

	const handleBillingInvoicePrint = async (id) => {
		const res = await getDataWithoutStore({
			url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.INDEX}/${id}`,
		});
		setBillingPrintData(res.data);
		requestAnimationFrame(printBillingInvoice);
	};

	const handlePrescriptionPrint = async (id) => {
		const res = await getDataWithoutStore({
			url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.INDEX}/${id}`,
		});
		setPrintData(res.data);
		requestAnimationFrame(printPrescription);
	};

	const handleManageOverview = (prescriptionId, id) => {
		setSelectedPrescriptionId(prescriptionId);
		modals.openConfirmModal({
			title: <Text size="md"> {t("FormConfirmationTitle")}</Text>,
			children: <Text size="sm"> {t("AreYouSureYouWantCreateAE-FreshPrescription")}</Text>,
			labels: { confirm: t("Confirm"), cancel: t("Cancel") },
			confirmProps: { color: "red" },
			onCancel: () => console.info("Cancel"),
			onConfirm: () => navigate(`${HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.IPD_ADMITTED.MANAGE}/${prescriptionId}`),
		});
	};

	const handleChangeIpdMode = () => {
		navigate(HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.IPD_ADMITTED.INDEX);
	};

	const handleAdmissionFormPrint = async (id) => {
		const res = await getDataWithoutStore({
			url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.INDEX}/${id}`,
		});
		setAdmissionFormPrintData(res.data);
		requestAnimationFrame(printAdmissionForm);
	};

	const handleProcessConfirmation = async (id, uid) => {
		const resultAction = await dispatch(
			showEntityData({
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.PRESCRIPTION.SEND_TO_PRESCRIPTION}/${id}`,
				module,
				id,
			})
		).unwrap();
		const prescription_id = resultAction?.data?.data.uid;
		if (prescription_id) {
			navigate(
				`${HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.IPD_ADMITTED.IPD_PRESCRIPTION}/${prescription_id}?redirect=prescription&ipd=${uid}`
			);
		} else {
			console.error(resultAction);
			showNotificationComponent(t("SomethingWentWrongPleaseTryAgain"), "red.6", "lightgray");
		}
	};

	return (
		<Box pos="relative">
			<Flex align="center" justify="space-between">
				<KeywordSearch showOpdRoom showUnits form={form} module={module} />

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
						{
							accessor: "admission_date",
							title: t("AdmissionDate"),
							textAlignment: "right",
							render: (item) => formatDate(item.admission_date),
						},
						{ accessor: "patient_id", title: t("patientId") },
						{ accessor: "name", title: t("Name") },
						{ accessor: "mobile", title: t("Mobile") },
						{ accessor: "room_name", title: t("Bed/Cabin") },
						{ accessor: "admission_day", title: t("AdmissionDay") },
						{ accessor: "consume_day", title: t("ConsumeDay") },
						{ accessor: "remaining_day", title: t("RemainingDay") },
						{
							accessor: "total",
							title: t("Total"),
							render: (item) => t(item.total),
						},
						{
							accessor: "amount",
							title: t("Amount"),
							render: (item) => t(item.amount),
						},
						{
							accessor: "due",
							title: t("Due"),
							render: (item) => t(item.total - item.amount),
						},
						{
							accessor: "action",
							title: t("Action"),
							textAlign: "right",
							titleClassName: "title-right",
							render: (values) => (
								<Group onClick={(e) => e.stopPropagation()} gap={4} justify="right" wrap="nowrap">
									{ipdMode === "non-prescription" && (
										<Button
											rightSection={<IconArrowNarrowRight size={18} />}
											onClick={() => handleProcessConfirmation(values.id, values.uid)}
											variant="filled"
											color="var(--theme-primary-color-6)"
											radius="xs"
											aria-label="Settings"
											size="compact-xs"
											fw={400}
										>
											{t("Prescription")}
										</Button>
									)}
									{ipdMode === "prescription" && values.prescription_id && (
										<>
											<Button
												rightSection={<IconArrowNarrowRight size={18} />}
												onClick={() => handleManageOverview(values.uid, values.id)}
												variant="filled"
												color="var(--theme-primary-color-6)"
												radius="xs"
												aria-label="Settings"
												size="compact-xs"
												fw={400}
											>
												{t("Manage")}
											</Button>
											{/* <Button
												rightSection={<IconArrowNarrowRight size={18} />}
												onClick={() => openManageIpd()}
												variant="filled"
												color="var(--theme-primary-color-6)"
												radius="xs"
												aria-label="Settings"
												size="compact-xs"
												fw={400}
											>
												{t("Instant")}
											</Button> */}
										</>
									)}

									<Menu
										position="bottom-end"
										offset={3}
										withArrow
										trigger="hover"
										openDelay={100}
										closeDelay={400}
									>
										<Menu.Target>
											<ActionIcon
												className="border-left-radius-none"
												variant="transparent"
												color="var(--theme-menu-three-dot)"
												radius="es"
												aria-label="Settings"
											>
												<IconDotsVertical height={18} width={18} stroke={1.5} />
											</ActionIcon>
										</Menu.Target>
										<Menu.Dropdown>
											{values?.prescription_id && (
												<>
													<Menu.Item
														leftSection={
															<IconPrinter
																style={{
																	width: rem(14),
																	height: rem(14),
																}}
															/>
														}
														onClick={() => handlePrescriptionPrint(values?.prescription_id)}
													>
														{t("Prescription")}
													</Menu.Item>
												</>
											)}

											<Menu.Item
												leftSection={
													<IconPrinter
														style={{
															width: rem(14),
															height: rem(14),
														}}
													/>
												}
												onClick={() => handleAdmissionFormPrint(values?.id)}
											>
												{t("AdmissionForm")}
											</Menu.Item>

											<Menu.Item
												leftSection={
													<IconPrinter
														style={{
															width: rem(14),
															height: rem(14),
														}}
													/>
												}
												onClick={() => handleBillingInvoicePrint(values?.id)}
											>
												{t("BillingInvoice")}
											</Menu.Item>

											<Menu.Item
												leftSection={
													<IconFileText
														style={{
															width: rem(14),
															height: rem(14),
														}}
													/>
												}
												onClick={() => handleDischargePaperPrint(values?.id)}
											>
												{t("DischargePaper")}
											</Menu.Item>
										</Menu.Dropdown>
									</Menu>
								</Group>
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

			<IpdManageDrawer opened={openedManageIpd} close={closeManageIpd} />

			{admissionFormPrintData && <AdmissionFormBN data={admissionFormPrintData} ref={admissionFormRef} />}
			{printData && <IPDPrescriptionFullBN data={printData} ref={prescriptionRef} />}
			{billingPrintData && <DetailsInvoiceBN data={billingPrintData} ref={billingInvoiceRef} />}
			{dischargePaperPrintData && <DischargeA4BN data={dischargePaperPrintData} ref={dischargePaperRef} />}
		</Box>
	);
}
