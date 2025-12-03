import { Group, Box, Text, rem, CloseButton, Flex, Button, TextInput, Select, Checkbox } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconAlertCircle, IconEdit, IconChevronUp, IconSelector, IconEye, IconTrashX } from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useOutletContext } from "react-router-dom";
import { modals } from "@mantine/modals";
import KeywordSearch from "@modules/filter/KeywordSearch";
import ViewDrawer from "./__ViewDrawer";
import { notifications } from "@mantine/notifications";
import { useOs, useHotkeys } from "@mantine/hooks";
import CreateButton from "@components/buttons/CreateButton";
import DataTableFooter from "@components/tables/DataTableFooter";
import { PHARMACY_DATA_ROUTES } from "@/constants/routes";
import tableCss from "@assets/css/Table.module.css";
import {deleteEntityData, inlineUpdateEntityData, storeEntityData} from "@/app/store/core/crudThunk";
import { setInsertType, setRefetchData } from "@/app/store/core/crudSlice.js";
import { ERROR_NOTIFICATION_COLOR } from "@/constants/index.js";
import { deleteNotification } from "@components/notification/deleteNotification";
import React, { useEffect, useRef, useCallback, memo } from "react";
import useInfiniteTableScroll from "@hooks/useInfiniteTableScroll.js";
import inlineInputCss from "@assets/css/InlineInputField.module.css";
import { errorNotification } from "@components/notification/errorNotification";
import useGlobalDropdownData from "@hooks/dropdown/useGlobalDropdownData";
import { CORE_DROPDOWNS, PHARMACY_DROPDOWNS } from "@/app/store/core/utilitySlice";
const durationModes = [
    "Day",
    "Days",
    "Month",
    "Months",
    "Year",
    "Years",
    "Continue",
];

const PER_PAGE = 50;

// Memoized inline input components to prevent re-renders
const InlineTextInput = memo(({ itemId, field, placeholder, onSubmit, initialValue }) => {
    const inputRef = useRef(null);
    const { t } = useTranslation();

    useEffect(() => {
        if (inputRef.current && initialValue !== undefined) {
            inputRef.current.value = initialValue || "";
        }
    }, [initialValue]);

    return (
        <TextInput
            ref={inputRef}
            size="xs"
            className={inlineInputCss.inputText}
            placeholder={t(placeholder)}
            defaultValue={initialValue || ""}
            onBlur={(e) => onSubmit(itemId, field, e.currentTarget.value)}
        />
    );
});

const InlineSelect = memo(({ itemId, field, placeholder, data, initialValue, onChange }) => {
    const { t } = useTranslation();

    return (
        <Select
            size="xs"
            className={inlineInputCss.inputText}
            placeholder={t(placeholder)}
            data={data}
            defaultValue={String(initialValue) || ""}
            onChange={(val) => onChange(itemId, field, val)}
        />
    );
});

const InlineCheckbox = memo(({ itemId, field, initialValue, onChange }) => {
    return (
        <Checkbox
            size="sm"
            defaultChecked={initialValue ?? false}
            onChange={(e) => onChange(itemId, field, e.currentTarget.checked)}
        />
    );
});

export default function _Table({ module, open }) {
    const { t } = useTranslation();
    const os = useOs();
    const dispatch = useDispatch();
    const { mainAreaHeight } = useOutletContext();
    const navigate = useNavigate();
    const height = mainAreaHeight - 84;

    const searchKeyword = useSelector((state) => state.crud.searchKeyword);
    const filterData = useSelector((state) => state.crud[module].filterData);
    const listData = useSelector((state) => state.crud[module].data);

    // Memoize filterParams - only recreate when values actually change
    const filterParams = React.useMemo(() => ({
        name: filterData?.name,
        term: searchKeyword,
    }), [filterData?.name, searchKeyword]);

    const { data: categoryDropdown } = useGlobalDropdownData({
        path: CORE_DROPDOWNS.CATEGORY.PATH,
        utility: CORE_DROPDOWNS.CATEGORY.UTILITY,
        params: { 'type': 'stockable' },
    });

    const { data: byMealDropdown } = useGlobalDropdownData({
        path: PHARMACY_DROPDOWNS.BY_MEAL.PATH,
        utility: PHARMACY_DROPDOWNS.BY_MEAL.UTILITY,
    });

    const { data: dosageDropdown } = useGlobalDropdownData({
        path: PHARMACY_DROPDOWNS.DOSAGE.PATH,
        utility: PHARMACY_DROPDOWNS.DOSAGE.UTILITY,
    });

    const { scrollRef, records, fetching, sortStatus, setSortStatus, handleScrollToBottom } = useInfiniteTableScroll({
        module,
        fetchUrl: PHARMACY_DATA_ROUTES.API_ROUTES.STOCK.GENERIC,
        filterParams: {
            name: filterData?.name,
            term: searchKeyword,
        },
        perPage: PER_PAGE,
        sortByKey: "product_name",
    });

    const [viewDrawer, setViewDrawer] = React.useState(false);

    const handleEntityEdit = (id) => {
        dispatch(setInsertType({ insertType: "update", module }));
        navigate(`${PHARMACY_DATA_ROUTES.NAVIGATION_LINKS.GENERIC.INDEX}/${id}`);
    };

    const handleDelete = (id) => {
        modals.openConfirmModal({
            title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
            children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
            labels: { confirm: "Confirm", cancel: "Cancel" },
            confirmProps: { color: "var(--theme-delete-color)" },
            onCancel: () => console.info("Cancel"),
            onConfirm: () => handleDeleteSuccess(id),
        });
    };

    const handleDeleteSuccess = async (id) => {
        const res = await dispatch(
            deleteEntityData({
                url: `${PHARMACY_DATA_ROUTES.API_ROUTES.STOCK.DELETE}/${id}`,
                module,
                id,
            })
        );

        if (deleteEntityData.fulfilled.match(res)) {
            dispatch(setRefetchData({ module, refetching: true }));
            deleteNotification(t("DeletedSuccessfully"), ERROR_NOTIFICATION_COLOR);
            navigate(PHARMACY_DATA_ROUTES.API_ROUTES.STOCK.GENERIC);
            dispatch(setInsertType({ insertType: "create", module }));
        } else {
            notifications.show({
                color: ERROR_NOTIFICATION_COLOR,
                title: t("Delete Failed"),
                icon: <IconAlertCircle style={{ width: rem(18), height: rem(18) }} />,
            });
        }
    };

    const handleCreateForm = () => {
        open();
        dispatch(setInsertType({ insertType: "create", module }));
    };

    const handleDataShow = (id) => {
        setViewDrawer(true);
    };

    // Handle inline update - completely isolated from render cycle
    const handleInlineUpdate = useCallback(async (rowId, field, value) => {
        const data = { [field]: value };
        try {
            await dispatch(inlineUpdateEntityData({
                url: `${PHARMACY_DATA_ROUTES.API_ROUTES.STOCK.INLINE_UPDATE}/${rowId}`,
                data,
                module,
            }));
        } catch (error) {
            errorNotification(error.message);
        }
    }, [dispatch, module]);

    const handleTextBlur = useCallback((rowId, field, value) => {
        handleInlineUpdate(rowId, field, value);
    }, [handleInlineUpdate]);

    const handleSelectChange = useCallback((rowId, field, value) => {
        handleInlineUpdate(rowId, field, value);
    }, [handleInlineUpdate]);

    const handleCheckboxChange = useCallback((rowId, field, checked) => {
        handleInlineUpdate(rowId, field, checked);
    }, [handleInlineUpdate]);

    useHotkeys([[os === "macos" ? "ctrl+n" : "alt+n", () => handleCreateForm()]]);

    // Memoize columns to prevent recreation
    const columns = React.useMemo(() => [
        {
            accessor: "index",
            title: t("S/N"),
            textAlignment: "right",
            sortable: false,
            render: (_item, index) => index + 1,
        },
        {
            accessor: "category_id",
            title: t("Category"),
            sortable: true,
            render: (item) => (
                <InlineSelect
                    key={`cat-${item.id}`}
                    itemId={item.id}
                    field="category_id"
                    placeholder="Category"
                    data={categoryDropdown}
                    initialValue={item.category_id}
                    onChange={handleSelectChange}
                />
            ),
        },
        {
            accessor: "product_name",
            title: t("GenericName"),
            sortable: true,
           /* render: (item) => (
                <InlineTextInput
                    key={`name-${item.id}`}
                    itemId={item.id}
                    field="product_name"
                    placeholder="product_name"
                    initialValue={item.product_name}
                    onSubmit={handleTextBlur}
                />
            ),*/
        },
        {
            accessor: "medicine_dosage_id",
            title: t("MedicineDosage"),
            sortable: true,
            render: (item) => (
                <InlineSelect
                    key={`dosage-${item.id}`}
                    itemId={item.id}
                    field="medicine_dosage_id"
                    placeholder="SelectDosage"
                    data={dosageDropdown}
                    initialValue={item.medicine_dosage_id}
                    onChange={handleSelectChange}
                />
            ),
        },
        {
            accessor: "medicine_bymeal_id",
            title: t("MedicineByMeal"),
            sortable: false,
            render: (item) => (
                <InlineSelect
                    key={`meal-${item.id}`}
                    itemId={item.id}
                    field="medicine_bymeal_id"
                    placeholder="SelectByMeal"
                    data={byMealDropdown}
                    initialValue={item.medicine_bymeal_id}
                    onChange={handleSelectChange}
                />
            ),
        },
        {
            accessor: "opd_quantity",
            title: t("OPDQty"),
            sortable: true,
            width: 80,
            render: (item) => (
                <InlineTextInput
                    key={`qty-${item.id}`}
                    itemId={item.id}
                    field="opd_quantity"
                    placeholder="Quantity"
                    initialValue={item.opd_quantity}
                    onSubmit={handleTextBlur}
                />
            ),
        },
        {
            accessor: "duration",
            title: t("Duration"),
            width: 80,
            sortable: true,
            render: (item) => (
                <InlineTextInput
                    key={`duration-${item.id}`}
                    itemId={item.id}
                    field="duration"
                    placeholder="Duration"
                    initialValue={item.duration}
                    onSubmit={handleTextBlur}
                />
            ),
        },
        {
            accessor: "duration_mode",
            title: t("DurationMode"),
            sortable: true,
            render: (item) => (
                <InlineSelect
                    key={`duration_mode-${item.id}`}
                    itemId={item.id}
                    clearable
                    field="duration_mode"
                    placeholder="DurationMode"
                    data={durationModes}
                    initialValue={item.duration_mode}
                    onChange={handleSelectChange}
                />
            ),
        },
        {
            accessor: "opd_status",
            title: t("OutDoor"),
            sortable: true,
            render: (item) => (
                <InlineCheckbox
                    key={`opd-${item.id}`}
                    itemId={item.id}
                    field="opd_status"
                    initialValue={item.opd_status}
                    onChange={handleCheckboxChange}
                />
            ),
        },
        {
            accessor: "ipd_status",
            title: t("InDoor"),
            sortable: true,
            render: (item) => (
                <InlineCheckbox
                    key={`ipd-${item.id}`}
                    itemId={item.id}
                    field="ipd_status"
                    initialValue={item.ipd_status}
                    onChange={handleCheckboxChange}
                />
            ),
        },
        {
            accessor: "admin_status",
            title: t("Admin"),
            sortable: true,
            render: (item) => (
                <InlineCheckbox
                    key={`admin-${item.id}`}
                    itemId={item.id}
                    field="admin_status"
                    initialValue={item.admin_status}
                    onChange={handleCheckboxChange}
                />
            ),
        },
        {
            accessor: "action",
            title: "",
            textAlign: "right",
            titleClassName: "title-right",
            render: (values) => (
                <Group gap={4} justify="right" wrap="nowrap">
                    <Button.Group>
                        <Button
                            onClick={() => {
                                handleEntityEdit(values.id);
                                open();
                            }}
                            variant="filled"
                            c="white"
                            fw={400}
                            size="compact-xs"
                            leftSection={<IconEdit size={12} />}
                            className="border-left-radius-none btnPrimaryBg"
                        >
                            {t("Edit")}
                        </Button>
                        <Button
                            onClick={() => handleDataShow(values.id)}
                            variant="filled"
                            c="white"
                            bg="var(--theme-primary-color-6)"
                            size="compact-xs"
                            fw={400}
                            leftSection={<IconEye size={12} />}
                            className="border-left-radius-none"
                        >
                            {t("View")}
                        </Button>
                        <CloseButton
                            icon={<IconTrashX size={18} stroke={1.2} />}
                            radius="es"
                            onClick={() => handleDelete(values.id)}
                            size={'sm'}
                            c={'red'}
                        />
                    </Button.Group>
                </Group>
            ),
        },
    ], [categoryDropdown, byMealDropdown, dosageDropdown, handleSelectChange, handleTextBlur, handleCheckboxChange, t]);

    return (
        <>
            <Box p="xs" className="boxBackground borderRadiusAll border-bottom-none ">
                <Flex align="center" justify="space-between" gap={4}>
                    <KeywordSearch module={module} />
                    <CreateButton handleModal={handleCreateForm} text="AddNew" />
                </Flex>
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
                    columns={columns}
                    fetching={fetching}
                    loaderSize="xs"
                    loaderColor="grape"
                    height={height - 72}
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

            <DataTableFooter indexData={listData} module={module} />
            <ViewDrawer viewDrawer={viewDrawer} setViewDrawer={setViewDrawer} module={module} />
        </>
    );
}