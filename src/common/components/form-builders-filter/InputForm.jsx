import React from "react";
import { Tooltip, TextInput } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconInfoCircle, IconSearch, IconX } from "@tabler/icons-react";
import { getHotkeyHandler } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { setFilterData } from "@/app/store/core/crudSlice.js";

function InputForm({ label, placeholder, nextField, id, name, module }) {
	const { t } = useTranslation();
	const dispatch = useDispatch();

	const entityMap = useSelector((state) => {
		const entities = state.crud;
		return Object.keys(entities).reduce((acc, module) => {
			const entity = entities[module];
			acc[module] = {
				module,
				data: entity.filterData,
			};
			return acc;
		}, {});
	});

	const handleChange = (e, module) => {
		const entity = entityMap[module];
		if (entity) {
			dispatch(
				setFilterData({
					module: entity.module,
					data: {
						...entity.data,
						[name]: e.currentTarget.value,
					},
				})
			);
		}
	};

	const handleOnKeyHandler = () => {
		return getHotkeyHandler([
			nextField === "submit"
				? [
						"Enter",
						(e) => {
							document.getElementById(nextField).click();
						},
				  ]
				: [
						"Enter",
						(e) => {
							document.getElementById(nextField).focus();
						},
				  ],
		]);
	};

	const resetInput = (module, name) => {
		dispatch(
			setFilterData({
				module: entityMap[module].module,
				data: {
					...entityMap[module].data,
					[name]: "",
				},
			})
		);
	};

	return (
		<>
			{
				<TextInput
					label={label}
					leftSection={<IconSearch size={16} opacity={0.5} />}
					size="sm"
					placeholder={placeholder}
					autoComplete="off"
					onKeyDown={handleOnKeyHandler}
					onChange={(e) => handleChange(e, module)}
					value={entityMap[module]?.data[name] || ""}
					id={id}
					rightSection={
						entityMap[module]?.data[name] ? (
							<Tooltip label={t("Close")} withArrow bg="red.5">
								<IconX
									color="red"
									size={16}
									opacity={0.5}
									onClick={() => resetInput(module, name)}
								/>
							</Tooltip>
						) : (
							<Tooltip label={placeholder} withArrow position="bottom" bg="red.4">
								<IconInfoCircle size={16} opacity={0.5} />
							</Tooltip>
						)
					}
				/>
			}
		</>
	);
}

export default InputForm;
