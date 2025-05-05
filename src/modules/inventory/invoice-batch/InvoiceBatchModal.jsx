import {
    Modal, Button, Flex, Box, Grid, useMantineTheme, Text,
    Title, Tooltip, Group, ActionIcon, Stack
} from '@mantine/core';

import { useTranslation } from 'react-i18next';
import React, { useEffect, } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    IconEyeEdit, IconMessage, IconTallymark1
} from '@tabler/icons-react';
import { useState } from 'react';
import { getShowEntityData } from "../../../../store/inventory/crudSlice.js";
import InvoiceBatchModalTable from './InvoiceBatchModalTable.jsx';
import InvoiceBatchModalTransaction from './InvoiceBatchModalTransaction.jsx';
import InvoiceBatchModalInvoice from './InvoiceBatchModalInvoice.jsx';
import _AddTransaction from "./drawer/_AddTransaction";
import { notifications } from "@mantine/notifications";

function InvoiceBatchModal(props) {
    const theme = useMantineTheme();
    const closeModel = () => {
        props.setBatchViewModal(false)
        props?.setAddTransactionDrawer(false)
    }

    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 130; //TabList height 104

    const [isShowSMSPackageModel, setIsShowSMSPackageModel] = useState(false)
    const [addTransactionDrawer, setAddTransactionDrawer] = useState(false);

    const showEntityData = useSelector((state) => state.inventoryCrudSlice.showEntityData);

    useEffect(() => {
        dispatch(getShowEntityData('inventory/invoice-batch/' + props.invoiceId))
    }, []);


    return (
        <>
            <Modal.Root bg={'black'} opened={props.batchViewModal} onClose={closeModel}
                styles={{
                    body: {
                        backgroundColor: '#f0f1f9',
                        padding: 2,
                    },
                }}
                fullScreen overlayProps={{
                    color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.dark[8],
                    opacity: 0.9,
                    blur: 3,
                }}>
                <Modal.Overlay />
                <Modal.Content>
                    <Modal.Header  >
                        <Modal.Title>{t('InvoiceBatchInformation')}</Modal.Title>
                        <Modal.CloseButton />
                    </Modal.Header>
                    <Modal.Body>
                        <Box h={height + 120} bg={''}>
                            <Box >
                                <Box bg={'#f0f1f9'} className={''} >
                                    <Box pl={'8'} pr={'8'} pb={'xs'} pt={'8'}>
                                        <Grid columns={24} gutter={{ base: 8 }} >
                                            <Grid.Col span={7} >
                                                <Box h={110} bg={'white'} pl={`xs`} pr={8} pt={'xs'} className={' borderRadiusAll'} >
                                                    <Flex spacing={0} direction={'column'} >
                                                        <Text fw={900} pl={'6'} fz={'md'}>{t('CustomerDetails')}</Text>
                                                        <Stack
                                                            h={60}
                                                            bg="var(--mantine-color-body)"
                                                            align="stretch"
                                                            justify="center"
                                                            gap="2"
                                                            mt={4}
                                                        >
                                                            <Grid gutter={{ base: 0 }} pl={6}>
                                                                <Grid.Col span={2}>
                                                                    <Text fz="xs" fw={600} >{t('Name')}</Text>
                                                                </Grid.Col>
                                                                <Grid.Col span={1}>
                                                                    <Text fz={'xs'} fw={700}>:</Text>
                                                                </Grid.Col>
                                                                <Grid.Col span={9}>
                                                                    <Text fz="xs" fw={300} >{showEntityData?.customer_name}</Text>
                                                                </Grid.Col>
                                                            </Grid>
                                                            <Grid gutter={{ base: 0 }} pl={6}>
                                                                <Grid.Col span={2}>
                                                                    <Text fz="xs" fw={600} >{t('Mobile')}</Text>
                                                                </Grid.Col>
                                                                <Grid.Col span={1}>
                                                                    <Text fz={'xs'} fw={700}>:</Text>
                                                                </Grid.Col>
                                                                <Grid.Col span={9}>
                                                                    <Text fz="xs" fw={300} >{showEntityData?.customer_mobile}</Text>
                                                                </Grid.Col>
                                                            </Grid>
                                                            <Grid gutter={{ base: 0 }} pl={6}>
                                                                <Grid.Col span={2}>
                                                                    <Text fz="xs" fw={600} >{t('Address')}</Text>
                                                                </Grid.Col>
                                                                <Grid.Col span={1}>
                                                                    <Text fz={'xs'} fw={700}>:</Text>
                                                                </Grid.Col>
                                                                <Grid.Col span={9}>
                                                                    <Text fz="xs" fw={300} >{showEntityData?.customer_address}</Text>
                                                                </Grid.Col>
                                                            </Grid>
                                                        </Stack>
                                                    </Flex>
                                                </Box>
                                            </Grid.Col>
                                            <Grid.Col span={8} >
                                                <Box h={110} bg={'white'} pl={`xs`} pr={8} pt={'xs'} className={' borderRadiusAll'} >

                                                    <Grid columns={12} gutter={0}>
                                                        <Grid.Col span={8}>
                                                            <Stack h={104} gap={0}>
                                                                <Text fw={900} pl={'6'} fz={'md'}>
                                                                    {t('Outstanding')}
                                                                </Text>
                                                                <Grid columns={12}>
                                                                    <Grid.Col span={12}>
                                                                        <Grid gutter={{ base: 0 }} pl={6} pt={'4'}>
                                                                            <Grid.Col span={4}>
                                                                                <Text fz="xs" fw={600} >{t('TotalBalance')}</Text>
                                                                            </Grid.Col>
                                                                            <Grid.Col span={1}>
                                                                                <Text fz={'xs'} fw={700}>:</Text>
                                                                            </Grid.Col>
                                                                            <Grid.Col span={7}>
                                                                                <Text fz="xs" fw={300} >{showEntityData?.total_balance}</Text>
                                                                            </Grid.Col>
                                                                        </Grid>
                                                                        <Grid gutter={{ base: 0 }} pl={6}>
                                                                            <Grid.Col span={4}>
                                                                                <Text fz="xs" fw={600} >{t('TotalSales')}</Text>
                                                                            </Grid.Col>
                                                                            <Grid.Col span={1}>
                                                                                <Text fz={'xs'} fw={700}>:</Text>
                                                                            </Grid.Col>
                                                                            <Grid.Col span={7}>
                                                                                <Text fz="xs" fw={300} >{showEntityData?.total_sales}</Text>
                                                                            </Grid.Col>
                                                                        </Grid>
                                                                        <Grid gutter={{ base: 0 }} pl={6}>
                                                                            <Grid.Col span={4}>
                                                                                <Text fz="xs" fw={600} >{t('TotalReceive')}</Text>
                                                                            </Grid.Col>
                                                                            <Grid.Col span={1}>
                                                                                <Text fz={'xs'} fw={700}>:</Text>
                                                                            </Grid.Col>
                                                                            <Grid.Col span={7}>
                                                                                <Text fz="xs" fw={300} >{showEntityData?.total_received}</Text>
                                                                            </Grid.Col>
                                                                        </Grid>
                                                                    </Grid.Col>
                                                                </Grid>
                                                            </Stack>
                                                        </Grid.Col>
                                                        <Grid.Col span={4} >
                                                            <Box mr={6} style={{ textAlign: 'right', float: 'right' }}>
                                                                <Stack gap={2} align="center"
                                                                    justify="center" h={86}>
                                                                    <Group pr={'xs'}>
                                                                        <Tooltip
                                                                            multiline
                                                                            bg={'orange.8'}
                                                                            position="top"
                                                                            ta={'center'}
                                                                            withArrow
                                                                            transitionProps={{ duration: 200 }}
                                                                            label={'Hello'}
                                                                        >
                                                                            <ActionIcon
                                                                                bg={'white'}
                                                                                variant="outline"
                                                                                color={'green'}
                                                                                disabled={false}
                                                                                onClick={(e) => {
                                                                                    if (isShowSMSPackageModel) {
                                                                                        notifications.show({
                                                                                            withCloseButton: true,
                                                                                            autoClose: 1000,
                                                                                            title: t('smsSendSuccessfully'),
                                                                                            message: t('smsSendSuccessfully'),
                                                                                            icon: <IconTallymark1 />,
                                                                                            className: 'my-notification-class',
                                                                                            style: {},
                                                                                            loading: true,
                                                                                        })
                                                                                    } else {
                                                                                        setIsShowSMSPackageModel(true)
                                                                                    }
                                                                                }}
                                                                            >
                                                                                <IconMessage size={18} stroke={1.5} />
                                                                            </ActionIcon>
                                                                        </Tooltip>
                                                                        <Tooltip
                                                                            multiline
                                                                            bg={'orange.8'}
                                                                            position="top"
                                                                            withArrow
                                                                            offset={{ crossAxis: '-45', mainAxis: '5' }}
                                                                            ta={'center'}
                                                                            transitionProps={{ duration: 200 }}
                                                                            label={'Hello'}
                                                                        >
                                                                            <ActionIcon
                                                                                variant="outline"
                                                                                color={'green'}
                                                                                disabled={false}
                                                                            >
                                                                                <IconEyeEdit
                                                                                    size={18}
                                                                                    stroke={1.5}
                                                                                />
                                                                            </ActionIcon>
                                                                        </Tooltip>
                                                                    </Group>
                                                                </Stack>
                                                            </Box>
                                                        </Grid.Col>
                                                    </Grid>
                                                </Box>
                                            </Grid.Col>
                                            <Grid.Col span={9} >
                                                <Box bg={'white'} pl={`xs`} pr={8} pt={'4'} className={' borderRadiusAll'} >
                                                    <Grid columns={12} gutter={0} >
                                                        <Grid.Col span={10}>
                                                            <Stack h={104} gap={0}>
                                                                <Text fw={900} pt={'8'} pl={'6'} fz={'md'}>{t('BatchDetails')}</Text>
                                                                <Grid columns={12} gutter={0} pt={8}>
                                                                    <Grid.Col span={6}>
                                                                        <Grid columns={12} gutter={{ base: 0 }} pl={6}>
                                                                            <Grid.Col span={4}>
                                                                                <Text fz="xs" fw={600} >{t('TotalAmount')}</Text>
                                                                            </Grid.Col>
                                                                            <Grid.Col span={1}>
                                                                                <Text fz={'xs'} fw={700}>:</Text>
                                                                            </Grid.Col>
                                                                            <Grid.Col span={7}>
                                                                                <Text fz="xs" fw={300} >{showEntityData?.batch_invoices?.reduce((acc, item) => acc + item.sub_total, 0)}</Text>
                                                                            </Grid.Col>
                                                                        </Grid>
                                                                        <Grid columns={12} gutter={{ base: 0 }} pl={6}>
                                                                            <Grid.Col span={4}>
                                                                                <Text fz="xs" fw={600} >{t('Discount')}</Text>
                                                                            </Grid.Col>
                                                                            <Grid.Col span={1}>
                                                                                <Text fz={'xs'} fw={700}>:</Text>
                                                                            </Grid.Col>
                                                                            <Grid.Col span={7}>
                                                                                <Text fz="xs" fw={300} >{showEntityData?.batch_invoices?.reduce((acc, item) => acc + item.discount, 0)}</Text>
                                                                            </Grid.Col>
                                                                        </Grid>
                                                                    </Grid.Col>
                                                                    <Grid.Col span={6}>
                                                                        <Grid gutter={{ base: 0 }} pl={6}>
                                                                            <Grid.Col span={4}>
                                                                                <Text fz="xs" fw={600} >{t('Receive')}</Text>
                                                                            </Grid.Col>
                                                                            <Grid.Col span={1}>
                                                                                <Text fz={'xs'} fw={700}>:</Text>
                                                                            </Grid.Col>
                                                                            <Grid.Col span={7}>
                                                                                <Text fz="xs" fw={300} >{showEntityData?.received}</Text>
                                                                            </Grid.Col>
                                                                        </Grid>
                                                                        <Grid gutter={{ base: 0 }} pl={6}>
                                                                            <Grid.Col span={4}>
                                                                                <Text fz="xs" fw={600} >{t('Balance')}</Text>
                                                                            </Grid.Col>
                                                                            <Grid.Col span={1}>
                                                                                <Text fz={'xs'} fw={700}>:</Text>
                                                                            </Grid.Col>
                                                                            <Grid.Col span={7}>
                                                                                <Text fz="xs" fw={300} >{showEntityData?.balance}</Text>
                                                                            </Grid.Col>
                                                                        </Grid>
                                                                    </Grid.Col>
                                                                </Grid>
                                                            </Stack>
                                                        </Grid.Col>
                                                        <Grid.Col span={2}>
                                                            <Stack gap={2} align="center"
                                                                justify="center" h={104}>
                                                                <Button
                                                                    color={'green.8'}
                                                                    size='xs'
                                                                    w={80}
                                                                    variant="filled"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        setAddTransactionDrawer(true)
                                                                    }}
                                                                >{t('Receive')}</Button>
                                                                <Button
                                                                    color={'red.5'}
                                                                    size='xs'
                                                                    w={80}
                                                                    variant="filled"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        setAddTransactionDrawer(true)
                                                                    }}
                                                                >{t('AddBill')}
                                                                </Button>
                                                            </Stack>
                                                        </Grid.Col>
                                                    </Grid>
                                                </Box>
                                            </Grid.Col>
                                        </Grid>
                                    </Box>

                                </Box>
                            </Box>
                            <Box >
                                <Box pl={'8'} pr={'8'}>
                                    <Grid columns={24} gutter={{ base: 8 }}>
                                        <Grid.Col span={7} >
                                            <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                                                <Box h={40} pl={`xs`} pr={8} pt={'xs'} mb={'xs'} className={'boxBackground borderRadiusAll'} >
                                                    <Title order={6} pl={'6'}>{t('Invoices')}</Title>
                                                </Box>
                                                <Box className={'borderRadiusAll'} h={height - 86}>
                                                    <InvoiceBatchModalInvoice batchInvoice={showEntityData?.batch_invoices ? showEntityData.batch_invoices : []} />
                                                </Box>
                                            </Box>

                                        </Grid.Col>
                                        <Grid.Col span={8} >
                                            <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                                                <Box h={40} pl={`xs`} pr={8} pt={'xs'} mb={'xs'} className={'boxBackground borderRadiusAll'} >
                                                    <Title order={6} pl={'6'}>{t('BatchItems')}</Title>
                                                </Box>
                                                <Box bg={'white'} h={height - 86} >
                                                    <InvoiceBatchModalTable invoiceBatchItems={showEntityData?.invoice_batch_items ? showEntityData.invoice_batch_items : []} />
                                                </Box>

                                            </Box>
                                        </Grid.Col>
                                        <Grid.Col span={9} >
                                            <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                                                <Box h={40} pl={`xs`} pr={8} pt={'xs'} mb={'xs'} className={'boxBackground borderRadiusAll'} >
                                                    <Title order={6} pl={'6'}>{t('Transactions')}</Title>
                                                </Box>
                                                <Box className={'borderRadiusAll'} h={height - 86}>
                                                    <InvoiceBatchModalTransaction batchTransactions={showEntityData?.invoice_batch_transactions ? showEntityData.invoice_batch_transactions : []} />
                                                </Box>
                                            </Box>
                                        </Grid.Col>
                                    </Grid>
                                </Box>
                            </Box>
                        </Box>
                    </Modal.Body>
                </Modal.Content>
            </Modal.Root >
            {addTransactionDrawer && <_AddTransaction addTransactionDrawer={addTransactionDrawer} setAddTransactionDrawer={setAddTransactionDrawer} />}
        </>
    );
}

export default InvoiceBatchModal;