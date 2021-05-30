import { useState, useEffect } from 'react';
import {useHistory} from 'react-router-dom'; 
import RecipeBtnGrp from './RecipeBtnGrp.js';
import RecipeCard from './RecipeCard.js';
import RecipePage from './RecipePage.js';
import NewRecipe from './NewRecipe.js';
import RecipePagination from './RecipePagination.js';
import * as yup from 'yup';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams
  } from "react-router-dom";



function Recipes({newShot, setNewShot, handleCheckboxChange, handleInputChange, onNewShot}){
    const history = useHistory();
    const prox = 'http://10.0.0.41:5000/'

    // for pagination
    const [myRecipes, setMyRecipes] = useState([]);
    const [currPage, setCurrPage] = useState(1);
    const [recipesPerPage, setRecipesPerPage] = useState(8);

    const schemaDose = yup.object().shape({
        Dose: yup.string().required().matches(/^([1-9]\d*(\.|\,)\d*|0?(\.|\,)\d*[1-9]\d*|[1-9]\d*)$/, "Dose is not a reasonable number"),
        Yield: yup.string().required().matches(/^([1-9]\d*(\.|\,)\d*|0?(\.|\,)\d*[1-9]\d*|[1-9]\d*)$/, "Yield is not a reasonable number"),
        Time: yup.string().required().matches(/^([1-9]\d*(\.|\,)\d*|0?(\.|\,)\d*[1-9]\d*|[1-9]\d*)$/, "Time is not a reasonable number"),
        Grind: yup.string().required().matches(/^([1-9]\d*(\.|\,)\d*|0?(\.|\,)\d*[1-9]\d*|[1-9]\d*)$/, "Grind is not a reasonable number"),
      })

    const schemaBean = yup.object().shape({
        Bean: yup.string().required(),
        Roaster: yup.string().required(),
        Region: yup.string().required(),
        Date: yup.date()
    })

    
    const handleSubmit = (event) => {
        event.preventDefault(); 
        addRecipe(newShot)
        history.push('/recipes');
    }
    
    const addRecipe = async (recipe) => {
        const res = await fetch('/recipes', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(recipe)
        })

        const data = await res.json()

        console.log(res, data);
        setMyRecipes([...myRecipes, data])
    }

    

    useEffect(() => {
        const getRecipes = async () => {
            const recipesFromServer = await fetchRecipes()
            setMyRecipes(recipesFromServer.map(x => x))         
        }
        getRecipes()   
    }, [])


    const fetchRecipes = async () => {
        const res = await fetch('/recipes')
        const data = await res.json()
        console.log('fetchRecipes data', data)
        return data
    }

    let match = useRouteMatch();

    const indexOfLastPost = currPage * recipesPerPage;
    const indexOfFirstPost = indexOfLastPost - recipesPerPage;
    const currRecipes = myRecipes.slice(indexOfFirstPost, indexOfLastPost);

    const paginate = (pageNumber) => setCurrPage(pageNumber);


    return(

        <div className="text-center pb-5">
            <Switch>
                <Route exact path={match.path}>
                    <h1 className="display-2">Recipes</h1>
                    <p>Here for all your espresso brewing needs.</p>
                    <RecipeBtnGrp  goTo={() => history.push(`${match.path}/new`)}/>
                    <div className="container row row-cols-1 row-cols-md-2 row-cols-xl-4 g-4 mx-auto">
                        {currRecipes.map(x => <RecipeCard key={x.id} recipe={x}/>)}
                    </div>
                    <RecipePagination recipesPerPage={recipesPerPage} totalRecipes={myRecipes.length} paginate={paginate} />
                </Route>

                <Route exact path={`${match.path}/new`}>
                    <form onSubmit={handleSubmit} className="mx-auto text-center">
                        <NewRecipe add={addRecipe} onNewShot={onNewShot} newShot={newShot} setNewShot={setNewShot} handleCheckboxChange={handleCheckboxChange} handleInputChange={handleInputChange} handleSubmit={handleSubmit} />
                    </form>
                </Route>

                <Route path={`${match.path}/:id`}>
                    <RecipePage recipe={myRecipes}/>
                </Route>
            </Switch>
        </div>
    )
}

export default Recipes;