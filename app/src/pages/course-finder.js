import React, { useState } from "react"
import Paper from "@mui/material/Paper"
import InputBase from "@mui/material/InputBase"
import IconButton from "@mui/material/IconButton"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt"
import { useTheme } from "@mui/styles"
import Grid from "@mui/material/Grid"

import { Results } from "../Components/results"
import { NavBar } from "../Components/navbar"

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

export const CourseFinder = () => {
  const theme = useTheme()
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

  return (
    <div>
      <NavBar />
      <div className="pageContainer">
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="flex-start"
          style={{
            backgroundColor: theme.palette.background.lightPink,
            padding: "20px 286px",
          }}
        >
          <Grid item>
            <Paper
              component="form"
              sx={{
                p: "2px 4px",
                display: "flex",
                alignItems: "center",
                width: 650,
                borderWidth: "medium",
                border: "solid",
                borderColor: theme.palette.background.main,
              }}
              className="searchBar"
              onSubmit={onSubmit}
            >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search by course name, department, or campus"
                inputProps={{ "aria-label": "search google maps" }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
                <ArrowRightAltIcon color="primary" />
              </IconButton>
            </Paper>
          </Grid>

          <Grid item id="form-filters">
            <FormControl
              variant="standard"
              sx={{
                m: "1rem 1rem 1rem 0rem",
                width: 120,
                backgroundColor: theme.palette.button.brightRed,
                borderRadius: "0.5rem",
              }}
            >
              <InputLabel sx={{ color: "white" }}>Course Year</InputLabel>
              <Select value={year} onChange={(e) => setYear(e.target.value)}>
                <MenuItem value="">
                  <em>Any</em>
                </MenuItem>
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
              </Select>
            </FormControl>

            <FormControl
              variant="standard"
              sx={{
                m: "1rem 1rem 1rem 0rem",
                minWidth: 120,
                backgroundColor: theme.palette.button.brightRed,
                borderRadius: "0.5rem",
              }}
            >
              <InputLabel sx={{ color: "white" }}>Division</InputLabel>
              <Select>
                <MenuItem value="">
                  <em>Any</em>
                </MenuItem>
                <MenuItem value={10}>
                  Faculty of Applied Science and Engineering
                </MenuItem>
                <MenuItem value={20}>Faculty of Arts and Science</MenuItem>
                <MenuItem value={30}>
                  University of Toronto Mississauga
                </MenuItem>
                <MenuItem value={40}>
                  University of Toronto Scarborough
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl
              variant="standard"
              sx={{
                m: "1rem 1rem 1rem 0rem",
                minWidth: 120,
                backgroundColor: theme.palette.button.brightRed,
                borderRadius: "0.5rem",
              }}
            >
              <InputLabel sx={{ color: "white" }}>Department</InputLabel>
              <Select>
                <MenuItem value="">
                  <em>Any</em>
                </MenuItem>
                <MenuItem value={10}>
                  ASDN: Arts and Science, Office of the Dean
                </MenuItem>
                <MenuItem value={20}>Anatomy and Cell Biology</MenuItem>
                <MenuItem value={30}>Anthropology</MenuItem>
                <MenuItem value={40}>Anthropology (UTSC)</MenuItem>
                <MenuItem value={30}>Art History</MenuItem>
                <MenuItem value={30}>Astronomy and Astrophysics</MenuItem>
                <MenuItem value={30}>Biochemistry</MenuItem>
                <MenuItem value={30}>Biological Sciences (UTSC)</MenuItem>
                <MenuItem value={30}>Biology</MenuItem>
                <MenuItem value={30}>
                  Canadian Institute for Theoretical Astrophysics
                </MenuItem>
                <MenuItem value={30}>Cell and Systems Biology</MenuItem>
                <MenuItem value={30}>
                  Centre for Criminology and Sociolegal Studies
                </MenuItem>
                <MenuItem value={30}>
                  Centre for Critical Development Studies (UTSC)
                </MenuItem>
                <MenuItem value={30}>
                  Centre for Diaspora and Transnational Studies
                </MenuItem>
                <MenuItem value={30}>
                  Centre for Drama, Theatre and Performance Studies
                </MenuItem>
                <MenuItem value={30}>Centre for Ethics</MenuItem>
                <MenuItem value={30}>
                  Centre for European, Russian and Eurasian Studies
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl
              variant="standard"
              sx={{
                m: "1rem 1rem 1rem 0rem",
                minWidth: 120,
                backgroundColor: theme.palette.button.brightRed,
                borderRadius: "0.5rem",
              }}
            >
              <InputLabel sx={{ color: "white" }}>Campus</InputLabel>
              <Select>
                <MenuItem value="">
                  <em>Any</em>
                </MenuItem>
                <MenuItem value={10}>Mississauga</MenuItem>
                <MenuItem value={20}>Scarborough</MenuItem>
                <MenuItem value={30}>St. George</MenuItem>
              </Select>
            </FormControl>

            <FormControl
              variant="standard"
              sx={{
                m: "1rem 1rem 1rem 0rem",
                minWidth: 120,
                backgroundColor: theme.palette.button.brightRed,
                borderRadius: "0.5rem",
              }}
            >
              <InputLabel sx={{ color: "white" }}>Max Results</InputLabel>
              <Select>
                <MenuItem value="">
                  <em>Any</em>
                </MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>25</MenuItem>
                <MenuItem value={30}>50</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <div style={{ margin: "20px 286px" }}>
          <FormControl
            variant="standard"
            sx={{
              m: 1,
              minWidth: 120,
              backgroundColor: "#D3D3D3",
              borderRadius: "0.5rem",
            }}
          >
            <InputLabel>Filter</InputLabel>
            <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="Field">Field</MenuItem>
              <MenuItem value="something">Something</MenuItem>
            </Select>
          </FormControl>
          <Results data={results} />
        </div>
      </div>
    </div>
  )
}
