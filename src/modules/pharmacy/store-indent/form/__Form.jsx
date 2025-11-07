import {
    Group,
    Box,
    ActionIcon,
    Text,
    Flex,
    Button,
    Grid,
    NumberInput,
    Tooltip,
    TextInput,
    Input,
} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {
    IconChevronUp,
    IconX,
    IconSelector,
    IconDeviceFloppy,
    IconHistory,
    IconRefresh,
    IconSearch,
    IconInfoCircle,
    IconShoppingBag,
} from "@tabler/icons-react";
import {DataTable} from "mantine-datatable";
import {useOutletContext} from "react-router-dom";
import {modals} from "@mantine/modals";
import {useDebouncedCallback, useDebouncedState} from "@mantine/hooks";
import {PHARMACY_DATA_ROUTES} from "@/constants/routes";
import tableCss from "@assets/css/Table.module.css";
import {useEffect, useState, useMemo} from "react";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import useGlobalDropdownData from "@hooks/dropdown/useGlobalDropdownData";
import {CORE_DROPDOWNS} from "@/app/store/core/utilitySlice";
import SelectForm from "@components/form-builders/SelectForm";
import useInfiniteTableScroll from "@hooks/useInfiniteTableScroll";
import genericClass from "@assets/css/Generic.module.css";
import {MODULES_PHARMACY} from "@/constants";

const module = MODULES_PHARMACY.REQUISITION;

export default function __Form({form, requisitionForm, items, setItems, onSave}) {
    const [products, setProducts] = useState([]);
    const {t} = useTranslation();
    const [medicineTerm, setMedicineTerm] = useDebouncedState("", 300);
    const {mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight-10;
    const itemFromHeight = mainAreaHeight - 142;
    const [searchValue, setSearchValue] = useState("");
    const [draftProducts, setDraftProducts] = useState([]);

    const createdBy = JSON.parse(localStorage.getItem("user"));
    const {data: warehouseDropdown} = useGlobalDropdownData({
        path: CORE_DROPDOWNS.USER_WAREHOUSE.PATH,
        utility: CORE_DROPDOWNS.USER_WAREHOUSE.UTILITY,
        params: {id: createdBy?.id}
    });

    const {data: categoryDropdown} = useGlobalDropdownData({
        path: CORE_DROPDOWNS.CATEGORY.PATH,
        utility: CORE_DROPDOWNS.CATEGORY.UTILITY,
        params: {type: "stockable"},
    });

    useEffect(() => {
        form.setFieldValue("category_id", categoryDropdown[3]?.value?.toString());
    }, [categoryDropdown]);

    async function handleRequisitionAdd(values) {
        setItems([...items, values]);
        setDraftProducts((previousRecords) => delete previousRecords[values?.stock_item_id]);
        setMedicineTerm("");
    }

    const handleRequisitionDelete = (id) => {
        modals.openConfirmModal({
            title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
            children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
            labels: {confirm: "Confirm", cancel: "Cancel"},
            confirmProps: {color: "var(--theme-delete-color)"},
            onCancel: () => console.info("Cancel"),
            onConfirm: () => handleRequisitionDeleteSuccess(id),
        });
    };

    const handleRequisitionDeleteSuccess = async (id) => {
        setItems(items.filter((_, index) => index !== id));
    };

    const handleResetRequisition = () => {
        setItems([]);
        setMedicineTerm("");
        form.reset();
        requisitionForm.reset();
    };

    const productQuantities = () => {
    };

    const handleRecordFieldChange = (stockItemId, fieldName, fieldValue) => {
        setItems((previousRecords) =>
            previousRecords.map((recordItem) =>
                recordItem?.stock_item_id?.toString() === stockItemId?.toString()
                    ? {...recordItem, [fieldName]: fieldValue}
                    : recordItem
            )
        );
        // =============== end ===============
    };

    const handleDraftProducts = (data, quantity) => {
        setDraftProducts((previousRecords) => ({
            ...previousRecords,
            [data?.stock_item_id]: {...data, quantity: quantity},
        }));
    };

    const memoizedFilterParameters = useMemo(
        () => ({category_id: form.values.category_id}),
        [form.values.category_id]
    );

    const {records} = useInfiniteTableScroll({
        module,
        fetchUrl: PHARMACY_DATA_ROUTES.API_ROUTES.STOCK.INDEX_CATEGORY,
        sortByKey: "created_at",
        filterParams: memoizedFilterParameters,
        direction: "desc",
    });

    useEffect(() => {
        setProducts(records);
    }, [records]);

    const handleProductSearch = useDebouncedCallback((value) => {
        setProducts(records?.filter((product) => product?.name?.toLowerCase()?.includes(value?.toLowerCase())));
    }, 300);

    return (
        <Grid columns={24} gutter={{base: 8}}>
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
                                sortable: false,
                                render: (_item, index) => index + 1,
                            },

                            {
                                accessor: "name",
                                title: t("MedicineName"),
                                sortable: true,
                            },
                            {
                                accessor: "quantity",
                                title: t("CurrentStock"),
                                sortable: false,
                            },
                            {
                                accessor: "quantity",
                                title: t("Quantity"),
                                sortable: false,
                            },
                            {
                                accessor: "quantity",
                                title: t("ItemBatch"),
                                sortable: false,
                            },
                            {
                                accessor: "quantity",
                                title: t("IssueQuantity"),
                                sortable: false,
                                render: (item) => (
                                    <NumberInput
                                        min={1}
                                        size="xs"
                                        value={item?.quantity}
                                        onChange={(value) =>
                                            handleRecordFieldChange(
                                                item?.stock_item_id,
                                                "quantity",
                                                String(value ?? "")
                                            )
                                        }
                                    />
                                ),
                            }

                        ]}
                        textSelectionDisabled
                        loaderSize="xs"
                        loaderColor="grape"
                        height={height - 90}
                        sortIcons={{
                            sorted: <IconChevronUp color="var(--theme-tertiary-color-7)" size={14}/>,
                            unsorted: <IconSelector color="var(--theme-tertiary-color-7)" size={14}/>,
                        }}
                    />
                    <Box
                        w={"100%"}
                        component="form"
                        onSubmit={requisitionForm.onSubmit(onSave)}
                        bg="var(--theme-tertiary-color-0)"
                        justify="flex-end"
                        align="right"
                        pt={"xs"}
                        pb={"xs"}
                    >
                        <Box align="right">
                            <Flex gap="les"  justify="flex-end" pr={'xs'}>
                                <Button
                                    onClick={handleResetRequisition}
                                    size="xs"
                                    leftSection={<IconHistory size={20}/>}
                                    type="button"
                                    bg="var(--theme-reset-btn-color)"
                                    color="white"
                                    w="200px"
                                >
                                    {t("Reset")}
                                </Button>
                                <Button
                                    onClick={onSave}
                                    size="xs"
                                    leftSection={<IconDeviceFloppy size={20}/>}
                                    type="submit"
                                    bg="var(--theme-primary-color-6)"
                                    color="white"
                                    w="200px"
                                >
                                    {t("Save")}
                                </Button>
                                <Button
                                    onClick={onSave}
                                    size="xs"
                                    leftSection={<IconDeviceFloppy size={20}/>}
                                    type="submit"
                                    bg="var(--theme-secondary-color-6)"
                                    color="white"
                                    w="200px"
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
