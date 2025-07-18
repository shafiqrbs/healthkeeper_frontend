import {Button, Flex, Text} from "@mantine/core";
import { IconPlus,IconChevronsRight } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import React from "react";

export default function CreateButton({ handleModal, text }) {
	const { t } = useTranslation();

	return (
		<Button
			size="sm"
			className="btnPrimaryBg"
			type="submit"
			id="EntityFormSubmit"
			rightSection={<IconChevronsRight size={16} />}
			onClick={handleModal}
			miw={160}
		>
			<Flex direction={`column`} gap={0}>
			<Text  fz={14} fw={400}>{t(text)}</Text>
			<Flex direction={`column`} align={'center'} fz={'12'} c={'white'}>alt+n</Flex>
			</Flex>
		</Button>
	);
}
