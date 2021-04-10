import ShotFormPageOne from './ShotFormPageOne.js';
import ShotFormPageTwo from './ShotFormPageTwo.js';
import ShotFormPageThree from './ShotFormPageThree.js';
import ShotFormPageFinal from './ShotFormPageFinal.js';
import React, { useState } from 'react';

function ShotForm({newShot, handleInputChange, handleSubmit, setStep, step, handleCheckboxChange}){

    

    function renderPage(){
        switch(step){
            case 0:
                return <ShotFormPageOne newShot={newShot} handleSubmit={handleSubmit} handleInputChange={handleInputChange} setStep={setStep} step={step}/>;
            case 1:
                return <ShotFormPageTwo newShot={newShot} handleSubmit={handleSubmit} handleInputChange={handleInputChange} setStep={setStep} step={step}/>;
            case 2:
                return <ShotFormPageThree newShot={newShot} handleSubmit={handleSubmit} handleInputChange={handleInputChange} handleCheckboxChange={handleCheckboxChange} setStep={setStep} step={step}/>;
            case 3:
                return <ShotFormPageFinal newShot={newShot} handleSubmit={handleSubmit} handleInputChange={handleInputChange} setStep={setStep} step={step}/>;
            default:
                console.log('error on loading wizrd form page, step not submitted');
    };
};
    
    return (
        <div>
            {renderPage()}
        </div>
    )
}

export default ShotForm;