import React, { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import MainLayout from "./routes/layouts/mainLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const Homepage = React.lazy(() => import("./routes/homepage/homepage"));
const CreatePage = React.lazy(() => import("./routes/createPage/createPage"));
const PostPage = React.lazy(() => import("./routes/postPage/postPage"));
const ProfilePage = React.lazy(() =>
  import("./routes/profilePage/profilePage")
);
const SearchPage = React.lazy(() => import("./routes/searchPage/searchPage"));
const AuthPage = React.lazy(() => import("./routes/authPage/authPage"));
const MintNFT = React.lazy(() => import("./routes/mintPage/MintNFT"));

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {/* Suspense phải bọc toàn bộ Routes */}
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Homepage />} />
              <Route path="/create" element={<CreatePage />} />
              <Route path="/pin/edit/:id" element={<CreatePage />} />
              <Route path="/pin/:id" element={<PostPage />} />
              <Route path="/:username" element={<ProfilePage />} />
              <Route path="/profile/:username" element={<ProfilePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/mint/:id" element={<MintNFT />} />
            </Route>
            <Route path="/auth" element={<AuthPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
