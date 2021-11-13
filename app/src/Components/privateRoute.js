import React, { useContext } from "react"
import { Route, Redirect } from "react-router-dom"
import CircularProgress from "@mui/material/CircularProgress"

import { AuthContext } from "../contexts/auth"

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { isAuthed, isAuthLoading } = useContext(AuthContext)

  return isAuthLoading ? (
    <CircularProgress size={50} />
  ) : (
    <Route
      {...rest}
      render={(props) =>
        isAuthed ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  )
}

export default PrivateRoute
