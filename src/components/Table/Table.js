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

import { MenuItem, Select, TableCell, TextField } from "@mui/material"
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
      <TextField
        select
        sx={{ display: "flex", height: 35 }}
        variant="standard"
        size="medium"
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
      </TextField>
    </TableCell>
  )
}

const InputComponent = ({ defaultValue, inputRef, ...props }) => {
  const [value, setValue] = React.useState(() => props.value || defaultValue)

  const handleChange = (event) => {
    // setValue(event.target.value)
    if (props.onBlur) {
      props.onBlur(event)
    }
  }
  console.log({ inputRef, props })

  const onAccept = () => {
    props.onFilter({
      value,
    })
  }

  return (
    <input
      ref={inputRef}
      {...props}
      onChange={(event) => {
        setValue(event.target.value)
      }}
      onBlur={() => {
        onAccept()
        props.onBlur()
      }}
      onFocus={() => {
        onAccept()
        props.onAccept()
      }}
    />
  )
}

const DateCell = (props) => {
  const { filter, onFilter, column } = props
  const dateFormat = column?.dateFormat || "DD/MM/YYYY"
  const value = filter?.value
    ? moment(filter.value, dateFormat).format("YYYY-MM-DD")
    : ""
  return (
    <TableCell
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: 25,
      }}
    >
      <TextField
        type="date"
        size="small"
        variant="standard"
        fullWidth
        defaultValue={""}
        value={value}
        // InputProps={{
        //   inputComponent: InputComponent
        // }}
        onChange={(e) => {
          const date = moment(e.target.value).format(dateFormat)
          onFilter({
            value: date,
          })
        }}
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
