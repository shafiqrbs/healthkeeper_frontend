import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Button, rem, Grid, Box, ScrollArea, Text, Title, Flex, Stack } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconCheck, IconDeviceFloppy } from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import InputForm from "@components/form-builders/InputForm";
import PasswordInputForm from "@components/form-builders/PasswordInputForm";
import SelectForm from "@components/form-builders/SelectForm";
import PhoneNumber from "@components/form-builders/PhoneNumberInput";
import { useDispatch } from "react-redux";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { editEntityData, setInsertType } from "@/app/store/core/crudSlice";
import { notifications } from "@mantine/notifications";
import Shortcut from "../../shortcut/Shortcut.jsx";
import CustomerGroupDrawer from "../customer/CustomerGroupDrawer.js";
import getCoreSettingEmployeeGroupDropdownData from "@/app/store/core/crudSlice";
import { storeEntityData } from "@/app/store/core/crudThunk.js";
import useUserDataStoreIntoLocalStorage from "@/common/hooks/local-storage/useUserDataStoreIntoLocalStorage.js";
import Create from "./Create.jsx";
import { getUserFormValues } from "../helpers/request.js";

export default function Form() {
	const { t } = useTranslation();
	const form = useForm(getUserFormValues(t));

	const [groupDrawer, setGroupDrawer] = useState(false);

	useHotkeys(
		[
			[
				"alt+n",
				() => {
					!groupDrawer && document.getElementById("employee_group_id").click();
				},
			],
			[
				"alt+r",
				() => {
					form.reset();
				},
			],
			[
				"alt+s",
				() => {
					!groupDrawer && document.getElementById("EntityFormSubmit").click();
				},
			],
		],
		[]
	);

	return (
		<Box>
			<Create form={form} />
		</Box>
	);
}
