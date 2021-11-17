import React from "react"
import { Typography } from "@mui/material"
import { NavBar } from "../Components/navbar"
import { makeStyles, useTheme } from "@mui/styles"

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
          padding: "30px 0",
          backgroundColor: theme.palette.background.lightPink,
        }}
      >
        <div
          style={{
            maxWidth: 1440,
            margin: "auto",
            padding: "0 24px",
            boxSizing: "border-box",
          }}
        >
          <Typography
            style={{
              color: theme.palette.text.dark,
              fontSize: 28,
              marginBottom: "15px",
              fontWeight: "bold",
            }}
          >
            Help
          </Typography>
        </div>
      </div>
      <div id="page-container" style={{ margin: "40px 0" }}>
        <div
          style={{
            maxWidth: 1440,
            margin: "auto",
            padding: "0 24px",
            boxSizing: "border-box",
          }}
        >
          <Typography className={classes.text}>
            The following video is a tutorial on how to use most of the websites
            features
          </Typography>
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              width: "100%",
              paddingTop: "57%",
            }}
          >
            <iframe
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
              src="https://www.youtube.com/embed/_E2EQi3-cac"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              title="Help Video"
            />
          </div>
        </div>
      </div>
    </>
  )
}
