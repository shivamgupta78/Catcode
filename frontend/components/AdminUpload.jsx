import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router";
import axios from "axios";

const VideoUpload = () =>{
    const {problemId} = useParams();
    const [uploading,setUploading] = useState(false);
    const [uploadprogress,setUploadProgress] = useState(0);
    const [uploadedVideo,setUploadVideo] = useState(null);

    const {register,handleSubmit,watch,formState:{errors},reset,setError,clearErrors} = useForm();
    const selectedFile = watch("videoFile");


    const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

    const onSubmit = async(data) => {
        const file = data.videoFile[0];

        setUploading(true);
        setUploadProgress(0);
        clearErrors();
        try{
            //get upload signature from backend
            const signatureResponse = await axios.get(`http://localhost:3000/video/create/${problemId}`);
            const { signature,timestamp,public_id,api_key,upload_url} = signatureResponse.data;
            //create a formdata for cloudinary upload
            const formdata = new FormData();
            formdata.append('file',file);
            formdata.append('signature',signature);
            formdata.append('timestamp',timestamp);
            formdata.append('public_id',public_id);
            formdata.append('api_key',api_key);

            //upload directly to cloudinary
            const uploadResponse = await axios.post(upload_url, formdata,{
                headers:{
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (ProgressEvent) =>{
                    const progress = Math.round((ProgressEvent.loaded * 100) / ProgressEvent.total)
                    setUploadProgress(progress);
                }
            });
            const cloudinaryResult = uploadResponse.data;

            //save video metadata to the database
            const metadataresponse = await axios.post('/video/save', {
                public_id: cloudinaryResult.public_id,
                secureUrl: cloudinaryResult.secure_url,
                duration : cloudinaryResult.duration,
                format: cloudinaryResult.format,
                bytes: cloudinaryResult.bytes,
            });
            setUploadVideo(metadataresponse.data.videoSolution);
            reset();
    
        } catch(error){
            console.error('upload error:',error);
            setError('root',{
                type:'manual',
                message:error.response?.data?.message || 'upload failed. Please Try Again later'
            });

        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
        
    }
    return (
        <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
      <h2 className="text-xl font-bold mb-4 text-zinc-800 dark:text-zinc-100">Upload Editorial Video</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Upload Dropzone Section */}
        <div className="relative">
          <label 
            className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                ${errors.videoFile ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20' : 'border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800'}
                ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-10 h-10 mb-3 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
              <p className="mb-2 text-sm text-zinc-500 dark:text-zinc-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
              <p className="text-xs text-zinc-400 uppercase font-medium">MP4, WebM (Max 100MB)</p>
            </div>
            
            <input 
              type="file" 
              className="hidden" 
              accept="video/*"
              disabled={uploading}
              {...register("videoFile", { 
                  required: "Please select a video file",
                  //format file size
                  validate: {
                      lessThan100MB: (files) => files[0]?.size < 100 * 1024 * 1024 || "Max file size is 100MB",
                      acceptedFormats: (files) => 
                        ['video/mp4', 'video/webm', 'video/ogg'].includes(files[0]?.type) || "Unsupported file format"
                    }
                })} 
            />
          </label>
        </div>

        {/* Selected File Info */}
        {selectedFile && selectedFile[0] && !uploading && (
          <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500 text-white p-2 rounded">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path></svg>
              </div>
              <div>
                <p className="text-sm font-medium truncate w-48 text-zinc-800 dark:text-zinc-200">{selectedFile[0].name}</p>
                <p className="text-xs text-zinc-500">{formatBytes(selectedFile[0].size)}</p>
              </div>
            </div>
            <button type="button" onClick={() => reset()} className="text-zinc-400 hover:text-red-500">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
        )}

        {/* Upload Progress Bar */}
        {uploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium text-zinc-500">
              <span>Uploading...</span>
              <span>{uploadprogress}%</span>
            </div>
            <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${uploadprogress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Error Messages */}
        {(errors.videoFile || errors.root) && (
          <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-md flex items-start space-x-2">
            <svg className="w-5 h-5 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">
              {errors.videoFile?.message || errors.root?.message}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={uploading}
          className={`w-full py-2.5 rounded-lg font-semibold text-white transition-all
            ${uploading 
              ? 'bg-zinc-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 shadow-md active:scale-[0.98]'}`}
        >
          {uploading ? 'Processing Video...' : 'Upload Video'}
        </button>
      </form>

      {/* Success View */}
      {uploadedVideo && (
        <div className="mt-8 p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
          <div className="flex items-center mb-4">
             <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white mr-3">
               ✓
             </div>
             <h3 className="font-bold text-emerald-800 dark:text-emerald-200">Video Uploaded Successfully!</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm text-zinc-600 dark:text-zinc-400">
             <div><span className="font-medium">Duration:</span> {formatDuration(uploadedVideo.duration)}</div>
             <div><span className="font-medium">Size:</span> {formatBytes(uploadedVideo.bytes)}</div>
             <div className="col-span-2"><span className="font-medium">Public ID:</span> {uploadedVideo.public_id}</div>
          </div>
        </div>
      )}
    </div>
  );
};


export default VideoUpload