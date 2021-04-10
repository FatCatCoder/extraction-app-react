

function ShotFormPageOne({newShot, handleInputChange, handleSubmit, setStep}){
      

    return(
        <>
                    <label for="Dose">Dose</label><br />
                    <input class="shadow border" value={newShot.Dose} onChange={handleInputChange} type="text" id="Dose" name="Dose" placeholder="Dose..." /><br />
                    
                    <label for="Yield">Yield</label><br />
                    <input class="shadow border" value={newShot.Yield} onChange={handleInputChange} type="text" id="Yield" name="Yield" placeholder="Yield..." /><br /> 

                    <label for="Time">Time</label><br />
                    <input class="shadow border" value={newShot.Time} onChange={handleInputChange} type="text" id="Time" name="Time" placeholder="Time..." /><br /> 

                    <button className="btn btn-primary m-2" type="button" onClick={() => setStep(1)}>next</button>

                    
                </>
    )
}

export default ShotFormPageOne;