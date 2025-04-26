import React, { useState, useEffect } from "react";
import Navbar from "../../components/input/Navbar";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInst";
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import TravelStoryCard from "../../components/Cards/TravelStoryCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddEditTravelStory from "../Home/AddEditTravelStory";
import ViewTravelStory from "./ViewTravelStory";
import EmptyCard from "../../components/Cards/EmptyCard";
import moment from "moment";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import FilterInfoTitle from "../../components/Cards/FilterInfoTitle";
import { getEmptyCardMessage, getEmptyCardImg } from "../../utils/helper";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const [userInfo, setUserInfo] = useState(null);
  const [allStories, setAllStories] = useState([]);
  const [SearchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [loading, setLoading] = useState(true);

  const [openAddEditModel, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [openViewModel, setOpenViewModal] = useState({
    isShown: false,
    data: null,
  });

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get(`/get-user`);
      if (response.data?.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      } else {
        toast.error("Failed to fetch user info. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getAllTravelStories = async () => {
    try {
      const response = await axiosInstance.get(`/get-all-TravelStories`);
      if (response.data?.stories) {
        setAllStories(response.data.stories);
      }
    } catch (error) {
      toast.error("Failed to fetch travel stories. Please try again.");
    }
  };

  const handleEdit = (data) => {
    setOpenAddEditModal({ isShown: true, type: "edit", data });
  };

  const handleViewStory = (data) => {
    setOpenViewModal({ isShown: true, data });
  };

  const updateIsFavourite = async (storyData) => {
    const storyId = storyData._id;
    try {
      const response = await axiosInstance.put(
        `/update-is-favourite/${storyId}`,
        { isFavourite: !storyData.isFavourite }
      );
      if (response.data?.story) {
        toast.success("Story Updated Successfully");
        if (filterType === "search" && SearchQuery) {
          onSearchStory(SearchQuery);
        } else if (filterType === "date") {
          filterStoriesByDate(dateRange);
        } else {
          getAllTravelStories();
        }
      }
    } catch (error) {
      toast.error("Failed to update favorite status. Please try again.");
    }
  };

  const deleteTravelStory = async (data) => {
    const storyId = data._id;
    try {
      const response = await axiosInstance.delete(`/delete-story/${storyId}`);
      if (response.data && !response.data.error) {
        toast.success("Story Deleted Successfully");
        setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
        getAllTravelStories();
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const onSearchStory = async (query) => {
    try {
      const response = await axiosInstance.get(`/search`, {
        params: { query },
      });
      if (response.data?.stories) {
        setFilterType("search");
        setAllStories(response.data.stories);
      }
    } catch (error) {
      toast.error("Failed to search stories. Please try again.");
    }
  };

  const handleClearSearch = () => {
    setFilterType("");
    getAllTravelStories();
  };

  const handleDayClick = (day) => {
    setDateRange(day);
    filterStoriesByDate(day);
  };

  const resetFilter = () => {
    setDateRange({ from: null, to: null });
    setFilterType("");
    getAllTravelStories();
  };

  const filterStoriesByDate = async (day) => {
    try {
      const startDate = day.from ? moment(day.from).startOf("day").valueOf() : null;
      const endDate = day.to ? moment(day.to).endOf("day").valueOf() : null;

      if (startDate && endDate) {
        const response = await axiosInstance.get(`/travel-stories/filter`, {
          params: { startDate, endDate },
        });
        if (response.data?.stories) {
          setFilterType("date");
          setAllStories(response.data.stories);
        }
      }
    } catch (error) {
      toast.error("Failed to filter stories by date. Please try again.");
    }
  };

  const handleModalClose = () => {
    setOpenAddEditModal({ isShown: false, type: "add", data: null });
    getAllTravelStories();
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getUserInfo();
      getAllTravelStories();
    }
  }, []);

  return (
    <>
      <Navbar
        userInfo={userInfo}
        SearchQuery={SearchQuery}
        setSearchQuery={setSearchQuery}
        onSearchNote={onSearchStory}
        handleClearSearch={handleClearSearch}
      />
      <div className="container mx-auto py-10 px-4 sm:px-6">
        <FilterInfoTitle
          filterType={filterType}
          filterDates={dateRange}
          onClear={resetFilter}
        />
        <div className="flex flex-wrap gap-7">
          <div className="flex-1 w-full md:w-[70%]">
            {allStories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allStories.map((item) => (
                  <TravelStoryCard
                    key={item._id}
                    imgUrl={item.imageUrl}
                    title={item.title}
                    story={item.story}
                    date={item.visitedDate}
                    visitedLocation={item.visitedLocation}
                    isFavourite={item.isFavourite}
                    onClick={() => handleViewStory(item)}
                    onFavouriteClick={() => updateIsFavourite(item)}
                  />
                ))}
              </div>
            ) : (
              <EmptyCard
                imgSrc={getEmptyCardImg(filterType)}
                message={getEmptyCardMessage(filterType)}
              />
            )}
          </div>
          <div className="w-full md:w-[30%]">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 shadow-lg rounded-lg">
              <div className="p-3 text-black dark:text-white">
                <DayPicker
                  captionLayout="dropdown-buttons"
                  mode="range"
                  selected={dateRange}
                  onSelect={handleDayClick}
                  pagedNavigation
                  classNames={{
                    day_selected: 'bg-primary text-white',
                    nav_button_previous: 'text-black dark:text-white',
                    nav_button_next: 'text-black dark:text-white',
                    caption_label: 'text-black dark:text-white font-semibold',
                    months: 'bg-white dark:bg-slate-800 rounded-lg p-2',
                    day: 'hover:bg-slate-200 dark:hover:bg-slate-700',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={openAddEditModel.isShown}
        onRequestClose={handleModalClose}
        style={{
          overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 999 },
        }}
        appElement={document.getElementById("root")}
        className="model-box"
      >
        <AddEditTravelStory
          type={openAddEditModel.type}
          storyInfo={openAddEditModel.data}
          onClose={handleModalClose}
          getAllTravelStories={getAllTravelStories}
        />
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={openViewModel.isShown}
        onRequestClose={() =>
          setOpenViewModal({ isShown: false, data: null })
        }
        style={{
          overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 999 },
        }}
        appElement={document.getElementById("root")}
        className="model-box"
      >
        <ViewTravelStory
          storyInfo={openViewModel.data || null}
          onClose={() =>
            setOpenViewModal({ isShown: false, data: null })
          }
          onEditClick={() => {
            setOpenViewModal({ isShown: false, data: null });
            handleEdit(openViewModel.data || null);
          }}
          onDeleteClick={() =>
            deleteTravelStory(openViewModel.data || null)
          }
        />
      </Modal>

      {/* Add Story Floating Button */}
      <button
        className="w-16 h-16 flex items-center justify-center rounded-full bg-primary hover:bg-cyan-400 fixed right-5 bottom-5 sm:right-10 sm:bottom-10"
        onClick={() =>
          setOpenAddEditModal({ isShown: true, type: "add", data: null })
        }
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <ToastContainer />
    </>
  );
};

export default Home;
