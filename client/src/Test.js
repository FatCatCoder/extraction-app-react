
import { useState, useEffect } from "react";
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from 'react-bootstrap/Button'
import FormControl from 'react-bootstrap/FormControl'
import e from "cors";


function Test({currPage, setCurrPage, totalItems = 150, itemsPerPage = 10}){
    //const pageNumbers = [];
    const [newPage, setNewPage] = useState(null);

    let numberOfPages =  Math.ceil(totalItems / itemsPerPage);

    /*
    for(let i=1; i <= numberOfPages; i++){
        pageNumbers.push(i);
    }
    */

    const handleChange = (e) =>{
        setNewPage(parseInt(e.target.value));
    }

    const handleSubmit = e => {
        e.preventDefault();
        
        if(Number.isInteger(newPage) && (newPage > 0 && newPage <= numberOfPages)){
            console.log(true)
            setCurrPage(newPage);
            setNewPage('');
        }
    }

    return(

    <div className="container text-center mx-auto">
        <h1>pages</h1>
        <ButtonGroup className="col-8 col-lg-3" aria-label="Basic example">
            <Button variant="outline-secondary text-primary p-0" onClick={() => {if(currPage !== 1){setCurrPage(--currPage)}}} ><i class="bi bi-chevron-left" /></Button>
                <form className="col-6 row m-0 outline-secondary rounded-0" onSubmit={handleSubmit}>
                    <FormControl className="rounded-0 pe-2 col text-center outline-secondary" type="number" min="1" max={numberOfPages} placeHolder={currPage + " of " + numberOfPages} value={newPage} onChange={handleChange} />
                    <Button variant="outline-secondary rounded-0 col-4 text-primary p-0" type="submit" id="gotoButton"><i class="bi bi-search"></i></Button>
                </form>
            <Button variant="outline-secondary text-primary p-0" onClick={() => {if(currPage !== numberOfPages){setCurrPage(++currPage)}}}><i class="bi bi-chevron-right" /></Button>
        </ButtonGroup>
        <p className="text-muted">@espresso/cat2021</p>

    </div>
    )
};

export default Test