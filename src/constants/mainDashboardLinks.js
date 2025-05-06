import {
	IconBasket,
	IconCategory,
	IconCategory2,
	IconCurrencyMonero,
	IconList,
	IconListDetails,
	IconShoppingBag,
	IconShoppingBagPlus,
	IconShoppingCartUp,
	IconUsers,
	IconUsersGroup,
} from "@tabler/icons-react";

export const INVENTORY_NAV_LINKS = [
	{
		icon: IconShoppingCartUp,
		href: "/inventory/purchase-invoice",
		label: "NewPurchase",
	},
	{
		icon: IconList,
		href: "/inventory/invoice-batch",
		label: "InvoiceBatch",
	},
	{
		icon: IconList,
		href: "/inventory/opening-stock",
		label: "OpeningStock",
	},
	{
		icon: IconList,
		href: "/inventory/opening-approve-stock",
		label: "OpeningApprove",
	},
];

export const ACCOUNTING_NAV_LINKS = [
	{
		icon: IconList,
		href: "/accounting/transaction-mode",
		label: "TransactionMode",
	},
	{
		icon: IconBasket,
		href: "/accounting/ledger",
		label: "Ledger",
	},
	{
		icon: IconBasket,
		href: "/accounting/head-group",
		label: "HeadGroup",
	},
	{
		icon: IconBasket,
		href: "/accounting/head-subgroup",
		label: "HeadSubGroup",
	},
];

export const PROCUREMENT_NAV_LINKS = [
	{
		icon: IconShoppingBag,
		href: "/procurement/requisition",
		label: "Requisition",
	},
	{
		icon: IconShoppingBagPlus,
		href: "/procurement/new-requisition",
		label: "NewRequisition",
	},
];

export const INVENTORY_NAV_LINKS2 = [
	{
		href: "/inventory/product",
		label: "ManageProduct",
		icon: IconListDetails,
	},
	{
		href: "/inventory/category",
		label: "Category",
		icon: IconCategory,
	},
	{
		href: "/inventory/category-group",
		label: "CategoryGroup",
		icon: IconCategory2,
	},
	{
		href: "/inventory/stock-transfer",
		label: "StockTransfer",
		icon: IconCategory2,
	},
	{
		href: "/inventory/stock-reconciliation",
		label: "StockReconciliation",
		icon: IconCategory2,
	},
	{
		href: "/inventory/coupon-code",
		label: "CouponCode",
		icon: IconCategory2,
	},
	{
		href: "/inventory/barcode-print",
		label: "BarcodePrint",
		icon: IconCategory2,
	},
	{
		href: "/inventory/particular",
		label: "Particular",
		icon: IconCategory2,
	},
	{
		href: "/inventory/config",
		label: "Configuration",
		icon: IconCategory2,
	},
];

export const DOMAIN_NAV_LINKS = [
	{
		href: "/domain",
		label: "ManageDomain",
		icon: IconCurrencyMonero,
	},
	{
		href: "/b2b/dashboard",
		label: "B2BManagement",
		icon: IconCurrencyMonero,
	},
	{
		href: "/discount",
		label: "Discount",
		icon: IconCurrencyMonero,
	},
];

export const CORE_NAV_LINKS = [
	{
		href: "core/customer",
		label: "ManageCustomers",
		icon: IconUsersGroup,
	},
	{
		href: "core/vendor",
		label: "ManageVendors",
		icon: IconUsersGroup,
	},
	{
		href: "core/user",
		label: "ManageUsers",
		icon: IconUsers,
	},
];

export const CORE_NAV_LINKS2 = [
	{
		href: "core/file-upload",
		label: "ManageFile",
		icon: IconUsers,
	},
	{
		href: "core/setting",
		label: "Setting",
		icon: IconUsers,
	},
];

export const PRODUCTION_NAV_LINKS = [
	{
		href: "/production/batch",
		label: "ProductionBatch",
		icon: IconShoppingBag,
	},
	{
		href: "/production/batch/new",
		label: "NewBatch",
		icon: IconShoppingBag,
	},
	{
		href: "/production/items",
		label: "ProductionItems",
		icon: IconShoppingBag,
	},
	{
		href: "/production/issue-production-general",
		label: "GeneralProductionIssue",
		icon: IconShoppingBag,
	},
	{
		href: "/production/issue-production-batch",
		label: "BatchProdcutionIssue",
		icon: IconShoppingBag,
	},
	{
		href: "/production/setting",
		label: "ProductionSetting",
		icon: IconShoppingBag,
	},
	{
		href: "/production/config",
		label: "Configuration",
		icon: IconShoppingBag,
	},
];
