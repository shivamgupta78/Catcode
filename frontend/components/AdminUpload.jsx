import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router";

const VideoUpload = () => {
    const { problemId } = useParams();
    const navigate = useNavigate();
    const [uploading, setUploading] = useState(false);
    const [showComingSoon, setShowComingSoon] = useState(false);

    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();
    const selectedFile = watch("videoFile");

    const formatBytes = (bytes, decimals = 2) => {
        if (!+bytes) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    };

    const onSubmit = async (data) => {
        setUploading(true);
        
        // Simulating artificial delay for premium professional feel
        setTimeout(() => {
            setUploading(false);
            setShowComingSoon(true); // Banner pop-up show karega
            reset(); // Clear the file input
        }, 1500);
    };

    return (
        <div className="max-w-2xl mx-auto my-10 p-8 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl relative overflow-hidden">
            
            {/* Professional Coming Soon Banner Overlay */}
            {showComingSoon && (
                <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 z-50 animate-fadeIn">
                    <div className="w-16 h-16 bg-blue-500/10 border border-blue-500 text-blue-400 rounded-full flex items-center justify-center text-3xl mb-4 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                        🚀
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Advanced Feature Coming Soon!</h3>
                    <p className="text-zinc-400 max-w-md mb-6 text-sm">
                        The video delivery & processing microservice is currently undergoing optimization benchmarking. Desktop cloud streaming architecture will be operational shortly!
                    </p>
                    <div className="flex gap-4">
                        <button 
                            onClick={() => setShowComingSoon(false)} 
                            className="px-5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium rounded-lg text-sm transition-all"
                        >
                            Try Again
                        </button>
                        <button 
                            onClick={() => navigate('/admin')} 
                            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition-all shadow-md active:scale-95"
                        >
                            Back to Workspace
                        </button>
                    </div>
                </div>
            )}

            <div className="mb-6 border-b border-zinc-800 pb-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    🎥 Core Solution Video Sync Engine
                </h2>
                <p className="text-zinc-400 text-xs mt-1">Target Problem Reference Context: <span className="text-blue-400 font-mono font-semibold">{problemId}</span></p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label className="block text-zinc-300 font-medium text-sm mb-2">Select walk-through video binary asset (.mp4):</label>
                    <div className="border-2 border-dashed border-zinc-700 hover:border-blue-500 rounded-xl p-6 text-center bg-zinc-950 transition-all cursor-pointer relative">
                        <input
                            type="file"
                            accept="video/mp4"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            {...register("videoFile", { required: "Please pick a valid MP4 resource asset first." })}
                        />
                        <div className="space-y-2">
                            <div className="text-4xl text-zinc-500">📁</div>
                            <p className="text-zinc-300 text-sm font-medium">
                                {selectedFile && selectedFile[0] ? selectedFile[0].name : "Click to select or drag and drop files here"}
                            </p>
                            <p className="text-zinc-500 text-xs">
                                {selectedFile && selectedFile[0] ? `Asset Size Payload: ${formatBytes(selectedFile[0].size)}` : "Max structural capacity limit: 50MB per cluster payload"}
                            </p>
                        </div>
                    </div>
                    {errors.videoFile && <p className="text-red-500 text-xs mt-2 font-medium">⚠️ {errors.videoFile.message}</p>}
                </div>

                <button
                    type="submit"
                    disabled={uploading}
                    className={`w-full py-2.5 rounded-lg font-semibold text-white transition-all
                        ${uploading 
                        ? 'bg-zinc-700 cursor-not-allowed text-zinc-400' 
                        : 'bg-blue-600 hover:bg-blue-700 shadow-md active:scale-[0.98]'}`}
                >
                    {uploading ? 'Analyzing Payload Metadata...' : 'Upload Reference Solution Video'}
                </button>
            </form>
        </div>
    );
};

export default VideoUpload;