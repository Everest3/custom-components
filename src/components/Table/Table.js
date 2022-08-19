import Paper from "@mui/material/Paper"
import React, { useCallback, useState } from "react"
import produce from "immer"
import {
  SortingState,
  IntegratedSorting,
  PagingState,
  IntegratedPaging,
  IntegratedFiltering,
  FilteringState,
  SearchState,
} from "@devexpress/dx-react-grid"

import {
  Grid,
  Table as MaterialTable,
  TableHeaderRow,
  PagingPanel,
  TableFilterRow,
  Toolbar,
  SearchPanel,
  TableColumnVisibility,
  ColumnChooser,
} from "@devexpress/dx-react-grid-material-ui"

const Table = ({
  defaultHiddenColumnNames = [],
  setDefaultHiddenColumnNames,
  showHideColumns = true,
  showSearch = true,
  searchValue,
  setSearchValue,
  filters,
  setFilters,
  showFilters = true,
  pagination,
  setPagination,
  customSorting,
  defaultSorting,
  ...props
}) => {
  let columnExtensions = []

  const getHiddenColumnsFilteringExtensions = useCallback(
    (hiddenColumnNames) =>
      hiddenColumnNames?.map(
        (columnName) =>
          ({
            columnName,
            predicate: () => false,
          } ?? [])
      ),
    [defaultHiddenColumnNames]
  )

  // const onHiddenColumnNamesChange = (hiddenColumnNames) => {
  //   setDefaultHiddenColumnNames(hiddenColumnNames)
  // }
  const comparePriority = (a, b, weights) => {
    const priorityA = weights[a]
    const priorityB = weights[b]
    if (priorityA === priorityB) {
      return 0
    }
    return priorityA < priorityB ? -1 : 1
  }

  if (customSorting) {
    columnExtensions = customSorting.map((customSort) => {
      return {
        columnName: customSort.columnName,
        compare: (a, b) => comparePriority(a, b, customSort.weights),
      }
    })
  }

  return (
    <Paper>
      <Grid {...props}>
        <SortingState defaultSorting={defaultSorting} />
        {/* custom sorting */}
        <IntegratedSorting columnExtensions={columnExtensions} />
        {/* shfletim */}
        {pagination ? (
          <PagingState
            defaultCurrentPage={0}
            defaultPageSize={10}
            currentPage={pagination.currentPage}
            onCurrentPageChange={(currentPage) => {
              setPagination((pagination) => ({ ...pagination, currentPage }))
            }}
            pageSize={pagination?.currentPageSize}
            onPageSizeChange={(currentPageSize) => {
              setPagination((pagination) => ({
                ...pagination,
                currentPageSize,
              }))
            }}
          />
        ) : (
          <PagingState defaultCurrentPage={0} defaultPageSize={10} />
        )}

        <IntegratedPaging />

        {showFilters && filters ? (
          <FilteringState filters={filters} onFiltersChange={setFilters} />
        ) : (
          <FilteringState />
        )}

        {showSearch &&
          (searchValue != null ? (
            <SearchState value={searchValue} onValueChange={setSearchValue} />
          ) : (
            <SearchState />
          ))}
        <IntegratedFiltering
          columnExtensions={getHiddenColumnsFilteringExtensions(
            defaultHiddenColumnNames
          )}
        />

        <MaterialTable />
        <TableHeaderRow showSortingControls />
        {showFilters && <TableFilterRow />}
        {showHideColumns && (
          <TableColumnVisibility
            defaultHiddenColumnNames={defaultHiddenColumnNames}
            onHiddenColumnNamesChange={(hiddenColumns) => {
              if (setDefaultHiddenColumnNames)
                setDefaultHiddenColumnNames(hiddenColumns)
            }}
          />
        )}
        <Toolbar />
        {showSearch && <SearchPanel />}
        {showHideColumns && <ColumnChooser />}
        {/* contrrollet e shfletimit */}
        <PagingPanel pageSizes={pagination?.pageSizes ?? [5, 10, 15]} />
      </Grid>
    </Paper>
  )
}

export default Table
