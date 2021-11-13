import React, { createContext, useEffect, useState } from "react"
import jwt from "jsonwebtoken"

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

export const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  const [isAuthed, setIsAuthed] = useState(false)
  const [isAuthLoading, setIsAuthLoading] = useState(true)

  const login = (username, password) => {
    const formdata = new FormData()
    formdata.append("username", username)
    formdata.append("password", password)

    return fetch(`${API_BASE_URL}/login`, { method: "POST", body: formdata })
      .then((response) => response.json())
      .then((token) => {
        if (token.access_token)
          localStorage.setItem("PLANIT_JWT", token.access_token)
        setIsAuthed(true)
        setIsAuthLoading(false)
      })
  }

  const checkTokenExpired = () => {
    const token = localStorage.getItem("PLANIT_JWT")

    const decodedToken = jwt.decode(token, { complete: true })
    return decodedToken.payload.exp < new Date().getTime() / 1000
  }

  const authedFetch = (url, options = {}) => {
    const makeCall = () => {
      const token = localStorage.getItem("PLANIT_JWT")

      return fetch(url, {
        ...options,
        headers: new Headers({
          ...options.headers,
          Authorization: `Bearer ${token}`,
        }),
      })
    }

    if (checkTokenExpired()) {
      return reAuthenticate().then(makeCall)
    }

    return makeCall()
  }

  const reAuthenticate = () => {
    const token = localStorage.getItem("PLANIT_JWT")
    if (!token) {
      setIsAuthLoading(false)
      return
    }

    // Check if jwt is still valid first...
    if (!checkTokenExpired()) {
      setIsAuthed(true)
      setIsAuthLoading(false)
      return
    }

    return authedFetch(`${API_BASE_URL}/refresh`, { method: "POST" })
      .then((res) => res.json())
      .then((token) => {
        if (token.access_token)
          localStorage.setItem("PLANIT_JWT", token.access_token)
        setIsAuthed(true)
        setIsAuthLoading(false)
      })
  }

  const logout = () => {
    localStorage.removeItem("PLANIT_JWT")

    setIsAuthed(false)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => reAuthenticate(), [])

  const defaultContext = {
    login,
    logout,
    authedFetch,
    isAuthed,
    isAuthLoading,
  }

  return (
    <AuthContext.Provider value={defaultContext}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
