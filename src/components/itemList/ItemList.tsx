import { Fragment, ReactNode, useState } from "react";
import {
    Avatar,
    Box,
    Divider,
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { useTranslation } from "react-i18next";

// ─── Action item for the bottom sheet ────────────────────────────────────────

export type ItemAction = {
    label: string;
    icon: ReactNode;
    onClick: () => void;
    color?: "error" | "warning" | "success" | "primary";
};

// ─── Row config & component ───────────────────────────────────────────────────

export type ItemRowConfig = {
    avatar: { bgcolor: string; icon: ReactNode };
    title: string;
    subtitle: ReactNode;
    amount: ReactNode;
    /** Inline actions (e.g. Pay button). Use menuActions for edit/delete/etc. */
    actions?: ReactNode;
    /** Opens a bottom sheet with these actions when the row is tapped */
    menuActions?: ItemAction[];
};

type ItemRowProps = {
    config: ItemRowConfig;
    hideDivider?: boolean;
};

export function ItemRow({ config, hideDivider }: ItemRowProps) {
    const [sheetOpen, setSheetOpen] = useState(false);
    const hasMenu = !!config.menuActions?.length;

    return (
        <>
            <Box
                display="flex"
                alignItems="center"
                gap={1.5}
                py={1.25}
                px={0.5}
                onClick={hasMenu ? () => setSheetOpen(true) : undefined}
                sx={hasMenu ? { cursor: "pointer" } : undefined}
            >
                <Avatar
                    sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 1.5,
                        bgcolor: config.avatar.bgcolor,
                        flexShrink: 0,
                    }}
                >
                    {config.avatar.icon}
                </Avatar>

                <Box flex={1} minWidth={0}>
                    <Typography variant="subtitle2" fontWeight={600} noWrap>
                        {config.title}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={0.75} mt={0.25}>
                        {config.subtitle}
                    </Box>
                </Box>

                <Box
                    sx={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 0.25 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {config.amount}
                    {config.actions}
                </Box>
            </Box>

            {!hideDivider && <Divider />}

            {hasMenu && (
                <Drawer
                    anchor="bottom"
                    open={sheetOpen}
                    onClose={() => setSheetOpen(false)}
                    PaperProps={{
                        sx: {
                            borderTopLeftRadius: 16,
                            borderTopRightRadius: 16,
                            pb: 2,
                        },
                    }}
                >
                    {/* Drag handle */}
                    <Box sx={{ display: "flex", justifyContent: "center", pt: 1.5, pb: 1 }}>
                        <Box sx={{ width: 32, height: 4, borderRadius: 2, bgcolor: "divider" }} />
                    </Box>

                    {/* Item title */}
                    <Box sx={{ px: 2.5, pb: 1.5 }}>
                        <Typography variant="subtitle1" fontWeight={700} noWrap>
                            {config.title}
                        </Typography>
                    </Box>

                    <Divider />

                    <List disablePadding>
                        {config.menuActions!.map((action, idx) => (
                            <ListItemButton
                                key={idx}
                                onClick={() => {
                                    setSheetOpen(false);
                                    action.onClick();
                                }}
                                sx={{
                                    py: 1.5,
                                    ...(action.color === "error" && { color: "error.main" }),
                                    ...(action.color === "warning" && { color: "warning.main" }),
                                    ...(action.color === "success" && { color: "success.main" }),
                                    ...(action.color === "primary" && { color: "primary.main" }),
                                }}
                            >
                                <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                                    {action.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={action.label}
                                    slotProps={{ primary: { fontWeight: 500 } }}
                                />
                            </ListItemButton>
                        ))}
                    </List>
                </Drawer>
            )}
        </>
    );
}

// ─── Date-grouped list container ──────────────────────────────────────────────

type Group<T> = {
    dateKey: string;
    label: string;
    items: T[];
};

type Props<T> = {
    items: T[];
    keyExtractor: (item: T) => string;
    renderItem: (item: T, hideDivider: boolean) => ReactNode;
    getDateKey?: (item: T) => string;
};

function buildGroups<T>(
    items: T[],
    getDateKey: (item: T) => string,
    todayLabel: string,
    yesterdayLabel: string,
): Group<T>[] {
    const map = new Map<string, Group<T>>();

    for (const item of items) {
        const key = getDateKey(item);

        if (!map.has(key)) {
            const d = dayjs(key);
            const today = dayjs().startOf("day");
            const yesterday = dayjs().subtract(1, "day").startOf("day");

            let label: string;
            if (d.isSame(today, "day")) label = todayLabel;
            else if (d.isSame(yesterday, "day")) label = yesterdayLabel;
            else label = d.locale("pt-br").format("DD [de] MMMM");

            map.set(key, { dateKey: key, label, items: [] });
        }

        map.get(key)!.items.push(item);
    }

    return Array.from(map.values());
}

export function ItemList<T>({ items, keyExtractor, renderItem, getDateKey }: Props<T>) {
    const { t } = useTranslation();

    if (getDateKey) {
        const groups = buildGroups(items, getDateKey, t("common.today"), t("common.yesterday"));

        return (
            <Box sx={{ px: 1.5, py: 1 }}>
                {groups.map((group) => (
                    <Box key={group.dateKey} mb={1.5}>
                        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                            <Box sx={{ flex: 1, height: "1px", bgcolor: "divider" }} />
                            <Typography variant="caption" color="text.disabled" sx={{ flexShrink: 0, fontWeight: 500 }}>
                                {group.label}
                            </Typography>
                            <Box sx={{ flex: 1, height: "1px", bgcolor: "divider" }} />
                        </Box>

                        {group.items.map((item, idx) => (
                            <Fragment key={keyExtractor(item)}>
                                {renderItem(item, idx === group.items.length - 1)}
                            </Fragment>
                        ))}
                    </Box>
                ))}
            </Box>
        );
    }

    return (
        <Box sx={{ px: 1.5, py: 1 }}>
            {items.map((item, idx) => (
                <Fragment key={keyExtractor(item)}>
                    {renderItem(item, idx === items.length - 1)}
                </Fragment>
            ))}
        </Box>
    );
}
