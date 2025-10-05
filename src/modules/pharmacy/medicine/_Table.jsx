import {Group, Box, ActionIcon, Text, rem, Flex, Button, TextInput, Select} from "@mantine/core";
import { useTranslation } from "react-i18next";
import {
    IconTrashX,
    IconAlertCircle,
    IconEdit,
    IconEye,
    IconChevronUp,
    IconSelector,
} from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { modals } from "@mantine/modals";
import KeywordSearch from "@modules/filter/KeywordSearch";
import ViewDrawer from "./__ViewDrawer";
import { notifications } from "@mantine/notifications";
import { useOs, useHotkeys } from "@mantine/hooks";
import CreateButton from "@components/buttons/CreateButton";
import DataTableFooter from "@components/tables/DataTableFooter";
import { MASTER_DATA_ROUTES , PHARMACY_DATA_ROUTES} from "@/constants/routes";
import tableCss from "@assets/css/Table.module.css";
import {
    deleteEntityData,
    editEntityData, storeEntityData,
} from "@/app/store/core/crudThunk";
import {
    setInsertType,
    setRefetchData,
} from "@/app/store/core/crudSlice.js";
import {
    ERROR_NOTIFICATION_COLOR,
} from "@/constants/index.js";
import { deleteNotification } from "@components/notification/deleteNotification";
import {useEffect, useState} from "react";
import useInfiniteTableScroll from "@hooks/useInfiniteTableScroll.js";
import inlineInputCss from "@assets/css/InlineInputField.module.css";
import {errorNotification} from "@components/notification/errorNotification";
import useGlobalDropdownData from "@hooks/dropdown/useGlobalDropdownData";
import {PHARMACY_DROPDOWNS} from "@/app/store/core/utilitySlice";

const PER_PAGE = 50;

export default function _Table({ module, open }) {
    const { t } = useTranslation();
    const os = useOs();
    const dispatch = useDispatch();
    const { mainAreaHeight } = useOutletContext();
    const navigate = useNavigate();
    const { id } = useParams();
    const height = mainAreaHeight - 78;
    const [submitFormData, setSubmitFormData] = useState({});
    const searchKeyword = useSelector((state) => state.crud.searchKeyword);
    const filterData = useSelector((state) => state.crud[module].filterData);
    const listData = useSelector((state) => state.crud[module].data);


    const { data: byMealDropdown } = useGlobalDropdownData({
        path: PHARMACY_DROPDOWNS.BY_MEAL.PATH,
        utility: PHARMACY_DROPDOWNS.BY_MEAL.UTILITY,
    });

    const { data: dosageDropdown } = useGlobalDropdownData({
        path: PHARMACY_DROPDOWNS.DOSAGE.PATH,
        utility: PHARMACY_DROPDOWNS.DOSAGE.UTILITY,
    });

    console.log(dosageDropdown)

    // for infinity table data scroll, call the hook
    const {
        scrollRef,
        records,
        fetching,
        sortStatus,
        setSortStatus,
        handleScrollToBottom,
    } = useInfiniteTableScroll({
        module,
        fetchUrl: PHARMACY_DATA_ROUTES.API_ROUTES.MEDICINE.INDEX,
        filterParams: {
            name: filterData?.name,
            term: searchKeyword,
        },
        perPage: PER_PAGE,
        sortByKey: "name",
    });

    const [viewDrawer, setViewDrawer] = useState(false);

    const handleEntityEdit = (id) => {
        dispatch(setInsertType({ insertType: "update", module }));
        dispatch(
            editEntityData({
                url: `${PHARMACY_DATA_ROUTES.API_ROUTES.MEDICINE.VIEW}/${id}`,
                module,
            })
        );
        navigate(`${PHARMACY_DATA_ROUTES.NAVIGATION_LINKS.MEDICINE.INDEX}/${id}`);
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
                url: `${MASTER_DATA_ROUTES.API_ROUTES.PARTICULAR.DELETE}/${id}`,
                module,
                id,
            })
        );

        if (deleteEntityData.fulfilled.match(res)) {
            dispatch(setRefetchData({ module, refetching: true }));
            deleteNotification(t("DeletedSuccessfully"), ERROR_NOTIFICATION_COLOR);
            navigate(PHARMACY_DATA_ROUTES.NAVIGATION_LINKS.MEDICINE.INDEX);
            dispatch(setInsertType({ insertType: "create", module }));
        } else {
            notifications.show({
                color: ERROR_NOTIFICATION_COLOR,
                title: t("Delete Failed"),
                icon: <IconAlertCircle style={{ width: rem(18), height: rem(18) }} />,
            });
        }
    };

    const handleDataShow = (id) => {
        dispatch(
            editEntityData({
                url: `${PHARMACY_DATA_ROUTES.NAVIGATION_LINKS.MEDICINE.VIEW}/${id}`,
                module,
            })
        );
        setViewDrawer(true);
    };

    const handleCreateForm = () => {
        open();
        dispatch(setInsertType({ insertType: "create", module }));
        navigate(PHARMACY_DATA_ROUTES.NAVIGATION_LINKS.MEDICINE.INDEX);
    };

    useEffect(() => {
        if (!records?.length) return;
        const initialFormData = records.reduce((acc, item) => {
            acc[item.id] = {
                company: item.company || "",
                product_name: item.product_name || "",
                generic: item.generic || "",
                opd_quantity: item.opd_quantity || "",
            };
            return acc;
        }, {});

        setSubmitFormData(initialFormData);
    }, [records]);

    const handleDataTypeChange = (rowId, field, value) => {
        setSubmitFormData(prev => ({
            ...prev,
            [rowId]: {
                ...prev[rowId],
                [field]: value,
            },
        }));
    };

    const handleRowSubmit = async (rowId) => {
        const formData = submitFormData[rowId];
        if (!formData) return false;

        // 🔎 find original row data
        const originalRow = records.find((r) => r.id === rowId);
        if (!originalRow) return false;

        // ✅ check if there is any change
        const isChanged = Object.keys(formData).some(
            (key) => formData[key] !== originalRow[key]
        );

        if (!isChanged) {
            // nothing changed → do not submit
            return false;
        }

        const value = {
            url: `${PHARMACY_DATA_ROUTES.API_ROUTES.MEDICINE.INLINE_UPDATE}/${rowId}`,
            data: formData,
            module,
        };
        try {
            const resultAction = await dispatch(storeEntityData(value));
        } catch (error) {
            errorNotification(error.message);
        }
    };

    useHotkeys([[os === "macos" ? "ctrl+n" : "alt+n", () => handleCreateForm()]]);

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
                    columns={[
                        {
                            accessor: "index",
                            title: t("S/N"),
                            textAlignment: "right",
                            sortable: false,
                            render: (_item, index) => index + 1,
                        },
                        {
                            accessor: "company",
                            title: t("Company"),
                            sortable: true,
                            render: (item) => (
                                <TextInput
                                    size="xs"
                                    className={inlineInputCss.inputText}
                                    placeholder={t("Name")}
                                    value={submitFormData[item.id]?.company || ""}
                                    onChange={(event) =>
                                        handleDataTypeChange(item.id, "company", event.currentTarget.value)
                                    }
                                    onBlur={() => handleRowSubmit(item.id)}
                                />
                            ),
                        },
                        {
                            accessor: "product_name",
                            title: t("MedicineName"),
                            sortable: true,
                            render: (item) => (
                                <TextInput
                                    size="xs"
                                    className={inlineInputCss.inputText}
                                    placeholder={t("product_name")}
                                    value={submitFormData[item.id]?.product_name || ""}
                                    onChange={(event) =>
                                        handleDataTypeChange(item.id, "product_name", event.currentTarget.value)
                                    }
                                    onBlur={() => handleRowSubmit(item.id)}
                                />
                            ),
                        },
                         {
                            accessor: "generic",
                            title: t("Generic"),
                            sortable: true,
                            render: (item) => (
                                <TextInput
                                    size="xs"
                                    className={inlineInputCss.inputText}
                                    placeholder={t("Name")}
                                    value={submitFormData[item.id]?.generic || ""}
                                    onChange={(event) =>
                                        handleDataTypeChange(item.id, "generic", event.currentTarget.value)
                                    }
                                    onBlur={() => handleRowSubmit(item.id)}
                                />
                            ),
                        },
                         {
                            accessor: "dose_details",
                            title: t("Dose"),
                            sortable: true,
                        },
                        {
                            accessor: "medicine_dosage_id",
                            title: t("MedicineDosage"),
                            render: (item) => (
                                <Select
                                    size="xs"
                                    className={inlineInputCss.inputText}
                                    placeholder={t("SelectDosage")}
                                    data={dosageDropdown}
                                    value={submitFormData[item.id]?.medicine_dosage_id || ""}
                                    onChange={(val) => {
                                        handleDataTypeChange(item.id, "medicine_dosage_id", val);
                                        handleRowSubmit(item.id);
                                    }}
                                />
                            ),
                        },
                        {
                            accessor: "medicine_bymeal_id",
                            title: t("MedicineDosage"),
                            render: (item) => (
                                <Select
                                    size="xs"
                                    className={inlineInputCss.inputText}
                                    placeholder={t("SelectByMeal")}
                                    data={byMealDropdown}
                                    value={submitFormData[item.id]?.medicine_bymeal_id || ""}
                                    onChange={(val) => {
                                        handleDataTypeChange(item.id, "medicine_bymeal_id", val);
                                        handleRowSubmit(item.id);
                                    }}
                                />
                            ),
                        },
                        {
                            accessor: "opd_quantity",
                            title: t("OPDQuantitiy"),
                            sortable: true,
                            render: (item) => (
                                <TextInput
                                    size="xs"
                                    className={inlineInputCss.inputText}
                                    placeholder={t("opd_quantity")}
                                    value={submitFormData[item.id]?.opd_quantity || ""}
                                    onChange={(event) =>
                                        handleDataTypeChange(item.id, "opd_quantity", event.currentTarget.value)
                                    }
                                    onBlur={() => handleRowSubmit(item.id)}
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
                                        <ActionIcon
                                            size="sm"
                                            variant="outline"
                                            radius="xs"
                                            onClick={() => handleDelete(values.id)}
                                            color="var(--theme-delete-color)"
                                            fw={400}
                                            aria-label="Settings"
                                        >
                                            <IconTrashX stroke={1} />
                                        </ActionIcon>
                                    </Button.Group>
                                </Group>
                            ),
                        },
                    ]}
                    textSelectionDisabled
                    fetching={fetching}
                    loaderSize="xs"
                    loaderColor="grape"
                    height={height - 72}
                    onScrollToBottom={handleScrollToBottom}
                    scrollViewportRef={scrollRef}
                    sortStatus={sortStatus}
                    onSortStatusChange={setSortStatus}
                    sortIcons={{
                        sorted: (
                            <IconChevronUp
                                color="var(--theme-tertiary-color-7)"
                                size={14}
                            />
                        ),
                        unsorted: (
                            <IconSelector color="var(--theme-tertiary-color-7)" size={14} />
                        ),
                    }}
                />
            </Box>

            <DataTableFooter indexData={listData} module={module} />
            <ViewDrawer viewDrawer={viewDrawer} setViewDrawer={setViewDrawer} module={module} />
        </>
    );
}

