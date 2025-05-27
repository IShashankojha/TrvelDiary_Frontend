import axiosInstance from "./axiosInst";
const uploadImage = async (imageFile) => {
    if (!imageFile) {
        throw new Error("No image file provided for upload.");
    }

    const formData = new FormData();
    formData.append('image', imageFile);

    try {
        const response = await axiosInstance.post('https://traveldiary-back.onrender.com/image-upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Set header for file upload
            },
        });

        // Check for a successful response and return the image URL or other data
        if (response.data && response.data.imageUrl) {
            return response.data; // Return the entire response data for flexibility
        } else {
            throw new Error("Image upload failed: No imageUrl in response.");
        }
    } catch (error) {
        console.error("Error uploading the image:", error.message || error);
        throw new Error(
            error.response?.data?.message || "Failed to upload image. Please try again."
        );
    }
};

export default uploadImage;
