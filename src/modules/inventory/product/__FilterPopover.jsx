import {
    ActionIcon,
    Box,
    Button,
    Flex,
    Grid,
    Popover,
    Text,
    Tooltip,
    ScrollArea,
} from "@mantine/core";
import {
    IconDeviceMobile,
    IconFileInvoice,
    IconFilter,
    IconRefreshDot,
    IconSearch,
    IconUserCircle,
} from "@tabler/icons-react";
import InputForm from "../../../form-builders/InputForm";
import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {useForm} from "@mantine/form";
import {useOutletContext} from "react-router-dom";
import SelectForm from "../../../form-builders/SelectForm";
import getSettingProductTypeDropdownData from "../../../global-hook/dropdown/getSettingProductTypeDropdownData";
import {setProductFilterData} from "../../../../store/inventory/crudSlice.js";
import {setFetching} from "../../../../store/core/crudSlice.js";

export default function __FilterPopover(props) {
    const {categoryDropdown, focusField, fieldPrefix, module} = props;

    const {mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight;

    const dispatch = useDispatch();
    const {t, i18n} = useTranslation();

    const [advanceSearchFormOpened, setAdvanceSearchFormOpened] = useState(false);
    const productFilterData = useSelector((state) => state.inventoryCrudSlice.productFilterData);
    const [nameDropdown, setNameDropdown] = useState(null);
    const [displayDropdown, setDisplayDropdown] = useState(null);
    const [languageDropdown, setLanguageDropdown] = useState(null);

    // dropdown hooks
    const [productTypeData, setProductTypeData] = useState(null);
    const [categoryData, setCategoryData] = useState(null);

    const advanceSearchForm = useForm({
        initialValues: {
            nature_of_product: "",
            category: "",
            name_dropdown: "",
            name: "",
            display_name: "",
            display_dropdown: "",
            language_dropdown: "",
            language_name: "",
        },
        validate: {},
    });
    const display_drop_data = [
        {id: 1, value: "="},
        {id: 2, value: "!="},
        {id: 2, value: "LIKE"},
    ];
    const language_drop_data = [
        {id: 1, value: "="},
        {id: 2, value: "!="},
        {id: 2, value: "LIKE"},
    ];
    const name_drop_data = [
        {id: 1, value: "="},
        {id: 2, value: "!="},
        {id: 2, value: "LIKE"},
    ];
    const nameof_product_data = [
        {id: 1, value: "Post-production"},
        {id: 2, value: "Pre-production"},
        {id: 3, value: "Raw Materials"},
    ];
    const category_data = [
        {id: 1, value: "Bread & Buns"},
        {id: 2, value: "Raw Materials"},
        {id: 3, value: "Groceries"},
    ];

    return (
        <Box>
            <Popover
                width={"586"}
                trapFocus
                position="bottom"
                withArrow
                shadow="xl"
                opened={advanceSearchFormOpened}
            >
                <Popover.Target>
                    <Tooltip
                        multiline
                        bg={"orange.8"}
                        offset={{crossAxis: "-42", mainAxis: "5"}}
                        position="top"
                        ta={"center"}
                        withArrow
                        transitionProps={{duration: 200}}
                        label={t("AdvanceSearch")}
                    >
                        <ActionIcon
                            variant="default"
                            size="lg"
                            c="gray.6"
                            aria-label="Settings"
                            onClick={() =>
                                advanceSearchFormOpened
                                    ? setAdvanceSearchFormOpened(false)
                                    : setAdvanceSearchFormOpened(true)
                            }
                        >
                            <IconFilter
                                style={{width: "70%", height: "70%"}}
                                stroke={1.5}
                            />
                        </ActionIcon>
                    </Tooltip>
                </Popover.Target>
                <Popover.Dropdown>
                    <Box>
                        <form
                            onSubmit={advanceSearchForm.onSubmit((values) => {
                                setAdvanceSearchFormOpened(false);

                                dispatch(setFetching(true));
                                dispatch(
                                    setProductFilterData({
                                        ...productFilterData,
                                        product_type_id: values?.nature_of_product,
                                        category_id: values?.category
                                    })
                                );

                                setCategoryData(null);
                                setProductTypeData(null);
                            })}
                        >
                            <Box mt={"4"}>
                                <Box
                                    className="boxBackground border-bottom-none borderRadiusAll"
                                    pt={"6"}
                                    pb={"6"}
                                >
                                    <Text ta={"center"} fw={600} fz={"sm"}>
                                        {t("AdvanceSearch")}
                                    </Text>
                                </Box>
                                <Box
                                    className="borderRadiusAll border-bottom-none border-top-none"
                                    bg={"white"}
                                >
                                    <ScrollArea
                                        h={height / 3}
                                        scrollbarSize={2}
                                        scrollbars="y"
                                        type="never"
                                    >
                                        <Box p={"xs"}>
                                            <Grid columns={18} gutter={{base: 8}}>
                                                <Grid.Col span={5}>
                                                    <Text ta={"right"} fw={600} fz={"sm"} mt={"8"}>
                                                        {t("NatureOfProduct")}
                                                    </Text>
                                                </Grid.Col>
                                                <Grid.Col span={13}>
                                                    <SelectForm
                                                        tooltip={t("SelectSearchLikeValue")}
                                                        form={advanceSearchForm}
                                                        searchable
                                                        name="nature_of_product"
                                                        id="nature_of_product"
                                                        // nextField="category"
                                                        placeholder={t("NatureOfProduct")}
                                                        dropdownValue={getSettingProductTypeDropdownData()}
                                                        value={productTypeData}
                                                        changeValue={setProductTypeData}
                                                    />
                                                </Grid.Col>
                                            </Grid>
                                        </Box>
                                        <Box p={"xs"}>
                                            <Grid columns={18} gutter={{base: 8}}>
                                                <Grid.Col span={5}>
                                                    <Text ta={"right"} fw={600} fz={"sm"} mt={"8"}>
                                                        {t("Category")}
                                                    </Text>
                                                </Grid.Col>
                                                <Grid.Col span={13}>
                                                    <SelectForm
                                                        tooltip={t("SelectSearchLikeValue")}
                                                        form={advanceSearchForm}
                                                        searchable
                                                        name="category"
                                                        id="category"
                                                        // nextField="name_dropdown"
                                                        placeholder={t("Category")}
                                                        dropdownValue={categoryDropdown}
                                                        value={categoryData}
                                                        changeValue={setCategoryData}
                                                    />
                                                </Grid.Col>
                                            </Grid>
                                        </Box>
                                        <Box p={"xs"}>
                                            <Grid columns={18} gutter={{base: 8}}>
                                                <Grid.Col span={5}>
                                                    <Text ta={"right"} fw={600} fz={"sm"} mt={"8"}>
                                                        {t("Name")}
                                                    </Text>
                                                </Grid.Col>

                                                <Grid.Col span={6}>
                                                    <SelectForm
                                                        tooltip={t("SelectSearchLikeValue")}
                                                        form={advanceSearchForm}
                                                        searchable
                                                        name="name_dropdown"
                                                        id="name_dropdown"
                                                        // nextField="name"
                                                        placeholder="Search Like"
                                                        dropdownValue={name_drop_data}
                                                        changeValue={setNameDropdown}
                                                        value={nameDropdown}
                                                    />
                                                </Grid.Col>
                                                <Grid.Col span={7}>
                                                    <Box>
                                                        <InputForm
                                                            tooltip={t("NameValidateMessage")}
                                                            label=""
                                                            placeholder={t("Name")}
                                                            // nextField={"display_dropdown"}
                                                            form={advanceSearchForm}
                                                            name={"name"}
                                                            id={"name"}
                                                            leftSection={
                                                                <IconUserCircle size={16} opacity={0.5}/>
                                                            }
                                                            rightIcon={""}
                                                        />
                                                    </Box>
                                                </Grid.Col>
                                            </Grid>
                                        </Box>
                                        <Box p={"xs"}>
                                            <Grid columns={18} gutter={{base: 8}}>
                                                <Grid.Col span={5}>
                                                    <Text ta={"right"} fw={600} fz={"sm"} mt={"8"}>
                                                        {t("DisplayName")}
                                                    </Text>
                                                </Grid.Col>

                                                <Grid.Col span={6}>
                                                    <SelectForm
                                                        tooltip={t("SelectSearchLikeValue")}
                                                        form={advanceSearchForm}
                                                        searchable
                                                        name="display_dropdown"
                                                        id="display_dropdown"
                                                        // nextField="display_name"
                                                        label=""
                                                        placeholder="Search Like"
                                                        dropdownValue={display_drop_data}
                                                        value={displayDropdown}
                                                        changeValue={setDisplayDropdown}
                                                    />
                                                </Grid.Col>
                                                <Grid.Col span={7}>
                                                    <Box>
                                                        <InputForm
                                                            tooltip={t("MobileValidateMessage")}
                                                            label=""
                                                            placeholder={t("DisplayName")}
                                                            // nextField={"language_dropdown"}
                                                            form={advanceSearchForm}
                                                            name={"display_name"}
                                                            id={"display_name"}
                                                            leftSection={
                                                                <IconDeviceMobile size={16} opacity={0.5}/>
                                                            }
                                                            rightIcon={""}
                                                        />
                                                    </Box>
                                                </Grid.Col>
                                            </Grid>
                                        </Box>
                                        <Box p={"xs"}>
                                            <Grid columns={18} gutter={{base: 8}}>
                                                <Grid.Col span={5}>
                                                    <Text ta={"right"} fw={600} fz={"sm"} mt={"8"}>
                                                        {t("LanguageName")}
                                                    </Text>
                                                </Grid.Col>

                                                <Grid.Col span={6}>
                                                    <SelectForm
                                                        tooltip={t("SelectSearchLikeValue")}
                                                        form={advanceSearchForm}
                                                        searchable
                                                        name="language_dropdown"
                                                        id="language_dropdown"
                                                        // nextField="language_name"
                                                        label=""
                                                        placeholder="Search Like"
                                                        dropdownValue={language_drop_data}
                                                        value={languageDropdown}
                                                        changeValue={setLanguageDropdown}
                                                    />
                                                </Grid.Col>
                                                <Grid.Col span={7}>
                                                    <Box>
                                                        <InputForm
                                                            tooltip={t("InvoiceValidateMessage")}
                                                            label=""
                                                            placeholder={t("LanguageName")}
                                                            // nextField={"EntityFormSubmit"}
                                                            form={advanceSearchForm}
                                                            name={"language_name"}
                                                            id={"language_name"}
                                                            leftSection={
                                                                <IconFileInvoice size={16} opacity={0.5}/>
                                                            }
                                                            rightIcon={""}
                                                        />
                                                    </Box>
                                                </Grid.Col>
                                            </Grid>
                                        </Box>
                                    </ScrollArea>
                                </Box>
                            </Box>
                            <Box
                                className="borderRadiusAll border-top-none boxBackground"
                                pl={"xs"}
                                pr={"xs"}
                                pb={2}
                            >
                                <Box>
                                    <Grid columns={12} gutter={{base: 1}}>
                                        <Grid.Col span={6}>&nbsp;</Grid.Col>
                                        <Grid.Col span={2}>
                                            <Button
                                                variant="transparent"
                                                size="sm"
                                                color={`red.4`}
                                                mt={0}
                                                mr={"4"}
                                                pt={8}
                                                fullWidth={true}
                                                onClick={() => {
                                                    advanceSearchForm.reset();
                                                }}
                                            >
                                                <IconRefreshDot
                                                    style={{width: "100%", height: "80%"}}
                                                    stroke={1.5}
                                                />
                                            </Button>
                                        </Grid.Col>
                                        <Grid.Col span={4} pt={8} pb={6}>
                                            <Button
                                                size="xs"
                                                color={`red.5`}
                                                type="submit"
                                                mt={0}
                                                mr={"xs"}
                                                fullWidth={true}
                                                id={"EntityFormSubmit"}
                                                name={"EntityFormSubmit"}
                                                leftSection={<IconSearch size={16}/>}
                                                // onClick={() => {
                                                //   let validation = true;
                                                //   if (!advanceSearchForm.values.name) {
                                                //     validation = false;
                                                //     advanceSearchForm.setFieldError("name", true);
                                                //   }
                                                //   if (!advanceSearchForm.values.mobile) {
                                                //     validation = false;
                                                //     advanceSearchForm.setFieldError("mobile", true);
                                                //   }
                                                //   if (!advanceSearchForm.values.invoice) {
                                                //     validation = false;
                                                //     advanceSearchForm.setFieldError("invoice", true);
                                                //   }

                                                //   if (validation) {
                                                //     // const value = {
                                                //     //   url: "core/customer",
                                                //     //   data: advanceSearchForm.values,
                                                //     // };
                                                //     // dispatch(storeEntityData(value));
                                                //     // advanceSearchForm.reset();
                                                //     // setRefreshCustomerDropdown(true);
                                                //     // advanceSearchFormOpened(false);
                                                //     // document.getElementById(focusField).focus();
                                                //   }
                                                // }}
                                            >
                                                <Flex direction={`column`} gap={0}>
                                                    <Text fz={12} fw={400}>
                                                        {t("Search")}
                                                    </Text>
                                                </Flex>
                                            </Button>
                                        </Grid.Col>
                                    </Grid>
                                </Box>
                            </Box>
                        </form>
                    </Box>
                </Popover.Dropdown>
            </Popover>
        </Box>
    );
}
