import Image from "../image/image";
import {Link} from "react-router";
import "./leftBar.css";

const LeftBar = () => {
  return (
    <div className="leftBar">
      <div className="menuIcons">
        <Link to="/" className="menuIcon">
          <Image path="/general/logo.png" alt="" className="logo"/>
        </Link>
        <Link to="/" className="menuIcon">
          <Image path="/general/home.svg" alt="" />
        </Link>
        <Link to="/create" className="menuIcon">
          <Image path="/general/create.svg" alt="" />
        </Link>


        <Link to="/forsale" className="menuIcon">
          <Image path="/general/shopping-cart-arrow-down.svg" alt="" />
        </Link>



        <Link to="/buypage" className="menuIcon">
          <Image path="/general/twotone-collections.svg" alt="" />
        </Link>
      </div>
      <Link to="/" className="menuIcon">
        <Image path="/general/settings.svg" alt="" />
      </Link>
    </div>
  );
};

export default LeftBar;
