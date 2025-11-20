import {Box, Button, Flex, Group} from "@mantine/core";
import {IconDeviceFloppy, IconHistory} from "@tabler/icons-react";

export default function TabsActionButtons({ handleReset, handleSave, isSubmitting = false }) {
	return (
		<Group mr={'xs'} gap="xs" grow>
			<Button radius={0} size="sm" onClick={handleReset} bg="var(--theme-reset-btn-color)">
				Reset
			</Button>
			{handleSave ? (
				<Button
					loading={isSubmitting}
					radius={0}
					size="sm"
					bg="var(--theme-primary-color-6)"
					onClick={handleSave}
				>
					Save
				</Button>
			) : (
				<Button loading={isSubmitting} type="submit" radius={0} size="sm" >
					Save
				</Button>
			)}
		</Group>

	);
}
