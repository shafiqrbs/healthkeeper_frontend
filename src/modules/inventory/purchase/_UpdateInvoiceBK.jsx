import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
    Button, ActionIcon, TextInput,
    Grid, Box, Group, Text,
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import {
    IconDeviceFloppy, IconSum, IconX, IconBarcode, IconSortAscendingNumbers
} from "@tabler/icons-react";
import { getHotkeyHandler, useHotkeys } from "@mantine/hooks";
import { isNotEmpty, useForm } from "@mantine/form";
import {notifications} from "@mantine/notifications";
import SelectServerSideForm from "../../../form-builders/SelectServerSideForm.jsx";
import InputButtonForm from "../../../form-builders/InputButtonForm";
import InputNumberForm from "../../../form-builders/InputNumberForm";

import { DataTable } from "mantine-datatable";
import ShortcutInvoice from "../../shortcut/ShortcutInvoice";
import tableCss from "../../../../assets/css/Table.module.css";
import productsDataStoreIntoLocalStorage from "../../../global-hook/local-storage/productsDataStoreIntoLocalStorage.js";
import __UpdateInvoiceForm from "./__UpdateInvoiceForm.jsx";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import getCoreWarehouseDropdownData from "../../../global-hook/dropdown/core/getCoreWarehouseDropdownData.js";

function _UpdateInvoice(props) {
    const { currencySymbol, isPurchaseByPurchasePrice,editedData,isWarehouse } = props
    const { t, i18n } = useTranslation();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 130; //TabList height 104
    const [fetching, setFetching] = useState(false);

    const [searchValue, setSearchValue] = useState('');
    const [productDropdown, setProductDropdown] = useState([]);

    const [tempCardProducts, setTempCardProducts] = useState([])
    const [loadCardProducts, setLoadCardProducts] = useState(false)

    /*get warehouse dropdown data*/
    let warehouseDropdownData = getCoreWarehouseDropdownData()
    const [warehouseData, setWarehouseData] = useState(null);

    let purchaseSubTotalAmount = tempCardProducts?.reduce((total, item) => total + item.sub_total, 0) || 0;
    let totalPurchaseAmount = tempCardProducts?.reduce((total, item) => total + (item.purchase_price * item.quantity), 0) || 0;

    const [stockProductRestore, setStockProductRestore] = useState(false)
    useEffect(() => {
        if (stockProductRestore) {
            const local = productsDataStoreIntoLocalStorage()
        }
    }, [stockProductRestore])

    useEffect(() => {
        setTempCardProducts(editedData?.purchase_items ? editedData.purchase_items : [])
        setLoadCardProducts(false)
    }, [])

    useEffect(() => {
        if (searchValue.length > 0) {
            const storedProducts = localStorage.getItem('core-products');
            const localProducts = storedProducts ? JSON.parse(storedProducts) : [];

            // Filter products where product_nature is not 'post-production'
            const filteredProducts = localProducts.filter(product => product.product_nature !== 'post-production');

            const lowerCaseSearchTerm = searchValue.toLowerCase();
            const fieldsToSearch = ['product_name'];
            const productFilterData = filteredProducts.filter(product =>
                fieldsToSearch.some(field =>
                    product[field] && String(product[field]).toLowerCase().includes(lowerCaseSearchTerm)
                )
            );
            const formattedProductData = productFilterData.map(type => ({
                label: type.product_name, value: String(type.id)
            }));

            setProductDropdown(formattedProductData);
        } else {
            setProductDropdown([]);
        }
    }, [searchValue]);


    /**
     * Adds a product to a collection based on ID, updates the local storage and resets the form
     */
    function handleAddProductByProductId(values, myCardProducts, localProducts) {
        const addProducts = [...myCardProducts, ...localProducts.reduce((acc, product) => {
            if (product.id === Number(values.product_id)) {
                acc.push({
                    product_id: product.id,
                    display_name: product.display_name,
                    quantity: Number(values.quantity),
                    unit_name: product.unit_name,
                    purchase_price: Number(values.purchase_price),
                    sub_total: Number(values.sub_total),
                    sales_price: Number(product.sales_price),
                    warehouse_id: values.warehouse_id?Number(values.warehouse_id):null,
                    warehouse_name: values.warehouse_id?warehouseDropdownData.find(warehouse => warehouse.value === values.warehouse_id).label:null,
                    bonus_quantity : values.bonus_quantity
                });
            }
            return acc;
        }, [])];
        updateLocalStorageAndResetForm(addProducts, 'productId');
    }

    /**
     * Adds a product to a collection based on BARCODE, updates the local storage and resets the form
     */
    function handleAddProductByBarcode(values, myCardProducts, localProducts) {
        const barcodeExists = localProducts.some(product => product.barcode === values.barcode);

        if (barcodeExists) {
            const addProducts = localProducts.reduce((acc, product) => {
                if (String(product.barcode) === String(values.barcode)) {
                    acc = [...acc, createProductFromValues(product,values)];
                }
                return acc;
            }, [...myCardProducts]);

            updateLocalStorageAndResetForm(addProducts, 'barcode');
        } else {
            notifications.show({
                loading: true,
                color: 'red',
                title: 'Product not found with this barcode',
                message: 'Data will be loaded in 3 seconds, you cannot close this yet',
                autoClose: 1000,
                withCloseButton: true,
            });
        }
    }

    /**
     * Updates local storage with new products, resets form, and sets focus on the product search.
     */
    function updateLocalStorageAndResetForm(addProducts, type) {
        setTempCardProducts(addProducts);
        setSearchValue('');
        form.reset();
        setLoadCardProducts(true);
        if (type == 'productId') {
            document.getElementById('product_id').focus();
        } else {
            document.getElementById('barcode').focus();
        }
    }

    function createProductFromValues(product,values) {
        return {
            product_id: product.id,
            display_name: product.display_name,
            quantity: 1,
            unit_name: product.unit_name,
            purchase_price: product.purchase_price,
            sub_total: Number(product.purchase_price),
            sales_price: Number(product.sales_price),
            warehouse_id: values.warehouse_id ? Number(values.warehouse_id):null,
            warehouse_name: values.warehouse_id?warehouseDropdownData.find(warehouse => warehouse.value === values.warehouse_id).label:null,
            bonus_quantity : values.bonus_quantity
        };
    }


    const form = useForm({
        initialValues: {
            product_id: '', price: '', purchase_price: '', barcode: '', sub_total: '', quantity: '',warehouse_id : '',bonus_quantity:''
        },
        validate: {
            product_id: (value, values) => {
                const isDigitsOnly = /^\d+$/.test(value);
                if (!isDigitsOnly && values.product_id) {
                    return true;
                }
                return null;
            },
            quantity: (value, values) => {
                if (values.product_id) {
                    const isNumberOrFractional = /^-?\d+(\.\d+)?$/.test(value);
                    if (!isNumberOrFractional) {
                        return true;
                    }
                }
                return null;
            },
            purchase_price: (value, values) => {
                if (values.product_id) {
                    const isNumberOrFractional = /^-?\d+(\.\d+)?$/.test(value);
                    if (!isNumberOrFractional) {
                        return true;
                    }
                }
                return null;
            }
        }
    });

    /*START PRODUCT SELECTED BY PRODUCT ID*/
    const [selectProductDetails, setSelectProductDetails] = useState('')
    useEffect(() => {
        const storedProducts = localStorage.getItem('core-products');
        const localProducts = storedProducts ? JSON.parse(storedProducts) : [];

        const filteredProducts = localProducts.filter(product => product.id === Number(form.values.product_id));
        if (filteredProducts.length > 0) {
            const selectedProduct = filteredProducts[0];
            setSelectProductDetails(selectedProduct);

            form.setFieldValue('price', selectedProduct.sales_price);
            form.setFieldValue('sales_price', selectedProduct.sales_price);
            form.setFieldValue('purchase_price', selectedProduct.purchase_price);
            document.getElementById('quantity').focus();
        } else {
            setSelectProductDetails(null);
            form.setFieldValue('price', '');
            form.setFieldValue('sales_price', '');
            form.setFieldValue('purchase_price', '');
        }
    }, [form.values.product_id]);
    /*END PRODUCT SELECTED BY PRODUCT ID*/

    /*START QUANTITY AND PURCHASE PRICE WISE SUB TOTAL*/
    useEffect(() => {
        const quantity = Number(form.values.quantity);
        const purchase_price = Number(form.values.purchase_price);

        if (!isNaN(quantity) && !isNaN(purchase_price) && quantity > 0 && purchase_price >= 0) {
            setSelectProductDetails(prevDetails => ({
                ...prevDetails,
                sub_total: quantity * purchase_price,
            }));
            form.setFieldValue('sub_total', quantity * purchase_price);
        }
    }, [form.values.quantity, form.values.purchase_price]);
    /*END QUANTITY AND PURCHASE PRICE WISE SUB TOTAL*/


    /*START SUBTOTAL WISE PURCHASE PRICE*/
    useEffect(() => {
        const quantity = Number(form.values.quantity);
        const subTotal = Number(form.values.sub_total);

        if (!isNaN(quantity) && !isNaN(subTotal) && quantity > 0 && subTotal >= 0) {
            setSelectProductDetails(prevDetails => ({
                ...prevDetails,
                purchase_price: subTotal / quantity,
            }));
            form.setFieldValue('purchase_price', subTotal / quantity);
        }
    }, [form.values.sub_total]);
    /*END SUBTOTAL WISE PURCHASE PRICE*/



    useHotkeys([['alt+n', () => {
        document.getElementById('product_id').focus()
    }]], []);

    useHotkeys([['alt+r', () => {
        form.reset()
    }]], []);

    useHotkeys([['alt+s', () => {
        document.getElementById('EntityFormSubmit').click()
    }]], []);

    const inputGroupText = (
        <Text style={{ textAlign: 'right', width: '100%', paddingRight: 16 }}
            color={'gray'}
        >
            {selectProductDetails && selectProductDetails.unit_name}
        </Text>
    );

    const inputGroupCurrency = (
        <Text style={{ textAlign: 'right', width: '100%', paddingRight: 16 }}
            color={'gray'}
        >
            {currencySymbol}
        </Text>
    );
    return (
        <Box>
            <Grid columns={24} gutter={{ base: 8 }}>
                <Grid.Col span={15} >
                    <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                        <Box>
                            <form onSubmit={form.onSubmit((values) => {
                                if (!values.barcode && !values.product_id) {
                                    form.setFieldError('barcode', true);
                                    form.setFieldError('product_id', true);
                                    isWarehouse && form.setFieldError('warehouse_id', true);
                                    setTimeout(() => { }, 1000)
                                } else {

                                    const myCardProducts = tempCardProducts ? tempCardProducts : [];
                                    const storedProducts = localStorage.getItem('core-products');
                                    const localProducts = storedProducts ? JSON.parse(storedProducts) : [];

                                    if (values.product_id && !values.barcode) {
                                        handleAddProductByProductId(values, myCardProducts, localProducts);
                                    } else if (!values.product_id && values.barcode) {
                                        handleAddProductByBarcode(values, myCardProducts, localProducts);
                                    }
                                }
                            })}>
                                <Box pl={`xs`} pr={8} pt={'xs'} mb={'xs'} className={'boxBackground borderRadiusAll'}>
                                    <Box pb={'xs'}>
                                        {
                                            isWarehouse==1 &&
                                            <Grid columns={24} gutter={{ base: 6 }}>
                                                <Grid.Col span={20}>
                                                    <SelectForm
                                                        tooltip={t('Warehouse')}
                                                        label=''
                                                        placeholder={t('Warehouse')}
                                                        required={false}
                                                        nextField={'product_id'}
                                                        name={'warehouse_id'}
                                                        form={form}
                                                        dropdownValue={warehouseDropdownData}
                                                        id={'warehouse_id'}
                                                        mt={1}
                                                        searchable={true}
                                                        value={warehouseData}
                                                        changeValue={setWarehouseData}
                                                    />
                                                </Grid.Col>
                                                <Grid.Col span={4}>
                                                    <InputButtonForm
                                                        type="number"
                                                        tooltip={t("BonusQuantity")}
                                                        label=""
                                                        placeholder={t("BonusQuantity")}
                                                        required={true}
                                                        nextField={"quantity"}
                                                        form={form}
                                                        name={"bonus_quantity"}
                                                        id={"bonus_quantity"}
                                                        leftSection={
                                                            <IconSortAscendingNumbers
                                                                size={16}
                                                                opacity={0.5}
                                                            />
                                                        }
                                                        rightSection={inputGroupText}
                                                        rightSectionWidth={50}
                                                    />
                                                </Grid.Col>
                                            </Grid>
                                        }
                                        <Grid columns={24} gutter={{ base: 6 }}>
                                            <Grid.Col span={4}>
                                                <InputNumberForm
                                                    tooltip={t('BarcodeValidateMessage')}
                                                    label=''
                                                    placeholder={t('Barcode')}
                                                    required={true}
                                                    nextField={'EntityFormSubmit'}
                                                    form={form}
                                                    name={'barcode'}
                                                    id={'barcode'}
                                                    leftSection={<IconBarcode size={16} opacity={0.5} />}
                                                />
                                            </Grid.Col>
                                            <Grid.Col span={8}>
                                                <SelectServerSideForm
                                                    tooltip={t('ChooseStockProduct')}
                                                    label=''
                                                    placeholder={t('ChooseStockProduct')}
                                                    required={false}
                                                    nextField={'quantity'}
                                                    name={'product_id'}
                                                    form={form}
                                                    id={'product_id'}
                                                    searchable={true}
                                                    searchValue={searchValue}
                                                    setSearchValue={setSearchValue}
                                                    dropdownValue={productDropdown}
                                                />
                                            </Grid.Col>
                                            <Grid.Col span={3}>
                                                <InputButtonForm
                                                    tooltip={t('QuantityValidateMessage')}
                                                    label=''
                                                    placeholder={t('Quantity')}
                                                    required={true}
                                                    nextField={!isPurchaseByPurchasePrice ? 'sub_total' : 'purchase_price'}
                                                    form={form}
                                                    name={'quantity'}
                                                    id={'quantity'}
                                                    type={'number'}
                                                    rightSection={inputGroupText}
                                                    rightSectionWidth={50}
                                                />
                                            </Grid.Col>
                                            <Grid.Col span={3}>
                                                <InputButtonForm
                                                    tooltip={t('PurchasePriceValidateMessage')}
                                                    label=''
                                                    placeholder={t('PurchasePrice')}
                                                    required={true}
                                                    nextField={isPurchaseByPurchasePrice && 'EntityFormSubmit'}
                                                    form={form}
                                                    name={'purchase_price'}
                                                    id={'purchase_price'}
                                                    type={'number'}
                                                    rightSection={inputGroupCurrency}
                                                    closeIcon={true}
                                                    disabled={!isPurchaseByPurchasePrice}
                                                />
                                            </Grid.Col>
                                            <Grid.Col span={3}>
                                                <InputButtonForm
                                                    tooltip={t('SubTotalValidateMessage')}
                                                    label=''
                                                    placeholder={t('SubTotal')}
                                                    required={true}
                                                    nextField={'EntityFormSubmit'}
                                                    form={form}
                                                    name={'sub_total'}
                                                    id={'sub_total'}
                                                    type={'number'}
                                                    rightSection={inputGroupCurrency}
                                                    closeIcon={false}
                                                    disabled={isPurchaseByPurchasePrice ? true : false}
                                                />
                                            </Grid.Col>
                                            <Grid.Col span={3}>
                                                <>
                                                    <Button
                                                        size="sm"
                                                        color={`red.5`}
                                                        type="submit"
                                                        mt={0}
                                                        mr={'xs'}
                                                        w={'100%'}
                                                        id="EntityFormSubmit"
                                                        leftSection={<IconDeviceFloppy size={14} />}
                                                    >
                                                        {t("Add")}
                                                    </Button>
                                                </>
                                            </Grid.Col>
                                            {/* <Grid.Col span={1} bg={'white'}>
                                                <_addProduct
                                                    setStockProductRestore={setStockProductRestore}
                                                    focusField={'product_id'}
                                                    fieldPrefix="purchase_"
                                                />
                                            </Grid.Col> */}
                                        </Grid>
                                    </Box>
                                </Box>
                            </form>

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
                                records={tempCardProducts}
                                columns={[
                                    {
                                        accessor: 'index',
                                        title: t('S/N'),
                                        textAlignment: 'right',
                                        render: (item) => (tempCardProducts.indexOf(item) + 1)
                                    },
                                    {
                                        accessor: 'display_name',
                                        title: t("Name"),
                                        width: isWarehouse?'30%':'50%',
                                    },
                                    {
                                        accessor: 'warehouse_name',
                                        title: t("Warehouse"),
                                        width: '20%',
                                        hidden:!isWarehouse
                                    },
                                    {
                                        accessor: 'bonus_quantity',
                                        title: t("BonusQty"),
                                    },
                                    {
                                        accessor: 'quantity',
                                        title: t('Quantity'),
                                        width: '10%',
                                        render: (item) => {
                                            const [editedQuantity, setEditedQuantity] = useState(item.quantity);

                                            const handleQuantityChange = (e) => {
                                                const editedQuantity = e.currentTarget.value;
                                                setEditedQuantity(editedQuantity);

                                                const updatedProducts = tempCardProducts.map(product => {
                                                    if (product.id === item.id) {
                                                        return {
                                                            ...product,
                                                            quantity: e.currentTarget.value,
                                                            sub_total: e.currentTarget.value * item.purchase_price,
                                                        };
                                                    }
                                                    return product
                                                });

                                                setTempCardProducts(updatedProducts)
                                            };

                                            return (
                                                <>
                                                    <TextInput
                                                        type="number"
                                                        label=""
                                                        size="xs"
                                                        value={editedQuantity}
                                                        onChange={handleQuantityChange}
                                                        onKeyDown={getHotkeyHandler([
                                                            ['Enter', (e) => {
                                                                document.getElementById('inline-update-quantity-' + item.product_id).focus();
                                                            }],
                                                        ])}
                                                    />
                                                </>
                                            );

                                        }
                                    },
                                    {
                                        accessor: 'unit_name',
                                        title: t('UOM'),
                                        width: '10%',
                                        textAlign: "center"
                                    },
                                    {
                                        accessor: 'purchase_price',
                                        title: t('Price'),
                                        width: '10%',
                                        render: (item) => {
                                            const [editedPurchasePrice, setEditedPurchasePrice] = useState(item.purchase_price);
                                            const handlePurchasePriceChange = (e) => {
                                                const newSalesPrice = e.currentTarget.value;
                                                setEditedPurchasePrice(newSalesPrice);
                                            };
                                            useEffect(() => {
                                                const timeoutId = setTimeout(() => {
                                                    const updatedProducts = tempCardProducts.map(product => {
                                                        if (product.id === item.id) {
                                                            return {
                                                                ...product,
                                                                purchase_price: editedPurchasePrice,
                                                                sub_total: editedPurchasePrice * item.quantity,
                                                            };
                                                        }
                                                        return product;
                                                    });
                                                    setTempCardProducts(updatedProducts)
                                                }, 1000);

                                                return () => clearTimeout(timeoutId);
                                            }, [editedPurchasePrice, item.product_id, item.quantity]);

                                            return (
                                                <>
                                                    <TextInput
                                                        type="number"
                                                        label=""
                                                        size="xs"
                                                        id={'inline-update-quantity-' + item.product_id}
                                                        value={editedPurchasePrice}
                                                        onChange={handlePurchasePriceChange}
                                                    />
                                                </>
                                            );
                                        }
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
                                        footer: (
                                            <Group spacing="xs" textAlign={"right"}>
                                                <Group spacing="xs">
                                                    <IconSum size="1.25em" />
                                                </Group>
                                                <Text fw={'600'} fz={'md'}>{
                                                    purchaseSubTotalAmount.toFixed(2)
                                                }</Text>
                                            </Group>
                                        ),
                                    },
                                    {
                                        accessor: "action",
                                        title: t('Action'),
                                        textAlign: "right",
                                        render: (item) => (
                                            <Group gap={4} justify="right" wrap="nowrap">
                                                <ActionIcon
                                                    size="sm"
                                                    variant="subtle"
                                                    color='var( --theme-remove-color)'
                                                    onClick={() => {
                                                        let data = tempCardProducts ? tempCardProducts : [];
                                                        data = data.filter(d => d.id !== item.id);
                                                        setTempCardProducts(data)
                                                    }}
                                                >
                                                    <IconX size={16} style={{ width: '70%', height: '70%' }}
                                                        stroke={1.5} />
                                                </ActionIcon>
                                            </Group>
                                        ),
                                    },
                                ]
                                }
                                fetching={fetching}
                                totalRecords={100}
                                recordsPerPage={10}
                                loaderSize="xs"
                                loaderColor="grape"
                                height={height}
                                scrollAreaProps={{ type: 'never' }}
                            />
                        </Box>

                    </Box>
                </Grid.Col>
                <Grid.Col span={8} >
                    <Box bg={'white'} p={'md'} className={'borderRadiusAll'}>
                        <__UpdateInvoiceForm
                            purchaseSubTotalAmount={purchaseSubTotalAmount}
                            tempCardProducts={tempCardProducts}
                            totalPurchaseAmount={totalPurchaseAmount}
                            currencySymbol={currencySymbol}
                            setLoadCardProducts={setLoadCardProducts}
                            editedData={editedData}
                        />
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

    );
}

export default _UpdateInvoice;
