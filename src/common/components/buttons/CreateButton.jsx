import { Button, Text } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

export default function CreateButton({ handleModal, text }) {
	const { t } = useTranslation();

	return (
		<Button
			size="sm"
			className="btnPrimaryBg"
			type="submit"
			id="EntityFormSubmit"
			leftSection={<IconPlus size={16} />}
			onClick={handleModal}
			miw={160}
		>
			<Text fz={14} fw={400}>
				{t(text)}
			</Text>
		</Button>
	);
}
