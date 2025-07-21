import { useState } from "react";
import "./userButton.css";

const UserButton = () => {
    //TEMP
    const [open, setOpen] = useState(false);
    const currentUser = true;
  return  currentUser ? (
    <div className="userButton">
        <img src="/general/noAvatar.png" alt=""/>
        <img
        onClick={() => setOpen((prev) => !prev)}
        src="/general/arrow.svg" 
        alt=""
        />
        {open && (
        <div className='userOptions'>
            <div className="userOption">Profile</div>
            <div className="userOption">Setting</div>
            <div className="userOption">Logout</div>
        </div>
        )}
        
    </div>
  ) : (
    <a href="/" className="loginLink">
        Login / Sign Up
    </a>
  );
};

export default UserButton;