import { generateRows } from "../demo-data/generator"
import Table from "../components/Table/Table"
import { useState } from "react"
import useStorage from "../utils/hooks/useStorage"

const GridPage = () => {
  const priorityOptions = [
    { value: "", label: "None" },
    { value: "Low", label: "Low" },
    { value: "Normal", label: "Normal" },
    { value: "High", label: "High" },
  ]

  const [rows] = useState(generateRows({ length: 25 }))

  const [columns] = useState([
    {
      name: "name",
      title: "Name",
      // filteringEnabled: false, //specify if filtering is enabled for this column
    },
    { name: "gender", title: "Gender" },
    { name: "city", title: "City" },
    {
      name: "birthDate",
      title: "Birthday",
      filterType: "date",
      // dateFormat: "DD/MM/YYYY",//you can specifiy date formats for date input,date format is in timestamp
    },
    { name: "car", title: "Car" },
    {
      name: "priority",
      title: "Priority",
      filterType: "select", //cell accepts filter types of select,date,by default is text input
      selectOptions: priorityOptions,
    },
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

  console.log({ filters })
  return (
    <Table
      rows={rows}
      columns={columns}
      // showFilters={false}
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
      filters={filters}
      setFilters={setFilters}
      // defaultHiddenColumnNames={defaultHiddenColumnNames}
      // setDefaultHiddenColumnNames={setDefaultHiddenColumnNames}
      // searchValue={searchValue}
      // setSearchValue={setSearchValue}
    ></Table>
  )
}

export default GridPage
