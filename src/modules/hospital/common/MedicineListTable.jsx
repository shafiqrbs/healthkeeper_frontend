import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import {Center, Flex, Select, Switch, TableTd, ActionIcon, Text, TextInput} from "@mantine/core";
import { IconCheck, IconGripVertical, IconX, IconTrash } from "@tabler/icons-react";
import { DataTable, DataTableDraggableRow } from "mantine-datatable";
import clsx from "clsx";
import React, { useState, useMemo, useEffect, useCallback, useRef, memo } from "react";
import debounce from "lodash.debounce";

import useAppLocalStore from "@hooks/useAppLocalStore";
import classes from "./MedicineListTable.module.css";
import tableCss from "@assets/css/Table.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { storeEntityData } from "@/app/store/core/crudThunk";
import { errorNotification } from "@components/notification/errorNotification";
import {capitalizeWords} from "@utils/index";
import InputForm from "@components/form-builders/InputForm";
import inlineInputCss from "@assets/css/InlineInputField.module.css";

const MemoSelect = memo(function MemoSelect({ value, data, placeholder, onChange }) {
	return (
		<Select
			searchable
			size="xs"
			data={data}
			value={value?.toString() ?? null}
			placeholder={placeholder}
			onChange={onChange}
		/>
	);
});

const MemoSwitch = memo(function MemoSwitch({ checked, onChange }) {
	return (
		<Switch
			size="md"
			onLabel="ON"
			color="teal"
			offLabel="OFF"
			radius="sm"
			checked={checked}
			onChange={(e) => onChange(e.currentTarget.checked)}
			thumbIcon={
				checked ? (
					<IconCheck size={12} color="var(--mantine-color-teal-6)" stroke={3} />
				) : (
					<IconX size={12} color="var(--mantine-color-red-6)" stroke={3} />
				)
			}
		/>
	);
});

function MedicineListTable({
	medicines,
	tableHeight = 0,
	showDelete = false,
	showSwitch = true,
	onDelete,
	prescriptionId: propPrescriptionId,
	setMedicines,
}) {
	const { id: paramsPrescriptionId } = useParams();
	const prescriptionId = propPrescriptionId || paramsPrescriptionId;
	const { t } = useTranslation();
	const { dosages, meals } = useAppLocalStore();
	const dispatch = useDispatch();

	const recordsWithIds = useMemo(
		() =>
			medicines.map((m) => ({
				...m,
				id: m.id?.toString(),
			})),
		[medicines]
	);

	const [records, setRecords] = useState(recordsWithIds);

	// only resync when list length changes
	useEffect(() => {
		setRecords((prev) => (prev.length !== recordsWithIds.length ? recordsWithIds : prev));
	}, [recordsWithIds]);

	const dosageOptions = useMemo(
		() =>
			dosages?.map((d) => ({
				value: d.id.toString(),
				label: d.name,
			})) ?? [],
		[dosages]
	);

	const mealOptions = useMemo(
		() =>
			meals?.map((m) => ({
				value: m.id.toString(),
				label: m.name,
			})) ?? [],
		[meals]
	);

	const debouncedUpdate = useRef(
		debounce(async (payload) => {
			try {
				await dispatch(storeEntityData(payload));
			} catch {
				errorNotification(t("Failed to update medicine"), "red", "lightgray", true, 700, true);
			}
		}, 300)
	).current;

	const handleInlineEdit = useCallback(
		(id, field, value) => {
			setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));

			debouncedUpdate({
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.INLINE_UPDATE}/${id}`,
				data: {
					medicine_id: id,
					[field]: value,
					prescription_id: prescriptionId,
				},
				module: "prescription",
			});
		},
		[debouncedUpdate, prescriptionId]
	);

	const handleDragEnd = async (result) => {
		if (!result.destination) return;

		const oldItems = [...records];
		const items = [...records];

		const [moved] = items.splice(result.source.index, 1);
		items.splice(result.destination.index, 0, moved);

		setRecords(items);

		if (setMedicines) {
			setMedicines(
				items.map((item, index) => ({
					...item,
					order: index + 1,
				}))
			);
		}

		const resultAction = await dispatch(
			storeEntityData({
				url: HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.MEDICINE_REORDER,
				data: {
					order: items.map((item, index) => ({
						id: item.id,
						ordering: index + 1,
					})),
				},
				module: "prescription",
			})
		);

		if (storeEntityData.rejected.match(resultAction)) {
			setRecords(oldItems);
			if (setMedicines) setMedicines(oldItems);
			errorNotification("Failed to update medicine order", "red", "lightgray", true, 700, true);
		}
	};

	const columns = useMemo(
		() => [
			{ accessor: "", hiddenContent: true, width: 40 },
			{
				accessor: "index",
				title: "S/N",
				width: 50,
				textAlign: "center",
				render: (_, index) => index + 1,
			},
			{ accessor: "medicine_name", title: "Medicine Name",
				render: (record) => (record.medicine_name),
			},
			{ accessor: "generic", title: "Medicine Name",
				render: (record) => (record.generic),
			},
			{
				accessor: "medicine_dosage_id",
				title: "Dosage",
				render: (record) => (
					<MemoSelect
						value={record.medicine_dosage_id}
						data={dosageOptions}
						placeholder={t("Dosage")}
						onChange={(v) => handleInlineEdit(record.id, "medicine_dosage_id", v)}
					/>
				),
			},
			{
				accessor: "medicine_bymeal_id",
				title: "By Meal",
				render: (record) => (
					<MemoSelect
						value={record.medicine_bymeal_id}
						data={mealOptions}
						placeholder={t("By Meal")}
						onChange={(v) => handleInlineEdit(record.id, "medicine_bymeal_id", v)}
					/>
				),
			},
			/*{
				accessor: "instruction",
				title: "Notes",
				width: 200,
				render: (record) => (
					<TextInput
						size="xs"
						className={inlineInputCss.inputText}
						placeholder={t("Instruction")}
						value={record.instruction}
						onChange={(event) =>
							handleInlineEdit(
								record.id,
								"instruction",
								event.currentTarget.value
							)
						}
						onBlur={() => handleInlineEdit(item.id)}
					/>
				),
			},*/
			{
				accessor: "action",
				title: "Action",
				width: 120,
				textAlign: "center",
				render: (record) => (
					<Flex justify="center" align="center" gap="sm">
						{showSwitch && (
							<MemoSwitch
								checked={record.is_active}
								onChange={(v) => handleInlineEdit(record.id, "is_active", v)}
							/>
						)}
						{showDelete && onDelete && (
							<ActionIcon
								variant="outline"
								color="var(--theme-error-color)"
								onClick={() => onDelete(record.id)}
							>
								<IconTrash size={16} />
							</ActionIcon>
						)}
					</Flex>
				),
			},
		],
		[dosageOptions, mealOptions, handleInlineEdit, showDelete, onDelete, showSwitch, t]
	);

	return (
		<DragDropContext onDragEnd={handleDragEnd}>
			<DataTable
				records={records}
				columns={columns}
				height={tableHeight - 30}
				striped
				withTableBorder
				withColumnBorders
				stripedColor="var(--theme-tertiary-color-1)"
				classNames={{
					root: tableCss.root,
					table: tableCss.table,
					header: tableCss.header,
					footer: tableCss.footer,
					pagination: tableCss.pagination,
				}}
				tableWrapper={({ children }) => (
					<Droppable droppableId="medicine-datatable">
						{(provided) => (
							<div ref={provided.innerRef} {...provided.droppableProps}>
								{children}
								{provided.placeholder}
							</div>
						)}
					</Droppable>
				)}
				rowFactory={({ record, index, rowProps, children }) => (
					<Draggable draggableId={record.id} index={index} key={record.id}>
						{(provided, snapshot) => (
							<DataTableDraggableRow
								{...rowProps}
								isDragging={snapshot.isDragging}
								className={clsx(rowProps.className, classes.draggableRow)}
								{...provided.draggableProps}
							>
								<TableTd>
									<Center ref={provided.innerRef} {...provided.dragHandleProps}>
										<IconGripVertical size={16} />
									</Center>
								</TableTd>
								{children}
							</DataTableDraggableRow>
						)}
					</Draggable>
				)}
			/>
		</DragDropContext>
	);
}

export default memo(MedicineListTable);
