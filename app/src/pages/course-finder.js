import React, { useState } from "react"
import Paper from "@mui/material/Paper"
import InputBase from "@mui/material/InputBase"
import IconButton from "@mui/material/IconButton"
import Button from "@mui/material/Button"
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt"
import Grid from "@mui/material/Grid"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state"
import { makeStyles, useTheme } from "@mui/styles"
import { Results } from "../Components/results"
import { NavBar } from "../Components/navbar"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import { Typography } from "@mui/material"

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

const useStyles = makeStyles((theme) => ({
  btn: {
    backgroundColor: theme.palette.button.brightRed,
    borderRadius: 10,
    textTransform: "none",
  },
  btnDiv: {
    width: "125px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  filter: {
    margin: "20px 16px 20px 0",
  },
}))

export const CourseFinder = () => {
  const theme = useTheme()
  const classes = useStyles()
  const [search, setSearch] = useState("")
  const [year, setYear] = useState("")
  const [department, setDepartment] = useState("")
  const [division, setDivision] = useState("")
  const [campus, setCampus] = useState("")
  const [top, setTop] = useState("")
  const [results, setResults] = useState(null)
  const [rating, setRating] = useState("")
  const [filter, setFilter] = useState("")

  const onSubmit = (e) => {
    e.preventDefault()
    if (
      search === "" &&
      year === "" &&
      department === "" &&
      division === "" &&
      campus === ""
    )
      return
    let searchParams = new URLSearchParams()
    searchParams.append("search_keywords", search)
    if (year !== "" && year !== "Any") {
      searchParams.append("year", year)
    }
    if (division !== "" && division !== "Any") {
      searchParams.append("division", division)
    }
    if (department !== "" && department !== "Any") {
      searchParams.append("department", department)
    }
    if (campus !== "" && campus !== "Any") {
      searchParams.append("campus", campus)
    }
    if (top !== "" && top !== "Any") {
      searchParams.append("top", top)
    }
    let url = searchParams.toString()

    fetch(`${API_BASE_URL}/results?${url}`, {
      method: "GET",
      mode: "cors",
    })
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
      })
      .then((data) => {
        setResults(data)
      })
  }

  const filters = {
    year: ["Any", 1, 2, 3, 4, 5, 6],
    division: [
      "Any",
      "Faculty of Arts and Science",
      "Faculty of Applied Science & Engineering",
      "Faculty of Music",
      "John H. Daniels Faculty of Architecture, Landscape, & Design",
      "University of Toronto Mississauga",
      "University of Toronto Scarborough",
    ],
    department: [
      "Any",
      "Anatomy and Cell Biology",
      "Anthropology",
      "Anthropology (UTSC)",
      "Art History",
      "ASDN: Arts and Science, Office of the Dean",
      "Astronomy and Astrophysics",
      "Biochemistry",
      "Biological Sciences (UTSC)",
      "Biology",
      "Canadian Institute for Theoretical Astrophysics",
      "Cell and Systems Biology",
      "Centre for Criminology and Sociolegal Studies",
      "Centre for Critical Development Studies (UTSC)",
      "Centre for Diaspora & Transnational Studies",
      "Centre for Drama, Theatre and Performance Studies",
      "Centre for European, Russian and Eurasian Studies",
      "Centre for Industrial Relations and Human Resources",
      "Centre for Study of United States",
      "Centre for Teaching and Learning (UTSC)",
      "Chemical and Physical Sciences",
      "Chemical Engineering and Applied Chemistry",
      "Chemistry",
      "Cinema Studies Institute",
      "Civil and Mineral Engineering",
      "Classics",
      "Computer Science",
      "Cross Disciplinary Programs Office",
      "Department for the Study of Religion",
      "Dept. of Arts, Culture & Media (UTSC)",
      "Dept. of Computer & Mathematical Sci (UTSC)",
      "Dept. of Historical & Cultural Studies (UTSC)",
      "Dept. of Physical & Environmental Sci (UTSC)",
      "Division of Engineering Science",
      "Earth Sciences",
      "East Asian Studies",
      "Ecology and Evolutionary Biology",
      "Economics",
      "Edward S. Rogers Sr. Dept. of Electrical & Computer Engin.",
      "Engineering First Year Office",
      "English",
      "English and Drama",
      "English (UTSC)",
      "Factor Inwentash Faculty of Social Work",
      "Faculty of Applied Science & Engineering",
      "Faculty of Arts and Science",
      "Faculty of Music",
      "French",
      "Geography and Planning",
      "Geography, Geomatics and Environment",
      "Germanic Languages & Literatures",
      "Health and Society (UTSC)",
      "Historical Studies",
      "History",
      "Human Biology Program",
      "Human Geography (UTSC)",
      "Immunology",
      "Indigenous Studies Arts & Science",
      "Inst for Studies in Transdisciplinary Engin Educ & Practice",
      "Inst. for the History & Philosophy of Science & Technology",
      "Institute for Management and Innovation",
      "Institute for the Study of University Pedagogy",
      "Institute of Biomedical Engineering",
      "Institute of Communication and Culture",
      "Italian Studies",
      "Jewish Studies",
      "John H. Daniels Faculty of Architecture, Landscape, & Design",
      "Laboratory Medicine and Pathobiology",
      "Language Studies",
      "Language Studies (UTSC)",
      "Linguistics",
      "Management",
      "Management (UTSC)",
      "Materials Science and Engineering",
      "Mathematical and Computational Sciences",
      "Mathematics",
      "Mechanical & Industrial Engineering",
      "Molecular Genetics",
      "Munk School of Global Affairs and Public Policy",
      "Near & Middle Eastern Civilizations",
      "New College",
      "Nutritional Sciences",
      "Pharmacology",
      "Philosophy",
      "Philosophy (UTSC)",
      "Physics",
      "Physiology",
      "Political Science",
      "Political Science (UTSC)",
      "Psychology",
      "Psychology (UTSC)",
      "Rotman Commerce",
      "School of Environment",
      "Sexual Diversity Studies",
      "Slavic Languages and Literatures",
      "Sociology",
      "Sociology (UTSC)",
      "Spanish and Portuguese",
      "Statistical Sciences",
      "St. Michael's College",
      "Trinity College",
      "University College",
      "University of Toronto Mississauga",
      "University of Toronto Scarborough",
      "Victoria College",
      "Visual Studies",
      "Women and Gender Studies Institute",
    ],
    campus: ["Any", "Mississauga", "Scarborough", "St. George"],
    maxResults: ["Any", 10, 25, 50],
    rating: ["Any", "Over 2", "Over 3", "Over 4", "Over 4.5"],
    sortBy: ["Any", "Field"],
  }

  return (
    <div>
      <NavBar />
      <div className="pageContainer">
        <div
          style={{
            backgroundColor: theme.palette.background.lightPink,
            padding: "40px 0 20px 0",
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
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="flex-start"
            >
              <Grid item sx={{ width: "100%" }}>
                <Paper
                  component="form"
                  sx={{
                    p: "2px 4px",
                    display: "flex",
                    alignItems: "center",
                    maxWidth: 1010,
                    borderWidth: "medium",
                    border: "solid",
                    borderColor: theme.palette.background.main,
                    borderRadius: 3,
                  }}
                  className="searchBar"
                  onSubmit={onSubmit}
                >
                  <InputBase
                    autoFocus
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search by course name, department, or campus"
                    inputProps={{ "aria-label": "search google maps" }}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <IconButton
                    type="submit"
                    sx={{ margin: "-10px" }}
                    aria-label="search"
                    disableRipple={true}
                    disableFocusRipple={true}
                  >
                    <ArrowRightAltIcon sx={{ fontSize: 40 }} color="primary" />
                  </IconButton>
                </Paper>
              </Grid>

              <Grid item id="form-filters" style={{ display: "flex", flexFlow: 'row wrap' }}>
                <div className={classes.filter}>
                  <PopupState variant="popover" popupId="year-filter">
                    {(popupState) => (
                      <React.Fragment>
                        <Button
                          variant="contained"
                          {...bindTrigger(popupState)}
                          className={classes.btn}
                        >
                          <div className={classes.btnDiv}>
                            <Typography>
                              Course Year
                              {year !== "" && year !== "Any" && <>: {year}</>}
                            </Typography>
                          </div>
                        </Button>
                        <Menu {...bindMenu(popupState)}>
                          {filters.year.map((item, index) => {
                            return (
                              <MenuItem
                                key={item}
                                selected={item === year}
                                onClick={() => {
                                  popupState.close()
                                  setYear(item)
                                }}
                              >
                                {item}
                              </MenuItem>
                            )
                          })}
                        </Menu>
                      </React.Fragment>
                    )}
                  </PopupState>
                </div>
                <div className={classes.filter}>
                  <PopupState variant="popover" popupId="division-filter">
                    {(popupState) => (
                      <React.Fragment>
                        <Button
                          variant="contained"
                          {...bindTrigger(popupState)}
                          className={classes.btn}
                        >
                          <div className={classes.btnDiv}>
                            <Typography>
                              Division
                              {division !== "" && division !== "Any" && (
                                <>: {division}</>
                              )}
                            </Typography>
                          </div>
                        </Button>
                        <Menu {...bindMenu(popupState)}>
                          {filters.division.map((item, index) => {
                            return (
                              <MenuItem
                                key={item}
                                selected={item === division}
                                onClick={() => {
                                  popupState.close()
                                  setDivision(item)
                                }}
                              >
                                {item}
                              </MenuItem>
                            )
                          })}
                        </Menu>
                      </React.Fragment>
                    )}
                  </PopupState>
                </div>
                <div className={classes.filter}>
                  <PopupState variant="popover" popupId="department-filter">
                    {(popupState) => (
                      <React.Fragment>
                        <Button
                          variant="contained"
                          {...bindTrigger(popupState)}
                          className={classes.btn}
                        >
                          <div className={classes.btnDiv}>
                            <Typography>
                              Department
                              {department !== "" && department !== "Any" && (
                                <>: {department}</>
                              )}
                            </Typography>
                          </div>
                        </Button>
                        <Menu {...bindMenu(popupState)}>
                          {filters.department.map((item, index) => {
                            return (
                              <MenuItem
                                key={item}
                                selected={item === department}
                                onClick={() => {
                                  popupState.close()
                                  setDepartment(item)
                                }}
                              >
                                {item}
                              </MenuItem>
                            )
                          })}
                        </Menu>
                      </React.Fragment>
                    )}
                  </PopupState>
                </div>
                <div className={classes.filter}>
                  <PopupState variant="popover" popupId="campus-filter">
                    {(popupState) => (
                      <React.Fragment>
                        <Button
                          variant="contained"
                          {...bindTrigger(popupState)}
                          className={classes.btn}
                        >
                          <div className={classes.btnDiv}>
                            <Typography>
                              Campus
                              {campus !== "" && campus !== "Any" && (
                                <>: {campus}</>
                              )}
                            </Typography>
                          </div>
                        </Button>
                        <Menu {...bindMenu(popupState)}>
                          {filters.campus.map((item, index) => {
                            return (
                              <MenuItem
                                key={item}
                                selected={item === campus}
                                onClick={() => {
                                  popupState.close()
                                  setCampus(item)
                                }}
                              >
                                {item}
                              </MenuItem>
                            )
                          })}
                        </Menu>
                      </React.Fragment>
                    )}
                  </PopupState>
                </div>
                <div className={classes.filter}>
                  <PopupState variant="popover" popupId="max-results-filter">
                    {(popupState) => (
                      <React.Fragment>
                        <Button
                          variant="contained"
                          {...bindTrigger(popupState)}
                          className={classes.btn}
                        >
                          <div className={classes.btnDiv}>
                            <Typography>
                              Max Results
                              {top !== "" && top !== "Any" && <>: {top}</>}
                            </Typography>
                          </div>
                        </Button>
                        <Menu {...bindMenu(popupState)}>
                          {filters.maxResults.map((item, index) => {
                            return (
                              <MenuItem
                                key={item}
                                selected={item === top}
                                onClick={() => {
                                  popupState.close()
                                  setTop(item)
                                }}
                              >
                                {item}
                              </MenuItem>
                            )
                          })}
                        </Menu>
                      </React.Fragment>
                    )}
                  </PopupState>
                </div>
                <div className={classes.filter}>
                  <PopupState variant="popover" popupId="rating-filter">
                    {(popupState) => (
                      <React.Fragment>
                        <Button
                          variant="contained"
                          {...bindTrigger(popupState)}
                          className={classes.btn}
                        >
                          <div className={classes.btnDiv}>
                            <Typography>
                              Rating
                              {rating !== "" && rating !== "Any" && (
                                <>: {rating}</>
                              )}
                            </Typography>
                          </div>
                        </Button>
                        <Menu {...bindMenu(popupState)}>
                          {filters.rating.map((item, index) => {
                            return (
                              <MenuItem
                                key={item}
                                selected={item === rating}
                                onClick={() => {
                                  popupState.close()
                                  setRating(item)
                                }}
                              >
                                {item}
                              </MenuItem>
                            )
                          })}
                        </Menu>
                      </React.Fragment>
                    )}
                  </PopupState>
                </div>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
      <div style={{ margin: "20px 0" }}>
        <div
          style={{
            maxWidth: 1440,
            margin: "auto",
            padding: "0 24px",
            boxSizing: "border-box",
          }}
        >
          <PopupState variant="popover" popupId="sort-by-filter">
            {(popupState) => (
              <React.Fragment>
                <Button
                  variant="contained"
                  {...bindTrigger(popupState)}
                  className={classes.btn}
                  style={{ backgroundColor: "#D3D3D3" }}
                >
                  Sort By
                  {filter !== "" && filter !== "Any" ? (
                    <>: {filter}</>
                  ) : (
                    <ArrowDropDownIcon />
                  )}
                </Button>
                <Menu {...bindMenu(popupState)}>
                  {filters.sortBy.map((item, index) => {
                    return (
                      <MenuItem
                        key={item}
                        selected={item === filter}
                        onClick={() => {
                          popupState.close()
                          setFilter(item)
                        }}
                      >
                        {item}
                      </MenuItem>
                    )
                  })}
                </Menu>
              </React.Fragment>
            )}
          </PopupState>
          <Results data={results} />
        </div>
      </div>
    </div>
  )
}
