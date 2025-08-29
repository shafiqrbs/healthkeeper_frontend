import { SegmentedControl } from "@mantine/core";
import { getHotkeyHandler } from "@mantine/hooks";

function SegmentedControlForm({ nextField = "", id, name, value, onChange, data, ...props }) {
	return (
		<SegmentedControl
			id={id}
			name={name}
			value={value}
			onChange={onChange}
			data={data}
			autoFocus
			onKeyDown={getHotkeyHandler([
				[
					"Enter",
					() => {
						nextField && nextField === "EntityFormSubmit"
							? document.getElementById(nextField).click()
							: document.getElementById(nextField).focus();
					},
				],
			])}
			{...props}
		/>
	);
}

export default SegmentedControlForm;
