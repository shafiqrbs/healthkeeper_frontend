import { Routes, Route } from "react-router-dom";
import Login from "@modules/auth/Login";
import Layout from "@components/layout/Layout";
// import SampleDashboard from "@modules/sample-module/DashBoard";
// import CustomerIndex from "@modules/core/customer/CustomerIndex";
// import UserIndex from "@modules/core/user/UserIndex";
import VendorIndex from "@/modules/core/vendor/VendorIndex";
// import ProductionConfigurationIndex from "@modules/production/configuraton/ConfigurationIndex";
// import CategoryGroupIndex from "@modules/inventory/category-group/CategoryGroupIndex";
// import CategoryIndex from "@modules/inventory/category/CategoryIndex";
// import ProductIndex from "@modules/inventory/product/ProductIndex";
// import SalesIndex from "@modules/inventory/sales/SalesIndex";
// import SampleInvoice from "@modules/sample-module/sample-layout/SampleInvoice";
// import SampleIndex from "@modules/sample-module/sample-layout/SampleIndex";
import DomainIndex from "@modules/domain/domain/DomainIndex";
// import TransactionModeIndex from "@modules/accounting/transaction-mode/TransactionModeIndex";
// import SalesInvoice from "@modules/inventory/sales/SalesInvoice";
// import Sitemap from "@modules/dashboard/SItemap";
// import PurchaseIndex from "@modules/inventory/purchase/PurchaseIndex";
// import PurchaseInvoice from "@modules/inventory/purchase/PurchaseInvoice";
// import VoucherIndex from "@modules/accounting/voucher-entry/VoucherIndex";
// import HeadGroupIndex from "@modules/accounting/head-group/HeadGroupIndex";
// import HeadSubGroupIndex from "@modules/accounting/head-subgroup/HeadSubGroupIndex";
// import LedgerIndex from "@modules/accounting/ledger/LedgerIndex";
// import SalesEdit from "@modules/inventory/sales/SalesEdit";
// import PurchaseEdit from "@modules/inventory/purchase/PurchaseEdit";
// import SampleModalIndex from "@modules/sample3Grid/SampleModalIndex";
// import OpeningApproveIndex from "@modules/inventory/opening-stock/OpeningApproveIndex";
// import OpeningStockIndex from "@modules/inventory/opening-stock/OpeningStockIndex";
// import InvoiceBatchIndex from "@modules/inventory/invoice-batch/InvoiceBatchIndex";
// import WarehouseIndex from "@modules/core/warehouse/WarehouseIndex";
// import MarketingExecutiveIndex from "@modules/core/marketing-executive/MarketingExecutiveIndex";
// import ProductSettingsIndex from "@modules/inventory/product-settings/ProductSettingsIndex";
// import ProductionSettingIndex from "@modules/production/settings/ProductionSettingIndex";
// import RecipeItemsIndex from "@modules/production/recipe-items/RecipeItemsIndex";
// import RecipeIndex from "@modules/production/recipe-items/recipe/RecipeIndex";
// import InventoryConfigurationIndex from "@modules/inventory/inventory-configuration/InventoryConfigurationIndex";
// import ParticularIndex from "@modules/inventory/particular/ParticularIndex";
// import InhouseIndex from "@modules/production/production-inhouse/InhouseIndex";
// import SettingsIndex from "@modules/core/settings/SettingsIndex";

// import StockIndex from "@modules/inventory/stock/StockIndex";
import ConfigurationIndex from "@modules/domain/configuration/ConfigurationIndex";
import DomainUserIndex from "@modules/domain/master-user/DomainUserIndex";
// import SitemapIndex from "@modules/domain/sitemap/SitemapIndex";
// import BatchIndex from "@modules/production/batch/BatchIndex";
// import Requisition from "@modules/procurement/purchase-requisition/Requisition";
// import RequisitionInvoice from "@modules/procurement/purchase-requisition/RequisitionInvoice";
// import BranchManagementIndex from "@modules/domain/branch-management/BranchManagementIndex";
// import AccountingConfig from "@modules/accounting/config/ConfigIndex";
// import FileUploadIndex from "@modules/core/file-upload/FileUploadIndex";
// import MatrixIndex from "@modules/procurement/requistion-matrix/MatrixIndex";
// import BakeryIndex from "@modules/pos/bakery/BakeryIndex";
// import ReportIndex from "@modules/reporting/reports/ReportIndex";
// import RequisitionUpdate from "@modules/procurement/purchase-requisition/RequisitionUpdate";
// import ReconciliationIndex from "@modules/inventory/stock-reconciliation/ReconciliationIndex";
// import TransferIndex from "@modules/inventory/stock-transfer/TransferIndex";
// import CouponIndex from "@modules/inventory/coupon-code/CouponIndex";
// import BarcodePrintIndex from "@modules/inventory/barcode-print/BarcodePrintIndex";
// import DashboardIndexB2B from "@modules/b2b/dashboard/DashboardIndex";
// import CategoryIndexB2B from "@modules/b2b/category/CategoryIndex";
// import ProductIndexB2B from "@modules/b2b/product/ProductIndex";
// import SettingIndexB2B from "@modules/b2b/setting/SettingIndex";
// import B2bDomainIndex from "@modules/b2b/domain/B2bDomainIndex";
// import GeneralIssueIndex from "@modules/production/production-issue/general-issue/GeneralIssueIndex";
// import BatchIssueIndex from "@modules/production/production-issue/batch-issue/BatchIssueIndex";
// import DiscountUserIndex from "@modules/discount/user/DiscountUserIndex";
// import B2bUserIndex from "@modules/b2b/master-user/B2bUserIndex";
// import DiscountConfigIndex from "@modules/discount/config/DiscountConfigIndex";
// import VoucherCreateIndex from "@modules/accounting/voucher-create/VoucherCreateIndex";
// import DiscountDashboard from "@modules/discount/dashboard/DiscountDashboard";

function AppRoute() {
	return (
		<Routes>
			<Route path="/login" element={<Login />} />
			<Route path="/" element={<Layout />}>
				{/* <Route path="/sample/">
          <Route path="" element={<SampleDashboard />} />
          <Route path="invoice" element={<SampleInvoice />} />
          <Route path="index" element={<SampleIndex />} />
        </Route> */}
				<Route path="core/">
					{/* <Route path="file-upload/">
            <Route path="" element={<FileUploadIndex />} />
          </Route>
          <Route path="customer" element={<CustomerIndex />} />
          <Route path="customer/:id" element={<CustomerIndex />} />
          <Route path="user" element={<UserIndex />} />
          <Route path="user/:id" element={<UserIndex />} /> */}
					<Route path="vendor" element={<VendorIndex />} />
					<Route path="vendor/:id" element={<VendorIndex mode="edit" />} />
					{/* <Route path="setting" element={<SettingsIndex />} />
          <Route path="setting/:id" element={<SettingsIndex />} />
          <Route path="warehouse" element={<WarehouseIndex />} />
          <Route path="warehouse/:id" element={<WarehouseIndex />} />
          <Route
            path="marketing-executive"
            element={<MarketingExecutiveIndex />}
          />
          <Route
            path="marketing-executive/:id"
            element={<MarketingExecutiveIndex />}
          /> */}
				</Route>
				<Route path="/domain/">
					<Route path="" element={<DomainIndex />} />
					<Route path="edit/:id" element={<DomainIndex mode="edit" />} />
					<Route path="config/:id" element={<ConfigurationIndex />} />
					<Route path="user" element={<DomainUserIndex />} />
					{/* <Route path="sitemap" element={<SitemapIndex />} />
          <Route path="sitemap/:id" element={<SitemapIndex />} />
          <Route path="branch-management" element={<BranchManagementIndex />} /> */}
				</Route>
				{/* <Route path="/inventory/">
          <Route path="sales/edit/:id" element={<SalesEdit />} />
          <Route path="sales" element={<SalesIndex />} />
          <Route path="sales-invoice" element={<SalesInvoice />} />
          <Route path="purchase/edit/:id" element={<PurchaseEdit />} />
          <Route path="purchase" element={<PurchaseIndex />} />
          <Route path="purchase-invoice" element={<PurchaseInvoice />} />
          <Route path="opening-stock" element={<OpeningStockIndex />} />
          <Route
            path="opening-approve-stock"
            element={<OpeningApproveIndex />}
          />
          <Route path="product" element={<ProductIndex />} />
          <Route path="product/:id" element={<ProductIndex />} />
          <Route path="category" element={<CategoryIndex />} />
          <Route path="category/:categoryId" element={<CategoryIndex />} />
          <Route path="category-group" element={<CategoryGroupIndex />} />
          <Route path="category-group/:id" element={<CategoryGroupIndex />} />
          <Route path="config" element={<InventoryConfigurationIndex />} />
          <Route path="invoice-batch" element={<InvoiceBatchIndex />} />
          <Route path="particular" element={<ParticularIndex />} />
          <Route path="particular/:id" element={<ParticularIndex />} />
          <Route path="product-settings" element={<ProductSettingsIndex />} />
          <Route
            path="product-settings/:id"
            element={<ProductSettingsIndex />}
          />
          <Route path="config" element={<InventoryConfigurationIndex />} />
          <Route path="stock" element={<StockIndex />} />
          <Route
            path="stock-reconciliation"
            element={<ReconciliationIndex />}
          />
          <Route
            path="stock-reconciliation/:id"
            element={<ReconciliationIndex />}
          />
          <Route path="stock-transfer" element={<TransferIndex />} />
          <Route path="stock-transfer/:id" element={<TransferIndex />} />
          <Route path="coupon-code" element={<CouponIndex />} />
          <Route path="coupon-code/:id" element={<CouponIndex />} />
          <Route path="barcode-print" element={<BarcodePrintIndex />} />
        </Route>

        <Route path="/discount">
          <Route path="" element={<DiscountDashboard />} />
          <Route path="users" element={<DiscountUserIndex />} />
          <Route path="config" element={<DiscountConfigIndex />} />
        </Route>
        <Route path="/production/">
          <Route path="items" element={<RecipeItemsIndex />} />
          <Route path="recipe-update/:id" element={<RecipeIndex />} />
          <Route path="setting" element={<ProductionSettingIndex />} />
          <Route path="setting/:id" element={<ProductionSettingIndex />} />
          <Route path="config" element={<ProductionConfigurationIndex />} />
          <Route path="batch" element={<BatchIndex />} />
          <Route path="batch/:id" element={<InhouseIndex />} />
          <Route
            path="issue-production-general"
            element={<GeneralIssueIndex />}
          />
          <Route path="issue-production-batch" element={<BatchIssueIndex />} />
        </Route>

        <Route path="/domain/">
          <Route path="" element={<DomainIndex />} />
          <Route path="edit/:id" element={<DomainIndex />} />
          <Route path="config/:id" element={<ConfigurationIndex />} />
          <Route path="sitemap" element={<SitemapIndex />} />
          <Route path="sitemap/:id" element={<SitemapIndex />} />
          <Route path="branch-management" element={<BranchManagementIndex />} />
        </Route>

        <Route path="/accounting/">
          <Route path="voucher-entry" element={<VoucherIndex />} />
          <Route path="ledger" element={<LedgerIndex />} />
          <Route path="ledger/:id" element={<LedgerIndex />} />
          <Route path="head-group" element={<HeadGroupIndex />} />
          <Route path="head-group/:id" element={<HeadGroupIndex />} />
          <Route path="head-subgroup" element={<HeadSubGroupIndex />} />
          <Route path="head-subgroup/:id" element={<HeadSubGroupIndex />} />
          <Route path="transaction-mode" element={<TransactionModeIndex />} />
          <Route path="voucher-create" element={<VoucherCreateIndex />} />
          <Route path="voucher-create/:id" element={<VoucherCreateIndex />} />
          <Route
            path="transaction-mode/:id"
            element={<TransactionModeIndex />}
          />
          <Route path="config" element={<AccountingConfig />} />
          <Route path="modalIndex" element={<SampleModalIndex />} />
        </Route>
        <Route path="/procurement/">
          <Route path="requisition" element={<Requisition />} />
          <Route path="new-requisition" element={<RequisitionInvoice />} />
          <Route path="requisition/edit/:id" element={<RequisitionUpdate />} />
          <Route path="requisition-board" element={<MatrixIndex />} />
        </Route>
        <Route path="/reporting/">
          <Route path="reports" element={<ReportIndex />} />
        </Route>
        <Route path="sitemap" element={<Sitemap />} />
        <Route path="/pos/">
          <Route path="bakery" element={<BakeryIndex />} />
        </Route>
        <Route path="/b2b/">
          <Route path="dashboard" element={<DashboardIndexB2B />} />
          <Route path="domain" element={<B2bDomainIndex />} />
          <Route path="master-user" element={<B2bUserIndex />} />
          <Route path="sub-domain/category/:id" element={<CategoryIndexB2B />} />
          <Route path="sub-domain/product/:id" element={<ProductIndexB2B />} />
          <Route path="sub-domain/setting/:id" element={<SettingIndexB2B />} />
        </Route>
        <Route path="sitemap" element={<Sitemap />} /> */}
			</Route>
		</Routes>
	);
}

export default AppRoute;
