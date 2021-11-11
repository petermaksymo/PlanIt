import React, { useEffect, useState } from "react"
import Paper from "@mui/material/Paper"
import InputBase from "@mui/material/InputBase"
import IconButton from "@mui/material/IconButton"
import SearchIcon from "@mui/icons-material/Search"
import Divider from "@mui/material/Divider"
import HelpIcon from "@mui/icons-material/Help"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"

import { Results } from "../Components/results"
import { NavBar } from "../Components/navbar"

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

export const CourseFinder = () => {
  const [search, setSearch] = useState("")
  const [year, setYear] = useState("")
  const [department, setDepartment] = useState("") // eslint-disable-line no-unused-vars
  const [division, setDivision] = useState("") // eslint-disable-line no-unused-vars
  const [campus, setCampus] = useState("") // eslint-disable-line no-unused-vars
  const [results, setResults] = useState(null)

  // Basic code showing how to communicate between our backend and frontend
  useEffect(() => {
    fetch(`${API_BASE_URL}/`)
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
      })
      .then((data) => console.log(data))
  }, [])

  const onSubmit = (e) => {
    e.preventDefault()

    const formdata = new FormData()
    formdata.append("search", search)
    formdata.append("select", year)
    formdata.append("departments", "Any")
    formdata.append("divisions", "Any")
    formdata.append("campuses", "Any")
    formdata.append("top", "10")

    fetch(`${API_BASE_URL}/results`, {
      method: "POST",
      mode: "cors",
      body: formdata,
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

  return (
    <>
      <NavBar />
      <div className="pageContainer">
        <Paper
          component="form"
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: 400,
          }}
          className="searchBar"
          onSubmit={onSubmit}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Enter a course name"
            inputProps={{ "aria-label": "search google maps" }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
            <SearchIcon />
          </IconButton>
          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
          <IconButton
            color="primary"
            sx={{ p: "10px" }}
            aria-label="directions"
          >
            <HelpIcon />
          </IconButton>
        </Paper>

        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel>Course Year</InputLabel>
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

        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel>Division</InputLabel>
          <Select>
            <MenuItem value="">
              <em>Any</em>
            </MenuItem>
            <MenuItem value={10}>
              Faculty of Applied Science and Engineering
            </MenuItem>
            <MenuItem value={20}>Faculty of Arts and Science</MenuItem>
            <MenuItem value={30}>University of Toronto Mississauga</MenuItem>
            <MenuItem value={40}>University of Toronto Scarborough</MenuItem>
          </Select>
        </FormControl>

        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel>Department</InputLabel>
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

        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel>Campus</InputLabel>
          <Select>
            <MenuItem value="">
              <em>Any</em>
            </MenuItem>
            <MenuItem value={10}>Mississauga</MenuItem>
            <MenuItem value={20}>Scarborough</MenuItem>
            <MenuItem value={30}>St. George</MenuItem>
          </Select>
        </FormControl>

        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel>Max Results</InputLabel>
          <Select>
            <MenuItem value="">
              <em>Any</em>
            </MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>25</MenuItem>
            <MenuItem value={30}>50</MenuItem>
          </Select>
        </FormControl>

        <Results data={results} />
      </div>
    </>
  )
}
