import { generateRows } from "../demo-data/generator"
import Table from "../components/Table/Table"
import { useState } from "react"
import useStorage from "../utils/hooks/useStorage"
import {
  Table as MaterialTable,
  TableFilterRow,
} from "@devexpress/dx-react-grid-material-ui"
import { MenuItem, Select, TableCell } from "@mui/material"

const GridPage = () => {
  const [rows] = useState(generateRows({ length: 25 }))
  const [columns] = useState([
    { name: "name", title: "Name" },
    { name: "gender", title: "Gender" },
    { name: "city", title: "City" },
    { name: "car", title: "Car" },
    { name: "priority", title: "Priority", filterType: "select" },
    { name: "colors", title: "Colors" },
  ])

  const [searchValue, setSearchValue] = useState("")
  const [filters, setFilters] = useState([
    // { columnName: "name", value: "Lisa" },
  ])
  const [pagination, setPagination] = useState({
    pageSizes: [5, 10, 15, 25],
    currentPage: 0,
    currentPageSize: 10,
  })

  //use storage is a custom hook to control the state and also to save the state in local storage,the only difference in use with useState
  //is that useStorage needs an unique key as a second parameter
  const [defaultHiddenColumnNames, setDefaultHiddenColumnNames] = useStorage(
    [],
    "grid-hidden-columns"
  )

  const priorityWeights = {
    Low: 0,
    Normal: 1,
    High: 2,
  }

  const colorWeights = {
    Red: 0,
    Blue: 1,
    Green: 2,
  }
  // console.log({ pagination })
  console.log({ filters, searchValue })
  console.log({ rows, columns })

  const priorityOptions = [
    { value: "", label: "None" },
    { value: "Low", label: "Low" },
    { value: "Normal", label: "Normal" },
    { value: "High", label: "High" },
  ]

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
          {priorityOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </TableCell>
    )
  }

  const FilterCell = (props) => {
    const { filter, onFilter, column } = props
    if (column.filterType === "select") {
      return <SelectCell {...props} />
    }
    return <TableFilterRow.Cell {...props} />
  }

  return (
    <Table
      rows={rows}
      columns={columns}
      showFilters={false}
      // showSearch={false}
      // showHideColumns={false}

      //by default table needs only rows and columns,but if you need to control the state of the components you can pass down props below

      // defaultSorting={[{ columnName: "name", direction: "asc" }]}
      customSorting={[
        { columnName: "priority", weights: priorityWeights },
        { columnName: "colors", weights: colorWeights },
      ]}
      // pagination={pagination}
      // setPagination={setPagination}
      // filters={filters}
      // setFilters={setFilters}
      // defaultHiddenColumnNames={defaultHiddenColumnNames}
      // setDefaultHiddenColumnNames={setDefaultHiddenColumnNames}
      // searchValue={searchValue}
      // setSearchValue={setSearchValue}
    >
      <TableFilterRow cellComponent={FilterCell} />
    </Table>
  )
}

export default GridPage
