import React from 'react'
import LOGO from "../../assets/logo/lOGO1.jpg";
import ProfileInfo from "../Cards/ProfileInfo"
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
const Navbar = ({userInfo,SearchQuery,setSearchQuery,onSearchNote,handleClearSearch}) => {

  const isToken =localStorage.getItem("token");
  const navigate = useNavigate();
  const onLogout =()=>{
    localStorage.clear();
    navigate("/login");
  };
  const handleSearch = ()=>{
    if(SearchQuery){
      onSearchNote(SearchQuery);
    }
  };
  
  const onClearSearch = ()=>{
    handleClearSearch();
    setSearchQuery("");

  };


  return (
    <div className='bg-white flex items-center justify-between px-10 py-2 drop-shadow sticky top-0 z-10'>
        <img src ={LOGO} alt="travelDiary"className="h-12"/>

        {isToken && (
          <> 
         <SearchBar 
         value={SearchQuery}
        onChange = {({target})=> {
          setSearchQuery(target.value);
        }}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
        />

        <ProfileInfo userInfo={userInfo} onLogout={onLogout}/> {""}
         </>
         )}
    </div>
  )
}

export default Navbar
