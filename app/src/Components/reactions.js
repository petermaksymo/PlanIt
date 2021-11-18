import React, { useContext, useEffect, useState } from "react"

import { AuthContext } from "../contexts/auth"

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

export const Reactions = ({ course_id, ...props }) => {
  const { isAuthed, authedFetch } = useContext(AuthContext)
  const [voted, setRating] = useState(false)

  useEffect(() => {
    if (isAuthed)
      return authedFetch(`${API_BASE_URL}/course/${course_id}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => setRating(data.length === 1))
  }, [course_id])

  const toggleRating = (e) => {
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()

    if (voted) {
      return authedFetch(`${API_BASE_URL}/course/${course_id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data === 1) setRating(false)
        })

      return authedFetch(`${API_BASE_URL}/course/${course_id}`, {
        method: "PATCH",
      })
        .then((res) => res.json())
        .then((data) => {
          setRating(data.course_code === course_id)
        })
    } else {
      const formdata = new FormData()
      formdata.append("course", course_id)

      return authedFetch(`${API_BASE_URL}/course/${course_id}`, {
        method: "POST",
        body: formdata,
      })
        .then((res) => res.json())
        .then((data) => {
          setRating(data.course_code === course_id)
        })
    }
  }

  if (!isAuthed) return <div {...props} />

}

export default Reactions
