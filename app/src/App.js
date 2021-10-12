import logo from './logo.svg';
import './App.css';
import { NavBar } from './Components/navbar';
import React from 'react';

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
    </div>
  );
}

export default App;
 