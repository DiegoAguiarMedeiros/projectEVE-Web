import React, { useCallback, useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

import './style.css';

// import required modules
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { _envelopes, _users } from 'src/_mock';
import { Card, Grid2, Table, TableBody, TableContainer, TablePagination, useTheme } from '@mui/material';
import { AnalyticsWidgetSummary } from '../overview/analytics-widget-summary';
import { applyFilter, emptyRows, getComparator } from './utils';
import { UserProps, UserTableRow } from './user-table-row';
import { UserTableHead } from './user-table-head';
import { TableEmptyRows } from './table-empty-rows';
import { TableNoData } from './table-no-data';
import { UserTableToolbar } from './user-table-toolbar';

export default function SwiperEnvelop() {
    const theme = useTheme();
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const table = useTable();

    const [filterName, setFilterName] = useState('');

    const dataFiltered: UserProps[] = applyFilter({
        inputData: _users,
        comparator: getComparator(table.order, table.orderBy),
        filterName,
    });
    const notFound = !dataFiltered.length && !!filterName;

    return (
        <>
            <Swiper
                // @ts-ignore
                onProgress={setThumbsSwiper}
                loop
                spaceBetween={10}
                slidesPerView={4}
                freeMode
                watchSlidesProgress
                modules={[FreeMode, Navigation, Thumbs]}
            >
                {_envelopes.map((envelope, index) => (
                    <SwiperSlide key={index}>
                        <Grid2 sx={{ padding: 2 }}>
                            <AnalyticsWidgetSummary
                                title={envelope.title}
                                percent={envelope.percent}
                                total={envelope.total}
                                icon={<envelope.icon />}
                                chart={envelope.chart}
                                color={envelope.color}
                            />
                        </Grid2>
                    </SwiperSlide>
                ))}
            </Swiper>
            <Swiper
                simulateTouch={false}
                spaceBetween={10}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[FreeMode, Navigation, Thumbs]}
            >
                {_envelopes.map((envelope, index) => (
                    <SwiperSlide key={index} >
                        <Card sx={{ width: '100%' }}>
                            <UserTableToolbar
                                numSelected={table.selected.length}
                                filterName={filterName}
                                onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    setFilterName(event.target.value);
                                    table.onResetPage();
                                }}
                            />
                            <TableContainer sx={{ overflow: 'unset' }}>
                                <Table sx={{ minWidth: 800 }}>
                                    <UserTableHead
                                        order={table.order}
                                        orderBy={table.orderBy}
                                        rowCount={_users.length}
                                        numSelected={table.selected.length}
                                        onSort={table.onSort}
                                        onSelectAllRows={(checked) =>
                                            table.onSelectAllRows(
                                                checked,
                                                _users.map((user) => user.id)
                                            )
                                        }
                                        headLabel={[
                                            { id: 'name', label: 'Name' },
                                            { id: 'company', label: 'Company' },
                                            { id: 'role', label: 'Role' },
                                            { id: 'isVerified', label: 'Verified', align: 'center' },
                                            { id: 'status', label: 'Status' },
                                            { id: '' },
                                        ]}
                                    />
                                    <TableBody>
                                        {dataFiltered
                                            .slice(
                                                table.page * table.rowsPerPage,
                                                table.page * table.rowsPerPage + table.rowsPerPage
                                            )
                                            .map((row) => (
                                                <UserTableRow
                                                    key={row.id}
                                                    row={row}
                                                    selected={table.selected.includes(row.id)}
                                                    onSelectRow={() => table.onSelectRow(row.id)}
                                                />
                                            ))}

                                        <TableEmptyRows
                                            height={68}
                                            emptyRows={emptyRows(table.page, table.rowsPerPage, _users.length)}
                                        />

                                        {notFound && <TableNoData searchQuery={filterName} />}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                component="div"
                                page={table.page}
                                count={_users.length}
                                rowsPerPage={table.rowsPerPage}
                                onPageChange={table.onChangePage}
                                rowsPerPageOptions={[5, 10, 25]}
                                onRowsPerPageChange={table.onChangeRowsPerPage}
                            />
                        </Card>
                    </SwiperSlide>
                ))}
            </Swiper >
        </>
    );
}



export function useTable() {
    const [page, setPage] = useState(0);
    const [orderBy, setOrderBy] = useState('name');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selected, setSelected] = useState<string[]>([]);
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');

    const onSort = useCallback(
        (id: string) => {
            const isAsc = orderBy === id && order === 'asc';
            setOrder(isAsc ? 'desc' : 'asc');
            setOrderBy(id);
        },
        [order, orderBy]
    );

    const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
        if (checked) {
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    }, []);

    const onSelectRow = useCallback(
        (inputValue: string) => {
            const newSelected = selected.includes(inputValue)
                ? selected.filter((value) => value !== inputValue)
                : [...selected, inputValue];

            setSelected(newSelected);
        },
        [selected]
    );

    const onResetPage = useCallback(() => {
        setPage(0);
    }, []);

    const onChangePage = useCallback((event: unknown, newPage: number) => {
        setPage(newPage);
    }, []);

    const onChangeRowsPerPage = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            onResetPage();
        },
        [onResetPage]
    );

    return {
        page,
        order,
        onSort,
        orderBy,
        selected,
        rowsPerPage,
        onSelectRow,
        onResetPage,
        onChangePage,
        onSelectAllRows,
        onChangeRowsPerPage,
    };
}