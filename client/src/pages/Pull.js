import {useState} from 'react';
import * as yup from 'yup';
import {useShotFormStore, globalStore} from '../store.js';

// components 
import ShotForm from '../components/ShotForm/ShotForm.js';
import Footer from '../components/Footer.js';
import '../assets/App.scss';


function Pull () {
  // nav
  const setCurrentPage = globalStore(state => state.setCurrentPage);
  setCurrentPage(window.location.pathname)

    // set default list of pulled shots
    const [shotList, setShotList] = useState([{"dose":"20", "time":"30", "yield":"45", "grind": "10", "roaster": "Buddy Brew", "bean": "Ethiopia", "Bitter": true, "Strong": true, "notes": "too strong and overextracted, no tasting notes present."},
    {"dose":"19", "time":"30", "yield":"45", "grind": "10", "roaster": "Buddy Brew", "bean": "Ethiopia", "Sour": true, "Balanced": true, "Weak": true, "notes": "tastes like sour/sweet fruit, pulled a little watery."}])

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
                [e.target.name]: true
            }));
        }
        if(e.target.checked === false){
            setNewShot((prevProps) => (((delete prevProps[e.target.name]), { 
                ...prevProps
            })));
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
        console.log(newShot.dose)
        schema.validate({
          dose: newShot.dose,
          yield: newShot.yield,
          time: newShot.time,
          grind: newShot.grind,
        }, { abortEarly: false }).then(function () {
          console.log('Submitted!')
          addShotToList(newShot);
          setNewShot({});
          setStep(2);
        }).catch(function (err) {
          setFormErrors(err.errors);
          console.log(Object.keys(err), err.name, err.value, err.path, err.type, err.errors, err.inner)
        })      
    }

      

    return (
        <div className="mx-auto text-center">
            <form onSubmit={handleSubmit} className="mx-auto text-center">
                <ShotForm pullValidation={pullValidation} newShot={newShot} handleSubmit={handleSubmit} handleInputChange={handleInputChange} handleCheckboxChange={handleCheckboxChange} setStep={setStep} step={step}/>
            </form>
            
            <Footer addShotToList={addShotToList} shotList={shotList} setShotList={setShotList} />
        </div>
    )
}

export default Pull;