import React, { useCallback, useEffect, useRef, useState } from "react";
import { Card, CardContent, Typography, IconButton, Stack, Divider, Box } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import dayjs from "dayjs";
import InfiniteScroll from "react-infinite-scroll-component";
import { TransactionForm } from "src/sections/envelope/form";
import { Transactions, TransactionsUpdateStatus } from "src/types/Transactions";
import { useDeleteTransactions } from "src/hooks/mutations/transactions/useDeleteTransactions";
import { useUpdateStatusTransactions } from "src/hooks/mutations/transactions/useUpdateStatusTransactions";
import Chips from "src/components/chip/chip";
import { Pagination } from "src/types/Pagination";
import { SlidingWindow, MAX_BUFFER } from "src/sections/shared/useSlidingWindow";
import { ITable } from "src/sections/shared/useTable";
import SkeletonLoading from "src/components/skeleton/SkeletonLoading";
import { Envelopes } from "src/types/Envelopes";

type TransactionListProps = {
    envelopeId: string;
    transactions: Pagination<Transactions> | undefined;
    table: ITable;
    allEnvelopes?: Envelopes[];
};

export function TransactionList({ envelopeId, transactions, table, allEnvelopes }: TransactionListProps) {
    const deleteTransactionMutation = useDeleteTransactions();
    const updateStatusTransactionMutation = useUpdateStatusTransactions();

    const windowRef = useRef(new SlidingWindow<Transactions>(MAX_BUFFER));
    const processedPageRef = useRef<number | null>(null);
    const loadingUpRef = useRef(false);
    const loadingDownRef = useRef(false);

    const [items, setItems] = useState<Transactions[]>([]);
    const [awaitingFirstLoad, setAwaitingFirstLoad] = useState(false);

    const containerRef = useRef<HTMLDivElement | null>(null);

    const DeleteTransaction = useCallback(
        (id: string) => deleteTransactionMutation.mutate(id),
        [deleteTransactionMutation]
    );

    const UpdateStatusTransaction = useCallback(
        (data: TransactionsUpdateStatus) => updateStatusTransactionMutation.mutate(data),
        [updateStatusTransactionMutation]
    );

    // --- Reset quando troca de envelope ---
    useEffect(() => {
        // console.log("🔄 Troca de envelope", envelopeId);
        // reset local
        windowRef.current = new SlidingWindow<Transactions>(MAX_BUFFER);
        processedPageRef.current = null;
        setItems([]);
        setAwaitingFirstLoad(true);

        // scroll to top to avoid showing "old" visible items
        if (containerRef.current) {
            try {
                containerRef.current.scrollTop = 0;
            } catch (e) {
                console.warn("Falha ao resetar scroll:", e);
            }
        }

        // garantir que o pai solicite a página inicial para o novo envelope
        if (table.page !== 0) {
            table.onChangePage(null, 0);
        } else {
            // se já está em page 0, então pode ser que o parent já vá fornecer os dados;
            // aguardamos transactions para page 0 (veja effect abaixo)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [envelopeId]);

    // --- Processa incoming `transactions` (com proteção contra dados atrasados) ---
    useEffect(() => {
        if (!transactions) return;

        const page = table.page;
        const rowsPerPage = table.rowsPerPage ?? 10;
        const pageStartIndex = page * rowsPerPage;
        const pageItems = transactions.data || [];

        // 1) Se estamos aguardando o primeiro carregamento do novo envelope,
        //    somente processamos quando recebermos a página 0 do novo envelope.
        if (awaitingFirstLoad) {
            if (page !== 0) {
                // ignora qualquer dado que não seja a página inicial do novo envelope
                return;
            }
            windowRef.current = new SlidingWindow<Transactions>(MAX_BUFFER);
            windowRef.current.setBuffer(pageItems, pageStartIndex);
            setItems(windowRef.current.getItems());
            processedPageRef.current = page;
            setAwaitingFirstLoad(false);
            loadingUpRef.current = false;
            loadingDownRef.current = false;
            return;
        }

        // 2) se ainda não processamos nenhuma página (inicialização normal)
        if (processedPageRef.current === null) {
            windowRef.current = new SlidingWindow<Transactions>(MAX_BUFFER);
            windowRef.current.setBuffer(pageItems, pageStartIndex);
            setItems(windowRef.current.getItems());
            processedPageRef.current = page;
            loadingUpRef.current = false;
            loadingDownRef.current = false;
            return;
        }

        // 3) carregamento para baixo (next page)
        if (page > (processedPageRef.current ?? -1)) {
            // dedupe por id para evitar duplicatas caso chegue algo repetido
            const existingIds = new Set(windowRef.current.getItems().map((i: any) => i.id));
            pageItems.filter((i: any) => !existingIds.has(i.id)).forEach(it => {
                windowRef.current.push(it);
            });
            setItems(windowRef.current.getItems());
            processedPageRef.current = page;
            loadingDownRef.current = false;
            return;
        }

        // 4) carregamento para cima (previous page)
        if (page < (processedPageRef.current ?? Infinity)) {
            const existingIds = new Set(windowRef.current.getItems().map((i: any) => i.id));
            pageItems.filter((i: any) => !existingIds.has(i.id)).slice().reverse().forEach(item => {
                windowRef.current.unshift(item);
            });
            setItems(windowRef.current.getItems());
            processedPageRef.current = page;
            loadingUpRef.current = false;
            return;
        }

        // 5) atualização da mesma página -> re-sincroniza aquele bloco
        windowRef.current = new SlidingWindow<Transactions>(MAX_BUFFER);
        windowRef.current.setBuffer(pageItems, pageStartIndex);
        setItems(windowRef.current.getItems());
        processedPageRef.current = page;
        loadingUpRef.current = false;
        loadingDownRef.current = false;
    }, [transactions, table.page, table.rowsPerPage, awaitingFirstLoad, envelopeId]);

    // helpers
    const windowRange = windowRef.current.getRange();
    const hasMoreDown = transactions ? windowRange.end + 1 < (transactions.totalItems ?? 0) : false;
    const hasMoreUp = windowRange.start > 0;

    const fetchMoreDown = () => {
        if (loadingDownRef.current || !hasMoreDown) return;
        loadingDownRef.current = true;
        table.onChangePage(null, table.page + 1);
    };

    const onContainerScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const el = e.currentTarget;
        const threshold = 60;
        if (el.scrollTop <= threshold && !loadingUpRef.current && hasMoreUp) {
            loadingUpRef.current = true;
            table.onChangePage(null, Math.max(0, table.page - 1));
        }
    };

    // se estamos aguardando primeiro load, mostra mensagem loading (evita renderar itens antigos)
    if (awaitingFirstLoad) {
        return (
            <Box sx={{ p: 2 }}>
                <SkeletonLoading count={3} height={100} spacing={2} />
            </Box>
        );
    }

    if (!transactions || (items.length === 0 && (!transactions.data || transactions.data.length === 0))) {
        return (
            <Typography align="center" sx={{ p: 2 }}>
                Nenhuma transação cadastrada!
            </Typography>
        );
    }

    return (
        <Box
            ref={containerRef}
            id="scrollableDiv"
            onScroll={onContainerScroll}
            style={{
                height: "70vh",
                overflow: "auto",
                WebkitOverflowScrolling: "touch",
            }}
        >
            <InfiniteScroll
                key={`${envelopeId}-${processedPageRef ?? "init"}`}
                dataLength={items.length}
                next={fetchMoreDown}
                hasMore={hasMoreDown}
                loader={<Box sx={{ p: 2 }}><SkeletonLoading count={1} height={100} /></Box>}
                endMessage={<Typography align="center" sx={{ p: 2 }}>Todas as transações foram carregadas</Typography>}
                scrollableTarget="scrollableDiv"
                scrollThreshold={0.9}
            >
                <Stack spacing={2} sx={{ p: 2 }}>
                    {items.map((row: any) => {
                        const { id, description, amount, paymentMethod, date, status } = row;

                        const handleClickStatus = () => {
                            UpdateStatusTransaction({ id, status: status === "Completed" ? "Pending" : "Completed" });
                        };

                        return (
                            <Card key={id} sx={{ borderRadius: 2, boxShadow: 2 }}>
                                <CardContent>
                                    <Stack spacing={1}>
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Typography variant="subtitle1" fontWeight="bold">{description}</Typography>
                                            <Typography variant="subtitle1" color="primary">R$ {amount}</Typography>
                                        </Box>

                                        <Typography variant="body2" color="text.secondary">
                                            {paymentMethod} • {dayjs(date).format("DD/MM/YYYY")}
                                        </Typography>

                                        <Chips label={status} labels={["Pago", "Pendente"]} fieldName="Completed" click={handleClickStatus} />

                                        <Divider />

                                        <Box display="flex" justifyContent="flex-end" gap={1}>
                                            <TransactionForm data={row} buttonIcon={<Edit />} buttonLabel="Editar" envelopeId={envelopeId} allEnvelopes={allEnvelopes} />
                                            <IconButton color="error" onClick={() => DeleteTransaction(id)}><Delete /></IconButton>
                                        </Box>
                                    </Stack>
                                </CardContent>
                            </Card>
                        );
                    })}
                </Stack>
            </InfiniteScroll>
        </Box>
    );
}
