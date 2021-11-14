import React, { useContext, useEffect, useState } from "react"

import IconButton from "@mui/material/IconButton"
import BookmarkIcon from "@mui/icons-material/Bookmark"
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder"
import { AuthContext } from "../contexts/auth"

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

export const BookmarkButton = ({ course_id, ...props }) => {
  const { isAuthed, authedFetch } = useContext(AuthContext)
  const [bookmarked, setBookmarked] = useState(false)

  useEffect(() => {
    if (isAuthed)
      return authedFetch(`${API_BASE_URL}/bookmark?course=${course_id}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => setBookmarked(data.length === 1))
  }, [course_id, authedFetch, isAuthed])

  const toggleBookmark = () => {
    if (bookmarked) {
      return authedFetch(`${API_BASE_URL}/bookmark?course=${course_id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data === 1) setBookmarked(false)
        })
    } else {
      const formdata = new FormData()
      formdata.append("course", course_id)

      return authedFetch(`${API_BASE_URL}/bookmark`, {
        method: "POST",
        body: formdata,
      })
        .then((res) => res.json())
        .then((data) => {
          setBookmarked(data.course_name === course_id)
        })
    }
  }

  if (!isAuthed) return <div {...props} />

  return (
    <IconButton onClick={toggleBookmark} {...props}>
      {bookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
    </IconButton>
  )
}

export default BookmarkButton
