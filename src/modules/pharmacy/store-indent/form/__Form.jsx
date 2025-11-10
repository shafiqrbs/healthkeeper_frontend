import {
    Box,
    Flex,
    Button,
    Grid,
    NumberInput,
    Select,
    rem, Text,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import {
    IconChevronUp,
    IconSelector,
    IconDeviceFloppy,
    IconHistory,
    IconAlertCircle,
} from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import {useNavigate, useOutletContext, useParams} from "react-router-dom";
import { useEffect, useState } from "react";
import useGlobalDropdownData from "@hooks/dropdown/useGlobalDropdownData";
import { CORE_DROPDOWNS } from "@/app/store/core/utilitySlice";
import {
    ERROR_NOTIFICATION_COLOR,
    MODULES_PHARMACY,
} from "@/constants";
import { notifications } from "@mantine/notifications";
import { PHARMACY_DATA_ROUTES } from "@/constants/routes";
import tableCss from "@assets/css/Table.module.css";
import {modals} from "@mantine/modals";
import {showEntityData} from "@/app/store/core/crudThunk.js";
import {successNotification} from "@components/notification/successNotification.jsx";
import {errorNotification} from "@components/notification/errorNotification.jsx";
import {useDispatch} from "react-redux";

const module = MODULES_PHARMACY.REQUISITION;

export default function __Form({
                                   form,
                                   requisitionForm,
                                   items,
                                   setItems,
                                   onSave,
                               }) {
    const { t } = useTranslation();
    const { mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 10;
    const { id } = useParams();
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const allItemsHavePurchaseItem = items.length > 0 && items.every(
        (item) => item.purchase_item_id && item.purchase_item_id !== ""
    );

    const { data: categoryDropdown } = useGlobalDropdownData({
        path: CORE_DROPDOWNS.CATEGORY.PATH,
        utility: CORE_DROPDOWNS.CATEGORY.UTILITY,
        params: { type: "stockable" },
    });

    useEffect(() => {
        form.setFieldValue("category_id", categoryDropdown[3]?.value?.toString());
    }, [categoryDropdown]);

    const handleResetIndent = () => {
        setItems([]);
        form.reset();
        requisitionForm.reset();
    };

    const handleRecordFieldChange = (id, stockItemId, fieldName, fieldValue) => {
        setItems((previousRecords) =>
            previousRecords.map((recordItem) =>
                recordItem?.stock_item_id?.toString() === stockItemId?.toString()
                    ? { ...recordItem, [fieldName]: fieldValue }
                    : recordItem
            )
        );
    };

    // ---- Validation before save/issue ----
    const validateQuantities = () => {
        for (const item of items) {
            const selected = (item.purchase_items || []).find(
                (p) => String(p.id) === String(item.purchase_item_id)
            );

            if (selected && Number(item.quantity) > Number(selected.remain_quantity)) {
                notifications.show({
                    color: ERROR_NOTIFICATION_COLOR,
                    title: t("ValidationError"),
                    message: `${item.name}: Issue quantity (${item.quantity}) exceeds remaining quantity (${selected.remain_quantity})`,
                    icon: <IconAlertCircle style={{ width: rem(18), height: rem(18) }} />,
                });
                return false;
            }
        }
        return true;
    };

    const handleSubmit = (action) => {
        if (!validateQuantities()) return;
        requisitionForm.setFieldValue("action", action);
        requisitionForm.onSubmit(onSave)();
    };

    // ---- Components ----
    function PurchaseItemSelect({ item }) {
        const [purchaseItemValue, setPurchaseItemValue] = useState(
            String(item.purchase_item_id || "")
        );

        const selectData = (item.purchase_items || []).map((pItem) => ({
            label: `Expire: ${pItem.expired_date} (stock #${pItem.remain_quantity})`,
            value: String(pItem.id),
            remain_quantity: pItem.remain_quantity,
        }));

        return (
            <Select
                size="xs"
                placeholder="Select"
                value={purchaseItemValue}
                data={selectData}
                onChange={(value) => {
                    const selected = selectData.find((p) => p.value === value);
                    const remain_quantity = selected ? selected.remain_quantity : 0;
                    const quantity = Number(item.quantity) || 0;

                    if (quantity <= remain_quantity) {
                        setPurchaseItemValue(String(value ?? ""));
                        handleRecordFieldChange(item?.id, item?.stock_item_id, "purchase_item_id", String(value ?? ""));
                    } else {
                        notifications.show({
                            color: ERROR_NOTIFICATION_COLOR,
                            title: t("ValidationError"),
                            message: "Quantity must be less than or equal to remaining quantity",
                            icon: <IconAlertCircle style={{ width: rem(18), height: rem(18) }} />,
                        });
                    }
                }}
            />
        );
    }

    function QuantityChange({ item }) {
        const selectData = (item.purchase_items || []).map((pItem) => ({
            label: `Expire: ${pItem.expired_date} (stock #${pItem.remain_quantity})`,
            value: String(pItem.id),
            remain_quantity: pItem.remain_quantity,
        }));

        return (
            <NumberInput
                min={1}
                size="xs"
                value={item?.quantity}
                onBlur={(event) => {
                    const inputValue = Number(event.currentTarget.value) || 0;

                    if (!item.purchase_item_id) {
                        notifications.show({
                            color: ERROR_NOTIFICATION_COLOR,
                            title: t("ValidationError"),
                            message: "Please select a purchase batch item first",
                            icon: <IconAlertCircle style={{ width: rem(18), height: rem(18) }} />,
                        });
                        return;
                    }

                    const selected = selectData.find(
                        (p) => p.value === String(item.purchase_item_id)
                    );
                    const remain_quantity = selected ? selected.remain_quantity : 0;

                    if (inputValue <= remain_quantity) {
                        handleRecordFieldChange(
                            item?.id,
                            item?.stock_item_id,
                            "quantity",
                            String(inputValue)
                        );
                    } else {
                        notifications.show({
                            color: ERROR_NOTIFICATION_COLOR,
                            title: t("ValidationError"),
                            message: "Quantity must be less than or equal to remaining quantity",
                            icon: <IconAlertCircle style={{ width: rem(18), height: rem(18) }} />,
                        });
                    }
                }}
            />
        );
    }

    const handleIndentApproved = () => {
        modals.openConfirmModal({
            title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
            children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
            labels: {confirm: "Confirm", cancel: "Cancel"},
            confirmProps: {color: "var(--theme-delete-color)"},
            onCancel: () => console.info("Cancel"),
            onConfirm: () => handleConfirmApproved(id),
        });
    }

    const handleConfirmApproved = async (id) => {
        try {
            const value = {
                url: `${PHARMACY_DATA_ROUTES.API_ROUTES.STOCK_TRANSFER.RECEIVE}/${id}`,
                module,
            };
            const resultAction = await dispatch(showEntityData(value));
            if (showEntityData.fulfilled.match(resultAction)) {
                if (resultAction.payload.data.status === 200) {
                    successNotification(resultAction.payload.data.message)
                    navigate(PHARMACY_DATA_ROUTES.NAVIGATION_LINKS.STORE_INDENT.INDEX)
                }
            }
        } catch (error) {
            errorNotification("Error updating indent config:" + error.message);
        }
    }

    return (
        <Grid columns={24} gutter={{ base: 8 }}>
            <Grid.Col span={24}>
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
                        records={items}
                        columns={[
                            {
                                accessor: "index",
                                title: t("S/N"),
                                textAlignment: "right",
                                render: (_item, index) => index + 1,
                            },
                            {
                                accessor: "name",
                                title: t("MedicineName"),
                            },
                            {
                                accessor: "stock_quantity",
                                title: t("CurrentStock"),
                                render: (item) => item.stock_quantity,
                            },
                            {
                                accessor: "request_quantity",
                                title: t("Quantity"),
                                render: (item) => item.request_quantity,
                            },
                            {
                                accessor: "purchase_item_id",
                                title: t("PurchaseItem"),
                                render: (item) => <PurchaseItemSelect item={item} />,
                            },
                            {
                                accessor: "quantity",
                                title: t("IssueQuantity"),
                                render: (item) => <QuantityChange item={item} />,
                            },
                        ]}
                        textSelectionDisabled
                        loaderSize="xs"
                        loaderColor="grape"
                        height={height - 90}
                        sortIcons={{
                            sorted: <IconChevronUp color="var(--theme-tertiary-color-7)" size={14} />,
                            unsorted: <IconSelector color="var(--theme-tertiary-color-7)" size={14} />,
                        }}
                    />

                    <Box
                        w={"100%"}
                        component="form"
                        bg="var(--theme-tertiary-color-0)"
                        justify="flex-end"
                        align="right"
                        pt={"xs"}
                        pb={"xs"}
                    >
                        <Box align="right">
                            <Flex gap="les" justify="flex-end" pr={"xs"}>
                                <Button
                                    onClick={handleResetIndent}
                                    size="xs"
                                    leftSection={<IconHistory size={20} />}
                                    type="button"
                                    bg="var(--theme-reset-btn-color)"
                                    color="white"
                                    w="200px"
                                >
                                    {t("Reset")}
                                </Button>

                                <Button
                                    onClick={() => handleSubmit("submit")}
                                    size="xs"
                                    leftSection={<IconDeviceFloppy size={20} />}
                                    type="button"
                                    bg="var(--theme-primary-color-6)"
                                    color="white"
                                    w="200px"
                                >
                                    {t("Save")}
                                </Button>

                                <Button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleIndentApproved();
                                    }}
                                    size="xs"
                                    leftSection={<IconDeviceFloppy size={20} />}
                                    type="button"
                                    bg="var(--theme-secondary-color-6)"
                                    color="white"
                                    w="200px"
                                    disabled={!allItemsHavePurchaseItem}
                                    title={!allItemsHavePurchaseItem ? t("Please select all Purchase Items first") : ""}
                                >
                                    {t("Issue")}
                                </Button>

                            </Flex>
                        </Box>
                    </Box>
                </Box>
            </Grid.Col>
        </Grid>
    );
}

