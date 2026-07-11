import { useTranslation } from "react-i18next";

type labelDisplayedRowsProps = {
    from: number;
    to: number;
    count: number;
};
export const labelDisplayedRows = ({ from, to, count }: labelDisplayedRowsProps) => {
    const { t } = useTranslation();
    return (`${from}–${to} ${t("pagination.of")} ${count !== -1 ? count : `${t("pagination.more_than")} ${to}`}`)
}