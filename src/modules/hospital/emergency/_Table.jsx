import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import DataTableFooter from "@components/tables/DataTableFooter";
import { ActionIcon, Box, Button, Flex, FloatingIndicator, Grid, Group, Menu, Tabs, Text } from "@mantine/core";
import { IconArrowRight, IconDotsVertical, IconTrashX } from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useTranslation } from "react-i18next";
import { rem } from "@mantine/core";
import tableCss from "@assets/css/Table.module.css";
import filterTabsCss from "@assets/css/FilterTabs.module.css";

import KeywordSearch from "../common/KeywordSearch";
import { hasLength, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import DetailsDrawer from "./__DetailsDrawer";
import OverviewDrawer from "./__OverviewDrawer";
import { HOSPITAL_DATA_ROUTES, MASTER_DATA_ROUTES } from "@/constants/routes";
import { useDispatch, useSelector } from "react-redux";
import { sortBy } from "lodash";
import { getIndexEntityData, showEntityData, storeEntityData } from "@/app/store/core/crudThunk";
import { setItemData, setRefetchData } from "@/app/store/core/crudSlice";
import {formatDate, getLoggedInHospitalUser, getUserRole} from "@utils/index";
import CompactDrawer from "@/common/components/drawers/CompactDrawer";
import TextAreaForm from "@/common/components/form-builders/TextAreaForm";
import { successNotification } from "@components/notification/successNotification";
import { ERROR_NOTIFICATION_COLOR, SUCCESS_NOTIFICATION_COLOR } from "@/constants";
import { errorNotification } from "@components/notification/errorNotification";
import useInfiniteTableScroll from "@hooks/useInfiniteTableScroll";
import { modals } from "@mantine/modals";
import { showNotificationComponent } from "@components/core-component/showNotificationComponent";

const PER_PAGE = 200;
const  tabs =[
	{ label: 'All', value: 'all' },
	{ label: 'Prescription', value: 'prescription' },
	{ label: 'Non-prescription', value: 'non-prescription' },
]

export default function Table({ module }) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { t } = useTranslation();
	const listData = useSelector((state) => state.crud[module].data);
	const refetch = useSelector((state) => state.crud[module].refetching);
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 34;
	const scrollViewportRef = useRef(null);
	const [page, setPage] = useState(1);
	const [selectedId, setSelectedId] = useState(null);
	const [hasMore, setHasMore] = useState(true);
	const [opened, { open, close }] = useDisclosure(false);
	const [openedOverview, { open: openOverview, close: closeOverview }] = useDisclosure(false);
	const [openedAdmission, { open: openAdmission, close: closeAdmission }] = useDisclosure(false);
	const filterData = useSelector((state) => state.crud[module].filterData);
	const [processTab, setProcessTab] = useState("all");
	const userHospitalConfig = getLoggedInHospitalUser();
	const userRoles = getUserRole();
	const userId = userHospitalConfig?.employee_id;
	const form = useForm({
		initialValues: {
			keywordSearch: "",
			created: "",
			room_id: "",
		},
	});

	const referredForm = useForm({
		initialValues: {
			referred_mode: "admission",
			admission_comment: "",
		},
		validate: {
			admission_comment: hasLength({ min: 1 }),
		},
	});

	const [rootRef, setRootRef] = useState(null);
	const [value, setValue] = useState("all");
	const [controlsRefs, setControlsRefs] = useState({});

	const setControlRef = (val) => (node) => {
		controlsRefs[val] = node;
		setControlsRefs(controlsRefs);
	};
	const today = new Date();
	const { scrollRef, records, fetching, sortStatus, setSortStatus, handleScrollToBottom } = useInfiniteTableScroll({
		module,
		fetchUrl: HOSPITAL_DATA_ROUTES.API_ROUTES.OPD.INDEX,
		filterParams: {
			name: filterData?.name,
			patient_mode: "emergency",
			term: filterData.keywordSearch,
			room_id: filterData.room_id,
			prescription_mode: processTab,
			created: filterData?.created || formatDate(today),
		},
		perPage: PER_PAGE,
		sortByKey: "created_at",
		direction: "desc",
	});

	const handleView = (id) => {
		open();
	};

	const handleOpenViewOverview = () => {
		openOverview();
	};

	const handleProcessPrescription = (id) => {
		modals.openConfirmModal({
			title: <Text size="md"> {t("FormConfirmationTitle")}</Text>,
			children: <Text size="sm"> {t("FormConfirmationMessage")}</Text>,
			labels: { confirm: "Confirm", cancel: "Cancel" },
			confirmProps: { color: "red" },
			onCancel: () => console.info("Cancel"),
			onConfirm: () => handleProcessConfirmation(id),
		});
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
		if (prescription_id) {
			navigate(`${HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.PRESCRIPTION.INDEX}/${prescription_id}`);
		} else {
			console.error(resultAction);
			showNotificationComponent(t("Something Went wrong , please try again"), "red.6", "lightgray");
		}
	};

	const handlePrescription = async (prescription_id) => {
		navigate(`${HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.PRESCRIPTION.INDEX}/${prescription_id}`);
	};

	const handleSendToAdmission = (id) => {
		setSelectedId(id);
		openAdmission();
		// navigate(HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.ADMISSION.INDEX);
	};

	async function handleConfirmSubmission(values) {
		try {
			const value = {
				url: `${MASTER_DATA_ROUTES.API_ROUTES.OPERATIONAL_API.REFERRED}/${selectedId}`,
				data: { ...values },
				module,
			};
			const resultAction = await dispatch(storeEntityData(value));
			if (storeEntityData.rejected.match(resultAction)) {
				const fieldErrors = resultAction.payload.errors;
				if (fieldErrors) {
					const errorObject = {};
					Object.keys(fieldErrors).forEach((key) => {
						errorObject[key] = fieldErrors[key][0];
					});
					referredForm.setErrors(errorObject);
				}
			} else if (storeEntityData.fulfilled.match(resultAction)) {
				referredForm.reset();
				setSelectedId(null);
				successNotification(t("InsertSuccessfully"), SUCCESS_NOTIFICATION_COLOR);
			}
		} catch (error) {
			errorNotification(error.message, ERROR_NOTIFICATION_COLOR);
		}
	}

	const handleAdmission = () => {
		handleConfirmSubmission(referredForm.values);
		closeAdmission();
	};

	return (
		<Box w="100%" bg="white" style={{ borderRadius: "4px" }}>
			<Flex justify="space-between" align="center" px="sm">
				<Text fw={600} fz="sm" py="xs">
					{t("EmergencyInformation")}
				</Text>
				<Flex gap="xs" align="center">
					<Tabs mt="xs" variant="none" value={processTab} onChange={setProcessTab}>
						<Tabs.List ref={setRootRef} className={filterTabsCss.list}>
							{tabs.map((tab) => (
								<Tabs.Tab value={tab.value} ref={setControlRef(tab)} className={filterTabsCss.tab} key={tab.value}>
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
						{t("VisitOverview")}
					</Button>
				</Flex>
			</Flex>
			<Box px="sm" mb="sm">
				<KeywordSearch form={form} module={module} />
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
								<Text fz="xs" onClick={() => handleView(item.id)} className="activate-link text-nowrap">
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
						{ accessor: "total", title: t("Total") },
						{
							accessor: "action",
							title: t("Action"),
							textAlign: "right",
							titleClassName: "title-right",
							render: (values) => (
								<Group gap={4} justify="right" wrap="nowrap">
									{["New", "In-progress"].includes(values?.process) &&
										values?.process !== "Closed" &&
										!values?.referred_mode &&
										(values?.prescription_id ? (
											<Button
												miw={124}
												variant="filled"
												bg="var(--theme-primary-color-4)"
												c="white"
												fw={'400'}
												size="compact-xs"
												onClick={() => handlePrescription(values.prescription_id)}
												radius="es"
												rightSection={<IconArrowRight size={18} />}
											>
												{t("Prescription")}
											</Button>
										) : (
											<Button
												miw={124}
												variant="filled"
												bg="var(--theme-primary-color-6)"
												c="white"
												size="compact-xs"
												onClick={() => handleProcessPrescription(values.id)}
												radius="es"
												fw={'400'}
												rightSection={<IconArrowRight size={18} />}
												className="border-right-radius-none"
											>
												{t("Prescription")}
											</Button>
										))}

									{values.process === "New" && !values.referred_mode && (
										<Button
											variant="filled"
											bg="var(--theme-success-color)"
											c="white"
											size="compact-xs"
											onClick={() => handleSendToAdmission(values.id)}
											radius="es"
											fw={'400'}
											rightSection={<IconArrowRight size={18} />}
											className="border-right-radius-none"
										>
											{t("Admission")}
										</Button>
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
												className="action-icon-menu border-left-radius-none"
												variant="transparent"
												radius="es"
												aria-label="Settings"
											>
												<IconDotsVertical height={18} width={18} stroke={1.5} />
											</ActionIcon>
										</Menu.Target>
										<Menu.Dropdown>
											<Menu.Item
												onClick={() => {
													// handleVendorEdit(values.id);
													// open();
												}}
											>
												{t("Edit")}
											</Menu.Item>
											<Menu.Item
												// onClick={() => handleDelete(values.id)}
												bg="red.1"
												c="red.6"
												rightSection={
													<IconTrashX
														style={{
															width: rem(14),
															height: rem(14),
														}}
													/>
												}
											>
												{t("Delete")}
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
					height={height - 118}
					onScrollToBottom={handleScrollToBottom}
					scrollViewportRef={scrollRef}
					sortStatus={sortStatus}
					onSortStatusChange={setSortStatus}
				/>
			</Box>
			<DataTableFooter indexData={listData} module="visit" />
			<DetailsDrawer opened={opened} close={close} />
			<OverviewDrawer opened={openedOverview} close={closeOverview} />

			<CompactDrawer
				opened={openedAdmission}
				close={closeAdmission}
				save={handleAdmission}
				position="right"
				size="30%"
				keepMounted={false}
				bg="white"
				title={t("Admission")}
				form={referredForm}
			>
				<Grid align="center" columns={20}>
					<Grid.Col span={7}>
						<Text fz="sm">{t("Comment")}</Text>
					</Grid.Col>
					<Grid.Col span={13}>
						<TextAreaForm
							tooltip={t("Comment")}
							label=""
							placeholder={t("AdmissionComment")}
							form={referredForm}
							name="admission_comment"
							mt={0}
							id="comment"
							showRightSection={false}
							required
							style={{ input: { height: 100 } }}
						/>
					</Grid.Col>
				</Grid>
			</CompactDrawer>
		</Box>
	);
}
