import React, { useState, useEffect } from 'react';
import { MdAdd, MdDeleteOutline, MdUpdate, MdClose } from 'react-icons/md';
import DateSelector from '../../components/input/DateSelector';
import ImageSelector from '../../components/input/ImageSelector';
import TagInput from '../../components/input/TagInput';
import axiosInstance from '../../utils/axiosInst';
import moment from 'moment';
import { toast } from 'react-toastify';
import uploadImage from '/src/utils/uploadImage.js';

const AddEditTravelStory = ({
    storyInfo,
    type,
    onClose,
    getAllTravelStories,
}) => {
    const [title, setTitle] = useState(storyInfo?.title || '');
    const [storyImg, setStoryImg] = useState(storyInfo?.imageUrl || null);
    const [story, setStory] = useState(storyInfo?.story || '');
    const [visitedLocation, setVisitedLocation] = useState(storyInfo?.visitedLocation || []);
    const [visitedDate, setVisitedDate] = useState(storyInfo?.visitedDate || null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (type === 'edit' && storyInfo) {
            setTitle(storyInfo.title || '');
            setStoryImg(storyInfo.imageUrl || null);
            setStory(storyInfo.story || '');
            setVisitedLocation(storyInfo.visitedLocation || []);
            setVisitedDate(storyInfo.visitedDate ? moment(storyInfo.visitedDate) : null);
        }
    }, [type, storyInfo]);

    const resetFields = () => {
        setTitle('');
        setStoryImg(null);
        setStory('');
        setVisitedLocation([]);
        setVisitedDate(null);
        setError('');
    };

    // Add New Story
    const addNewTravelStory = async () => {
        try {
            let imageUrl = '';
            if (storyImg) {
                const imgUploadRes = await uploadImage(storyImg);
                imageUrl = imgUploadRes.imageUrl || '';
            }

            const response = await axiosInstance.post('https://traveldiary-udd9.onrender.com/Add-TravelStory', {
                title,
                story,
                imageUrl,
                visitedLocation,
                visitedDate: visitedDate ? moment(visitedDate).valueOf() : moment().valueOf(),
            });

            if (response.data && response.data.story) {
                toast.success('Story Added Successfully');
                getAllTravelStories(); // Refresh stories after adding
                resetFields();
                onClose(); // Close modal
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || 'Failed to add the story. Please try again.'
            );
        }
    };
// Update Story
const updateTravelStory = async () => {
    const storyId = storyInfo._id;

    try {
        let imageUrl = storyInfo.imageUrl || ''; // Retain the original image URL by default

        const postData = {
            title,
            story,
            imageUrl, // Use the default imageUrl unless explicitly updated
            visitedLocation,
            visitedDate: visitedDate ? moment(visitedDate).valueOf() : moment().valueOf(),
        };

        // Check if the story image has been updated
        if (typeof storyImg === 'object') {
            const imgUploadRes = await uploadImage(storyImg);
            imageUrl = imgUploadRes.imageUrl || ''; // Update the imageUrl with the new image
            postData.imageUrl = imageUrl; // Update the postData with the new image URL
        }

        const response = await axiosInstance.put(`https://traveldiary-udd9.onrender.com/edit-story/${storyId}`, postData);

        if (response.data && response.data.story) {
            toast.success('Story Updated Successfully');
            getAllTravelStories(); // Refresh stories after updating
            onClose(); // Close modal
        }
    } catch (error) {
        console.error(error);
        if (error.response && error.response.data && error.response.data.message) {
            setError(error.response.data.message);
        } else {
            // Handle unexpected errors
            setError('An unexpected error occurred. Please try again.');
        }
    }
};

// Add or Update Click Handler
const handleAddOrUpdateClick = () => {
    if (!title) {
        const errorMessage = 'Please enter the Title';
        setError(errorMessage);
        toast.error(errorMessage); // Notify user to add a title
        return;
    }
    if (!story) {
        const errorMessage = 'Please enter the Story';
        setError(errorMessage);
        toast.error(errorMessage); // Notify user to add a story
        return;
    }
    setError(''); // Clear existing errors
    if (type === 'edit') {
        updateTravelStory();
    } else {
        addNewTravelStory();
    }
};

    // Delete Story Image
    const handleDeleteStoryImg = async () => {
        try {
            const deleteImgRes = await axiosInstance.delete('https://traveldiary-udd9.onrender.com/delete-image', {
                params: { imageUrl: storyInfo.imageUrl },
            });

            if (deleteImgRes.data) {
                const storyId = storyInfo._id;
                const postData = {
                    title,
                    story,
                    visitedLocation,
                    visitedDate: moment().valueOf(),
                    imageUrl: '',
                };

                // Update story to remove the image
                const response = await axiosInstance.put(`https://traveldiary-udd9.onrender.com/edit-story/${storyId}`, postData);

                if (response.data && response.data.updated) {
                    setStoryImg(null);
                    toast.info('Image removed successfully.');
                }
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || 'Failed to delete the image. Please try again.'
            );
        }
    };

    return (
        <div className="bg-white p-4 rounded shadow-md">
            <div className="relative">
                <div className="flex items-center justify-between mb-4">
                    <h5 className="text-xl font-medium text-slate-700">
                        {type === 'add' ? 'Add Travel Story' : 'Update Story'}
                    </h5>
                    <div className="flex items-center gap-3 bg-cyan-50/50 p-2 rounded-lg">
                        <button className="btn-small" onClick={handleAddOrUpdateClick}>
                            {type === 'add' ? <MdAdd className="text-lg" /> : <MdUpdate className="text-lg" />}
                            {type === 'add' ? ' ADD STORY' : ' UPDATE STORY'}
                        </button>
                        <button className="btn-small" onClick={onClose}>
                            <MdClose className="text-xl text-slate-400" />
                        </button>
                    </div>
                    {error && <p className="text-red-500 text-xs pt-2 text-right">{error}</p>}
                </div>

                <div className="flex-1 flex flex-col gap-4">
                    <div>
                        <label className="input-label">TITLE</label>
                        <input
                            type="text"
                            className="w-full text-2xl text-slate-950 outline-none border border-slate-200 rounded p-2"
                            placeholder="A day at the Great Wall"
                            value={title}
                            onChange={({ target }) => setTitle(target.value)}
                        />
                    </div>

                    <div>
                        <DateSelector date={visitedDate} setDate={setVisitedDate} />
                    </div>

                    <div>
                        <ImageSelector
                            image={storyImg}
                            setImage={setStoryImg}
                            handleDeleteImg={handleDeleteStoryImg}
                        />
                    </div>

                    <div className="flex flex-col gap-2 mt-4">
                        <label className="input-label">STORY</label>
                        <textarea
                            className="w-full text-sm text-slate-950 outline-none bg-slate-50 border border-slate-200 p-2 rounded"
                            placeholder="Your Story"
                            rows={10}
                            value={story}
                            onChange={({ target }) => setStory(target.value)}
                        />
                    </div>

                    <div className="pt-3">
                        <label className="input-label">VISITED LOCATIONS</label>
                        <TagInput tags={visitedLocation} setTags={setVisitedLocation} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddEditTravelStory;
