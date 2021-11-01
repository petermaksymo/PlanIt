import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles';

import './App.css';
import theme from './Theme';
import { CourseFinder } from "./pages/course-finder";
import { Signup } from './pages/signup'


function App() {

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Router>
          <Switch>
            <Route path='/signup'>
              <Signup/>
            </Route>

            {/*Keep this Route as the last one so it will also be the default for all other routes*/}
            <Route path='/'>
              <CourseFinder/>
            </Route>
          </Switch>
        </Router>
      </ThemeProvider>
    </div>
  );
}

export default App;
 