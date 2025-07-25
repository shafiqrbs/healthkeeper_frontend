import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {Grid, Box } from "@mantine/core";
import { useTranslation } from 'react-i18next';

import { useHotkeys } from "@mantine/hooks";
import {useDispatch, useSelector} from "react-redux";
import { useForm } from "@mantine/form";
import { DataTable } from "mantine-datatable";
import ShortcutInvoice from "../../shortcut/ShortcutInvoice";
import tableCss from "../../../../assets/css/Table.module.css";
import _OpeningSearch from "./_OpeningSearch";
import {getIndexEntityData} from "../../../../store/inventory/crudSlice";
import Navigation from "../common/Navigation";

function _OpeningApproveTable(props) {
    const { t, i18n } = useTranslation();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 130; //TabList height 104
    const [fetching, setFetching] = useState(true);
    const dispatch = useDispatch();

    const perPage = 15;
    const [page, setPage] = useState(1);
    const purchaseItemsFilterData = useSelector((state) => state.inventoryCrudSlice.purchaseItemsFilterData)
    const invFetching = useSelector((state) => state.inventoryCrudSlice.fetching)


    const [indexData,setIndexData] = useState([])

    useEffect(() => {
        let isMounted = true; // To handle cleanup properly in `useEffect`

        const fetchData = async () => {
            const options = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            };

            const value = {
                url: 'inventory/opening-stock',
                param: {
                    page: page,
                    offset: perPage,
                    mode:"opening",
                    is_approved:1,
                    term:purchaseItemsFilterData.searchKeyword,
                    start_date: purchaseItemsFilterData.start_date && new Date(purchaseItemsFilterData.start_date).toLocaleDateString("en-CA", options),
                    end_date: purchaseItemsFilterData.end_date && new Date(purchaseItemsFilterData.end_date).toLocaleDateString("en-CA", options)
                }
            }

            try {
                const resultAction = await dispatch(getIndexEntityData(value));

                if (getIndexEntityData.rejected.match(resultAction)) {
                    console.error('Error:', resultAction);
                } else if (getIndexEntityData.fulfilled.match(resultAction)) {
                    if (isMounted) {
                        setIndexData(resultAction.payload);
                    }
                }
            } catch (err) {
                console.error('Unexpected error:', err);
            } finally {
                if (isMounted) setFetching(false);
            }
        };

        fetchData();

        return () => {
            isMounted = false; // Cleanup the effect to prevent state updates on unmounted component
        };
    }, [fetching,invFetching,dispatch,page]);

    const form = useForm({
        initialValues: {
            test: ''
        },

    });

    useHotkeys([['alt+n', () => {
        document.getElementById('product_id').focus()
    }]], []);

    useHotkeys([['alt+r', () => {
        form.reset()
    }]], []);

    useHotkeys([['alt+s', () => {
        document.getElementById('EntityFormSubmit').click()
    }]], []);

    return (
        <>
            <Box>
                <Grid columns={24} gutter={{ base: 8 }}>
                    <Grid.Col span={1} >
                        <Navigation module = {"opening-approve-stock"} />
                    </Grid.Col>
                    <Grid.Col span={22} >
                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                            <Box>
                                <Box pl={`xs`} pr={8} pt={'xs'} mb={'xs'} className={'boxBackground borderRadiusAll'}>
                                    <Box pb={'xs'}>
                                       <_OpeningSearch tableDataLoading={setFetching}/>
                                    </Box>
                                </Box>
                            </Box>
                            <Box className={'borderRadiusAll'}>
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
                                        {
                                            accessor: 'created',
                                            title: t("CreatedDate"),
                                        },
                                        {
                                            accessor: 'product_name',
                                            title: t("Name"),
                                            width: '25%',
                                        },
                                        {
                                            accessor: 'unit_name',
                                            title: t('UOM'),
                                            width: '10%',
                                            textAlign: "center"
                                        },
                                        {
                                            accessor: 'opening_quantity',
                                            title: t('Quantity'),
                                            width: '10%',
                                            textAlign: "right",
                                        },

                                        {
                                            accessor: 'purchase_price',
                                            title: t('PurchasePrice'),
                                            width: '10%',
                                            textAlign: "right",
                                            render: (item) => {
                                                return (
                                                    item.purchase_price && Number(item.purchase_price).toFixed(2)
                                                );
                                            },
                                        },
                                        {
                                            accessor: 'sales_price',
                                            title: t('SalesPrice'),
                                            width: '10%',
                                            textAlign: "right",
                                            render: (item) => {
                                                return (
                                                    item.sales_price && Number(item.sales_price).toFixed(2)
                                                );
                                            },
                                        },

                                        {
                                            accessor: 'sub_total',
                                            title: t('SubTotal'),
                                            width: '15%',
                                            textAlign: "right",
                                            render: (item) => {
                                                return (
                                                    item.sub_total && Number(item.sub_total).toFixed(2)
                                                );
                                            },

                                        },
                                    ]
                                    }
                                    fetching={fetching || invFetching}
                                    totalRecords={indexData.total}
                                    recordsPerPage={perPage}
                                    page={page}
                                    onPageChange={(p) => {
                                        setPage(p)
                                        setFetching(true)
                                    }}
                                    loaderSize="xs"
                                    loaderColor="grape"
                                    height={height + 10}
                                    scrollAreaProps={{ type: 'never' }}
                                />
                            </Box>
                        </Box>
                    </Grid.Col>

                    <Grid.Col span={1} >
                        <Box bg={'white'} className={'borderRadiusAll'} pt={'16'}>
                            <ShortcutInvoice
                                form={form}
                                FormSubmit={'EntityFormSubmit'}
                                Name={'CompanyName'}
                            />
                        </Box>
                    </Grid.Col>
                </Grid>
            </Box>
        </>

    );
}

export default _OpeningApproveTable;
