import {
	IconDashboard,
	IconSettings,
	IconIcons,
	IconCategory,
	IconCopyCheck,
	IconShoppingBag,
	IconShoppingCart,
} from "@tabler/icons-react";
import { Button, Flex, Text, Tooltip, ScrollArea } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext } from "react-router-dom";
import { getUserRole } from "@/common/utils";

export default function Navigation({ module }) {
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 30;
	const navigate = useNavigate();
	const userRole = getUserRole();

	return (
		<>
			<ScrollArea
				h={
					module === "opening-approve-stock"
						? height
						: module === "config" || module === "purchase-invoice"
						? height
						: module === "purchase" || module === "sales"
						? height - 52
						: module === "opening-stock"
						? height + 4
						: module
						? height - 63
						: height
				}
				bg="white"
				type="never"
				className="border-radius"
			>
				<Flex direction={`column`} align={"center"} gap={"16"}>
					<Flex direction={`column`} align={"center"} mt={"xs"} pt={5}>
						<Tooltip
							label={t("InvoiceBatch")}
							px={16}
							py={2}
							withArrow
							position={"left"}
							c={"white"}
							bg={"#4CAF50"}
							transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
						>
							<Button
								bg={"#4CAF50"}
								size="md"
								pl={"12"}
								pr={"12"}
								variant={"light"}
								color={`black`}
								radius="xl"
								onClick={() => {
									navigate("/inventory/invoice-batch");
								}}
							>
								<Flex direction={`column`} align={"center"}>
									<IconDashboard size={16} color={"white"} />
								</Flex>
							</Button>
						</Tooltip>
						<Flex direction={`column`} align={"center"} fz={"12"} c={"black"}>
							<Text
								size="xs"
								c="black"
								ta="center"
								w={56}
								style={{
									wordBreak: "break-word",
									hyphens: "auto",
								}}
							>
								{t("InvoiceBatch")}
							</Text>
						</Flex>
					</Flex>
					<Flex direction={`column`} align={"center"}>
						<Tooltip
							label={t("Sales")}
							px={16}
							py={2}
							withArrow
							position={"left"}
							c={"white"}
							bg={"#6f1225"}
							transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
						>
							<Button
								bg={"#6f1225"}
								size="md"
								pl={"12"}
								pr={"12"}
								variant={"light"}
								color={`black`}
								radius="xl"
								onClick={() => {
									navigate("/inventory/sales");
								}}
							>
								<Flex direction={`column`} align={"center"}>
									<IconDashboard size={16} color={"white"} />
								</Flex>
							</Button>
						</Tooltip>
						<Flex direction={`column`} align={"center"} fz={"12"} c={"black"}>
							<Text
								size="xs"
								c="black"
								ta="center"
								w={56}
								style={{
									wordBreak: "break-word",
									hyphens: "auto",
								}}
							>
								{t("Sales")}
							</Text>
						</Flex>
					</Flex>
					<Flex direction={`column`} align={"center"}>
						<Tooltip
							label={t("NewSales")}
							px={16}
							py={2}
							withArrow
							position={"left"}
							c={"white"}
							bg={"#E53935"}
							transitionProps={{
								transition: "pop-bottom-left",
								duration: 500,
							}}
						>
							<Button
								bg={"#E53935"}
								size="md"
								pl={"12"}
								pr={"12"}
								variant={"light"}
								color={`black`}
								radius="xl"
								onClick={() => {
									navigate("/inventory/sales-invoice");
								}}
							>
								<Flex direction={`column`} align={"center"}>
									<IconCategory size={16} color={"white"} />
								</Flex>
							</Button>
						</Tooltip>
						<Flex direction={`column`} align={"center"} fz={"12"} c={"black"}>
							<Text
								size="xs"
								c="black"
								ta="center"
								w={56}
								style={{
									wordBreak: "break-word",
									hyphens: "auto",
								}}
							>
								{t("NewSales")}
							</Text>
						</Flex>
					</Flex>
					<Flex direction={`column`} align={"center"}>
						<Tooltip
							label={t("Purchase")}
							px={16}
							py={2}
							withArrow
							position={"left"}
							c={"white"}
							bg={"#3F51B5"}
							transitionProps={{
								transition: "pop-bottom-left",
								duration: 500,
							}}
						>
							<Button
								bg={"#3F51B5"}
								size="md"
								pl={"12"}
								pr={"12"}
								variant={"light"}
								color={`black`}
								radius="xl"
								onClick={() => {
									navigate("/inventory/purchase");
								}}
							>
								<Flex direction={`column`} align={"center"}>
									<IconIcons size={16} color={"white"} />
								</Flex>
							</Button>
						</Tooltip>
						<Flex direction={`column`} align={"center"} fz={"12"} c={"black"}>
							<Text
								size="xs"
								c="black"
								ta="center"
								w={56}
								style={{
									wordBreak: "break-word",
									hyphens: "auto",
								}}
							>
								{t("Purchase")}
							</Text>
						</Flex>
					</Flex>
					<Flex direction={`column`} align={"center"}>
						<Tooltip
							label={t("NewPurchase")}
							px={16}
							py={2}
							withArrow
							position={"left"}
							c={"white"}
							bg={"#F59E0B"}
							transitionProps={{
								transition: "pop-bottom-left",
								duration: 500,
							}}
						>
							<Button
								bg={"#F59E0B"}
								size="md"
								pl={"12"}
								pr={"12"}
								variant={"light"}
								color={`black`}
								radius="xl"
								onClick={() => {
									navigate("/inventory/purchase-invoice");
								}}
							>
								<Flex direction={`column`} align={"center"}>
									<IconShoppingBag size={16} color={"white"} />
								</Flex>
							</Button>
						</Tooltip>
						<Flex direction={`column`} align={"center"} fz={"12"} c={"black"}>
							<Text
								size="xs"
								c="black"
								ta="center"
								w={56}
								style={{
									wordBreak: "break-word",
									hyphens: "auto",
								}}
							>
								{t("NewPurchase")}
							</Text>
						</Flex>
					</Flex>
					<Flex direction={`column`} align={"center"}>
						<Tooltip
							label={t("OpeningStock")}
							px={16}
							py={2}
							withArrow
							position={"left"}
							c={"white"}
							bg={"#06B6D4"}
							transitionProps={{
								transition: "pop-bottom-left",
								duration: 500,
							}}
						>
							<Button
								bg={"#06B6D4"}
								size="md"
								pl={"12"}
								pr={"12"}
								variant={"light"}
								color={"black"}
								radius="xl"
								onClick={() => {
									navigate("/inventory/opening-stock");
								}}
							>
								<Flex direction={`column`} align={"center"}>
									<IconShoppingCart size={16} color={"white"} />
								</Flex>
							</Button>
						</Tooltip>
						<Flex direction={`column`} align={"center"} fz={"12"} c={"black"}>
							<Text
								size="xs"
								c="black"
								ta="center"
								w={56}
								style={{
									wordBreak: "break-word",
									hyphens: "auto",
								}}
							>
								{t("Opening")}
							</Text>
						</Flex>
					</Flex>
					<Flex direction={`column`} align={"center"}>
						<Tooltip
							label={t("ApproveStock")}
							px={16}
							py={2}
							withArrow
							position={"left"}
							c={"white"}
							bg={"#10B981"}
							transitionProps={{
								transition: "pop-bottom-left",
								duration: 500,
							}}
						>
							<Button
								bg={"#10B981"}
								size="md"
								pl={"12"}
								pr={"12"}
								variant={"light"}
								color={`black`}
								radius="xl"
								onClick={() => {
									navigate("/inventory/opening-approve-stock");
								}}
							>
								<Flex direction={`column`} align={"center"}>
									<IconCopyCheck size={16} color={"white"} />
								</Flex>
							</Button>
						</Tooltip>
						<Flex direction={`column`} align={"center"} fz={"12"} c={"black"}>
							<Text
								size="xs"
								c="black"
								ta="center"
								w={56}
								style={{
									wordBreak: "break-word",
									hyphens: "auto",
								}}
							>
								{t("Approve")}
							</Text>
						</Flex>
					</Flex>
					{userRole && userRole.length > 0 && userRole.includes("role_domain") && (
						<Flex direction={`column`} align={"center"}>
							<Tooltip
								label={t("Configuration")}
								px={16}
								py={2}
								withArrow
								position={"left"}
								c={"white"}
								bg={"#6e66d6"}
								transitionProps={{
									transition: "pop-bottom-left",
									duration: 500,
								}}
							>
								<Button
									bg={"#6e66d6"}
									size="md"
									pl={"12"}
									pr={"12"}
									variant={"light"}
									color={`black`}
									radius="xl"
									onClick={() => {
										navigate("/inventory/config");
									}}
								>
									<Flex direction={`column`} align={"center"}>
										<IconSettings size={16} color={"white"} />
									</Flex>
								</Button>
							</Tooltip>
							<Flex direction={`column`} align={"center"} fz={"12"} c={"black"}>
								<Text
									size="xs"
									c="black"
									ta="center"
									w={56}
									style={{
										wordBreak: "break-word",
										hyphens: "auto",
									}}
								>
									{t("Setting")}
								</Text>
							</Flex>
						</Flex>
					)}
				</Flex>
			</ScrollArea>
		</>
	);
}
