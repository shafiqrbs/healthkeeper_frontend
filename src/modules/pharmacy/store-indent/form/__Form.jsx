import {
    Box,
    Flex,
    Button,
    Grid,
    NumberInput,
    Select,
    rem
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
import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import useGlobalDropdownData from "@hooks/dropdown/useGlobalDropdownData";
import { CORE_DROPDOWNS } from "@/app/store/core/utilitySlice";
import { ERROR_NOTIFICATION_COLOR, MODULES_PHARMACY } from "@/constants";
import { notifications } from "@mantine/notifications";
import { PHARMACY_DATA_ROUTES } from "@/constants/routes";
import tableCss from "@assets/css/Table.module.css";
import { updateEntityData } from "@/app/store/core/crudThunk.js";
import { useDispatch } from "react-redux";

const module = MODULES_PHARMACY.REQUISITION;

export default function __Form({ form, requisitionForm, items, setItems, onSave }) {
    const { t } = useTranslation();
    const { mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 10;
    const dispatch = useDispatch();

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

    const handleRecordFieldChange = async (id, stockItemId, fieldName, fieldValue) => {
        const requestData = {
            url: `${PHARMACY_DATA_ROUTES.API_ROUTES.STOCK_TRANSFER.INLINE_UPDATE}/${id}`,
            data: {
                transfer_item_id: id,
                field_name: fieldName,
                field_value: fieldValue,
                stock_item_id: stockItemId
            },
            module,
        };

        await dispatch(updateEntityData(requestData));
    };

    const handleSubmit = () => {
        requisitionForm.onSubmit(onSave);
    };

    function PurchaseItemSelect({ item, setItems, handleRecordFieldChange, t }) {
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
                    const reqQty = Number(item.quantity || 0);

                    const newIssueQty = remain_quantity >= reqQty ? reqQty : 0;

                    // frontend update
                    setItems(prev =>
                        prev.map(r =>
                            r.id === item.id
                                ? { ...r, quantity: newIssueQty, purchase_item_id: value }
                                : r
                        )
                    );

                    // backend update
                    handleRecordFieldChange(item.id, item.stock_item_id, "purchase_item_id", value);
                    handleRecordFieldChange(item.id, item.stock_item_id, "quantity", newIssueQty);

                    // notification if stock < requested
                    if (remain_quantity < reqQty) {
                        notifications.show({
                            color: ERROR_NOTIFICATION_COLOR,
                            title: t("ValidationError"),
                            message: `Batch stock (${remain_quantity}) is less than request quantity (${reqQty}). Quantity set to 0.`,
                            icon: <IconAlertCircle style={{ width: rem(18), height: rem(18) }} />,
                        });
                    }

                    setPurchaseItemValue(value);
                }}
            />
        );
    }

    function QuantityChange({ item, setItems, handleRecordFieldChange, t }) {
        const [lastValidQuantity, setLastValidQuantity] = useState(item.quantity ?? 0);
        const [localQty, setLocalQty] = useState(item.quantity ?? 0);

        useEffect(() => {
            setLocalQty(item.quantity ?? 0);
            setLastValidQuantity(item.quantity ?? 0);
        }, [item.quantity, item.id]);

        const getSelectedRemain = () => {
            const selected = (item.purchase_items || []).find(
                (p) => String(p.id) === String(item.purchase_item_id)
            );
            return selected ? Number(selected.remain_quantity || 0) : 0;
        };

        const revertToLastValid = () => {
            setLocalQty(lastValidQuantity);
            setItems(prev =>
                prev.map(r =>
                    r.id === item.id ? { ...r, quantity: lastValidQuantity } : r
                )
            );
        };

        return (
            <NumberInput
                min={0}
                size="xs"
                value={localQty}
                onChange={(value) => setLocalQty(value ?? 0)}
                onBlur={() => {
                    const newQty = Number(localQty || 0);

                    if (!item.purchase_item_id) {
                        notifications.show({
                            color: ERROR_NOTIFICATION_COLOR,
                            title: t?.("ValidationError"),
                            message: t?.("Please select a purchase item batch first"),
                        });
                        revertToLastValid();
                        return;
                    }

                    const remainQty = getSelectedRemain();

                    if (newQty > remainQty) {
                        notifications.show({
                            color: ERROR_NOTIFICATION_COLOR,
                            title: t?.("ValidationError") ?? "Validation Error",
                            message: t?.("Quantity cannot be greater than available stock", {
                                remain: remainQty,
                            }) ?? `Quantity cannot be greater than available stock (${remainQty})`,
                        });
                        revertToLastValid();
                        return;
                    }

                    // valid → update + backend call
                    setLastValidQuantity(newQty);
                    setItems(prev =>
                        prev.map(r =>
                            r.id === item.id ? { ...r, quantity: newQty } : r
                        )
                    );

                    handleRecordFieldChange(item.id, item.stock_item_id, "quantity", String(newQty));
                }}
            />
        );
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
                                accessor: "purchase_item_id",
                                title: t("BatchItem"),
                                render: (item) => (
                                    <PurchaseItemSelect
                                        item={item}
                                        setItems={setItems}
                                        handleRecordFieldChange={handleRecordFieldChange}
                                        t={t}
                                    />
                                ),
                            },
                            {
                                accessor: "quantity",
                                title: t("IssueQuantity"),
                                render: (item) => (
                                    <QuantityChange
                                        item={item}
                                        setItems={setItems}
                                        handleRecordFieldChange={handleRecordFieldChange}
                                        t={t}
                                    />
                                ),
                            },
                            {
                                accessor: "request_quantity",
                                title: t("RequestQuantity"),
                                render: (item) => item.request_quantity,
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
                                    onClick={() => requisitionForm.onSubmit(onSave)()}
                                    size="xs"
                                    leftSection={<IconDeviceFloppy size={20} />}
                                    type="button"
                                    bg="var(--theme-primary-color-6)"
                                    color="white"
                                    w="200px"
                                >
                                    {t("Save")}
                                </Button>
                            </Flex>
                        </Box>
                    </Box>
                </Box>
            </Grid.Col>
        </Grid>
    );
}

