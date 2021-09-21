import {useState} from 'react';
import {globalStore} from '../store.js';

// components
import Shot from './Shot';
import AddToJournalModal from './AddToJournalModal.js';

// controls the shot logging system and contains bootstrap offcanvas component which hides the log queue and handles the new journal submit as BS modal form

function Footer ({ shotList, setShotList}){
    // Auth
    const getUserId = globalStore(state => state.getUserIdFromJWT) 
    const isLoggedIn = globalStore(state => state.isLoggedIn)

     // Footer modal form to log shots as new journal
     const [journalEntry, setJournalEntry] = useState({});
     const [show, setShow] = useState(false);
     

    const handleModalSubmit = (event) => {
        event.preventDefault();
        addEntryToJournal(journalEntry);
    }

    const handleModalInputChange = (e) => {
        setJournalEntry((prevProps) => ({
            ...prevProps,
            [e.target.name]: e.target.value
        }));
    };

    // add new entry to journal
    const addEntryToJournal = async(entry) => {
        const userId = await getUserId();

        const res = await fetch('/api/journals/new', {
            method: 'POST',
            headers: {"Content-Type": "application/json", "Authorization": localStorage.getItem('Authorization')},
            body: JSON.stringify({"journalData": entry, "ShotLog": shotList, "user_id": userId})
        })

        const parseRes = await res.json();

        if(parseRes.success){
            setShow(false)
        }
    }
    // render pulls
    const pulls = shotList.map((pull, index) =>
            <Shot key={index} listNum={index+1} dose={pull.dose} time={pull.time} yield={pull.yield} grind={pull.grind} notes={pull.notes} Sour={pull.Sour} Bitter={pull.Bitter} Weak={pull.Weak} Balanced={pull.Balanced} Strong={pull.Strong} /> 
        );


    return(
        <div id="Footer" className="text-center mx-auto">

            <div className="btn p-2 bi bi-chevron-compact-up" data-bs-toggle="offcanvas" data-bs-target="#shotlist" aria-controls="shotlist button">
                <span className="row display-6 p-2" data-bs-toggle="offcanvas" data-bs-target="#shotlist" aria-controls="shotlist text">Shot List</span>
            </div>
            

            <div className="offcanvas offcanvas-bottom container" tabIndex="-1" id="shotlist" data-bs-backdrop="false" data-bs-scroll="false" aria-label="shotlist container">

                <div className="offcanvas-header pb-0">
                    <h5 className="offcanvas-title mx-auto col-12" id="shotlist">Shot List</h5>
                    <button type="button" className="btn-close text-reset my-auto" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>

                <div className="container mx-auto col-6 col-sm-4 col-md-3 col-lg-3 col-xl-3">
                    <div className="row">
                        <div className="col-6">
                            <AddToJournalModal buttonLabel={isLoggedIn? 'Log': 'login'} show={show} setShow={setShow} isLoggedIn={isLoggedIn} handleModalSubmit={handleModalSubmit} handleModalInputChange={handleModalInputChange} journalEntry={journalEntry} />
                        </div>
                        <div className="col-6">
                            <button onClick={() => setShotList([])} className="btn btn-danger w-100">clear</button>
                        </div>
                    </div>
                </div>

                <div className="offcanvas-body small">
                    {pulls}
                </div>
                
            </div>
        </div>
    )
}

export default Footer;