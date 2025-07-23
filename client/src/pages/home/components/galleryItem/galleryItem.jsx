import { IKImage } from 'imagekitio-react';
import Image from '../image/image';
import './galleryItem.css'
import { Link } from 'react-router-dom'; 

const GalleryItem = ({item}) => {

  const optimizedHeight = (500 * item.height) / item.width

  return (
    <div className="galleryItem" style={{gridRowEnd:`span ${Math.ceil(item.height / 100)}`}}>
      {/* <img src={item.media} alt=''/> */}
      <Image path={item.media} alt="" w={372} h={optimizedHeight}/>
      <Link to={`/home/pin/${item._id}`} className="overlay" />
      <button className="saveButton">Save</button>
      <div className="overlayIcons">
        <button>
          <img src="/general/share.svg" alt="" />
        </button>
        <button>
          <img src="/general/more.svg" alt="" />
        </button>
      </div>
    </div>
  );
};

export default GalleryItem;