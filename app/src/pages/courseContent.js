import { Typography, Rating, Divider } from "@mui/material"
import { useParams } from "react-router-dom"
import BookmarkButton from "../Components/bookmarkButton"
import { NavBar } from "../Components/navbar"
import { makeStyles, useTheme } from "@mui/styles"
import { useEffect, useState } from "react"

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

const useStyles = makeStyles((theme) => ({
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.palette.text.grey,
    marginRight: 20,
  },
  text: {
    fontSize: 18,
    color: theme.palette.text.grey,
  },
  divider: {
    backgroundColor: theme.palette.background.lightBlue,
    height: "3px",
    margin: "25px 0",
    borderRadius: "50px",
  },
  alignSegment: {
    display: "flex",
    flexFlow: "row wrap",
    alignItems: "center",
  },
  align: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "50%",
    margin: "16px 0",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
  },
  courseContainer: {
    maxWidth: 1440,
    margin: "auto",
    padding: "0 24px",
    boxSizing: "border-box",
  },
}))

export const CourseContent = () => {
  const theme = useTheme()
  const { course_id } = useParams()
  const classes = useStyles()
  const [result, setResult] = useState()

  useEffect(() => {
    return fetch(`${API_BASE_URL}/course/${course_id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.pre_requisites !== null && data.pre_requisites !== "[]") {
          data.pre_requisites = data.pre_requisites
            .replace("[", "")
            .replace("]", "")
            .replaceAll("' ", ", ")
            .replaceAll("'", "")
        } else {
          data.pre_requisites = "None"
        }

        if (data.corequisites !== null && data.corequisites !== "[]") {
          data.corequisites = data.corequisites
            .replace("[", "")
            .replace("]", "")
            .replaceAll("' ", ", ")
            .replaceAll("'", "")
        } else {
          data.corequisites = "None"
        }

        if (data.term !== null) {
          data.term = data.term
            .replace("[", "")
            .replace("]", "")
            .replaceAll("' ", ", ")
            .replaceAll("'", "")
        } else {
          data.term = "Not Offered Currently"
        }

        if (data.related_course !== null) {
          data.related_course = data.related_course
            .replace("[", "")
            .replace("]", "")
            .split(" ")
          if (data.related_course.length === 1) {
            data.related_course = data.related_course[0]
          } else if (data.related_course.length > 5) {
            data.related_course = data.related_course.slice(0, 5).join(", ")
          } else {
            data.related_course = data.related_course.join(", ")
          }
        } else {
          data.related_course = "None"
        }
        setResult({
          ...data,
          rating: Math.random() * 5,
          views: Math.round(Math.random() * 10000),
        })
      })
  }, [course_id])

  if (!result) return null

  return (
    <>
      <NavBar />
      <div id="page-container" style={{ margin: "62px 0" }}>
        <div id="course-container" className={classes.courseContainer}>
          <div id="segment1">
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
                  color: theme.palette.text.grey,
                }}
              >
                {result.code} &#8211; {result.name}
              </Typography>
              <div style={{ display: "flex" }}>
                <Rating
                  sx={{ margin: "auto 0" }}
                  value={result.rating}
                  readOnly
                />
                <Typography
                  sx={{
                    margin: "auto 0",
                    paddingLeft: 1,
                    paddingRight: 4,
                    fontSize: 14,
                    color: theme.palette.text.grey,
                  }}
                >
                  {Math.round(result.rating)}/5 (
                  {Math.round(Math.random() * 1000)} votes)
                </Typography>
                <Typography
                  sx={{
                    margin: "auto 0",
                    fontSize: 14,
                    color: theme.palette.text.grey,
                  }}
                >
                  {result.views} Views
                </Typography>
              </div>
              <BookmarkButton
                sx={{ position: "absolute", top: -7, right: -7 }}
                course_id={result.code}
              />
            </div>
            <Typography
              sx={{ padding: "6px 42px", color: theme.palette.text.grey }}
            >
              {result.course_description}
            </Typography>
          </div>
          <Divider className={classes.divider} />
          <div id="segment2" className={classes.alignSegment}>
            <div className={classes.align}>
              <Typography className={classes.header}>Division: </Typography>
              <Typography className={classes.text}>
                {result.division}
              </Typography>
            </div>
            <div className={classes.align}>
              <Typography className={classes.header}>Department: </Typography>
              <Typography className={classes.text}>
                {result.department}
              </Typography>
            </div>
          </div>
          <Divider className={classes.divider} />
          <div id="segment3" className={classes.alignSegment}>
            <div className={classes.align}>
              <Typography className={classes.header}>
                Pre-requisites:{" "}
              </Typography>
              <Typography className={classes.text}>
                {result.pre_requisites}
              </Typography>
            </div>
            <div className={classes.align}>
              <Typography className={classes.header}>
                Co-requisites:{" "}
              </Typography>
              <Typography className={classes.text}>
                {result.corequisites}
              </Typography>
            </div>
          </div>
          <Divider className={classes.divider} />
          <div id="segment4" className={classes.alignSegment}>
            <div className={classes.align}>
              <Typography className={classes.header}>Campus: </Typography>
              <Typography className={classes.text}>{result.campus}</Typography>
            </div>
            <div className={classes.align}>
              <Typography className={classes.header}>Term: </Typography>
              <Typography className={classes.text}>{result.term}</Typography>
            </div>
          </div>
          <Divider className={classes.divider} />
          <div id="segment5" className={classes.alignSegment}>
            <Typography className={classes.header}>
              Related Courses:{" "}
            </Typography>
            <Typography className={classes.text}>
              {result.related_course}
            </Typography>
          </div>
        </div>
      </div>
    </>
  )
}
