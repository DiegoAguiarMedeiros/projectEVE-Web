/**
 * Returns how many installments are effectively "paid" for the selected month/year context.
 *
 * - Past / current month: shows actual paid count relative to that month.
 *   Example: realPaid=3 (March current), viewing January → effectivePaid=1
 *
 * - Future month: projects forward assuming one payment per month.
 *   Example: realPaid=3 (March current), viewing June (+3 months) → effectivePaid=6
 */
export function getEffectivePaidInstallments(
    realPaidInstallments: number,
    totalInstallments: number,
    selectedMonth: number, // 1-based (from store)
    selectedYear: number
): number {
    const now = new Date();
    const offsetFromNow =
        (selectedYear - now.getFullYear()) * 12 + (selectedMonth - 1 - now.getMonth());

    if (offsetFromNow > 0) {
        // Future: project one payment per month forward
        return Math.min(totalInstallments, realPaidInstallments + offsetFromNow);
    }

    // Past / current: show how many were paid up to and including the selected month
    const selectedIndex = realPaidInstallments + offsetFromNow;
    if (selectedIndex < 0) return 0; // before the first installment
    const clampedIndex = Math.min(selectedIndex, totalInstallments);
    return Math.min(realPaidInstallments, clampedIndex);
}

/**
 * Returns the payment date (DD/MM/YYYY) for installment at index `i`,
 * anchored on the real paid count and the current date.
 * Index `realPaidInstallments` = current month's installment.
 */
export function getInstallmentDate(
    index: number,
    realPaidInstallments: number,
    paymentDay: number
): string {
    const now = new Date();
    const date = new Date(now.getFullYear(), now.getMonth() - realPaidInstallments + index, paymentDay);
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    return `${dd}/${mm}/${date.getFullYear()}`;
}
