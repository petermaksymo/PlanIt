import React, { useState } from "react"
import { Typography, Divider, Button } from "@mui/material"
import { NavBar } from "../Components/navbar"
import { makeStyles, useTheme } from "@mui/styles"
import TextField from "@mui/material/TextField"
import SaveIcon from "@mui/icons-material/Save"

const useStyles = makeStyles((theme) => ({
  header: {
    color: theme.palette.text.grey,
    fontSize: 20,
    marginBottom: "15px",
    fontWeight: "bold",
  },
  text: {
    color: theme.palette.text.grey,
    fontSize: 18,
    marginBottom: "15px",
  },
}))

export const Help = () => {
  const theme = useTheme()
  const classes = useStyles()

  return (
    <>
      <NavBar />
      <div
        id="profiles"
        style={{
          padding: "30px 286px",
          backgroundColor: theme.palette.background.lightPink,
        }}
      >
        <Typography
          style={{
            color: theme.palette.text.dark,
            fontSize: 28,
            marginBottom: "15px",
          }}
        >
          Help
        </Typography>
      </div>
      <div id="page-container" style={{ margin: "80px 309px" }}>
        <Typography className={classes.text}>The following video is a tutorial on how to use most of the websites features</Typography>
        <iframe src='https://www.youtube.com/embed/dQw4w9WgXcQ'
          frameborder='0'
          width="853"
          height="480"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          title='Help Video'
        />
      </div>
    </>
  )
}
