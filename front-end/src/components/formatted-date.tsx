"use client"

import { useState, useEffect } from "react"
import { formatDistanceToNow, isValid } from "date-fns"

interface FormattedDateProps {
  date: string
  prefix?: string
}

export function FormattedDate({ date, prefix }: FormattedDateProps) {
  const [formattedDate, setFormattedDate] = useState("")

  useEffect(() => {
    try {
      const dateObj = new Date(date)
      if (!isValid(dateObj)) {
        setFormattedDate("Invalid date")
        return
      }
      
      setFormattedDate(
        `${prefix ? prefix + " " : ""}${formatDistanceToNow(dateObj, { addSuffix: true })}`
      )
    } catch (error) {
      setFormattedDate("Invalid date")
    }
  }, [date, prefix])

  return <span>{formattedDate}</span>
} 