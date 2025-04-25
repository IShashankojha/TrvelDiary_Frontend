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
import FilterInfoTitle from "../../components/Cards/FilterInfoTitle";
import { getEmptyCardMessage, getEmptyCardImg } from "../../utils/helper";

const Home = () => {
  const navigate = useNavigate();

  // 👇 Redirect to login if token doesn't exist
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
            <div className="bg-white dark:bg-gray-900 text-black dark:text-white border border-slate-200 dark:border-gray-700 shadow-lg rounded-lg">
              <div className="p-3">
                <DayPicker
                  captionLayout="dropdown-buttons"
                  mode="range"
                  selected={dateRange}
                  onSelect={handleDayClick}
                  pagedNavigation
                  className="!bg-white dark:!bg-gray-900 dark:!text-white"
                  classNames={{
                    caption: "text-black dark:text-white",
                    head: "text-slate-600 dark:text-slate-300",
                    head_cell: "text-xs font-semibold px-2 py-1",
                    row: "flex justify-center mt-2",
                    day: "w-9 h-9 text-sm rounded-full hover:bg-sky-100 dark:hover:bg-sky-700 dark:text-white",
                    day_selected: "bg-sky-500 text-white hover:bg-sky-600 dark:bg-sky-500 dark:hover:bg-sky-600",
                    day_today: "border border-sky-500 dark:border-sky-400",
                    nav_button: "text-sky-600 hover:bg-sky-100 dark:text-sky-300 dark:hover:bg-sky-700",
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
          deleteTravelStory={deleteTravelStory}
        />
      </Modal>

      <ToastContainer />
    </>
  );
};

export default Home;
