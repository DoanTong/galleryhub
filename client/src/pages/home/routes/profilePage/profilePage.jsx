import './profilePage.css'
import Image from '../../components/image/image';
import { useState } from 'react';
import Gallery from '../../components/gallery/gallery';
import Collections from '../../components/collections/collections';

const ProfilePage = () => {
  const [type, setType] = useState("saved");

  return (
    <div className="profilePage">
      <Image
        className="profileImg"
        w={100}
        h={100}
        path="/general/noAvatar.png"
        alt=""
      />
      <h1 className="profileName">John Doe</h1>
      <span className="profileUsername">@johndoe</span>
      <div className='followCounts'>10 followers · 20 followings</div>
      <div className='profileInteractions'>
        <Image path="/general/share.svg" alt="" />
        <div className="profileButtons">
          <button>Message</button>
          <button>Follow</button>
        </div>
        <Image path="/general/more.svg" alt="" />
      </div>
      <div className="profileOptions">
        <span onClick={() => setType("created")} className={type === "created" ? "active" : ""}>Created</span>
        <span onClick={() => setType("saved")} className={type === "saved" ? "active" : ""}>Save</span>
      </div>
      {type==="created" ? <Gallery /> : <Collections />}
    </div>
  )
}

export default ProfilePage;