
import { useReducer, useRef, useEffect, useState } from "react";
import { Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';

import Stopwatch from './components/Stopwatch';

function Test() {
    //const [myTool, setMyTool] = useState();
    const [popoverOpen1, setPopoverOpen1] = useState(false);

    const toggle1 = () => setPopoverOpen1(!popoverOpen1);
    
  
  return (
    <div className="text-center">
        <Button className="btn bg-light btn-outline-dark" id="Popover1" type="button"><i class="bi bi-watch"></i></Button>


      <Popover placement="top" isOpen={popoverOpen1} target="Popover1" toggle={toggle1}>
        <PopoverHeader>Timer</PopoverHeader>
        <PopoverBody><Stopwatch /></PopoverBody>
      </Popover>

    </div>
  )
};

export default Test