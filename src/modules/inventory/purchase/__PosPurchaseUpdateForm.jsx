import {isNotEmpty, useForm} from "@mantine/form";
import {useEffect, useMemo, useState} from "react";
import __PosVendorSection from "./__PosVendorSection.jsx";
import {Box, Text, ActionIcon, Group, TextInput} from "@mantine/core";
import {DataTable} from "mantine-datatable";
import tableCss from "../../../../assets/css/Table.module.css";
import {useTranslation} from "react-i18next";
import {IconSum, IconX} from "@tabler/icons-react";
import {useNavigate, useOutletContext, useParams} from "react-router-dom";
import {getHotkeyHandler, useToggle} from "@mantine/hooks";
import vendorDataStoreIntoLocalStorage from "../../../global-hook/local-storage/vendorDataStoreIntoLocalStorage.js";
import {useDispatch} from "react-redux";
import __PosPurchaseInvoiceSection from "./__PosPurchaseInvoiceSection.jsx";
import {updateEntityData} from "../../../../store/inventory/crudSlice.js";
import {showNotificationComponent} from "../../../core-component/showNotificationComponent.jsx";

export default function __PosPurchaseUpdateForm(props) {
    const {id} = useParams();
    const {
        isSMSActive,
        currencySymbol,
        tempCardProducts,
        setLoadCardProducts,
        isWarehouse,
        editedData,
        setTempCardProducts,
        domainConfigData
    } = props;

    const toNumber = (value) => (isNaN(Number(value)) ? 0 : Number(value));

    //common hooks
    const {t} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 170;
    const [fetching, setFetching] = useState(false);
    const dispatch = useDispatch();
// Initial discount type from database
    const initialDatabaseDiscountType = editedData?.discount_type === "Percent" ? "Percent" : "Flat";
    // Local state: Discount type toggle (controlled after form init)
    const [discountType, setDiscountType] = useToggle(["Flat", "Percent"]);
    const [warehouseData, setWarehouseData] = useState(String(editedData.warehouse_id) ?? null);

    // Calculate initial discount value based on DB & type
    const initialDiscountValue = useMemo(() => {
        setDiscountType(initialDatabaseDiscountType)
        return initialDatabaseDiscountType === "Flat"
            ? editedData?.discount || ''
            : editedData?.discount_calculation || '';
    }, [initialDatabaseDiscountType, editedData]);

    // form
    const form = useForm({
        initialValues: {
            vendor_id: editedData ? editedData?.vendor_id : "",
            transaction_mode_id: editedData ? editedData?.transaction_mode_id : "",
            order_process: editedData ? editedData?.order_process : "",
            narration: editedData ? editedData?.narration : "",
            discount: initialDiscountValue,
            receive_amount: editedData ? editedData?.payment : "",
            name: editedData ? editedData?.vendor_name : "",
            mobile: editedData ? editedData?.vendor_mobile : "",
            email: editedData ? editedData?.vendor_email : "",
            warehouse_id: editedData ? editedData?.warehouse_id : "",
        },
        validate: {
            transaction_mode_id: isNotEmpty(),
            vendor_id: isNotEmpty(),
            warehouse_id: (value) => (isWarehouse ? isNotEmpty()(value) : null),
        },
    });
    const navigate = useNavigate();
    //calculate subTotal amount
    let purchaseSubTotalAmount = tempCardProducts?.reduce((total, item) => total + item.sub_total, 0) || 0;

    //customer dropdown data
    const [vendorsDropdownData, setVendorsDropdownData] = useState([]);

    //customer hook
    const [vendorData, setVendorData] = useState(
        editedData?.vendor_id?.toString()
    );

    // setting defualt customer
    useEffect(() => {
        const fetchVendors = async () => {
            await vendorDataStoreIntoLocalStorage();
            let coreVendors = localStorage.getItem("core-vendors");
            coreVendors = coreVendors ? JSON.parse(coreVendors) : [];

            if (coreVendors && coreVendors.length > 0) {
                const transformedData = coreVendors.map((type) => {
                    return {
                        label: type.mobile + " -- " + type.name,
                        value: String(type.id),
                    };
                });
                setVendorsDropdownData(transformedData);
            }
        };
        fetchVendors();
    }, []);

    //default customer hook
    const [defaultVendorId, setDefaultVendorId] = useState(null);

    //Custoemr object hook
    const [vendorObject, setVendorObject] = useState({});

    //sales discount amount hook
    const [purchaseDiscountAmount, setPurchaseDiscountAmount] = useState('');

    //order process hook
    const [orderProcess, setOrderProcess] = useState(
        editedData?.process?.toString()
    );

    //vat amount hook
    const [purchaseVatAmount, setPurchaseVatAmount] = useState(0);

    //sales total amount hook
    const [purchaseTotalAmount, setPurchaseTotalAmount] = useState(0);

    // sales due amount hook
    const [purchaseDueAmount, setPurchaseDueAmount] = useState(0);

    //return or due text hook
    const [returnOrDueText, setReturnOrDueText] = useState("Due");

    // Calculate discount amount, total amount, and due/return text
    useEffect(() => {
        const discountValue = toNumber(form.values.discount);
        let discountAmount = '';

        if (discountType === "Flat") {
            discountAmount = discountValue;
        } else if (discountType === "Percent" && discountValue <= 100) {
            discountAmount = (purchaseSubTotalAmount * discountValue) / 100;
        }

        if (discountAmount > purchaseSubTotalAmount) {
            discountAmount = 0;
        }

        setPurchaseDiscountAmount(discountAmount);

        const total = purchaseSubTotalAmount - discountAmount + Number(purchaseVatAmount);
        setPurchaseTotalAmount(total);

        const received = toNumber(form.values.receive_amount || 0);
        setReturnOrDueText(received < total ? "Due" : "Return");
        setPurchaseDueAmount(total - received);
    }, [
        form.values.discount,
        discountType,
        form.values.receive_amount,
        purchaseSubTotalAmount,
        purchaseVatAmount,
    ]);

    //invoice button hooks for tracking last clicked
    const [lastClicked, setLastClicked] = useState(null);

    //function to handling button clicks
    const handleClick = (event) => {
        setLastClicked(event.currentTarget.name);
    };

    const handleFormSubmit = async (values) => {
        let createdBy = JSON.parse(localStorage.getItem("user"));
        let transformedArray = tempCardProducts.map((product) => {
            return {
                product_id: product.product_id,
                quantity: product.quantity,
                purchase_price: product.purchase_price,
                sales_price: product.sales_price,
                sub_total: product.sub_total,
                bonus_quantity: product.bonus_quantity,
                warehouse_id: product.warehouse_id,
            };
        });

        const options = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        };

        const formValue = {};
        formValue["vendor_id"] = form.values.vendor_id
            ? form.values.vendor_id
            : defaultVendorId;

        // Include manual customer input fields if no customer is selected
        if (
            !form.values.vendor_id ||
            form.values.vendor_id == defaultVendorId
        ) {
            formValue["vendor_name"] = form.values.name;
            formValue["vendor_mobile"] = form.values.mobile;
            formValue["vendor_email"] = form.values.email;
        }
        formValue["vendor_id"] = form.values.vendor_id;
        formValue["sub_total"] = purchaseSubTotalAmount;
        formValue["transaction_mode_id"] = form.values.transaction_mode_id;
        formValue["discount_type"] = discountType;
        formValue["discount"] = purchaseDiscountAmount;
        formValue["discount_calculation"] =
            discountType === "Percent" ? form.values.discount : 0;
        formValue["vat"] = 0;
        formValue["total"] = purchaseTotalAmount;
        formValue["payment"] = form.values.receive_amount > purchaseTotalAmount ? purchaseTotalAmount : form.values.receive_amount
        formValue["created_by_id"] = Number(createdBy["id"]);
        formValue["process"] = orderProcess;
        formValue["narration"] = form.values.narration;
        formValue["items"] = transformedArray ? transformedArray : [];
        formValue["warehouse_id"] = form.values.warehouse_id;

        if (transformedArray && transformedArray.length > 0) {
            const data = {
                url: "inventory/purchase/" + id,
                data: formValue,
            };
            const resultAction = await dispatch(updateEntityData(data));
            if (updateEntityData.rejected.match(resultAction)) {
                showNotificationComponent('Fail to update', 'red')
            } else if (updateEntityData.fulfilled.match(resultAction)) {
                showNotificationComponent(t("UpdatedSuccessfully"), 'teal')
                if (lastClicked === "save") {
                    navigate("/inventory/purchase");
                }
            }
        } else {
            showNotificationComponent(t("PleaseChooseItems"), 'red')
        }
    }

    return (
        <>
            <form
                onSubmit={form.onSubmit(handleFormSubmit)}
            >
                <Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
                    <__PosVendorSection
                        form={form}
                        isSMSActive={isSMSActive}
                        currencySymbol={currencySymbol}
                        vendorObject={vendorObject}
                        setVendorObject={setVendorObject}
                        vendorData={vendorData}
                        setVendorData={setVendorData}
                        vendorsDropdownData={vendorsDropdownData}
                        setVendorsDropdownData={setVendorsDropdownData}
                        defaultVendorId={defaultVendorId}
                        setDefaultVendorId={setDefaultVendorId}
                    />
                    <Box className={"borderRadiusAll"}>
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
                                    accessor: "index",
                                    title: t("S/N"),
                                    textAlignment: "right",
                                    render: (item) => tempCardProducts.indexOf(item) + 1,
                                },
                                {
                                    accessor: "display_name",
                                    title: t("Name"),
                                    width: isWarehouse ? "30%" : "50%",
                                },
                                {
                                    accessor: "warehouse_name",
                                    title: t("Warehouse"),
                                    width: "20%",
                                    hidden: !isWarehouse,
                                },
                                {
                                    accessor: "bonus_quantity",
                                    title: t("BonusQuantityTable"),
                                },
                                {
                                    accessor: "quantity",
                                    title: t("Quantity"),
                                    width: "10%",
                                    render: (item) => {
                                        const [editedQuantity, setEditedQuantity] = useState(
                                            item.quantity
                                        );

                                        const handleQuantityChange = (e) => {
                                            const editedQuantity = e.currentTarget.value;
                                            setEditedQuantity(editedQuantity);

                                            const updatedProducts = tempCardProducts.map(
                                                (product) => {
                                                    if (product.id === item.id) {
                                                        return {
                                                            ...product,
                                                            quantity: e.currentTarget.value,
                                                            sub_total:
                                                                e.currentTarget.value * item.purchase_price,
                                                        };
                                                    }
                                                    return product;
                                                }
                                            );

                                            setTempCardProducts(updatedProducts);
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
                                                        [
                                                            "Enter",
                                                            (e) => {
                                                                document
                                                                    .getElementById(
                                                                        "inline-update-quantity-" + item.product_id
                                                                    )
                                                                    .focus();
                                                            },
                                                        ],
                                                    ])}
                                                />
                                            </>
                                        );
                                    },
                                },
                                {
                                    accessor: "unit_name",
                                    title: t("UOM"),
                                    width: "10%",
                                    textAlign: "center",
                                },
                                {
                                    accessor: "purchase_price",
                                    title: t("Price"),
                                    width: "10%",
                                    render: (item) => {
                                        const [editedPurchasePrice, setEditedPurchasePrice] =
                                            useState(item.purchase_price);
                                        const handlePurchasePriceChange = (e) => {
                                            const newSalesPrice = e.currentTarget.value;
                                            setEditedPurchasePrice(newSalesPrice);
                                        };
                                        useEffect(() => {
                                            const timeoutId = setTimeout(() => {
                                                const updatedProducts = tempCardProducts.map(
                                                    (product) => {
                                                        if (product.id === item.id) {
                                                            return {
                                                                ...product,
                                                                purchase_price: editedPurchasePrice,
                                                                sub_total: editedPurchasePrice * item.quantity,
                                                            };
                                                        }
                                                        return product;
                                                    }
                                                );
                                                setTempCardProducts(updatedProducts);
                                            }, 1000);

                                            return () => clearTimeout(timeoutId);
                                        }, [editedPurchasePrice, item.product_id, item.quantity]);

                                        return (
                                            <>
                                                <TextInput
                                                    type="number"
                                                    label=""
                                                    size="xs"
                                                    id={"inline-update-quantity-" + item.product_id}
                                                    value={editedPurchasePrice}
                                                    onChange={handlePurchasePriceChange}
                                                />
                                            </>
                                        );
                                    },
                                },

                                {
                                    accessor: "sub_total",
                                    title: t("SubTotal"),
                                    width: "15%",
                                    textAlign: "right",
                                    render: (item) => {
                                        return item.sub_total && Number(item.sub_total).toFixed(2);
                                    },
                                    footer: (
                                        <Group spacing="xs" textAlign={"right"}>
                                            <Group spacing="xs">
                                                <IconSum size="1.25em"/>
                                            </Group>
                                            <Text fw={"600"} fz={"md"}>
                                                {purchaseSubTotalAmount.toFixed(2)}
                                            </Text>
                                        </Group>
                                    ),
                                },
                                {
                                    accessor: "action",
                                    title: t("Action"),
                                    textAlign: "right",
                                    render: (item) => (
                                        <Group gap={4} justify="right" wrap="nowrap">
                                            <ActionIcon
                                                size="sm"
                                                variant="subtle"
                                                color='var(--theme-primary-color-6)'
                                                onClick={() => {
                                                    let data = tempCardProducts ? tempCardProducts : [];
                                                    data = data.filter((d) => d.id !== item.id);
                                                    setTempCardProducts(data);
                                                }}
                                            >
                                                <IconX
                                                    size={16}
                                                    style={{width: "70%", height: "70%"}}
                                                    stroke={1.5}
                                                />
                                            </ActionIcon>
                                        </Group>
                                    ),
                                },
                            ]}
                            fetching={fetching}
                            totalRecords={100}
                            recordsPerPage={10}
                            loaderSize="xs"
                            loaderColor="grape"
                            height={height - 264}
                            scrollAreaProps={{type: "never"}}
                        />
                    </Box>
                </Box>
                <Box>
                    <__PosPurchaseInvoiceSection
                        lastClicked={lastClicked}
                        setLastClicked={setLastClicked}
                        handleClick={handleClick}
                        setVendorsDropdownData={setVendorsDropdownData}
                        vendorsDropdownData={vendorsDropdownData}
                        form={form}
                        currencySymbol={currencySymbol}
                        purchaseDiscountAmount={purchaseDiscountAmount}
                        setPurchaseDiscountAmount={setPurchaseDiscountAmount}
                        setOrderProcess={setOrderProcess}
                        orderProcess={orderProcess}
                        purchaseVatAmount={purchaseVatAmount}
                        purchaseTotalAmount={purchaseTotalAmount}
                        discountType={discountType}
                        setDiscountType={setDiscountType}
                        returnOrDueText={returnOrDueText}
                        vendorData={vendorData}
                        purchaseDueAmount={purchaseDueAmount}
                        setLoadCardProducts={setLoadCardProducts}
                        editedData={editedData}
                        isWarehouse={isWarehouse}
                        domainConfigData={domainConfigData}
                        setWarehouseData={setWarehouseData}
                        warehouseData={warehouseData}
                    />
                </Box>
            </form>
        </>
    );
}
