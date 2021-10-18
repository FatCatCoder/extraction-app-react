import {useState, useEffect} from 'react';
import * as yup from 'yup';
import {useShotFormStore, globalStore} from '../store.js';

// components 
import ShotForm from '../components/ShotForm/ShotForm.js';
import Footer from '../components/Footer.js';



function Pull () {
  // nav
  const setCurrentPage = globalStore(state => state.setCurrentPage);
  useEffect(() => {
      setCurrentPage(window.location.pathname)
      // eslint-disable-next-line
  }, [])

  // set default list of pulled shots
  const [shotList, setShotList] = useState([])

  const addShotToList = (addShot) => {
      setShotList([...shotList, addShot]);
  };

  // form data
  const [newShot, setNewShot] = useState({"dose":"", "time":"", "yield":"", "grind": "", "roaster": "", "bean": "", "notes": ""});
  const setFormErrors = useShotFormStore(state => state.setFormError);

  // form utils
  const handleCheckboxChange = (e) => {
      if(e.target.checked){
          setNewShot((prevProps) => ({
            ...prevProps,
              "attribute": e.target.value
          }));
      }
  };
  const handleInputChange = (e) => {
      setNewShot((prevProps) => ({
          ...prevProps,
          [e.target.name]: e.target.value
      }));
  };

  const schema = yup.object().shape({
      dose: yup.string().required().matches(/^([1-9]\d*(\.)\d*|0?(\.)\d*[1-9]\d*|[1-9]\d*)$/, "Dose is not a reasonable number"),
      yield: yup.string().required().matches(/^([1-9]\d*(\.)\d*|0?(\.)\d*[1-9]\d*|[1-9]\d*)$/, "Yield is not a reasonable number"),
      time: yup.string().required().matches(/^([1-9]\d*(\.)\d*|0?(\.)\d*[1-9]\d*|[1-9]\d*)$/, "Time is not a reasonable number"),
      grind: yup.string().required().matches(/^([1-9]\d*(\.)\d*|0?(\.)\d*[1-9]\d*|[1-9]\d*)$/, "Grind is not a reasonable number"),
    })
  
  
  // wizard form progress 
  const [step, setStep] = useState(0);

  const pullValidation = () => {
    schema.validate({
      dose: newShot.dose,
      yield: newShot.yield,
      time: newShot.time,
      grind: newShot.grind,
    }, { abortEarly: false }).then(function () {
      setFormErrors([]);
      setStep(1);
    }).catch(function (err) {
      setFormErrors(err.errors);
    })
  }

  const handleSubmit = (event) => {
      event.preventDefault();
      schema.validate({
        dose: newShot.dose,
        yield: newShot.yield,
        time: newShot.time,
        grind: newShot.grind,
      }, { abortEarly: false }).then(function () {
        addShotToList(newShot);
        setNewShot({});
        
      }).then(function () {setStep(2);}).catch(function (err) {
        setFormErrors(err.errors);
      })      
  }

    

  return (
      <div className="mx-auto text-center">
          <form onSubmit={handleSubmit} className="mx-auto text-center">
              <ShotForm pullValidation={pullValidation} shotList={shotList} newShot={newShot} handleSubmit={handleSubmit} handleInputChange={handleInputChange} handleCheckboxChange={handleCheckboxChange} setStep={setStep} step={step}/>
          </form>
          
          <Footer addShotToList={addShotToList} shotList={shotList} setShotList={setShotList} />
      </div>
  )
}

export default Pull;