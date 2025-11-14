import {
    Box,
    Flex,
    Button,
    Stack,
    Checkbox,
    Center, rem,
} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {IconCheck, IconDeviceFloppy} from "@tabler/icons-react";
import {DataTable} from "mantine-datatable";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useOutletContext} from "react-router-dom";
import {useEffect, useState, useMemo} from "react";
import {useOs, useHotkeys} from "@mantine/hooks";
import {notifications} from "@mantine/notifications";

import KeywordSearch from "@modules/filter/KeywordSearch";
import useInfiniteTableScroll from "@hooks/useInfiniteTableScroll.js";
import useGlobalDropdownData from "@hooks/dropdown/useGlobalDropdownData";
import {errorNotification} from "@components/notification/errorNotification";

import {MASTER_DATA_ROUTES} from "@/constants/routes";
import {storeEntityData} from "@/app/store/core/crudThunk";
import {setInsertType} from "@/app/store/core/crudSlice.js";
import {CORE_DROPDOWNS} from "@/app/store/core/utilitySlice";
import tableCss from "@assets/css/TableAdmin.module.css";
import {SUCCESS_NOTIFICATION_COLOR} from "@/constants/index.js";

const PER_PAGE = 50;

export default function _Table({module, open}) {
    const {t} = useTranslation();
    const os = useOs();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {mainAreaHeight} = useOutletContext();

    const height = mainAreaHeight - 108;
    const searchKeyword = useSelector((state) => state.crud.searchKeyword);
    const filterData = useSelector((state) => state.crud[module].filterData);

    const [submitFormData, setSubmitFormData] = useState({});
    const [loadingIds, setLoadingIds] = useState([]);

    // Infinite scroll hook for users
    const {records, fetching} = useInfiniteTableScroll({
        module,
        fetchUrl: MASTER_DATA_ROUTES.API_ROUTES.STORE_USER.INDEX,
        filterParams: {
            name: filterData?.name,
            term: searchKeyword,
        },
        perPage: PER_PAGE,
        sortByKey: "name",
    });

    // Dropdown for warehouses
    const {data: warehouseDropdown} = useGlobalDropdownData({
        path: CORE_DROPDOWNS.WAREHOUSE.PATH,
        utility: CORE_DROPDOWNS.WAREHOUSE.UTILITY,
    });

    // Initialize form data from fetched records
    useEffect(() => {
        if (!records?.length) return;

        const initialData = records.reduce((acc, item) => {
            const warehouseIds = Array.from(
                new Set((item.warehouses || []).map((p) => p.warehouse_id))
            );
            acc[item.user_id] = {warehouses: warehouseIds};
            return acc;
        }, {});
        setSubmitFormData(initialData);
    }, [records]);

    // Handle create new user
    const handleCreateForm = () => {
        open();
        dispatch(setInsertType({insertType: "create", module}));
        navigate(MASTER_DATA_ROUTES.NAVIGATION_LINKS.STORE_USER.INDEX);
    };

    // Handle row save
    const handleRowSubmit = async (rowId) => {
        const formData = submitFormData[rowId];
        if (!formData) return;

        const originalRow = records.find((r) => r.user_id === rowId);
        if (!originalRow) return;

        // Compare warehouses deeply
        const oldWarehouses = (originalRow.warehouses || []).map(
            (w) => w.warehouse_id
        );
        const newWarehouses = formData.warehouses || [];

        const isChanged =
            JSON.stringify(oldWarehouses.sort()) !==
            JSON.stringify(newWarehouses.sort());

        if (!isChanged) return;

        const payload = {
            url: `${MASTER_DATA_ROUTES.API_ROUTES.STORE_USER.INLINE_UPDATE}/${rowId}`,
            data: {store_id: newWarehouses},
            module,
        };

        setLoadingIds((prev) => [...prev, rowId]);

        try {
            await dispatch(storeEntityData(payload)).unwrap();
            notifications.show({
                color: SUCCESS_NOTIFICATION_COLOR,
                title: "Warehouse updated successfully",
                icon: <IconCheck style={{width: rem(18), height: rem(18)}}/>,
                autoClose: 800,
            });
        } catch (error) {
            errorNotification(error.message || t("Something went wrong"));
        } finally {
            setLoadingIds((prev) => prev.filter((id) => id !== rowId));
        }
    };

    // Keyboard shortcut for new record
    useHotkeys([[os === "macos" ? "ctrl+n" : "alt+n", handleCreateForm]]);

    // Render warehouse checkboxes
    const renderWarehouses = (item) => (
        <Stack>
            {warehouseDropdown.map((mode) => (
                <Checkbox
                    key={mode.value}
                    label={`${mode.label}`}
                    size="xs"
                    disabled={mode.label === 'Central'}
                    checked={
                        submitFormData[item.user_id]?.warehouses?.includes(
                            Number(mode.value)
                        ) || false
                    }
                    onChange={(e) => {
                        const checked = e.currentTarget.checked;
                        setSubmitFormData((prev) => {
                            const prevModes = prev[item.user_id]?.warehouses || [];
                            return {
                                ...prev,
                                [item.user_id]: {
                                    ...prev[item.user_id],
                                    warehouses: checked
                                        ? [...prevModes, Number(mode.value)]
                                        : prevModes.filter((m) => m !== Number(mode.value)),
                                },
                            };
                        });
                    }}
                />
            ))}
        </Stack>
    );

    // Memoized table columns for performance
    const columns = useMemo(
        () => [
            {
                accessor: "index",
                title: t("S/N"),
                textAlignment: "right",
                render: (item) => records?.indexOf(item) + 1,
            },
            {
                accessor: "name",
                title: t("Name"),
            },
            {
                accessor: "username",
                title: t("UserName"),
            },
            {
                accessor: "warehouses",
                title: t("Warehouse"),
                width: "220px",
                render: renderWarehouses,
            },
            {
                accessor: "action",
                title: "",
                render: (item) => (
                    <Center>
                        <Button
                            onClick={() => handleRowSubmit(item.user_id)}
                            loading={loadingIds.includes(item.user_id)}
                            disabled={loadingIds.includes(item.user_id)}
                            variant="filled"
                            fw={400}
                            size="compact-xs"
                            radius="es"
                            className="btnPrimaryBg"
                            leftSection={<IconDeviceFloppy size={16}/>}
                        >
                            {t("Save")}
                        </Button>
                    </Center>
                ),
            },
        ],
        [records, submitFormData, loadingIds, warehouseDropdown]
    );

    return (
        <>
            <Box
                p="xs"
                className="boxBackground borderRadiusAll border-bottom-none "
            >
                <Flex align="center" justify="space-between" gap={4}>
                    <KeywordSearch module={module}/>
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
                    }}
                    records={records}
                    columns={columns}
                    fetching={fetching}
                    loaderSize="xs"
                    loaderColor="grape"
                    height={height}
                />
            </Box>
        </>
    );
}
