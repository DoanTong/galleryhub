// import Image from "../image/image";
// import {Link} from "react-router";
import Image from "../image/image";
import "./leftBar.css";

const LeftBar = () => {
  return (
    <div className="leftBar">
      <div className="menuIcons">
        <a href="/chat" className="menuIcon">
          <Image path="/general/logo.png" alt="" className="logo"/>
        </a>
        <a href="/chat" className="menuIcon">
          <Image path="/general/home.svg" alt="" />
        </a>
        <a href="/chat/create" className="menuIcon">
          <Image path="/general/create.svg" alt="" />
        </a>
        <a href="/" className="menuIcon">
          <Image path="/general/updates.svg" alt="" />
        </a>
        <a href="/" className="menuIcon">
          <Image path="/general/messages.svg" alt="" />
        </a>
      </div>
      <a href="/" className="menuIcon">
          <Image path="/general/settings.svg" alt="" />
        </a>
        
    </div>
  );
};

export default LeftBar;