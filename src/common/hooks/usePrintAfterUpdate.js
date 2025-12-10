import { useState, useEffect, useRef } from "react";

/**
 * =============== custom hook to handle printing after state updates to avoid stale data ================
 * This hook ensures that print actions are triggered only after the data dependency has been updated,
 * preventing stale data from being printed.
 *
 * @param {Function} printFunction - The print function from useReactToPrint hook
 * @param {any} dataDependency - The data that needs to be updated before printing (e.g., invoiceDetails)
 * @param {Object} options - Optional configuration
 * @param {boolean} options.useRequestAnimationFrame - Whether to use requestAnimationFrame before printing (default: true)
 * @param {Function} options.onPrintComplete - Optional callback function called after print is triggered
 * @returns {[boolean, Function]} - Returns [pendingPrint state, setPendingPrint function]
 *
 * @example
 * const invoicePrint = useReactToPrint({ content: () => invoicePrintRef.current });
 * const [pendingPrint, setPendingPrint] = usePrintAfterUpdate(invoicePrint, invoiceDetails);
 *
 * // After updating data, set pending print
 * setInvoiceDetails(newData);
 * setPendingPrint(true); // Print will trigger after invoiceDetails updates
 */
const usePrintAfterUpdate = (printFunction, dataDependency, options = {}) => {
	const { useRequestAnimationFrame = true, onPrintComplete } = options;
	const [pendingPrint, setPendingPrint] = useState(false);
	const printFunctionRef = useRef(printFunction);
	const onPrintCompleteRef = useRef(onPrintComplete);

	// =============== keep refs updated to avoid stale closures ================
	useEffect(() => {
		printFunctionRef.current = printFunction;
	}, [printFunction]);

	useEffect(() => {
		onPrintCompleteRef.current = onPrintComplete;
	}, [onPrintComplete]);

	// =============== trigger print only after data dependency is updated to avoid stale data ================
	useEffect(() => {
		if (!pendingPrint || !dataDependency) return;

		const triggerPrint = () => {
			if (printFunctionRef.current) {
				printFunctionRef.current();
			}
			if (onPrintCompleteRef.current) {
				onPrintCompleteRef.current();
			}
			setPendingPrint(false);
		};

		if (useRequestAnimationFrame) {
			requestAnimationFrame(triggerPrint);
		} else {
			triggerPrint();
		}
	}, [dataDependency, pendingPrint, useRequestAnimationFrame]);

	return { pendingPrint, setPendingPrint };
};

export default usePrintAfterUpdate;
