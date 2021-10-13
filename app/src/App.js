import logo from './logo.svg';
import './App.css';
import { NavBar } from './Components/navbar';
import React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions';
import HelpIcon from '@mui/icons-material/Help';
import { styled } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import NativeSelect from '@mui/material/NativeSelect';

function App() {

  //   Basic code showing how to communicate between our backend and frontend
  //   useEffect( () => {
  //     fetch('/').then(response => {
  //         if(response.ok) {
  //             return response.json()
  //         }
  //     }).then(data => console.log(data))
  // })


  return (
    <div className="App">
      <NavBar></NavBar>
      <div className='pageContainer'>
        <Paper
          component="form"
          sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
          className='searchBar'
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Enter a course name"
            inputProps={{ 'aria-label': 'search google maps' }}
          />
          <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
            <SearchIcon />
          </IconButton>
          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
          <IconButton color="primary" sx={{ p: '10px' }} aria-label="directions">
            <HelpIcon />
          </IconButton>
        </Paper>

        <FormControl sx={{ m: 1 }} variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel>Course Year</InputLabel>
          <Select>
            <MenuItem value="">
              <em>Any</em>
            </MenuItem>
            <MenuItem value={10}>1</MenuItem>
            <MenuItem value={20}>2</MenuItem>
            <MenuItem value={30}>3</MenuItem>
            <MenuItem value={40}>4</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ m: 1 }} variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel>Division</InputLabel>
          <Select>
            <MenuItem value="">
              <em>Any</em>
            </MenuItem>
            <MenuItem value={10}>Faculty of Applied Science and Engineering</MenuItem>
            <MenuItem value={20}>Faculty of Arts and Science</MenuItem>
            <MenuItem value={30}>University of Toronto Mississauga</MenuItem>
            <MenuItem value={40}>University of Toronto Scarborough</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ m: 1 }} variant="standard" sx={{ m: 1, minWidth: 120}}>
          <InputLabel>Department</InputLabel>
          <Select>
            <MenuItem value="">
              <em>Any</em>
            </MenuItem>
            <MenuItem value={10}>ASDN: Arts and Science, Office of the Dean</MenuItem>
            <MenuItem value={20}>Anatomy and Cell Biology</MenuItem>
            <MenuItem value={30}>Anthropology</MenuItem>
            <MenuItem value={40}>Anthropology (UTSC)</MenuItem>
            <MenuItem value={30}>Art History</MenuItem>
            <MenuItem value={30}>Astronomy and Astrophysics</MenuItem>
            <MenuItem value={30}>Biochemistry</MenuItem>
            <MenuItem value={30}>Biological Sciences (UTSC)</MenuItem>
            <MenuItem value={30}>Biology</MenuItem>
            <MenuItem value={30}>Canadian Institute for Theoretical Astrophysics</MenuItem>
            <MenuItem value={30}>Cell and Systems Biology</MenuItem>
            <MenuItem value={30}>Centre for Criminology and Sociolegal Studies</MenuItem>
            <MenuItem value={30}>Centre for Critical Development Studies (UTSC)</MenuItem>
            <MenuItem value={30}>Centre for Diaspora and Transnational Studies</MenuItem>
            <MenuItem value={30}>Centre for Drama, Theatre and Performance Studies</MenuItem>
            <MenuItem value={30}>Centre for Ethics</MenuItem>
            <MenuItem value={30}>Centre for European, Russian and Eurasian Studies</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ m: 1 }} variant="standard" sx={{ m: 1, minWidth: 120 }}>
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

        <FormControl sx={{ m: 1 }} variant="standard" sx={{ m: 1, minWidth: 120 }}>
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
      </div>
    </div>
  );
}

export default App;
 