import React from "react";
import { Link } from "react-router-dom";
import { Upload, ImagePlus, GalleryVerticalEnd, Sparkle } from "lucide-react";

const featuredArtworks = [
  {
    title: "Rừng Xanh",
    image: "https://source.unsplash.com/random/400x300?forest",
    views: 102,
    likes: 15,
    comments: 5,
  },
  {
    title: "Ký Ức AI",
    image: "https://source.unsplash.com/random/400x300?cyber",
    views: 250,
    likes: 60,
    comments: 9,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 text-gray-800">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-700 tracking-wide">
            🎨 GalleryHub
          </h1>
          <nav className="space-x-6 text-sm font-medium">
            <Link to="/" className="hover:text-purple-600">Trang chủ</Link>
            <Link to="/upload" className="hover:text-purple-600">Đăng tranh</Link>
            <Link to="/marketplace" className="hover:text-purple-600">Chợ NFT</Link>
            <Link to="/my-gallery" className="hover:text-purple-600">Bộ sưu tập</Link>
            <Link to="/events" className="hover:text-purple-600">Sự kiện</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="text-center py-20 px-4">
        <h2 className="text-4xl font-bold mb-4">Chào mừng đến với Thư viện Tranh Web3! 🚀</h2>
        <p className="text-lg text-gray-600 max-w-xl mx-auto">
          Nơi bạn có thể chia sẻ, mint và giao dịch các tác phẩm nghệ thuật kỹ thuật số của mình.
        </p>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <Link to="/upload" className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
            <Upload className="text-purple-500 w-6 h-6 mx-auto mb-2" />
            <p className="font-medium text-sm">Tải tranh</p>
          </Link>
          <Link to="/upload" className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
            <ImagePlus className="text-purple-500 w-6 h-6 mx-auto mb-2" />
            <p className="font-medium text-sm">Mint NFT</p>
          </Link>
          <Link to="/marketplace" className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
            <GalleryVerticalEnd className="text-purple-500 w-6 h-6 mx-auto mb-2" />
            <p className="font-medium text-sm">Mua bán NFT</p>
          </Link>
          <Link to="/my-gallery" className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
            <Sparkle className="text-purple-500 w-6 h-6 mx-auto mb-2" />
            <p className="font-medium text-sm">Bộ sưu tập</p>
          </Link>
        </div>
      </section>

      {/* Bộ sưu tập nổi bật */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-2xl font-semibold mb-8 text-center">✨ Bộ sưu tập nổi bật</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {featuredArtworks.map((art, index) => (
              <div key={index} className="bg-gray-50 rounded-xl shadow hover:shadow-xl transition overflow-hidden">
                <img src={art.image} alt={art.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h4 className="font-bold text-lg mb-2">{art.title}</h4>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>👁 {art.views}</span>
                    <span>❤️ {art.likes}</span>
                    <span>💬 {art.comments}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-purple-50 text-center py-6 text-sm text-gray-600 border-t">
        © 2025 GalleryHub. Bản quyền thuộc về cộng đồng nghệ sĩ Web3.
      </footer>
    </div>
  );
}
