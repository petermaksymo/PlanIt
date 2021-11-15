import { Typography, Rating, Divider } from "@mui/material"
import BookmarkButton from "../Components/bookmarkButton"
import { NavBar } from "../Components/navbar"
import { makeStyles, useTheme } from "@mui/styles"

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
    height: '3px', 
    margin: '42px 0',
  },
  align: {
    display: "flex", 
    flexDirection: "row", 
    alignItems: 'center',
  },
}))


export const CourseContent = () => {
  const theme = useTheme()
  const classes = useStyles()
  const result = {
    name: " Introduction to Databases",
    code: "CSC343H1",
    courseDescription: "Introduction to database management systems. The relational data model. Relational algebra. Querying and updating databases: the query language SQL. Application programming with SQL. Integrity constraints, normal forms, and database design. Elements of database system technology: query processing, transaction management.",
    division: "Faculty of Applied Science and Engineering",
    department: "Biochemistry",
    prereq: "",
    coreq: "",
    campus: "St. George",
    term: "Winter 2022",
    rating: Math.random() * 5,
    views: Math.round(Math.random() * 10000)
  }

  return (
    <>
    <NavBar/>
      <div id="page-container" style={{margin: "62px 172px"}}>
        <div
          id="course-container"
          style={{padding: "81px 137px", borderRadius: "14px", border: "4px solid", borderColor: theme.palette.background.lightBlue }}
        >
          <div id="segment1">
            <div style={{ display: "flex" }}>
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
              <Rating sx={{ margin: "auto 0" }} value={result.rating} readOnly />
              <Typography
                sx={{
                  margin: "auto 0",
                  paddingLeft: 1,
                  paddingRight: 4,
                  fontSize: 14,
                  color: theme.palette.text.grey,
                }}
              >
                {Math.round(result.rating)}/5 ({Math.round(Math.random() * 1000)} votes)
              </Typography>
              <Typography sx={{ margin: "auto 0", fontSize: 14, color: theme.palette.text.grey, }}>
                {Math.round(Math.random() * 10000)} Views
              </Typography>
              <BookmarkButton
                sx={{ marginLeft: "auto" }}
                course_id={result.code}
              />
            </div>
            <Typography sx={{ padding: "6px 42px", color: theme.palette.text.grey, }}>
              {result.courseDescription}
            </Typography>
          </div>
          <Divider className={classes.divider}/>
          <div id="segment2" className={classes.align}>
            <div className={classes.align} style={{width: '50%'}}>
              <Typography className={classes.header}>Division: </Typography>
              <Typography className={classes.text}>{result.division}</Typography>
            </div>
            <div className={classes.align} style={{width: '50%'}}>
              <Typography className={classes.header}>Department: </Typography>
              <Typography className={classes.text}>{result.department}</Typography>
            </div>
          </div>
          <Divider className={classes.divider}/>
          <div id="segment3" className={classes.align}>
              <Typography className={classes.header}>Pre-requisites: </Typography>
              <Typography className={classes.text}>{result.prereq}</Typography>
          </div>
          <Divider className={classes.divider}/>
          <div id="segment4" className={classes.align}>
              <Typography className={classes.header}>Co-requisites: </Typography>
              <Typography className={classes.text}>{result.coreq}</Typography>
          </div>
          <Divider className={classes.divider}/>
          <div id="segment5" className={classes.align}>
            <div className={classes.align} style={{width: '50%'}}>
              <Typography className={classes.header}>Campus: </Typography>
              <Typography className={classes.text}>{result.campus}</Typography>
            </div>
            <div className={classes.align} style={{width: '50%'}}>
              <Typography className={classes.header}>Term: </Typography>
              <Typography className={classes.text}>{result.term}</Typography>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
