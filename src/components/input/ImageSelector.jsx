import React, { useEffect, useRef, useState } from 'react';
import { FaRegFileImage } from 'react-icons/fa';
import { MdDeleteOutline } from 'react-icons/md';

const ImageSelector = ({ image, setImage, handleDeleteImg }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };

  const handleRemoveImage = () => {
    setImage(null);
    handleDeleteImg();
  };

  useEffect(() => {
    // Handle image preview
    if (typeof image === 'string') {
      setPreviewUrl(image);
    } else if (image) {
      setPreviewUrl(URL.createObjectURL(image));
    } else {
      setPreviewUrl(null);
    }

    return () => {
      if (previewUrl && typeof previewUrl === 'string' && !image) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [image]);

  return (
    <div>
      {/* Hidden File Input */}
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {!image ? (
        <button
          className="w-full h-[220px] sm:h-[240px] flex flex-col items-center justify-center gap-4 bg-slate-50 rounded-lg border border-slate-200/50 hover:bg-slate-100 transition-colors"
          onClick={onChooseFile}
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center bg-cyan-50 rounded-full border border-cyan-100">
            <FaRegFileImage className="text-xl sm:text-2xl text-cyan-500" />
          </div>
          <p className="text-sm sm:text-base text-slate-500">
            Browse image files to upload
          </p>
        </button>
      ) : (
        <div className="w-full relative">
          {/* Image Preview */}
          <img
            src={previewUrl}
            alt="Selected"
            className="w-full h-[300px] sm:h-[350px] object-cover rounded-lg"
          />

          {/* Delete Button */}
          <button
            className="absolute top-2 right-2 bg-white/80 hover:bg-white/90 rounded-full p-2 border border-slate-200 shadow-md"
            onClick={handleRemoveImage}
          >
            <MdDeleteOutline className="text-lg sm:text-xl text-red-600" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageSelector;
