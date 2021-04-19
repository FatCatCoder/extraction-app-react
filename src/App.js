// import logo from './logo.svg';
import React from 'react';
import { useState } from 'react';
import {BrowserRouter as Router, Route, Switch, useHistory } from 'react-router-dom';
import './App.css';
import './App.scss';
import Header from './Header.js';
import Body from './Body.js';
import Footer from './Footer.js';
import About from './About.js';
import Journal from './Journal.js';
import Recipes from './Recipes.js';
import RecipeTest from './RecipeTest.js';
import ScrollToTop from './ScrollToTop.js';

function App (){
  let thisPage = window.location.pathname;
  const history = useHistory();
  const [currPage, setCurrPage] = useState({[thisPage]: true});

  

  /*set default list of pulled shots */
  const [shotList, setShotList] = useState([{"Dose":"20", "Time":"30", "Yield":"45", "Grind": "10", "Grinder": "Breville Smart Grinder Pro", "Roaster": "Buddy Brew", "Bean": "Ethiopia", "Method": "Espresso", "Machine": "1998 Gaggia Coffee", "Style": "Espresso", "Creamer": "Black", "Notes": "bitter, overextracted."},
  {"Dose":"19", "Time":"30", "Yield":"45", "Grind": "10", "Grinder": "Breville Smart Grinder Pro", "Roaster": "Buddy Brew", "Bean": "Ethiopia", "Method": "Espresso", "Machine": "1998 Gaggia Coffee", "Style": "Espresso", "Creamer": "Black", "Notes": "tastes like sour/sweet fruit, pulled a little watery."}])

  const addShotToList = (addShot) => {
    setShotList([...shotList, addShot]);
  };


  const [newShot, setNewShot] = useState({});

    const handleCheckboxChange = (e) => {
        if(e.target.checked){
            setNewShot((prevProps) => ({
                ...prevProps,
                [e.target.name]: true
            }));
        }
        if(e.target.checked === false){
            setNewShot((prevProps) => (delete prevProps[e.target.name], { 
                ...prevProps
            }));
        }
    };

    const handleInputChange = (e) => {
        setNewShot((prevProps) => ({
            ...prevProps,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        addShotToList(newShot);
        setNewShot({});
        setStep(2); 
    }


    const [step, setStep] = useState(0);

  return (
    <Router>
      <ScrollToTop />
    <div className="App">
      <Header currPage={currPage} setCurrPage={setCurrPage}/>

      <Switch>
        <Route path="/" exact>
          <Body  onNewShot={addShotToList} newShot={newShot} setNewShot={setNewShot} handleCheckboxChange={handleCheckboxChange} handleInputChange={handleInputChange} handleSubmit={handleSubmit} step={step} setStep={setStep} />
          <Footer shotList={shotList} setShotList={setShotList} />
        </Route>

        <Route path="/journal">
          <Journal shotList={shotList}/>
        </Route>

        <Route path="/recipes">
          <Recipes onNewShot={addShotToList} newShot={newShot} setNewShot={setNewShot} handleCheckboxChange={handleCheckboxChange} handleInputChange={handleInputChange} handleSubmit={handleSubmit} />
        </Route>

        <Route path="/about">
          <About />
        </Route>

        <Route path="/test">
          <RecipeTest recipe={shotList[0]}/>
        </Route>
      </Switch>
      
      
    </div>
    </Router>
  );
}


export default App;
