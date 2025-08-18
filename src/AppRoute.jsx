import { Routes, Route } from "react-router-dom";
import Login from "@modules/auth/Login";
import Layout from "@components/layout/Layout";
// import SampleDashboard from "@modules/sample-module/DashBoard";
// import CustomerIndex from "@modules/core/customer/CustomerIndex";
// import UserIndex from "@modules/core/user/UserIndex";
import VendorIndex from "@modules/core/vendor/VendorIndex";
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
import Sitemap from "@modules/sitemap/SitemapIndex";
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
// import ParticularIndex from "@modules/inventory/particular/ParticularIndex";
// import InhouseIndex from "@modules/production/production-inhouse/InhouseIndex";
// import SettingsIndex from "@modules/core/settings/SettingsIndex";

// import StockIndex from "@modules/inventory/stock/StockIndex";
// import InventoryConfigurationIndex from "@modules/inventory/inventory-configuration/InventoryConfigurationIndex";
import DomainConfigurationIndex from "@modules/domain/configuration/ConfigurationIndex";
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
import HospitalConfigIndex from "@modules/settings/HospitalConfigIndex";
import PrescriptionIndex from "@modules/hospital/prescription";
import VisitIndex from "@modules/hospital/visit";
import ParticularIndex from "@modules/hospital/core/particular";
import BedIndex from "@modules/hospital/core/bed";
import ParticularModeIndex from "@modules/hospital/core/particular-mode";
import ParticularTypeIndex from "@modules/hospital/core/particular-type";
import CategoryIndex from "@modules/hospital/core/category";
import AdmissionListIndex from "@/modules/hospital/admission-list";
import AdmissionIndex from "@modules/hospital/admission";
import EmergencyIndex from "@modules/hospital/emergency";
import NotFound from "@components/layout/NotFound";
import CustomerIndex from "@modules/hospital/customer";
import MedicineIndex from "@modules/hospital/medicine";
import LabIndex from "@modules/hospital/lab";
import LabGroupIndex from "@modules/hospital/lab-group";
import RequisitionIndex from "@modules/hospital/requisition";
import InvestigationIndex from "@modules/hospital/investigation";
import BillingIndex from "@modules/hospital/billing";
import DoctorIndex from "@modules/hospital/doctor";
import ListIndex from "@modules/hospital/visit/list";
import ConfigurationIndex from "@modules/configuration";
import ConfirmIndex from "@modules/hospital/admission/confirm";
import IpdIndex from "@modules/hospital/admission/ipd";
import UserIndex from "@/modules/core/user";

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
					<Route path="user" element={<UserIndex />} />
					<Route path="user/:id" element={<UserIndex />} />
					{/* <Route path="file-upload/">
            <Route path="" element={<FileUploadIndex />} />
            </Route>
          <Route path="customer" element={<CustomerIndex />} />
          <Route path="customer/:id" element={<CustomerIndex />} />
          
           */}
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
					<Route path="config/:id" element={<DomainConfigurationIndex />} />
					<Route path="user" element={<DomainUserIndex />} />
					{/* <Route path="sitemap" element={<SitemapIndex />} />
          <Route path="sitemap/:id" element={<SitemapIndex />} />
          <Route path="branch-management" element={<BranchManagementIndex />} /> */}
				</Route>
				<Route path="/hospital/">
					<Route path="visit">
						<Route index element={<VisitIndex />} />
						<Route path="list" element={<ListIndex />} />
					</Route>

					<Route path="admission">
						<Route index element={<AdmissionIndex />} />
						<Route path="ipd" element={<IpdIndex />} />
						<Route path="confirm" element={<ConfirmIndex />} />
					</Route>
					<Route path="ipd">
						<Route index element={<IpdIndex />} />
						<Route path="admission" element={<AdmissionIndex />} />
					</Route>

					<Route path="admission-list" element={<AdmissionListIndex />} />

					<Route path="prescription">
						<Route index element={<PrescriptionIndex />} />
						<Route path="edit/:id" element={<PrescriptionIndex />} />
					</Route>

					<Route path="customer">
						<Route index element={<CustomerIndex />} />
						<Route path="edit/:id" element={<CustomerIndex mode="edit" />} />
					</Route>

					<Route path="emergency" element={<EmergencyIndex />} />

					<Route path="lab-test" element={<LabIndex />} />
					<Route path="lab-group-test" element={<LabGroupIndex />} />
					<Route path="medicine" element={<MedicineIndex />} />
					<Route path="medicine-requisition" element={<RequisitionIndex />} />
					<Route path="investigation" element={<InvestigationIndex />} />
					<Route path="billing" element={<BillingIndex />} />
					<Route path="doctor" element={<DoctorIndex />} />
				</Route>

				<Route path="/settings/">
					<Route path="hospital-config/:id" element={<HospitalConfigIndex />} />
				</Route>
				<Route path="/hospital/core/">
					<Route path="particular" element={<ParticularIndex />} />
					<Route path="particular/:id" element={<ParticularIndex mode={"edit"} />} />
					<Route path="bed" element={<BedIndex />} />
					<Route path="bed/:id" element={<BedIndex mode={"edit"} />} />
					<Route path="particular-mode" element={<ParticularModeIndex />} />
					<Route path="particular-type" element={<ParticularTypeIndex />} />
					<Route path="category" element={<CategoryIndex />} />
				</Route>
				<Route path="sitemap" element={<Sitemap />} />
				<Route path="/configuration/">
					<Route index element={<ConfigurationIndex />} />
				</Route>

				{/*<Route path="/discount">
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
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
}

export default AppRoute;
