import Paper from "@mui/material/Paper"
import React, { memo, useCallback, useState } from "react"
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

import { MenuItem, Select, TableCell } from "@mui/material"
import DatePicker from "react-datepicker"
import { FaCalendarAlt } from "react-icons/fa"
import { IoClose } from "react-icons/io5"
import moment from "moment"

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
  rows,
  columns,
  children,
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
      <Grid rows={rows} columns={columns}>
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
        {showFilters && <TableFilterRow cellComponent={memo(FilterCell)} />}
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
        {children}
      </Grid>
    </Paper>
  )
}

const SelectCell = (props) => {
  const { filter, onFilter, column } = props

  return (
    <TableCell sx={{ width: "100%", p: 1 }}>
      <Select
        sx={{ display: "flex", height: 35 }}
        value={filter ? filter.value : ""}
        onChange={(e) =>
          onFilter(e.target.value ? { value: e.target.value } : null)
        }
      >
        {column?.selectOptions?.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </TableCell>
  )
}

const DateCell = (props) => {
  const { filter, onFilter, column } = props
  const dateFormat = column?.dateFormat || "DD/MM/YYYY"

  const DateInput = React.forwardRef((props, ref) => {
    const { filter, onFilter, children } = props
    return (
      <button
        ref={ref}
        // disabled={props.i}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "10px 0px",
          backgroundColor: "white",
          border: "1px solid #ccc",
          shadow: "none",
          width: "100%",
        }}
        onClick={props.onClick}
      >
        <FaCalendarAlt />
        <div style={{ margin: "0px 7px" }}>{children}</div>
        {filter?.value && filter.value != "" && (
          <IoClose
            size={20}
            onClick={() => {
              onFilter({ value: "" })
            }}
          />
        )}
      </button>
    )
  })
  return (
    <TableCell
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: 25,
      }}
    >
      <DatePicker
        format="dd/mm/yyyy"
        selected={filter?.value ?? ""}
        onChange={(date) => {
          onFilter({
            value: date.setHours(2, 0, 0, 0),
          })
        }}
        customInput={
          <DateInput filter={filter} onFilter={onFilter}>
            {filter?.value && filter.value != ""
              ? moment(filter?.value).format(dateFormat)
              : ""}
          </DateInput>
        }
      />
    </TableCell>
  )
}

const FilterCell = (props) => {
  const { column } = props
  if (column.filterType === "select") {
    return <SelectCell {...props} />
  } else if (column.filterType === "date") {
    return <DateCell {...props} />
  }
  return <TableFilterRow.Cell {...props} />
}

export default memo(Table)
