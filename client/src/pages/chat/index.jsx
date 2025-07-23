import { useAppStore } from "@/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ContactsContainer from "./components/contacts-container";
import EmptyChatContainer from "./components/empty-chat-container";
import ChatContainer from "./components/chat-container";
import LeftBar from "./components/leftBar/leftBar";
import TopBar from "./components/topBar/topBar";
import Gallery from "./components/gallery/gallery";

const Chat = () => {

  const {
    userInfo, 
    selectedChatType, 
    isUploading,
    isDownloading, 
    fileUploadProgress,
    fileDownloadProgress,
  } = useAppStore();  
  const navigate = useNavigate();
  useEffect(()=>{
    if(!userInfo.profileSetup){
      toast('Hãy setup profile của bạn để tiếp tục nhé.');
      navigate("/profile");
    }
  },[userInfo, navigate]);
  
  return <div >
    {/* <div className='app'>
      <LeftBar/>
      <div className="content">
        <TopBar/>
        <Gallery/>
      </div>
    </div> */}
  </div>
  };
  
  export default Chat;