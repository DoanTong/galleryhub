import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4 shadow-md bg-white">
      <Link to="/" className="text-xl font-bold">📸 NFTgram</Link>
      <div className="flex gap-4">
        <Link to="/upload">Upload</Link>
        <Link to="/marketplace">Marketplace</Link>
        <Link to="/events">Events</Link>
      </div>
    </nav>
  );
}
