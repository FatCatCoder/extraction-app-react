// modules
import { useState, useEffect  } from 'react';
import {useHistory} from 'react-router-dom'; 
import {globalStore, useRecipesStore} from '../store.js';
import {
    Switch,
    Route,
    useRouteMatch,
    Redirect
  } from "react-router-dom";

// components
import RecipeBtnGrp from '../components/RecipeBtnGrp.js';
import RecipeCard from '../components/RecipeCard.js';
import RecipePage from '../components/RecipePage.js';
import RecipeForm from '../components/RecipeForm/RecipeForm.js';
import Pagination from '../components/Pagination.js';
import ErrorScreen from '../components/ErrorScreen.js';



function Recipes({isAuth}){
    console.log('Render');
    // nav and header
    let match = useRouteMatch();
    const history = useHistory();
    const setCurrentPage = globalStore(state => state.setCurrentPage);
    
    useEffect(() => {
        setCurrentPage(window.location.pathname)
    }, [])

    // global state for recipes data
    const { 
        myRecipes, setMyRecipes, 
        recipeSlice, setRecipeSlice,
        currPage, setCurrPage, 
        recipesPerPage, setRecipesPerPage,
        totalRecipes, setTotalRecipes,
        refresh, setRefresh,
        isLoading, setIsLoading,
        sortFilters, setSortFilters,
        } = useRecipesStore();

    const getUserId = globalStore(state => state.getUserIdFromJWT)
    const isLoggedIn = globalStore(state => state.isLoggedIn)
    
    
    // get recipes on load and refresh, and check for existing pages in memory to avoid api call
    useEffect(() => {
        console.log('useEffect');
        const abortController = new AbortController();
        let ignore = false;

        const alreadyFetched = () => {
            return myRecipes.includes(myRecipes.find(x => x["page"] === currPage))
        };
        
        // POST, setMyRecipes from server based on currPage and amount, checks for null filter requirements
        const fetchRecipes = async (thisPage = currPage, numOf = recipesPerPage , controller) => {
            try{ 
                // if(Object.keys(sortFilters) !== 0 && (sortFilters?.sortBy === null || sortFilters?.sortBy == undefined)){
                //     setSortFilters({...sortFilters, "sortBy": "postdate DESC"})
                // }
                console.log(sortFilters);
        
                const res = await fetch('/recipes', {
                    method: 'POST',
                    signal: controller?.signal,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({"offsetPage": thisPage - 1, "limitAmount": numOf, "sortFilters": sortFilters})
                })
                const data = await res.json();
                
                // already returned as 'popular' column from table join
                if(sortFilters?.sortBy === 'popular DESC'){
                    return await data;
                }
                // grab likes, merge json
                const recipesWithLikes = await getAllLikes(data, controller)
                return await recipesWithLikes;
            }
            catch(err){
                return err.name
            }
        }
    
        const getAllLikes = async (recipes, controller) => {
            try{
                const ids = recipes.map(x => x.id);
                const res = await fetch('/recipes/all-likes', {
                    method: 'POST',
                    signal: controller?.signal,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(ids)
                })
        
                const data = await res.json();
                const addLikes = await recipes.map(x => Object.assign(x, data.find(y => y.id === x.id)));
                return await addLikes;
            }
            catch(err){
                return err.name
            }
        }
    
    
        const getRecipes = async (newOrNext, controller) => {
            if(newOrNext==='new'){
                const recipesFromServer = await fetchRecipes(1, recipesPerPage);

                if(recipesFromServer === 'AbortError'){
                    return 'AbortError'
                }

                setMyRecipes([{"page": 1, "recipes" : recipesFromServer}]) // set Recipes array
                setRecipeSlice(recipesFromServer)    
                setTotalRecipes(recipesFromServer[0].count) // set total number of recipes for pagination, count is my defined sql count over() function on the api being returned along side the recipes data
                setCurrPage(1) // push page state back to the first page
            }
            else if(newOrNext==='next'){
                const recipesFromServer = await fetchRecipes(currPage, recipesPerPage, controller);

                if(recipesFromServer === 'AbortError'){
                    return 'AbortError'
                }
                
                setMyRecipes([...myRecipes, {"page": currPage, "recipes" : recipesFromServer}]) // set Recipes array
                setRecipeSlice(recipesFromServer)    
                setTotalRecipes(recipesFromServer[0].count) // set total number of recipes for pagination, count is my defined sql count over() function on the api being returned along side the recipes data
            }
        }
        

        // init & refresh
        if(!ignore && (myRecipes.length === 0 || refresh)){
            const returnedData = getRecipes('new', abortController);

            if(returnedData === 'AbortError'){
                console.log('abort error on returned data after new');
            }
            else{
                setRefresh(false);
                setCurrPage(1);
            }
        }
        // fetch next page
        else if(!ignore && !alreadyFetched()){
            const returnedData = getRecipes('next', abortController);

            if(returnedData === 'AbortError'){
                console.log('abort error on get recipes after next');
            }
            else{
                setRefresh(false);
            }
        }
        // already in memory
        else if(!ignore && alreadyFetched()){
            setRecipeSlice(myRecipes.find(x => x["page"] === currPage)["recipes"])
            setIsLoading(false)
        }

        return () => {
            ignore = true;
            abortController.abort();
        };
        // eslint-disable-next-line 
    }, [currPage, refresh])

    // set recipes on page
    useEffect(() => {
        let ignore = false;

        if(!ignore && !refresh){ myRecipes.length !== 0? setRecipeSlice(myRecipes.find(x => x["page"] === currPage)["recipes"]) : setRecipeSlice([]); }

        setIsLoading(false)

        return () => { ignore = true; }; 
        // eslint-disable-next-line
    }, [myRecipes]) 


    // On pagination setCurrPage change, checks if page exists in memory, if not then fetch it and update state.
    const changePage = async(number) => {
        console.log(number);
        (function () {
            setIsLoading(true);
            setCurrPage(number); 
        } ());
    }
    
     // Recipe data mapped to recipe card components
     const displayRecipes = () => {
         console.log('display recipes', isLoading);
        if(recipeSlice[0]?.count === 0){
            return <ErrorScreen errorMessage={'All out of coffee, try a different search?'} />
        }
        else if(isLoading){
            const fakeArr = new Array(recipesPerPage).fill({});
            return fakeArr.map((x, y) => <RecipeCard key={y} recipe={x} animation={'skeleton'} />) 
        }
        else if(recipeSlice === null || recipeSlice === undefined){
            const fakeArr = new Array(recipesPerPage).fill({});
            return fakeArr.map((x, y) => <RecipeCard key={y} recipe={x} animation={'skeleton'} />) 
        }
        console.log('displayrecipes recipeSlice',recipeSlice, 'displayrecipes myrecipes',myRecipes, sortFilters);
        return recipeSlice.map((x) => <RecipeCard key={x.id} recipe={x} animation={'fadeIn'} />)
    }

    const loadingRecipes =() => {
        const fakeArr = new Array(recipesPerPage).fill({});
        return fakeArr.map((x, y) => <RecipeCard key={y} recipe={x} animation={'skeleton'} />) 
    }

    return(

        <div className="text-center pb-5">
            <Switch>
                <Route exact path={match.path}>
                    <h1 className="display-2">Recipes</h1>
                    <p>Here for all your espresso brewing needs.</p>
                    <RecipeBtnGrp  goTo={() => history.push(`${match.path}/new`)} refresh={refresh} setRefresh={setRefresh} sortFilters={sortFilters} setSortFilters={setSortFilters} getUserId={getUserId} isLoggedIn={isLoggedIn} />

                    <div className="container h-100 row row-cols-1 row-cols-md-2 row-cols-xl-4 g-4 mx-auto">
                        {isLoading? loadingRecipes(): displayRecipes()}
                    </div>

                    <Pagination className={"container text-center mx-auto p-3"} itemsPerPage={recipesPerPage} totalItems={totalRecipes} currPage={currPage} setCurrPage={changePage} />
                </Route>

                <Route exact path={`/recipes/new`} 
                    render={props => isAuth ? 
                        (
                    
                        <RecipeForm getUserId={getUserId} refresh={refresh} setRefresh={setRefresh} />
                    )
                     : (<Redirect to={{pathname: "/login", state: {location: "/recipes", going: '/recipes/new'}}} />)} 
                />

                <Route path={`${match.path}/:id`}>
                    <RecipePage recipe={recipeSlice} />
                </Route>
            </Switch>
        </div>
    )
}

export default Recipes;