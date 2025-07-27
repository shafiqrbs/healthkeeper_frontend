import React, {useEffect, useMemo, useRef, useState} from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  Group,
  Box,
  Button,
  Switch,
  Menu,
  ActionIcon,
  rem,
  Text,
  Image,
  Modal,
} from "@mantine/core";

import { DataTable } from "mantine-datatable";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  getIndexEntityData,
  setFetching,
} from "../../../../store/core/crudSlice.js";
import tableCss from "../../../../assets/css/Table.module.css";
import __StockSearch from "./__StockSearch.jsx";
import { setDeleteMessage } from "../../../../store/inventory/crudSlice.js";
import OverviewModal from "../product-overview/OverviewModal.jsx";
import { IconCheck, IconDotsVertical, IconTrashX } from "@tabler/icons-react";
import { showEntityData } from "../../../../store/core/crudSlice.js";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { showNotificationComponent } from "../../../core-component/showNotificationComponent.jsx";
import {
  editEntityData,
  setFormLoading,
  setInsertType,
} from "../../../../store/core/crudSlice.js";
import { modals } from "@mantine/modals";
import AddMeasurement from "../modal/AddMeasurement.jsx";
import { Carousel } from "@mantine/carousel";
import Autoplay from "embla-carousel-autoplay";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import { useForm } from "@mantine/form";

function StockTable(props) {
  const { categoryDropdown, locationData } = props;
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 120; //TabList height 104

  const navigate = useNavigate();
  const perPage = 50;
  const [page, setPage] = useState(1);

  const fetchingReload = useSelector((state) => state.crudSlice.fetching);
  const [fetching, setFetching] = useState(true);
  const searchKeyword = useSelector((state) => state.crudSlice.searchKeyword);
  const [indexData, setIndexData] = useState([]);
  const productFilterData = useSelector(
    (state) => state.inventoryCrudSlice.productFilterData
  );
  const entityDataDelete = useSelector(
    (state) => state.inventoryCrudSlice.entityDataDelete
  );

  // Sync `configData` with localStorage
  const [configData, setConfigData] = useState(() => {
    const storedConfigData = localStorage.getItem("domain-config-data");
    return storedConfigData ? JSON.parse(storedConfigData) : [];
  });
  const product_config = configData?.inventory_config?.config_product;

  const [viewModal, setViewModal] = useState(false);

  // remove this line when api integrated
  const [checked, setChecked] = useState({});

  const [swtichEnable, setSwitchEnable] = useState({});
  const [measurementDrawer, setMeasurementDrawer] = useState(false);
  const [id, setId] = useState("null");

  const handleSwtich = (event, item) => {
    setChecked((prev) => ({ ...prev, [item.product_id]: !prev[item.product_id] }));
    setSwitchEnable((prev) => ({ ...prev, [item.product_id]: true }));

    setTimeout(() => {
      setSwitchEnable((prev) => ({ ...prev, [item.product_id]: false }));
    }, 5000);
  };

  const [downloadStockXLS, setDownloadStockXls] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const value = {
        url: "inventory/product",
        param: {
          term: searchKeyword,
          name: productFilterData.name,
          alternative_name: productFilterData.alternative_name,
          sku: productFilterData.sku,
          sales_price: productFilterData.sales_price,
          product_type_id: productFilterData.product_type_id,
          category_id: productFilterData.category_id,
          page: searchKeyword ? 1: page,
          offset: perPage,
          type: "stock",
        },
      };

      try {
        const resultAction = await dispatch(getIndexEntityData(value));

        if (getIndexEntityData.rejected.match(resultAction)) {
          console.error("Error:", resultAction);
        } else if (getIndexEntityData.fulfilled.match(resultAction)) {
          setIndexData(resultAction.payload);
          setFetching(false)
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    fetchData();
  }, [fetching, downloadStockXLS, searchKeyword, productFilterData, page]);

  useEffect(() => {
    dispatch(setDeleteMessage(""));
    if (entityDataDelete === "success") {
      notifications.show({
        color: "red",
        title: t("DeleteSuccessfully"),
        icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
        loading: false,
        autoClose: 700,
        style: { backgroundColor: "lightgray" },
      });

      setTimeout(() => {
        setFetching(true)
      }, 700);
    }
  }, [entityDataDelete]);

  const [isColor, setColor] = useState(product_config?.sku_color === 1);
  const [isGrade, setGrade] = useState(product_config?.sku_grade === 1);
  const [isSize, setSize] = useState(product_config?.sku_size === 1);
  const [isModel, setModel] = useState(product_config?.sku_model === 1);
  const [isBrand, setBrand] = useState(product_config?.sku_brand === 1);

  useEffect(() => {
    if (downloadStockXLS) {
      const fetchData = async () => {
        const value = {
          url: "inventory/generate/stock-item/xlsx",
          param: {},
        };

        try {
          const resultAction = await dispatch(getIndexEntityData(value));
          if (getIndexEntityData.rejected.match(resultAction)) {
            console.error("Error:", resultAction);
          } else if (getIndexEntityData.fulfilled.match(resultAction)) {
            if (resultAction.payload.status === 200) {
              const href = `${
                import.meta.env.VITE_API_GATEWAY_URL + "stock-item/download"
              }`;

              const anchorElement = document.createElement("a");
              anchorElement.href = href;
              document.body.appendChild(anchorElement);
              anchorElement.click();
              document.body.removeChild(anchorElement);
            } else {
              showNotificationComponent(resultAction.payload.error, "red");
            }
          }
        } catch (err) {
          console.error("Unexpected error:", err);
        } finally {
          setDownloadStockXls(false);
        }
      };

      fetchData();
    }
  }, [downloadStockXLS, dispatch]);

  // Location Dropdown
  const form = useForm({
    initialValues: {
      location_id: "",
    },
  });




  const [sortStatus, setSortStatus] = useState({
    columnAccessor: 'product_name',
    direction: 'asc'
  });

  // Memoized Sorted Data
  const sortedRecords = useMemo(() => {
    if (!indexData?.data) return [];

    return [...indexData.data].sort((a, b) => {
      const aVal = a[sortStatus.columnAccessor];
      const bVal = b[sortStatus.columnAccessor];

      if (aVal == null) return 1;
      if (bVal == null) return -1;

      const valA = typeof aVal === 'string' ? aVal.toLowerCase() : aVal;
      const valB = typeof bVal === 'string' ? bVal.toLowerCase() : bVal;

      if (valA < valB) return sortStatus.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortStatus.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [indexData?.data, sortStatus]);


  return (
    <>
      <Box
        pl={`xs`}
        pb={"xs"}
        pr={8}
        pt={"xs"}
        mb={"xs"}
        className={"boxBackground borderRadiusAll"}
      >
        <__StockSearch
          module={"stock"}
          setDownloadStockXls={setDownloadStockXls}
          categoryDropdown={categoryDropdown}
        />
      </Box>
      <Box className={"borderRadiusAll"}>
        <DataTable
          classNames={{
            root: tableCss.root,
            table: tableCss.table,
            header: tableCss.header,
            footer: tableCss.footer,
            pagination: tableCss.pagination,
          }}
          records={sortedRecords}
          columns={[
            {
              accessor: "index",
              title: t("S/N"),
              textAlignment: "right",
              render: (_row, index) => index + 1 + (page - 1) * perPage,
            },
            { accessor: "product_type", title: t("NatureOfProduct") ,sortable: true},
            { accessor: "category_name", title: t("Category"),sortable: true },
            { accessor: "product_name", title: t("Name"),sortable: true },
            { accessor: "barcode", title: t("Barcode"),sortable: true },
            { accessor: "rem_quantity", title: t("Quantity"), textAlign: "center" },
            { accessor: "brand_name", title: t("Brand"), hidden: !isBrand },
            { accessor: "grade_name", title: t("Grade"), hidden: !isGrade },
            { accessor: "color_name", title: t("Color"), hidden: !isColor },
            { accessor: "size_name", title: t("Size"), hidden: !isSize },
            { accessor: "model_name", title: t("Model"), hidden: !isModel },

            {
              accessor: "unit_name",
              title: t("Unit"),
              render: (item) => (
                  <Button
                      component="a"
                      size="compact-xs"
                      radius="xs"
                      color='var(--theme-primary-color-4)'
                      variant="filled"
                      fw={"100"}
                      fz={"12"}
                      onClick={() => {
                        setId(item.product_id);
                        setMeasurementDrawer(true);
                      }}
                  >
                    {item.unit_name}
                  </Button>


              ),
            },
            {
              accessor: "purchase_price",
              title: t("PurchasePrice"),
              textAlign: "center",
            },
            {
              accessor: "sales_price",
              title: t("SalesPrice"),
              textAlign: "center",
            },
            { accessor: "vat", title: t("Vat") },


            {
              accessor: "status",
              title: t("Status"),
              render: (item) => (
                <>
                  <Switch
                    disabled={swtichEnable[item.product_id] || false}
                    checked={checked[item.product_id] || item.status === 1}
                    color='var(--theme-primary-color-6)'
                    radius="xs"
                    size="md"
                    onLabel="Enable"
                    offLabel="Disable"
                    onChange={(event) => {
                      handleSwtich(event, item);
                    }}
                  />
                </>
              ),
            },
            {
              accessor: "action",
              title: t("Action"),
              textAlign: "right",
              render: (item) => (
                <Group gap={4} justify="right" wrap="nowrap">
                  <Button
                    component="a"
                    size="compact-xs"
                    radius="xs"
                    variant="filled"
                    fw={"100"}
                    fz={"12"}
                    color='var(--theme-primary-color-6)'
                    mr={"4"}
                    onClick={() => {
                      dispatch(showEntityData("inventory/product/" + item.product_id));
                      setViewModal(true);
                    }}
                  >
                    {" "}
                    {t("View")}
                  </Button>
                  {!item.parent_id &&
                  <Menu
                      position="bottom-end"
                      offset={3}
                      withArrow
                      trigger="hover"
                      openDelay={100}
                      closeDelay={400}
                  >
                    <Menu.Target>
                      <ActionIcon
                          size="sm"
                          variant="outline"
                          color='var(--theme-primary-color-6)'
                          radius="xl"
                          aria-label="Settings"
                      >
                        <IconDotsVertical
                            height={"18"}
                            width={"18"}
                            stroke={1.5}
                        />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                          onClick={() => {
                            dispatch(setInsertType("update"));
                            dispatch(
                                editEntityData("inventory/product/" + item.product_id)
                            );
                            dispatch(setFormLoading(true));
                            navigate(`/inventory/product/${item.product_id}`);
                          }}
                      >
                        {t("Edit")}
                      </Menu.Item>

                      <Menu.Item
                          target="_blank"
                          component="a"
                          w={"200"}
                          mt={"2"}
                          bg={"red.1"}
                          c={"red.6"}
                          onClick={() => {
                            modals.openConfirmModal({
                              title: (
                                  <Text size="md">
                                    {" "}
                                    {t("FormConfirmationTitle")}
                                  </Text>
                              ),
                              children: (
                                  <Text size="sm">
                                    {" "}
                                    {t("FormConfirmationMessage")}
                                  </Text>
                              ),
                              labels: {confirm: "Confirm", cancel: "Cancel"},
                              confirmProps: {color: "red.6"},
                              onCancel: () => console.log("Cancel"),
                              onConfirm: () => {
                                console.log("ok pressed");
                              },
                            });
                          }}
                          rightSection={
                            <IconTrashX
                                style={{width: rem(14), height: rem(14)}}
                            />
                          }
                      >
                        {t("Delete")}
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                  }

                </Group>
              ),
            },
          ]}
          fetching={fetching || downloadStockXLS || fetchingReload}
          totalRecords={indexData.total}
          sortStatus={sortStatus}
          onSortStatusChange={setSortStatus}
          recordsPerPage={perPage}
          page={page}
          onPageChange={(p) => {
            setPage(p);
            setFetching(true)
          }}
          loaderSize="xs"
          loaderColor="grape"
          height={height}
          scrollAreaProps={{ type: "never" }}
        />
      </Box>
      {viewModal && (
        <OverviewModal viewModal={viewModal} setViewModal={setViewModal} />
      )}
      {measurementDrawer && (
        <AddMeasurement
          measurementDrawer={measurementDrawer}
          setMeasurementDrawer={setMeasurementDrawer}
          id={id}
        />
      )}
    </>
  );
}

export default StockTable;
