import {
	IconAdjustments,
	IconMap2,
	IconLetterMSmall,
	IconSettings,
	IconBuildingStore,
	IconBrandCodesandbox,
	IconBrandProducthunt,
	IconCreditCard,
} from "@tabler/icons-react";

export const coreHeaderLinks = {
	core: {
		topBarLinks: [
			{ link: "/core/customer", label: "Customers" },
			{ link: "/core/vendor", label: "Vendors" },
			{ link: "/core/user", label: "Users" },
		],
		dropDownLinks: [
			{
				link: "/core/setting",
				label: "Setting",
				icon: IconAdjustments,
			},
			{
				link: "/core/warehouse",
				label: "Warehouse",
				icon: IconMap2,
			},
			{
				link: "/core/marketing-executive",
				label: "MarketingExecutive",
				icon: IconLetterMSmall,
			},
			{
				link: "/inventory/config",
				label: "Configuration",
				icon: IconSettings,
			},
		],
	},
	accounting: {
		topBarLinks: [
			{ link: "/accounting/voucher-entry", label: "VoucherEntry" },
			{ link: "/accounting/ledger", label: "Ledger" },
			{ link: "/accounting/voucher-create", label: "Voucher" },
		],
		dropDownLinks: [
			{
				link: "/accounting/transaction-mode",
				label: "Transaction",
				icon: IconSettings,
			},
			{
				link: "/accounting/head-group",
				label: "AccountHeadGroup",
				icon: IconSettings,
			},
			{
				link: "/accounting/head-subgroup",
				label: "AccountSubHeadGroup",
				icon: IconSettings,
			},
			{
				link: "/accounting/config",
				label: "Settings",
				icon: IconSettings,
			},
		],
	},
	b2b: {
		topBarLinks: [
			{ link: "/b2b/dashboard", label: "Dashboard" },
			{ link: "/b2b/domain", label: "Domains" },
			{ link: "/b2b/master-user", label: "MasterUser" },
		],
		dropDownLinks: [],
	},
	domain: {
		topBarLinks: [{ link: "/domain", label: "Domains" }],
		dropDownLinks: [
			{
				label: "Sitemap",
				path: "/domain/sitemap",
				icon: IconMap2,
			},
			{
				label: "BranchManagement",
				path: "/domain/branch-management",
				icon: IconBuildingStore,
			},
		],
	},
	discount: {
		topBarLinks: [
			{ link: "/b2b/dashboard", label: "Dashboard" },
			{ link: "/b2b/domain", label: "Domains" },
		],
		dropDownLinks: [],
	},
	reporting: {
		topBarLinks: [{ link: "/reporting/reports", label: "Reports" }],
		dropDownLinks: [
			{
				link: "/accounting/transaction-mode",
				label: "Transaction",
				icon: IconSettings,
			},
			{
				link: "/accounting/head-group",
				label: "AccountHeadGroup",
				icon: IconSettings,
			},
			{
				link: "/accounting/head-subgroup",
				label: "AccountSubHeadGroup",
				icon: IconSettings,
			},
			{
				link: "/accounting/config",
				label: "Settings",
				icon: IconSettings,
			},
		],
	},
	inventory: {
		topBarLinks: [
			{ link: "/inventory/product", label: "Products" },
			{ link: "/inventory/category", label: "Category" },
			{ link: "/inventory/category-group", label: "CategoryGroup" },
			{ link: "/inventory/stock", label: "Stock" },
		],
		dropDownLinks: [
			{
				link: "/inventory/opening-stock",
				label: "OpeningStockN",
				icon: IconBrandCodesandbox,
			},
			{
				link: "/inventory/particular",
				label: "ProductSetting",
				icon: IconBrandProducthunt,
			},
			{
				link: "/inventory/config",
				label: "InventoryConfiguration",
				icon: IconBrandCodesandbox,
			},
		],
	},
	pharmacy: {
		topBarLinks: [
			{ link: "/pharmacy/core/generic", label: "Generic" },
			{ link: "/pharmacy/core/medicine", label: "Medicine" },
			{ link: "/pharmacy/stock", label: "Stock" },
			{ link: "/pharmacy/stock-matrix", label: "Stock Matrix" },
			{ link: "/pharmacy/core/workorder", label: "Workorder" },
			{ link: "/pharmacy/core/store-indent", label: "Indent" },
		]
	},
	store: {
		topBarLinks: [
			{ link: "/store/stock", label: "Stock" },
			{ link: "/store/requisition", label: "Indent" },
		]
	},
	procurement: {
		topBarLinks: [
			{
				link: "/procurement/requisition",
				label: "Requisition",
			},
			{
				link: "/procurement/new-requisition",
				label: "NewRequisition",
			},
		],
		dropDownLinks: [
			{
				link: "/procurement/purchase",
				label: "Requisition",
				icon: IconCreditCard,
			},
			{
				link: "/procurement/new-requisition",
				label: "NewRequisition",
				icon: IconCreditCard,
			},
		],
	},
};
