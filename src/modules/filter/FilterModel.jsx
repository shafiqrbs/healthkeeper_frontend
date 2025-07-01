import React from "react";
import { Drawer, Button, Box, Flex, Text, ScrollArea, ActionIcon, Group } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { setGlobalFetching } from "@/app/store/core/crudSlice.js";
import { useDispatch } from "react-redux";
import CustomerFilterForm from "@modules/core/customer/CustomerFilterForm.jsx";
import VendorFilterForm from "@/modules/filter/VendorFilterForm.jsx";
import UserFilterForm from "@modules/core/user/UserFilterForm.jsx";
import ProductFilterForm from "@modules/inventory/product/ProductFilterForm.jsx";
import CategoryGroupFilterForm from "@modules/inventory/category-group/CategoryGroupFilterForm.jsx";
import CategoryFilterForm from "@modules/inventory/category/CategoryFilterForm.jsx";
import { useOutletContext } from "react-router-dom";
import { IconSearch, IconX } from "@tabler/icons-react";
import __ProductionSettingFilterForm from "@modules/production/settings/__ProductionSettingFilterForm.jsx";
import WarehouseFilterForm from "@modules/core/warehouse/WarehouseFilterForm.jsx";
import FileUploadFilterForm from "@modules/core/file-upload/FIleUploadFIlterForm.jsx";

function FilterModel({ filterModel, setFilterModel, module }) {
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight;

	const dispatch = useDispatch();

	const closeModel = () => {
		setFilterModel(false);
	};

	return (
		<Drawer.Root opened={filterModel} position="right" onClose={closeModel} size={"30%"}>
			<Drawer.Overlay />
			<Drawer.Content>
				<ScrollArea h={height + 100} scrollbarSize={2} type="never" bg={"gray.1"}>
					<Group mih={40} justify="space-between">
						<Box>
							<Text fw={"600"} fz={"16"} ml={"md"}>
								{t("FilterData")}
							</Text>
						</Box>
						<ActionIcon
							mr={"sm"}
							radius="xl"
							color="red.6"
							size="md"
							onClick={closeModel}
						>
							<IconX style={{ width: "100%", height: "100%" }} stroke={1.5} />
						</ActionIcon>
					</Group>

					<Box ml={2} mr={2} mt={0} p={"xs"} className="borderRadiusAll" bg={"white"}>
						<Box bg={"white"} p={"xs"} className={"borderRadiusAll"} h={height - 37}>
							{module === "customer" && <CustomerFilterForm module={module} />}
							{module === "warehouse" && <WarehouseFilterForm module={module} />}
							{module === "category-group" && (
								<CategoryGroupFilterForm module={module} />
							)}
							{module === "vendor" && <VendorFilterForm module={module} />}
							{module === "user" && <UserFilterForm module={module} />}
							{module === "product" && <ProductFilterForm module={module} />}
							{module === "category" && <CategoryFilterForm module={module} />}
							{module === "production-setting" && (
								<__ProductionSettingFilterForm module={module} />
							)}
							{module === "file-upload" && <FileUploadFilterForm module={module} />}
						</Box>
						<Box
							pl={`xs`}
							pr={8}
							pt={"6"}
							pb={"6"}
							mb={"2"}
							mt={4}
							className={"boxBackground borderRadiusAll"}
						>
							<Group justify="flex-end">
								<Button
									size="xs"
									color={`green.8`}
									type="submit"
									id={"submit"}
									w={142}
									onClick={() => {
										dispatch(setGlobalFetching(true));
										closeModel();
									}}
									leftSection={<IconSearch size={16} />}
								>
									<Flex direction={`column`} gap={0}>
										<Text fz={14} fw={400}>
											{t("Submit")}
										</Text>
									</Flex>
								</Button>
							</Group>
						</Box>
					</Box>
				</ScrollArea>
			</Drawer.Content>
		</Drawer.Root>
	);
}

export default FilterModel;
