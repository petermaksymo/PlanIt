import React from "react"
import map from "lodash/map"

import Card from "@mui/material/Card"
import Rating from "@mui/material/Rating"
import Typography from "@mui/material/Typography"

import BookmarkButton from "./bookmarkButton"

export const ResultCard = ({ result }) => {
  const rating = Math.random() * 5

  return (
    <Card
      sx={{ margin: "1rem 0 0 0", padding: "12px 24px", borderRadius: "10px" }}
      elevation={3}
    >
      <div style={{ display: "flex" }}>
        <Typography
          sx={{
            fontSize: 18,
            fontWeight: "bold",
            paddingRight: 4,
            margin: "auto 0",
          }}
        >
          {result["Name"]}
        </Typography>
        <Rating sx={{ margin: "auto 0" }} value={rating} readOnly />
        <Typography
          sx={{
            margin: "auto 0",
            paddingLeft: 1,
            paddingRight: 4,
            fontSize: 14,
          }}
        >
          {Math.round(rating)}/5 ({Math.round(Math.random() * 1000)} votes)
        </Typography>
        <Typography sx={{ margin: "auto 0", fontSize: 14 }}>
          {Math.round(Math.random() * 10000)} Views
        </Typography>
        <BookmarkButton
          sx={{ marginLeft: "auto" }}
          course_id={result["Code"]}
        />
      </div>
      <Typography sx={{ padding: "6px 42px" }}>
        {result["Course Description"]}
      </Typography>
    </Card>
  )
}

export const Results = ({ data }) => {
  if (!data) return null

  return (
    <>
      {map(data, (result) => (
        <ResultCard result={result} />
      ))}
    </>
  )
}
