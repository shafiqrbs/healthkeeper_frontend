import TabsWithSearch from "@components/advance-search/TabsWithSearch";
import GlobalDrawer from "@components/drawers/GlobalDrawer";
import Investigation from "@modules/hospital/ipdAdmitted/common/tabs/Investigation";
import Medicine from "@modules/hospital/ipdAdmitted/common/tabs/Medicine";
import { useTranslation } from "react-i18next";

export default function IpdManageDrawer({ opened, close }) {
	const { t } = useTranslation();

	return (
		<GlobalDrawer size="60%" opened={opened} close={close} title={t("ManageIpd")}>
			<TabsWithSearch
				tabWidth="50%"
				tabList={["Investigation", "Medicine"]}
				hideSearchbar
				tabPanels={[
					{
						tab: "Investigation",
						component: <Investigation />,
					},
					{
						tab: "Medicine",
						component: <Medicine />,
					},
				]}
			/>
		</GlobalDrawer>
	);
}
