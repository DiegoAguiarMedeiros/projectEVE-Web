import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { Typography, Stack, Box } from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";
import InfiniteScroll from "react-infinite-scroll-component";
import SkeletonLoading from "src/components/skeleton/SkeletonLoading";
import { Pagination } from "src/types/Pagination";
import { ITable } from "src/sections/shared/useTable";

type InfiniteListProps<T extends { id: string }> = {
    pagination: Pagination<T> | undefined;
    table: ITable;
    scrollId: string;
    emptyText: string;
    allLoadedText: string;
    renderItem?: (item: T) => ReactNode;
    renderList?: (items: T[]) => ReactNode;
    resetKey?: string;
    header?: ReactNode;
    footer?: ReactNode;
    maxHeight?: string;
    scrollBoxSx?: SxProps<Theme>;
    onItemsChange?: (items: T[]) => void;
};

export function InfiniteList<T extends { id: string }>({
    pagination,
    table,
    scrollId,
    emptyText,
    allLoadedText,
    renderItem,
    renderList,
    resetKey,
    header,
    footer,
    maxHeight = "calc(100vh - 350px)",
    scrollBoxSx,
    onItemsChange,
}: InfiniteListProps<T>) {
    const [allItems, setAllItems] = useState<T[]>([]);
    const [hasMore, setHasMore] = useState(table.page + 1 < (pagination?.totalPages ?? 1));
    const [isResetting, setIsResetting] = useState(false);

    console.log("InfiniteList table", table)
    console.log("InfiniteList pagination", pagination)
    console.log("InfiniteList table.page + 1", table.page + 1)
    console.log("InfiniteList pagination?.totalPages ?? 1", pagination?.totalPages ?? 1)
    console.log("InfiniteList hasMore", hasMore)

    const containerRef = useRef<HTMLDivElement | null>(null);
    const lastProcessedPage = useRef<number>(-1);

    useEffect(() => {
        if (resetKey === undefined) return;

        setAllItems([]);
        setHasMore(true);
        setIsResetting(true);
        lastProcessedPage.current = -1;

        if (containerRef.current) {
            containerRef.current.scrollTop = 0;
        }

        if (table.page !== 0) {
            table.onChangePage(null, 0);
        } else {
            setIsResetting(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resetKey]);

    useEffect(() => {
        if (!pagination) return;

        const page = table.page;

        if (isResetting) {
            if (page !== 0) return;
            setIsResetting(false);
        }

        const pageItems = pagination.data || [];
        const totalPages = pagination.totalPages ?? 1;

        if (page === 0) {
            setAllItems(pageItems);
            lastProcessedPage.current = 0;
        } else if (page > lastProcessedPage.current) {
            setAllItems(prev => {
                const existingIds = new Set(prev.map(item => item.id));
                const newItems = pageItems.filter(item => !existingIds.has(item.id));
                return [...prev, ...newItems];
            });
            lastProcessedPage.current = page;
        } else {
            setAllItems(prev => {
                const rowsPerPage = table.rowsPerPage ?? 10;
                const keepCount = page * rowsPerPage;
                const kept = prev.slice(0, keepCount);
                const existingIds = new Set(kept.map(item => item.id));
                const newItems = pageItems.filter(item => !existingIds.has(item.id));
                return [...kept, ...newItems];
            });
        }

        setHasMore(page + 1 < totalPages);
    }, [pagination, table.page, table.rowsPerPage, isResetting]);

    useEffect(() => {
        onItemsChange?.(allItems);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allItems]);

    const fetchMore = useCallback(() => {
        if (hasMore) {
            table.onChangePage(null, table.page + 1);
        }
    }, [hasMore, table]);

    if (isResetting || (allItems.length === 0 && pagination === undefined)) {
        return (
            <Box sx={{ p: 2, width: "100%" }}>
                <SkeletonLoading count={3} height={100} spacing={2} />
            </Box>
        );
    }

    const isEmpty = allItems.length === 0 && pagination && pagination.data.length === 0;
    console.log("InfiniteList resetKey", resetKey)
    console.log("InfiniteList allItems.length", allItems.length)
    console.log("InfiniteList hasMore", hasMore)
    console.log("InfiniteList scrollId", scrollId)
    return (
        <Box sx={{ width: "100%", display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
            {header}

            <Box
                ref={containerRef}
                id={scrollId}
                sx={[
                    {
                        flex: 1,
                        minHeight: 0,
                        maxHeight,
                        overflow: isEmpty ? "hidden" : "scroll",
                        WebkitOverflowScrolling: "touch",
                        scrollbarWidth: "none",
                        "&::-webkit-scrollbar": {
                            display: "none",
                        },
                    },
                    ...(Array.isArray(scrollBoxSx) ? scrollBoxSx : scrollBoxSx ? [scrollBoxSx] : []),
                ]}
            >
                {isEmpty ? (
                    <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
                        {emptyText}
                    </Typography>
                ) : (
                    <InfiniteScroll
                        key={resetKey}
                        dataLength={allItems.length}
                        next={fetchMore}
                        hasMore={hasMore}
                        loader={
                            <Box sx={{ p: 2 }}>
                                <SkeletonLoading count={1} height={80} />
                            </Box>
                        }
                        endMessage={
                            <Typography align="center" variant="body2" color="text.secondary" sx={{ py: 2 }}>
                                {allLoadedText}
                            </Typography>
                        }
                        scrollableTarget={scrollId}
                        scrollThreshold={0.85}
                    >
                        {renderList ? renderList(allItems) : (
                            <Stack spacing={1.5} sx={{ p: 1.5 }}>
                                {allItems.map((item) => renderItem!(item))}
                            </Stack>
                        )}
                    </InfiniteScroll>
                )}
            </Box>

            {footer}
        </Box>
    );
}
