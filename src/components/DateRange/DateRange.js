import { FaCalendarAlt } from "react-icons/fa"
import React, { useState } from "react"
import ReactDatePicker from "react-datepicker"
import "./DateRange.css"
const DateRange = ({
  fromDate,
  toDate,
  onChange,
  showDateMenu = true,
  disabled = false,
  dateInputStyle,
  ...props
}) => {
  const moment = require("moment")
  const [isOpen, setIsOpen] = useState(false)

  const DateInput = React.forwardRef((props, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        style={{
          padding: "10px 12px",
          backgroundColor: "white",
          border: "1px solid #ccc",
          shadow: "none",
          ...dateInputStyle,
        }}
        onClick={props.onClick}
      >
        <FaCalendarAlt style={{ marginRight: 5 }} />
        {props.children}
      </button>
    )
  })
  const fixedDates = (dateRange) => {
    let startDate
    let endDate = moment()._d
    switch (dateRange) {
      case "today":
        startDate = moment().startOf("day")._d
        startDate = new Date(startDate.setHours(2, 0, 0, 0))
        endDate = moment().endOf("day")._d
        break
      case "yesterday":
        startDate = moment().subtract(1, "days")._d
        startDate = new Date(startDate.setHours(2, 0, 0, 0))
        break
      case "thisWeek":
        startDate = moment().startOf("isoWeek")._d
        endDate = moment().endOf("day")._d
        break
      case "lastWeek":
        startDate = moment().subtract(1, "weeks").startOf("isoWeek")._d
        endDate = moment().subtract(1, "weeks").endOf("isoWeek")._d
        break
      case "thisMonth":
        startDate = moment().startOf("month")._d
        endDate = moment().endOf("day")._d
        break
      case "lastMonth":
        startDate = moment().subtract(1, "months").startOf("month")._d
        endDate = moment().subtract(1, "months").endOf("month")._d
        break
      default:
    }
    onChange({ fromDate: startDate, toDate: endDate })
    setIsOpen(false)
  }
  return (
    <>
      <div className="react-date-picker">
        <ReactDatePicker
          selectsRange={true}
          onInputClick={() => setIsOpen(true)}
          onClickOutside={() => setIsOpen(false)}
          open={isOpen}
          startDate={fromDate}
          endDate={toDate}
          onChange={(dates) => {
            if (dates[0] && dates[1]) {
              setIsOpen(false)
            }
            let fromDate = dates[0]
              ? new Date(dates[0].setHours(2, 0, 0, 0))
              : null
            let toDate = dates[1]
              ? new Date(dates[1].setHours(2, 0, 0, 0))
              : null
            onChange({ fromDate, toDate })
          }}
          customInput={
            <DateInput>
              {fromDate ? moment(fromDate).format("DD/MM/YYYY") : "Date"} -{" "}
              {toDate ? moment(toDate).format("DD/MM/YYYY") : "Date"}
            </DateInput>
          }
          {...props}
        >
          {isOpen && showDateMenu && (
            <div className="d-none d-md-flex list-group date-range-actions">
              <button onClick={() => fixedDates("today")} className="list-item">
                Today
              </button>
              <button
                onClick={() => fixedDates("yesterday")}
                className="list-item"
              >
                Yesterday
              </button>
              <button
                onClick={() => fixedDates("thisWeek")}
                className="list-item"
              >
                This Week
              </button>
              <button
                onClick={() => fixedDates("lastWeek")}
                className="list-item"
              >
                Last Week
              </button>
              <button
                onClick={() => fixedDates("thisMonth")}
                className="list-item"
              >
                This Month
              </button>
              <button
                onClick={() => fixedDates("lastMonth")}
                className="list-item"
              >
                Last Month
              </button>
            </div>
          )}
        </ReactDatePicker>
      </div>
    </>
  )
}

export default DateRange
