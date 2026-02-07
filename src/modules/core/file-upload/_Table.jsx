import {
    Group,
    Box,
    ActionIcon,
    Text,
    Flex,
    Button,
    Chip,
    LoadingOverlay,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import {
    IconTrashX,
    IconAlertCircle,
    IconEye,
    IconChevronUp,
    IconSelector,
    IconCheck,
} from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useOs, useHotkeys } from "@mantine/hooks";
import { useCallback, useState } from "react";
import axios from "axios";

import KeywordSearch from "@modules/filter/KeywordSearch";
import CreateButton from "@components/buttons/CreateButton";
import DataTableFooter from "@components/tables/DataTableFooter";
import ViewDrawer from "./__ViewDrawer";

import { MASTER_DATA_ROUTES } from "@/constants/routes";
import { ERROR_NOTIFICATION_COLOR } from "@/constants";
import tableCss from "@assets/css/TableAdmin.module.css";

import { deleteEntityData } from "@/app/store/core/crudThunk";
import { setInsertType, setRefetchData } from "@/app/store/core/crudSlice";
import { deleteNotification } from "@components/notification/deleteNotification";

import useInfiniteTableScroll from "@hooks/useInfiniteTableScroll";
import { API_GATEWAY_URL } from "@/config";
import { useAuthStore } from "@/store/useAuthStore";
import useMainAreaHeight from "@hooks/useMainAreaHeight";

const PER_PAGE = 50;

export default function _Table({ module, open }) {
    const { t } = useTranslation();
    const os = useOs();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { mainAreaHeight } = useMainAreaHeight();

    const height = mainAreaHeight - 78;

    const searchKeyword = useSelector((state) => state.crud.searchKeyword);
    const filterData = useSelector((state) => state.crud[ module ]?.filterData);
    const listData = useSelector((state) => state.crud[ module ]?.data);

    const { token, user } = useAuthStore.getState();

    const {
        scrollRef,
        records,
        fetching,
        sortStatus,
        setSortStatus,
        handleScrollToBottom,
        refetchAll,
    } = useInfiniteTableScroll({
        module,
        fetchUrl: MASTER_DATA_ROUTES.API_ROUTES.MANAGE_FILE.INDEX,
        filterParams: {
            name: filterData?.name,
            term: searchKeyword,
        },
        perPage: PER_PAGE,
        sortByKey: "name",
    });

    const [ viewDrawer, setViewDrawer ] = useState(false);
    const [ loading, setLoading ] = useState(false);

    /* ---------------- CREATE ---------------- */

    const handleCreateForm = useCallback(() => {
        open();
        dispatch(setInsertType({ insertType: "create", module }));
    }, [ open, dispatch, module ]);

    useHotkeys([ [ os === "macos" ? "ctrl+n" : "alt+n", handleCreateForm ] ]);

    /* ---------------- DELETE ---------------- */

    const handleDelete = (id) => {
        modals.openConfirmModal({
            title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
            children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
            labels: { confirm: "Confirm", cancel: "Cancel" },
            confirmProps: { color: "var(--theme-delete-color)" },
            onConfirm: () => handleDeleteConfirm(id),
        });
    };

    const handleDeleteConfirm = async (id) => {
        const res = await dispatch(
            deleteEntityData({
                url: `${MASTER_DATA_ROUTES.API_ROUTES.MANAGE_FILE.DELETE}/${id}`,
                module,
                id,
            })
        );

        if (deleteEntityData.fulfilled.match(res)) {
            dispatch(setRefetchData({ module, refetching: true }));
            deleteNotification(t("DeletedSuccessfully"), ERROR_NOTIFICATION_COLOR);
            navigate(MASTER_DATA_ROUTES.NAVIGATION_LINKS.MANAGE_FILE);
            dispatch(setInsertType({ insertType: "create", module }));
        } else {
            notifications.show({
                color: ERROR_NOTIFICATION_COLOR,
                title: t("Delete Failed"),
                icon: <IconAlertCircle size={18} />,
            });
        }
    };

    /* ---------------- PROCESS FILE ---------------- */

    const processUploadFile = (id) => {
        modals.openConfirmModal({
            title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
            children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
            labels: { confirm: "Confirm", cancel: "Cancel" },
            confirmProps: { color: "var(--theme-primary-color-6)" },
            onConfirm: () => handleProcessConfirm(id),
        });
    };

    const handleProcessConfirm = async (id) => {
        setLoading(true);

        try {
            const res = await axios.get(
                `${API_GATEWAY_URL}/core/file-upload/process`,
                {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                        "X-Api-Key": import.meta.env.VITE_API_KEY,
                        "X-Api-User": user?.id,
                    },
                    params: {
                        file_id: id,
                    },
                }
            );

            if (res.data?.status === 200) {
                refetchAll();

                notifications.show({
                    color: "teal",
                    title: `Processed ${res.data.row} rows successfully`,
                    icon: <IconCheck size={18} />,
                    autoClose: 2000,
                });
            }
        } catch (error) {
            refetchAll();

            notifications.show({
                color: "red",
                title: error?.response?.data?.message || "Processing failed",
                icon: <IconAlertCircle size={18} />,
            });
        } finally {
            setLoading(false);
        }
    };

    /* ---------------- RENDER ---------------- */

    return (
        <>
            <LoadingOverlay visible={loading} zIndex={1000} blur={2} />

            <Box p="xs" className="boxBackground borderRadiusAll border-bottom-none">
                <Flex align="center" justify="space-between" gap={4}>
                    <KeywordSearch module={module} />
                    <CreateButton handleModal={handleCreateForm} text="AddNew" />
                </Flex>
            </Box>

            <Box className="borderRadiusAll border-top-none">
                <DataTable
                    classNames={tableCss}
                    records={records}
                    fetching={fetching}
                    height={height - 72}
                    scrollViewportRef={scrollRef}
                    onScrollToBottom={handleScrollToBottom}
                    sortStatus={sortStatus}
                    onSortStatusChange={setSortStatus}
                    loaderSize="xs"
                    loaderColor="grape"
                    sortIcons={{
                        sorted: <IconChevronUp size={14} />,
                        unsorted: <IconSelector size={14} />,
                    }}
                    columns={[
                        {
                            accessor: "index",
                            title: t("S/N"),
                            textAlign: "right",
                            render: (_, index) => index + 1,
                        },
                        { accessor: "file_type", title: t("FileType") },
                        { accessor: "original_name", title: t("FileName") },
                        { accessor: "created", title: t("Created") },
                        {
                            accessor: "is_process",
                            title: t("Status"),
                            render: (item) => (
                                <Chip
                                    checked
                                    color={item.is_process ? "green" : "red"}
                                    variant="light"
                                >
                                    {item.is_process ? "Completed" : "Created"}
                                </Chip>
                            ),
                        },
                        {
                            accessor: "process_row",
                            title: t("TotalItem"),
                            textAlign: "center",
                            render: (item) =>
                                item.process_row > 0 && (
                                    <Button variant="subtle" radius="xl">
                                        {item.process_row}
                                    </Button>
                                ),
                        },
                        {
                            title: "",
                            textAlign: "right",
                            render: (row) =>
                                !row.is_process && (
                                    <Group gap={4} justify="right">
                                        <Button
                                            size="compact-xs"
                                            leftSection={<IconEye size={12} />}
                                            onClick={() => processUploadFile(row.id)}
                                        >
                                            {t("FileProcess")}
                                        </Button>

                                        <ActionIcon
                                            size="xs"
                                            color="red"
                                            onClick={() => handleDelete(row.id)}
                                        >
                                            <IconTrashX size={14} />
                                        </ActionIcon>
                                    </Group>
                                ),
                        },
                    ]}
                />
            </Box>

            <DataTableFooter indexData={listData} module={module} />
            <ViewDrawer
                viewDrawer={viewDrawer}
                setViewDrawer={setViewDrawer}
                module={module}
            />
        </>
    );
}
