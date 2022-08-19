import moment from "moment"
import React, { useState } from "react"
import DateRange from "../components/DateRange/DateRange"

const SmallComponents = () => {
  const [dates, setDates] = useState({
    fromDate: moment().subtract(2, "days")._d,
    toDate: moment().add(3, "days")._d,
  })
  console.log({ dates })
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        transform: "translateY(-20%)",
      }}
    >
      <DateRange
        fromDate={dates.fromDate}
        toDate={dates.toDate}
        onChange={(dates) => {
          setDates(dates)
        }}
      />
    </div>
  )
}

export default SmallComponents
