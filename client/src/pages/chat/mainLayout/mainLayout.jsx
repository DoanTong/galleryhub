import LeftBar from "@/pages/chat/components/leftBar/leftBar";
import TopBar from "@/pages/chat/components/topBar/topBar";
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