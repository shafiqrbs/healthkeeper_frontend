import {Group, Box, ActionIcon, Text, rem, Flex, Button, NumberInput, TextInput, Checkbox} from "@mantine/core";
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
import { MASTER_DATA_ROUTES } from "@/constants/routes";
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
import React, {useEffect, useState} from "react";
import useInfiniteTableScroll from "@hooks/useInfiniteTableScroll.js";
import inlineInputCss from "@assets/css/InlineInputField.module.css";
import {useForm} from "@mantine/form";
import {errorNotification} from "@components/notification/errorNotification";

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
    const [updatingRows, setUpdatingRows] = useState({});
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
        fetchUrl: MASTER_DATA_ROUTES.API_ROUTES.PARTICULAR.INDEX,
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
                url: `${MASTER_DATA_ROUTES.API_ROUTES.PARTICULAR.VIEW}/${id}`,
                module,
            })
        );
        navigate(`${MASTER_DATA_ROUTES.NAVIGATION_LINKS.PARTICULAR.INDEX}/${id}`);
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
            navigate(MASTER_DATA_ROUTES.NAVIGATION_LINKS.PARTICULAR);
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
                url: `${MASTER_DATA_ROUTES.API_ROUTES.PARTICULAR.VIEW}/${id}`,
                module,
            })
        );
        setViewDrawer(true);
    };

    const handleCreateForm = () => {
        open();
        dispatch(setInsertType({ insertType: "create", module }));
        navigate(MASTER_DATA_ROUTES.NAVIGATION_LINKS.PARTICULAR.INDEX);
    };

    const form = useForm({
        initialValues: {
            name: "",
        }
    });

    useEffect(() => {
        if (!records?.length) return;

        const initialFormData = records.reduce((acc, item) => {

            acc[item.id] = {
                name: item.name || "",
                status: item?.status ?? false,
                ordering: item?.ordering ?? 1,
            };
            return acc;
        }, {});

        setSubmitFormData(initialFormData);
    }, [records]);

    const handleFieldChange = async (rowId, field, value) => {
        setSubmitFormData((prev) => ({
            ...prev,
            [rowId]: { ...prev[rowId], [field]: value },
        }));

        setUpdatingRows((prev) => ({ ...prev, [rowId]: true }));

        try {
            await dispatch(
                storeEntityData({
                    url: `${MASTER_DATA_ROUTES.API_ROUTES.PARTICULAR.INLINE_UPDATE}/${rowId}`,
                    data: { [field]: value },
                    module,
                })
            );
        } catch (error) {
            errorNotification(error.message);
        } finally {
            setUpdatingRows((prev) => ({ ...prev, [rowId]: false }));
        }
    };

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
            url: `${MASTER_DATA_ROUTES.API_ROUTES.PARTICULAR.INLINE_UPDATE}/${rowId}`,
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
                            accessor: "particular_type_name",
                            title: t("ParticularType"),
                            textAlignment: "right",
                            sortable: true,
                            render: (item) => item.particular_type_name,
                        },
                        {
                            accessor: "name",
                            title: t("Name"),
                            sortable: true,
                            render: (item) => (
                                <TextInput
                                    size="xs"
                                    className={inlineInputCss.inputText}
                                    placeholder={t("Name")}
                                    value={submitFormData[item.id]?.name || ""}
                                    onChange={(event) =>
                                        handleDataTypeChange(item.id, "name", event.currentTarget.value)
                                    }
                                    onBlur={() => handleRowSubmit(item.id)}
                                />
                            ),
                        },
                        {
                            accessor: "category",
                            title: t("Category"),
                            sortable: false,
                            render: (values) => values.category || "N/A",
                        },
                        {
                            accessor: "ordering",
                            title: t("Ordering"),
                            sortable: true,
                            render: (item) => (
                                <TextInput
                                    size="xs"
                                    className={inlineInputCss.inputText}
                                    placeholder={t("ordering")}
                                    value={submitFormData[item.id]?.ordering || ""}
                                    onChange={(event) =>
                                        handleDataTypeChange(item.id, "ordering", event.currentTarget.value)
                                    }
                                    onBlur={() => handleRowSubmit(item.id)}
                                />
                            ),
                        },
                        {
                            accessor: "status",
                            title: t("Status"),
                            render: (item) => (
                                <Checkbox
                                    key={item.id}
                                    size="sm"
                                    checked={submitFormData[item.id]?.status ?? false}
                                    onChange={(val) =>
                                        handleFieldChange(
                                            item.id,
                                            "status",
                                            val.currentTarget.checked
                                        )
                                    }
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
                                            radius="es"
                                            leftSection={<IconEdit size={12} />}
                                            className="border-right-radius-none btnPrimaryBg"
                                        >
                                            {t("Edit")}
                                        </Button>
                                        <Button
                                            onClick={() => handleDataShow(values.id)}
                                            variant="filled"
                                            c="white"
                                            bg="var(--theme-primary-color-6)"
                                            size="compact-xs"
                                            radius="es"
                                            fw={400}
                                            leftSection={<IconEye size={12} />}
                                            className="border-left-radius-none"
                                        >
                                            {t("View")}
                                        </Button>
                                        <ActionIcon
                                            size="xs"
                                            onClick={() => handleDelete(values.id)}
                                            variant="light"
                                            color="var(--theme-delete-color)"
                                            radius="es"
                                            aria-label="Settings"
                                        >
                                            <IconTrashX stroke={1.5} />
                                        </ActionIcon>
                                    </Button.Group>
                                </Group>
                            ),
                        },
                    ]}
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

