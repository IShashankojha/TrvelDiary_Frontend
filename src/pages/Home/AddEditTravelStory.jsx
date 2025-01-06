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
                getAllTravelStories();
                resetFields();
                onClose();
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || 'Failed to add the story. Please try again.'
            );
        }
    };

    const updateTravelStory = async () => {
        const storyId = storyInfo._id;

        try {
            let imageUrl = storyInfo.imageUrl || '';
            const postData = {
                title,
                story,
                imageUrl,
                visitedLocation,
                visitedDate: visitedDate ? moment(visitedDate).valueOf() : moment().valueOf(),
            };

            if (typeof storyImg === 'object') {
                const imgUploadRes = await uploadImage(storyImg);
                imageUrl = imgUploadRes.imageUrl || '';
                postData.imageUrl = imageUrl;
            }

            const response = await axiosInstance.put(`https://traveldiary-udd9.onrender.com/edit-story/${storyId}`, postData);

            if (response.data && response.data.story) {
                toast.success('Story Updated Successfully');
                getAllTravelStories();
                onClose();
            }
        } catch (error) {
            setError(error.response?.data?.message || 'An unexpected error occurred. Please try again.');
        }
    };

    const handleAddOrUpdateClick = () => {
        if (!title) {
            toast.error('Please enter the Title');
            setError('Please enter the Title');
            return;
        }
        if (!story) {
            toast.error('Please enter the Story');
            setError('Please enter the Story');
            return;
        }
        setError('');
        if (type === 'edit') {
            updateTravelStory();
        } else {
            addNewTravelStory();
        }
    };

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
        <div className="bg-white p-4 rounded shadow-md w-full max-w-3xl mx-auto">
            <div className="relative">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
                    <h5 className="text-xl font-medium text-slate-700">
                        {type === 'add' ? 'Add Travel Story' : 'Update Story'}
                    </h5>
                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                        <button className="btn-small flex items-center gap-1" onClick={handleAddOrUpdateClick}>
                            {type === 'add' ? <MdAdd /> : <MdUpdate />}
                            {type === 'add' ? 'ADD STORY' : 'UPDATE STORY'}
                        </button>
                        <button className="btn-small" onClick={onClose}>
                            <MdClose />
                        </button>
                    </div>
                </div>
                {error && <p className="text-red-500 text-sm mb-2 text-center sm:text-left">{error}</p>}

                <div className="flex flex-col gap-4">
                    <div>
                        <label className="input-label">Title</label>
                        <input
                            type="text"
                            className="input-box"
                            placeholder="A day at the Great Wall"
                            value={title}
                            onChange={({ target }) => setTitle(target.value)}
                        />
                    </div>

                    <DateSelector date={visitedDate} setDate={setVisitedDate} />
                    <ImageSelector
                        image={storyImg}
                        setImage={setStoryImg}
                        handleDeleteImg={handleDeleteStoryImg}
                    />
                    <div>
                        <label className="input-label">Story</label>
                        <textarea
                            className="input-box h-28"
                            placeholder="Write your travel story here..."
                            value={story}
                            onChange={({ target }) => setStory(target.value)}
                        />
                    </div>
                    <TagInput tags={visitedLocation} setTags={setVisitedLocation} />
                </div>
            </div>
        </div>
    );
};

export default AddEditTravelStory;
