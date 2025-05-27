import React, { useEffect, useState } from 'react'
import { MdAdd, MdClose, MdUpdate } from 'react-icons/md'
import DateSelector from '../../components/input/DateSelector'
import ImageSelector from '../../components/input/ImageSelector'
import TagInput from '../../components/input/TagInput'
import axiosInstance from '../../utils/axiosInst'
import moment from 'moment'
import { toast } from 'react-toastify'
import uploadImage from '/src/utils/uploadImage.js'

const AddEditTravelStory = ({
    storyInfo,
    type,
    onClose,
    getAllTravelStories,
}) => {
    const [title, setTitle] = useState(storyInfo?.title || '')
    const [storyImg, setStoryImg] = useState(storyInfo?.imageUrl || null)
    const [story, setStory] = useState(storyInfo?.story || '')
    const [visitedLocation, setVisitedLocation] = useState(storyInfo?.visitedLocation || [])
    const [visitedDate, setVisitedDate] = useState(storyInfo?.visitedDate || null)
    const [error, setError] = useState('')

    useEffect(() => {
        if (type === 'edit') {
            setTitle(storyInfo?.title || '')
            setStoryImg(storyInfo?.imageUrl || null)
            setStory(storyInfo?.story || '')
            setVisitedLocation(storyInfo?.visitedLocation || [])
            setVisitedDate(storyInfo?.visitedDate || null)
        }
    }, [type, storyInfo])

    const resetFields = () => {
        setTitle('')
        setStoryImg(null)
        setStory('')
        setVisitedLocation([])
        setVisitedDate(null)
        setError('')
    }

    const addNewTravelStory = async () => {
        try {
            let imageUrl = ''
            if (storyImg) {
                const imgUploadRes = await uploadImage(storyImg)
                imageUrl = imgUploadRes.imageUrl || ''
            }

            const response = await axiosInstance.post('https://traveldiary-backend.onrender.com/Add-TravelStory', {
                title,
                story,
                imageUrl,
                visitedLocation,
                visitedDate: visitedDate ? moment(visitedDate).valueOf() : Date.now(),
            })

            if (response.data && response.data.story) {
                toast.success('Story Added Successfully')
                getAllTravelStories()
                resetFields()
                onClose()
            }
        } catch (error) {
            toast.error(
                error?.response?.data?.message || 'Failed to add story. Please try again later.'
            )
        }
    }

    const updateTravelStory = async () => {
        const storyId = storyInfo._id
        try {
            let imageUrl = storyInfo?.imageUrl || ''
            const postData = {
                title,
                story,
                imageUrl,
                visitedLocation,
                visitedDate: visitedDate ? moment(visitedDate).valueOf() : Date.now(),
            }

            if (typeof storyImg === 'object') {
                const imgUploadRes = await uploadImage(storyImg)
                imageUrl = imgUploadRes.imageUrl || ''
                postData.imageUrl = imageUrl
            }

            const response = await axiosInstance.put(`https://traveldiary-backend.onrender.com/edit-Story/${storyId}`, postData)

            if (response.data && response.data.story) {
                toast.success('Story Updated Successfully')
                getAllTravelStories()
                resetFields()
                onClose()
            }
        } catch (error) {
            toast.error(
                error?.response?.data?.message || 'Failed to update story. Please try again later.'
            )
        }
    }

    const handleSubmit = () => {
        if (!title || !story || visitedLocation.length === 0) {
            setError('Please fill all the fields')
            return
        }

        if (type === 'edit') {
            updateTravelStory()
        } else {
            addNewTravelStory()
        }
    }

    return (
        <div className="w-full h-full bg-white dark:bg-slate-800 p-4 rounded-md flex flex-col gap-5">
            <div className="flex justify-between items-center">
                <p className="text-lg font-semibold tracking-wide text-slate-700 dark:text-white">
                    {type === 'edit' ? 'Edit Travel Story' : 'Add Travel Story'}
                </p>
                <MdClose
                    className="text-2xl cursor-pointer text-slate-500 hover:text-red-500"
                    onClick={onClose}
                />
            </div>

            {error && (
                <p className="text-sm text-red-500 font-medium tracking-wide">{error}</p>
            )}

            <div className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Title"
                    className="input-style"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <textarea
                    rows={4}
                    placeholder="Your story..."
                    className="input-style"
                    value={story}
                    onChange={(e) => setStory(e.target.value)}
                />

                <TagInput
                    label="Visited Location(s)"
                    tags={visitedLocation}
                    setTags={setVisitedLocation}
                />

                <DateSelector
                    label="Visited Date"
                    date={visitedDate}
                    setDate={setVisitedDate}
                />

                <ImageSelector
                    image={storyImg}
                    setImage={setStoryImg}
                />
            </div>

            <button
                className="mt-2 flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                onClick={handleSubmit}
            >
                {type === 'edit' ? (
                    <>
                        <MdUpdate className="text-lg" /> Update Story
                    </>
                ) : (
                    <>
                        <MdAdd className="text-lg" /> Add Story
                    </>
                )}
            </button>
        </div>
    )
}

export default AddEditTravelStory
