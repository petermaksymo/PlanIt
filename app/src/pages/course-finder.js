import React, { useState } from "react"
import Paper from "@mui/material/Paper"
import InputBase from "@mui/material/InputBase"
import IconButton from "@mui/material/IconButton"
import Button from '@mui/material/Button'
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt"
import Grid from "@mui/material/Grid"
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { makeStyles, useTheme } from "@mui/styles"
import { Results } from "../Components/results"
import { NavBar } from "../Components/navbar"
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const useStyles = makeStyles((theme) => ({
  btn: {
    backgroundColor: theme.palette.button.brightRed, 
    borderRadius: 10, 
    textTransform: "none",
  },
  filter: {
    margin: "20px 16px 20px 0",
  }
}))

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

export const CourseFinder = () => {
  const theme = useTheme()
  const classes = useStyles()
  const [search, setSearch] = useState("")
  const [year, setYear] = useState("")
  const [department, setDepartment] = useState("") // eslint-disable-line no-unused-vars
  const [division, setDivision] = useState("") // eslint-disable-line no-unused-vars
  const [campus, setCampus] = useState("") // eslint-disable-line no-unused-vars
  const [results, setResults] = useState(null)
  const [filter, setFilter] = useState("")

  const onSubmit = (e) => {
    e.preventDefault()
    if (search === "") return
    let searchParams = new URLSearchParams()
    searchParams.append("search_keywords", search)
    if (year !== "") {
      searchParams.append("year", year)
    }
    if (division !== "") {
      searchParams.append("divisions", division)
    }
    if (department !== null) {
      searchParams.append("departments", department)
    }
    if (campus !== "") {
      searchParams.append("campuses", campus)
    }
    if (filter !== "") {
      searchParams.append("top", results)
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
        console.log(data)
      })
  }

  const filters = {
    year: ["Any", 1, 2, 3, 4],
    division: ["Any",
              "Faculty of Applied Science and Engineering", 
              "Faculty of Arts and Science", 
              "University of Toronto Mississauga", 
              "University of Toronto Scarborough"],
    department: ["Any",
                "ASDN: Arts and Science, Office of the Dean", 
                "Anatomy and Cell Biology", 
                "Anthropology", 
                "Anthropology (UTSC)", 
                "Art History", 
                "Astronomy and Astrophysics",
                "Biochemistry", 
                "Biological Sciences (UTSC)", 
                "Biology", 
                "Canadian Institute for Theoretical Astrophysics", 
                "Cell and Systems Biology", 
                "Centre for Criminology and Sociolegal Studies",
                "Centre for Critical Development Studies (UTSC)",
                "Centre for Diaspora and Transnational Studies",
                "Centre for Drama, Theatre and Performance Studies",
                "Centre for Ethics",
                "Centre for European, Russian and Eurasian Studies"],
    campus: ["Any",
            "Mississauga",
            "Scarborough",
            "St. George"],
    maxResults: ["Any", 10, 25, 50],
    rating: ["Any", "Over 2", "Over 3", "Over 4", "Over 4.5"],
    sortBy: ["Any", "Field"]
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
                    maxWidth: 650,
                    borderWidth: "medium",
                    border: "solid",
                    borderColor: theme.palette.background.main,
                    borderRadius: 3
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
                    <ArrowRightAltIcon sx={{fontSize: 40}} color="primary" />
                  </IconButton>
                </Paper>
              </Grid>

              <Grid item id="form-filters" style={{display: "flex"}}>
                <div className={classes.filter}>
                  <PopupState variant="popover" popupId="year-filter" >
                    {(popupState) => (
                      <React.Fragment>
                        <Button variant="contained" {...bindTrigger(popupState)} className={classes.btn}>
                          Course Year
                        </Button>
                        <Menu {...bindMenu(popupState)}>
                          {filters.year.map(item => {
                            return <MenuItem onClick={popupState.close}>{item}</MenuItem>
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
                        <Button variant="contained" {...bindTrigger(popupState)} className={classes.btn}>
                          Division
                        </Button>
                        <Menu {...bindMenu(popupState)}>
                          {filters.division.map(item => {
                            return <MenuItem onClick={popupState.close}>{item}</MenuItem>
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
                        <Button variant="contained" {...bindTrigger(popupState)} className={classes.btn}>
                          Department
                        </Button>
                        <Menu {...bindMenu(popupState)}>
                          {filters.department.map(item => {
                            return <MenuItem onClick={popupState.close}>{item}</MenuItem>
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
                        <Button variant="contained" {...bindTrigger(popupState)} className={classes.btn}>
                          Campus
                        </Button>
                        <Menu {...bindMenu(popupState)}>
                          {filters.campus.map(item => {
                            return <MenuItem onClick={popupState.close}>{item}</MenuItem>
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
                        <Button variant="contained" {...bindTrigger(popupState)} className={classes.btn}>
                          Max Results
                        </Button>
                        <Menu {...bindMenu(popupState)}>
                          {filters.maxResults.map(item => {
                            return <MenuItem onClick={popupState.close}>{item}</MenuItem>
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
                        <Button variant="contained" {...bindTrigger(popupState)} style={{backgroundColor: theme.palette.button.brightRed, borderRadius: "0.5rem", textTransform: "none"}}>
                          Rating
                        </Button>
                        <Menu {...bindMenu(popupState)}>
                          {filters.rating.map(item => {
                            return <MenuItem onClick={popupState.close}>{item}</MenuItem>
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
                <Button variant="contained" {...bindTrigger(popupState)} className={classes.btn} style={{backgroundColor: "#D3D3D3"}}>
                  Sorty By 
                  <ArrowDropDownIcon/>
                </Button>
                <Menu {...bindMenu(popupState)}>
                  {filters.sortBy.map(item => {
                    return <MenuItem onClick={popupState.close}>{item}</MenuItem>
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
