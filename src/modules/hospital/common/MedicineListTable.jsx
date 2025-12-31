import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Center, Flex, Select, Switch, TableTd } from "@mantine/core";
import { IconCheck, IconGripVertical, IconX } from "@tabler/icons-react";
import { DataTable, DataTableDraggableRow } from "mantine-datatable";
import clsx from "clsx";
import { useState, useMemo, useEffect } from "react";
import useAppLocalStore from "@hooks/useAppLocalStore";
import classes from "./MedicineListTable.module.css";
import tableCss from "@assets/css/Table.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { storeEntityData } from "@/app/store/core/crudThunk";
import { errorNotification } from "@components/notification/errorNotification";

export default function MedicineListTable({ medicines, tableHeight = 0 }) {
	const { id: prescriptionId } = useParams();
	const { t } = useTranslation();
	const { dosages, meals } = useAppLocalStore();
	const dispatch = useDispatch();
	const recordsWithIds = useMemo(() => {
		return medicines.map((medicine) => ({
			...medicine,
			id: medicine.id?.toString(),
		}));
	}, [medicines]);

	const [records, setRecords] = useState(recordsWithIds);

	useEffect(() => {
		setRecords(recordsWithIds);
	}, [recordsWithIds]);

	const handleInlineEdit = async (id, field, value) => {
		setRecords((prevRecords) => {
			const updatedRecords = prevRecords.map((record) => {
				if (record.id.toString() === id.toString()) {
					return { ...record, [field]: value };
				}
				return record;
			});
			return updatedRecords;
		});

		// add api call to update the medicine field
		const updateMedicineValue = {
			url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.INLINE_UPDATE}/${id}`,
			data: {
				medicine_id: id,
				[field]: value,
				prescription_id: prescriptionId,
			},
			module: "prescription",
		};
		try {
			await dispatch(storeEntityData(updateMedicineValue));
		} catch (error) {
			console.error(error);
			errorNotification(t("Failed to update medicine"), "red", "lightgray", true, 700, true);
		}
	};

	const handleDragEnd = async (result) => {
		if (!result.destination) return;

		const items = Array.from(records);
		const sourceIndex = result.source.index;
		const destinationIndex = result.destination.index;
		const [reorderedItem] = items.splice(sourceIndex, 1);
		items.splice(destinationIndex, 0, reorderedItem);

		setRecords(items);

		// add api call to update the order of the medicines
		const updateMedicineOrderValue = {
			url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.MEDICINE_REORDER}`,
			data: {
				order: items.map((item, index) => ({
					id: item.id,
					ordering: index + 1,
				})),
			},
			module: "prescription",
		};
		try {
			await dispatch(storeEntityData(updateMedicineOrderValue));
		} catch (error) {
			console.error(error);
			errorNotification(t("Failed to update medicine order"), "red", "lightgray", true, 700, true);
		}
	};

	return (
		<DragDropContext onDragEnd={handleDragEnd}>
			<DataTable
				height={tableHeight - 30}
				columns={[
					{ accessor: "", hiddenContent: true, width: 40 },
					{ accessor: "index", textAlign: "center", width: 50, title: "S/N", render: (_record, index) => index + 1 },
					{ accessor: "medicine_name", title: "Medicine Name" },
					{ accessor: "generic", title: "Generic" },
					{
						accessor: "medicine_dosage_id",
						title: "Dosage",
						render: (record) => (
							<Select
								searchable
								size="xs"
								label=""
								data={dosages?.map((dosage) => ({
									value: dosage.id?.toString(),
									label: dosage.name,
								}))}
								value={record.medicine_dosage_id?.toString()}
								placeholder={t("Dosage")}
								onChange={(v) => handleInlineEdit(record.id, "medicine_dosage_id", v)}
							/>
						),
					},
					{
						accessor: "medicine_bymeal_id",
						title: "By Meal",
						render: (record) => (
							<Select
								searchable
								size="xs"
								label=""
								data={meals?.map((meal) => ({
									value: meal.id?.toString(),
									label: meal.name,
								}))}
								value={record.medicine_bymeal_id?.toString()}
								placeholder={t("By Meal")}
								onChange={(v) => handleInlineEdit(record.id, "medicine_bymeal_id", v)}
							/>
						),
					},
					{
						accessor: "action",
						width: 100,
						title: "Action",
						textAlign: "center",
						render: (record) => (
							<Flex justify="center" align="center">
								<Switch
									size="md"
									onLabel="ON"
									color="teal"
									offLabel="OFF"
									checked={record.is_active}
									onChange={(e) => handleInlineEdit(record.id, "is_active", e.currentTarget.checked)}
									radius="sm"
									thumbIcon={
										record.is_active ? (
											<IconCheck size={12} color="var(--mantine-color-teal-6)" stroke={3} />
										) : (
											<IconX size={12} color="var(--mantine-color-red-6)" stroke={3} />
										)
									}
								/>
							</Flex>
						),
					},
				]}
				records={records}
				withTableBorder
				striped
				stripedColor="var(--theme-tertiary-color-1)"
				withColumnBorders
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
							<div {...provided.droppableProps} ref={provided.innerRef}>
								{children}
								{provided.placeholder}
							</div>
						)}
					</Droppable>
				)}
				styles={{ table: { tableLayout: "fixed" } }}
				rowFactory={({ record, index, rowProps, children }) => (
					<Draggable key={record.id} draggableId={record.id?.toString()} index={index}>
						{(provided, snapshot) => (
							<DataTableDraggableRow
								isDragging={snapshot.isDragging}
								{...rowProps}
								className={clsx(rowProps.className, classes.draggableRow)}
								{...provided.draggableProps}
							>
								<TableTd>
									<Center {...provided.dragHandleProps} ref={provided.innerRef}>
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
