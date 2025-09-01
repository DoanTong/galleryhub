// import Image from "../image/image";
import {Link} from "react-router-dom";
import Image from "../image/image";
import "./leftBar.css";

const LeftBar = () => {
  return (
    <div className="leftBar">
      <div className="menuIcons">
        <Link to="/home" className="menuIcon">
          <Image path="/general/logo.png" alt="" className="logo"/>
        </Link>
        <Link to="/home" className="menuIcon">
          <Image path="/general/home.svg" alt="" />
        </Link>
        <Link to="/home/create" className="menuIcon">
          <Image path="/general/create.svg" alt="" />
        </Link>
        <Link to="/" className="menuIcon">
          <Image path="/general/updates.svg" alt="" />
        </Link>
        <Link to="/" className="menuIcon">
          <Image path="/general/messages.svg" alt="" />
        </Link>
      </div>
      <Link to="/" className="menuIcon">
          <Image path="/general/settings.svg" alt="" />
        </Link>

    </div>
  );
};

export default LeftBar;