import {Group, Box, ActionIcon, Text, Flex, Button, Grid, Select, Stack, rem} from "@mantine/core";
import { useTranslation } from "react-i18next";
import inputCss from "@assets/css/TextAreaInputField.module.css";
import {
    IconChevronUp,
    IconX,
    IconSelector,
    IconEye,
    IconPlus,
    IconDeviceFloppy,
    IconHistory, IconCheck, IconAlertCircle,
} from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { modals } from "@mantine/modals";
import { useDebouncedState, useDisclosure } from "@mantine/hooks";
import {CORE_DATA_ROUTES, HOSPITAL_DATA_ROUTES, PHARMACY_DATA_ROUTES} from "@/constants/routes";
import tableCss from "@assets/css/Table.module.css";
import React, { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import { getInitialValues, getWorkorderFormInitialValues } from "../helpers/request";
import InputNumberForm from "@components/form-builders/InputNumberForm";
import DatePickerForm from "@components/form-builders/DatePicker";
import useMedicineData from "@hooks/useMedicineData";
import {formatDate, formatDateForMySQL, getLoggedInUser} from "@utils/index";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import GlobalDrawer from "@components/drawers/GlobalDrawer";
import { getDataWithoutStore } from "@/services/apiService";
import useGlobalDropdownData from "@hooks/dropdown/useGlobalDropdownData";
import {CORE_DROPDOWNS} from "@/app/store/core/utilitySlice";
import RequiredAsterisk from "@components/form-builders/RequiredAsterisk";
import SelectForm from "@components/form-builders/SelectForm";
import {storeEntityData} from "@/app/store/core/crudThunk.js";
import useVendorDataStoreIntoLocalStorage from "@hooks/local-storage/useVendorDataStoreIntoLocalStorage.js";
import {setRefetchData} from "@/app/store/core/crudSlice.js";
import {notifications} from "@mantine/notifications";
import {ERROR_NOTIFICATION_COLOR, SUCCESS_NOTIFICATION_COLOR} from "@/constants/index.js";
import {useDispatch} from "react-redux";
import useDataWithoutStore from "@hooks/useDataWithoutStore";

export default function __Form() {
	const { id } = useParams();
	const [records, setRecords] = useState([]);
	const { t } = useTranslation();
	const [medicineTerm, setMedicineTerm] = useDebouncedState("", 300);
	const { medicineData } = useMedicineData({ term: medicineTerm });
	const { mainAreaHeight } = useOutletContext();
    const dispatch = useDispatch();
    const navigate = useNavigate();
	const height = mainAreaHeight - 78;
	const [resetKey, setResetKey] = useState(0);
//	const { id } = useParams();
	const form = useForm(getInitialValues(t));
	const workOrderForm = useForm(getWorkorderFormInitialValues(t));
	const [openedDrawer, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);
	const [requisitions, setRequisitions] = useState([]);

	useEffect(() => {
		if (id) {
			fetchSingleRequisitionData();
		}
	}, [id]);


	/*
		const { data: workorder, isLoading } = useDataWithoutStore({
		url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.PRESCRIPTION.INDEX}/${id}`,

	});*/

	async function fetchSingleRequisitionData() {
		const response = await getDataWithoutStore({
			url: `${PHARMACY_DATA_ROUTES.API_ROUTES.PURCHASE.VIEW}/${id}`,
			params: {},
		});
		setRequisitions(response?.data?.data);
	}

	console.log(requisitions);
	const { data: vendorDropdown } = useGlobalDropdownData({
		path: CORE_DROPDOWNS.VENDOR.PATH,
		utility: CORE_DROPDOWNS.VENDOR.UTILITY,
	});


	async function handleWorkorderAdd(values) {
		setRecords([...records, values]);

		form.reset();
		setMedicineTerm("");
		setResetKey(Date.now());
	}

	const handleRequisitionDelete = (id) => {
		modals.openConfirmModal({
			title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
			children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
			labels: { confirm: "Confirm", cancel: "Cancel" },
			confirmProps: { color: "var(--theme-delete-color)" },
			onCancel: () => console.info("Cancel"),
			onConfirm: () => handleRequisitionDeleteSuccess(id),
		});
	};

	const handleRequisitionDeleteSuccess = async (id) => {
		setRecords(records.filter((_, index) => index !== id));
	};

	const handleMedicineChange = (value) => {
		const selectedMedicine = medicineData.find((medicine) => medicine.product_id == value);
		form.setFieldValue("medicine_id", value);
		form.setFieldValue("medicine_name", selectedMedicine.product_name);
		form.setFieldValue("generic", selectedMedicine.generic);
	};

    const [isSaving, setIsSaving] = useState(false);

    const handleWorkOrderSave = (values) => {
        const validation = workOrderForm.validate();
        if (validation.hasErrors) return;

        modals.openConfirmModal({
            title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
            children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
            labels: { confirm: t("Submit"), cancel: t("Cancel") },
            confirmProps: { color: "red", loading: isSaving },
            onCancel: () => console.info("Cancelled"),
            onConfirm: () => saveWorkOrderToDB(values),
        });
    };

    async function saveWorkOrderToDB(values) {
        modals.closeAll();
        setIsSaving(true);
        try {
            const payload = {
                ...values,
                items: records.map((r) => ({
                    ...r,
                    production_date: formatDateForMySQL(r.production_date),
                    expired_date: formatDateForMySQL(r.expired_date),
                })),
                created_by_id: getLoggedInUser()?.id,
            };

            const requestData = {
                url: PHARMACY_DATA_ROUTES.API_ROUTES.PURCHASE.CREATE,
                data: payload,
                module: "vendor",
            };

            const result = await dispatch(storeEntityData(requestData));

            if (storeEntityData.rejected.match(result)) {
                const fieldErrors = result.payload?.errors;
                if (fieldErrors) {
                    form.setErrors(
                        Object.fromEntries(
                            Object.entries(fieldErrors).map(([k, v]) => [k, v[0]])
                        )
                    );
                } else {
                    notifications.show({
                        color: ERROR_NOTIFICATION_COLOR,
                        title: t("ServerError"),
                        message: result.error?.message || t("UnexpectedError"),
                    });
                }
            } else if (storeEntityData.fulfilled.match(result)) {
                form.reset();
                workOrderForm.reset();
                notifications.show({
                    color: SUCCESS_NOTIFICATION_COLOR,
                    title: t("CreateSuccessfully"),
                    icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                    autoClose: 800,
                    onClose: () => navigate("/pharmacy/core/workorder"),
                });
            }
        } catch (error) {
            console.error(error);
            notifications.show({
                color: ERROR_NOTIFICATION_COLOR,
                title: t("ErrorOccurred"),
                message: error.message,
                icon: <IconAlertCircle style={{ width: rem(18), height: rem(18) }} />,
                autoClose: 800,
            });
        } finally {
            setIsSaving(false);
        }
    }

	const handleResetRequisition = () => {
		setRecords([]);
		setMedicineTerm("");
		setResetKey(Date.now());
		form.reset();
		workOrderForm.reset();
	};

	const handleViewList = () => {
		navigate(PHARMACY_DATA_ROUTES.NAVIGATION_LINKS.WORKORDER.INDEX);
	};

	return (
		<>
			<Box
				component="form"
				onSubmit={form.onSubmit(handleWorkorderAdd)}
				p="xs"
				h="52px"
				className="boxBackground border-bottom-none"
			>
				<Grid columns={24} gutter={{ base: 8 }}>
					<Grid.Col span={5}>
						<DatePickerForm
							form={form}
							tooltip={t("NameValidationMessage")}
							placeholder={t("ExpiryStartDate")}
							name="production_date"
							id="production_date"
							nextField="expired_date"
							value={form.values.production_date}
						/>
					</Grid.Col>
					<Grid.Col span={5}>
						<DatePickerForm
							form={form}
							tooltip={t("NameValidationMessage")}
							placeholder={t("ExpiryEndDate")}
							name="expired_date"
							id="expired_date"
							nextField="EntityFormSubmit"
							value={form.values.expired_date}
						/>
					</Grid.Col>
					<Grid.Col span={5}>
						<Select
							key={resetKey}
							searchable
							onSearchChange={setMedicineTerm}
							onChange={(value) => handleMedicineChange(value)}
							tooltip={t("NameValidationMessage")}
							placeholder={t("Medicine")}
							name="medicine_id"
							id="medicine_id"
							nextField="quantity"
							value={form.values.medicine_id}
							required={true}
							data={medicineData?.map((item) => ({
								label: item.product_name,
								value: item.product_id?.toString(),
							}))}
							onBlur={() => setMedicineTerm("")}
							nothingFoundMessage="Type to find medicine..."
							classNames={inputCss}
						/>
					</Grid.Col>
					<Grid.Col span={5}>
						<InputNumberForm
							form={form}
							tooltip={t("QuantityValidationMessage")}
							placeholder={t("Quantity")}
							name="quantity"
							id="quantity"
							nextField="EntityFormSubmit"
							value={form.values.quantity}
							required={true}
						/>
					</Grid.Col>
					<Grid.Col span={4}>
						<Flex h="100%" align="center" justify="flex-end" gap={6}>
							<Button
								size="xs"
								bg="var(--theme-secondary-color-6)"
								type="submit"
								id="EntityFormSubmit"
								leftSection={<IconPlus size={16} />}
							>
								<Flex direction={`column`} gap={0}>
									<Text fz={14} fw={400}>
										{t("Add")}
									</Text>
								</Flex>
							</Button>
							<Button
								size="xs"
								bg="var(--theme-primary-color-6)"
								type="button"
								id="EntityFormSubmit"
								leftSection={<IconEye size={16} />}
								onClick={handleViewList}
							>
								<Flex direction={`column`} gap={0}>
									<Text fz={14} fw={400}>
										{t("ViewList")}
									</Text>
								</Flex>
							</Button>
						</Flex>
					</Grid.Col>
				</Grid>
			</Box>
			<Box className="borderRadiusAll border-top-none">
				<DataTable
					classNames={{
						root: tableCss.root,
						table: tableCss.table,
						body: tableCss.body,
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
							sortable: false,
							render: (_item, index) => index + 1,
						},
						{
							accessor: "production_date",
							title: t("ExpiryStartDate"),
							sortable: false,
							render: (item) => formatDate(item.production_date),
						},
						{
							accessor: "expired_date",
							title: t("ExpiryEndDate"),
							sortable: false,
							render: (item) => formatDate(item.expired_date),
						},
						{
							accessor: "medicine_name",
							title: t("MedicineName"),
							sortable: true,
						},
						{
							accessor: "generic",
							title: t("GenericName"),
							sortable: false,
							render: (item) => item.generic || "N/A",
						},
						{
							accessor: "quantity",
							title: t("Quantity"),
							sortable: false,
							render: (item) => item.quantity,
						},
						{
							accessor: "action",
							title: "",
							textAlign: "right",
							titleClassName: "title-right",
							render: (_, index) => (
								<Group gap={4} justify="right" wrap="nowrap">
									<Button.Group>
										<ActionIcon
											size="md"
											onClick={() => handleRequisitionDelete(index)}
											className="border-left-radius-none"
											variant="transparent"
											color="var(--theme-delete-color)"
											radius="es"
											aria-label="delete"
										>
											<IconX height={18} width={18} stroke={1.5} />
										</ActionIcon>
									</Button.Group>
								</Group>
							),
						},
					]}
					textSelectionDisabled
					loaderSize="xs"
					loaderColor="grape"
					height={height - 180}
					sortIcons={{
						sorted: <IconChevronUp color="var(--theme-tertiary-color-7)" size={14} />,
						unsorted: <IconSelector color="var(--theme-tertiary-color-7)" size={14} />,
					}}
				/>

				<Flex
					component="form"
					onSubmit={workOrderForm.onSubmit(handleWorkOrderSave)}
					bg="white"
					justify="space-between"
					align="center"
					className="borderRadiusAll"
				>
					<Box w="50%" bg="var(--theme-primary-color-0)" fz="sm" c="white">
						<Grid align="center" columns={20} mt="xxxs">
							<Grid.Col span={6}>
								<Text fz="sm">{t("ParticularType")} <RequiredAsterisk /></Text>
							</Grid.Col>
						</Grid>
						<Text bg="var(--theme-secondary-color-6)" fz="sm" c="white" px="sm" py="les">
							{t("Comment")}
						</Text>
						<Box p="sm">
							<TextAreaForm
								form={workOrderForm}
								label=""
								value={workOrderForm.values.comment}
								name="comment"
								placeholder="Write a comment..."
								showRightSection={false}
								style={{ input: { height: "60px" } }}
							/>
						</Box>
					</Box>
					<Stack gap="xs" px="sm">
                            <SelectForm
                                form={workOrderForm}
                                tooltip={t("ChooseVendor")}
                                placeholder={t("ChooseVendor")}
                                name="vendor_id"
                                id="vendor_id"
                                nextField="EntityFormSubmit"
                                required={true}
                                value={workOrderForm.values.vendor_id}
                                dropdownValue={vendorDropdown}
                            />
						{/*<DatePickerForm
							form={workOrderForm}
							tooltip={t("NameValidationMessage")}
							placeholder={t("ExpectedDate")}
							name="expected_date"
							id="expected_date"
							nextField="EntityFormSubmit"
							value={workOrderForm.values.expected_date}
							required={true}
						/>*/}
						<Flex gap="les">
							<Button
								onClick={handleResetRequisition}
								size="md"
								leftSection={<IconHistory size={20} />}
								type="button"
								bg="var(--theme-reset-btn-color)"
								color="white"
								w="200px"
							>
								{t("Reset")}
							</Button>
							<Button
								onClick={handleWorkOrderSave}
								size="md"
								leftSection={<IconDeviceFloppy size={20} />}
								type="submit"
								bg="var(--theme-primary-color-6)"
								color="white"
								w="200px"
							>
								{t("Save")}
							</Button>
						</Flex>
					</Stack>
				</Flex>
			</Box>

			{/*<GlobalDrawer title={t("RequisitionList")} opened={openedDrawer} close={closeDrawer}>
				<Box>
					{requisitions.map((requisition) => (
						<Box key={requisition.id}>
							<Text>{requisition.medicine.name}</Text>
							<Text>{requisition.quantity}</Text>
							<Text>{formatDate(requisition.expected_date)}</Text>
							<Text>{requisition.comment}</Text>
						</Box>
					))}
				</Box>
			</GlobalDrawer>*/}
		</>
	);
}
