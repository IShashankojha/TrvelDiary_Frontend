import React from "react";
import LOGO from "../../assets/logo/lOGO1.jpg";
import ProfileInfo from "../Cards/ProfileInfo";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";

const Navbar = ({
  userInfo,
  SearchQuery,
  setSearchQuery,
  onSearchNote,
  handleClearSearch,
}) => {
  const isToken = localStorage.getItem("token");
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSearch = () => {
    if (SearchQuery) {
      onSearchNote(SearchQuery);
    }
  };

  const onClearSearch = () => {
    handleClearSearch();
    setSearchQuery("");
  };

  return (
    <div className="bg-white flex items-center justify-between px-4 sm:px-8 py-3 drop-shadow sticky top-0 z-10">
      {/* Logo Section */}
      <div className="flex items-center">
        <img src={LOGO} alt="TravelDiary" className="h-10 sm:h-12" />
      </div>

      {isToken && (
        <div className="flex items-center gap-4 sm:gap-6 flex-1 justify-end">
          {/* Search Bar */}
          <div className="hidden sm:block flex-1">
            <SearchBar
              value={SearchQuery}
              onChange={({ target }) => setSearchQuery(target.value)}
              handleSearch={handleSearch}
              onClearSearch={onClearSearch}
            />
          </div>

          {/* Profile Info */}
          <ProfileInfo userInfo={userInfo} onLogout={onLogout} />

          {/* Mobile Search Button */}
          <div className="block sm:hidden">
            <button
              onClick={handleSearch}
              className="bg-sky-500 text-white px-4 py-2 rounded-lg text-sm"
            >
              Search
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
