"use client"

import { useState, useEffect } from "react"
import { formatDistanceToNow, parseISO, isValid } from "date-fns"

interface FormattedDateProps {
  date: string
  prefix?: string
}

export function FormattedDate({ date, prefix }: FormattedDateProps) {
  const [formattedDate, setFormattedDate] = useState("")

  useEffect(() => {
    console.log("Date received:", date)
    try {
      // First try parsing as ISO string
      let dateObj: Date
      
      if (date.includes('T')) {
        // If it's an ISO string (contains 'T')
        dateObj = parseISO(date)
      } else {
        // If it's a different format, try regular Date constructor
        dateObj = new Date(date)
      }

      if (!isValid(dateObj)) {
        console.error("Invalid date received:", date)
        setFormattedDate("Invalid date")
        return
      }
      
      const formatted = formatDistanceToNow(dateObj, { addSuffix: true })
      setFormattedDate(`${prefix ? prefix + " " : ""}${formatted}`)
      
    } catch (error) {
      console.error("Error formatting date:", error, "Date value:", date)
      setFormattedDate("Invalid date")
    }
  }, [date, prefix])

  return <span>{formattedDate}</span>
}