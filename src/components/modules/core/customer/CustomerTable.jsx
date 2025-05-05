import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
    Group,
    Box,
    ActionIcon, Text, Menu, rem,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconTrashX, IconDotsVertical, IconCheck, IconAlertCircle } from "@tabler/icons-react";
import { DataTable } from 'mantine-datatable';
import { useDispatch, useSelector } from "react-redux";
import {
    editEntityData,
    getIndexEntityData,
    setDeleteMessage,
    setFormLoading,
    setInsertType,
} from "../../../../store/core/crudSlice.js";
import KeywordSearch from "../../filter/KeywordSearch";
import { modals } from "@mantine/modals";
import { deleteEntityData } from "../../../../store/core/crudSlice";
import tableCss from "../../../../assets/css/Table.module.css";
import CustomerViewDrawer from "./CustomerViewDrawer.jsx";
import { notifications } from "@mantine/notifications";
import _AddProvisionDrawer from "./_AddProvisionDrawer.jsx";

function CustomerTable() {

    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 98; //TabList height 104
    const coreCustomers = JSON.parse(localStorage.getItem('core-customers') || '[]');

    const perPage = 20;
    const [page, setPage] = useState(1);

    const [fetching,setFetching] = useState(true)
    const searchKeyword = useSelector((state) => state.crudSlice.searchKeyword)
    const fetchingReload = useSelector((state) => state.crudSlice.fetching)
    const customerFilterData = useSelector((state) => state.crudSlice.customerFilterData)
    const [customerObject, setCustomerObject] = useState({});
    const [viewDrawer, setViewDrawer] = useState(false)
    const [provisionDrawer, setProvisionDrawer] = useState(false)

    const navigate = useNavigate();
    const entityDataDelete = useSelector((state) => state.crudSlice.entityDataDelete)

    useEffect(() => {
        dispatch(setDeleteMessage(''))
        if (entityDataDelete?.message === 'delete') {
            notifications.show({
                color: 'red',
                title: t('DeleteSuccessfully'),
                icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                loading: false,
                autoClose: 700,
                style: { backgroundColor: 'lightgray' },
            });

            setTimeout(() => {
                setFetching(true)
            }, 700)
        }
    }, [entityDataDelete]);

    const [indexData,setIndexData] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            setFetching(true)
            const value = {
                url: 'core/customer',
                param: {
                    term: searchKeyword,
                    name: customerFilterData.name,
                    mobile: customerFilterData.mobile,
                    page: page,
                    offset: perPage
                },
            };

            try {
                const resultAction = await dispatch(getIndexEntityData(value));

                if (getIndexEntityData.rejected.match(resultAction)) {
                    console.error('Error:', resultAction);
                } else if (getIndexEntityData.fulfilled.match(resultAction)) {
                    setIndexData(resultAction.payload);
                    setFetching(false)
                }
            } catch (err) {
                console.error('Unexpected error:', err);
            }
        };

        fetchData();
    }, [dispatch, searchKeyword, customerFilterData, page,fetchingReload]);
    // console.log(indexData)
    return (
        <>

            <Box pl={`xs`} pr={8} pt={'6'} pb={'4'} className={'boxBackground borderRadiusAll border-bottom-none'} >
                <KeywordSearch module={'customer'} />
            </Box>
            <Box className={'borderRadiusAll border-top-none'}>
                <DataTable
                    classNames={{
                        root: tableCss.root,
                        table: tableCss.table,
                        header: tableCss.header,
                        footer: tableCss.footer,
                        pagination: tableCss.pagination,
                    }}
                    records={indexData.data}
                    columns={[
                        {
                            accessor: 'index',
                            title: t('S/N'),
                            textAlignment: 'right',
                            render: (item) => (indexData.data.indexOf(item) + 1)
                        },
                        { accessor: 'id', title: t("ID"), width: 100 },
                        { accessor: 'name', title: t("Name"), width: 200 },
                        { accessor: 'mobile', title: t("Mobile"), width: 200 },
                        { accessor: 'customer_group', title: t("CustomerGroup") },
                        { accessor: 'credit_limit', title: t("CreditLimit") },
                        { accessor: 'discount_percent', title: t("Discount")+" %"},
                        {
                            accessor: "action",
                            title: t("Action"),
                            textAlign: "right",
                            render: (data) => (
                                <Group gap={4} justify="right" wrap="nowrap">
                                    <Menu position="bottom-end" offset={3} withArrow trigger="hover" openDelay={100} closeDelay={400}>
                                        <Menu.Target>
                                            <ActionIcon size="sm" variant="outline" color="red" radius="xl" aria-label="Settings">
                                                <IconDotsVertical height={'16'} width={'16'} stroke={1.5} />
                                            </ActionIcon>
                                        </Menu.Target>
                                        <Menu.Dropdown>
                                            <Menu.Item
                                                onClick={() => {
                                                    setProvisionDrawer(true)
                                                }}
                                                target="_blank"
                                                component="a"
                                                w={'200'}
                                            >
                                                {t('AddProvision')}
                                            </Menu.Item><Menu.Item
                                                onClick={() => {
                                                    dispatch(setInsertType('update'))
                                                    dispatch(editEntityData('core/customer/' + data.id))
                                                    dispatch(setFormLoading(true))
                                                    navigate(`/core/customer/${data.id}`);
                                                }}
                                                target="_blank"
                                                component="a"
                                                w={'200'}
                                            >
                                                {t('Edit')}
                                            </Menu.Item>
                                            <Menu.Item
                                                onClick={() => {
                                                    const foundCustomers = coreCustomers.find(type => type.id == data.id);
                                                    if (foundCustomers) {
                                                        setCustomerObject(foundCustomers);
                                                        // console.log(foundCustomers)
                                                        setViewDrawer(true)
                                                    } else {
                                                        notifications.show({
                                                            color: 'red',
                                                            title: t('Something Went wrong , please try again'),
                                                            icon: <IconAlertCircle style={{ width: rem(18), height: rem(18) }} />,
                                                            loading: false,
                                                            autoClose: 900,
                                                            style: { backgroundColor: 'lightgray' },
                                                        });
                                                    }
                                                    // 
                                                }}
                                                target="_blank"
                                                component="a"
                                                w={'200'}
                                            >
                                                {t('Show')}
                                            </Menu.Item>
                                            <Menu.Item
                                                target="_blank"
                                                component="a"
                                                w={'200'}
                                                mt={'2'}
                                                bg={'red.1'}
                                                c={'red.6'}
                                                onClick={() => {
                                                    modals.openConfirmModal({
                                                        title: (
                                                            <Text size="md"> {t("FormConfirmationTitle")}</Text>
                                                        ),
                                                        children: (
                                                            <Text size="sm"> {t("FormConfirmationMessage")}</Text>
                                                        ),
                                                        confirmProps: { color: 'red.6' },
                                                        labels: { confirm: 'Confirm', cancel: 'Cancel' },
                                                        onCancel: () => console.log('Cancel'),
                                                        onConfirm: () => {
                                                            dispatch(deleteEntityData('core/customer/' + data.id))
                                                        },
                                                    });
                                                }}
                                                rightSection={<IconTrashX style={{ width: rem(14), height: rem(14) }} />}
                                            >
                                                {t('Delete')}
                                            </Menu.Item>
                                        </Menu.Dropdown>
                                    </Menu>

                                </Group>
                            ),
                        },
                    ]
                    }
                    fetching={fetching}
                    totalRecords={indexData.total}
                    recordsPerPage={perPage}
                    page={page}
                    onPageChange={(p) => {
                        setPage(p)
                        setFetching(true)
                    }}
                    loaderSize="xs"
                    loaderColor="grape"
                    height={height}
                    scrollAreaProps={{ type: 'never' }}
                />
            </Box>
            {
                viewDrawer &&
                <CustomerViewDrawer viewDrawer={viewDrawer} setViewDrawer={setViewDrawer} customerObject={customerObject} />
            }
            {
                provisionDrawer &&
                <_AddProvisionDrawer provisionDrawer={provisionDrawer} setProvisionDrawer={setProvisionDrawer} saveId={'EntityProvisionSubmit'} />
            }
        </>
    );
}

export default CustomerTable;