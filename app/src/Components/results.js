import React from "react"
import { Link } from "react-router-dom"
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
      <div
        style={{
          position: "relative",
          display: "flex",
          flexFlow: "row wrap",
          paddingRight: 40,
        }}
      >
        <Typography
          sx={{
            fontSize: 18,
            fontWeight: "bold",
            paddingRight: 4,
            margin: "auto 0",
          }}
        >
          {result.code + " - " + result.name}
        </Typography>
        <div style={{ display: "flex" }}>
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
        </div>
        <BookmarkButton
          sx={{ position: "absolute", top: -8, right: -8 }}
          course_id={result["code"]}
        />
      </div>
      <Typography sx={{ padding: "6px 12px" }}>
        {result["course_description"]}
      </Typography>
      <Typography
        style={{
          width: "100%",
          textAlign: "center",
          marginTop: 4,
          color: "#555555",
        }}
      >
        <Link to={`/course/${result.code}`} target="_blank" style={{}}>
          More Details
        </Link>
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
