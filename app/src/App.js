import React from "react"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom"
import { ThemeProvider, StyledEngineProvider } from "@mui/material/styles"

import "./App.css"
import theme from "./Theme"
import { CourseFinder } from "./pages/course-finder"
import { Signup } from "./pages/signup"
import { Login } from "./pages/login"
import { Profiles } from "./pages/profiles"
import { CourseContent } from "./pages/courseContent"
import { Account } from "./pages/account"
import { Help } from "./pages/help"
import AuthContext from "./contexts/auth"
import PrivateRoute from "./Components/privateRoute"

function App() {
  return (
    <div className="App">
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <AuthContext>
            <Router>
              <Switch>
                <Route path="/signup">
                  <Signup />
                </Route>
                <Route path="/login">
                  <Login />
                </Route>
                <Route path="/courseContent">
                  <CourseContent />
                </Route>
                <Route path="/help">
                  <Help />
                </Route>
                <PrivateRoute path="/profiles" component={Profiles} />
                <PrivateRoute path="/account" component={Account} />

                {/*Keep this Route as the last one so it will also be the default for all other routes*/}
                <Route path="/">
                  <CourseFinder />
                </Route>
                <Redirect to="/" />
              </Switch>
            </Router>
          </AuthContext>
        </ThemeProvider>
      </StyledEngineProvider>
    </div>
  )
}

export default App
