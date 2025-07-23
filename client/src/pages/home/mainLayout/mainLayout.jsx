import LeftBar from "@/pages/home/components/leftBar/leftBar";
import TopBar from "@/pages/home/components/topBar/topBar";
import { Outlet } from "react-router-dom";


const MainLayout = () => {
    return <div >
    <div className='app'>
      <LeftBar/>
      <div className="content">
        <TopBar/>
        <Outlet/>
      </div>
    </div>
  </div>
};

export default MainLayout;