'use client'

import React, { useState, useRef, useEffect } from 'react';
import { Modal, CircularProgress } from '@mui/material';
import { CancelRounded } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { updateCaptureEmotion } from '@/store/botSlice';
import Image from 'next/image';

const EmotionCaptureModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
    const [dominantEmotion, setDominantEmotion] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [imageData, setImageData] = useState<string | null>(null);
    const dispatch = useDispatch();

    const startWebcam = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { width: 260, height: 260 }
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                // Add these handlers
                videoRef.current.onloadedmetadata = () => {
                    console.log('Video metadata loaded');
                    videoRef.current?.play().catch(console.error);
                };
                videoRef.current.onplay = () => console.log('Video playing');
                videoRef.current.onerror = (e) => console.error('Video error:', e);
            }
        } catch (error) {
            console.error("Webcam error:", error);
        }
    };
    useEffect(() => {
        if (stream && videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
        }
    }, [stream]);

    const stopWebcam = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const captureImage = async () => {
        try {
            if (videoRef.current && canvasRef.current) {
                const canvas = canvasRef.current;
                canvas.width = 260;
                canvas.height = 260;
                const context = canvas.getContext('2d');
                if (context) {
                    context.drawImage(videoRef.current, 0, 0);
                    const base64Image = canvas.toDataURL('image/png');
                    setImageData(base64Image);
                    console.log("The image data :", base64Image);
                    stopWebcam();

                    try {
                        // Send the image as JSON
                        setLoading(true);
                        // const res = await fetch(`${process.env.NEXT_PUBLIC_FLASK_APP}/analyze-emotion`, {
                        const res = await fetch(`https://emotion-detector-7lf7.onrender.com/analyze-emotion`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ image: base64Image }),
                        });

                        const data = await res.json();
                        console.log("The response from flask api is : ", data);
                        setLoading(false);
                        setDominantEmotion(data.dominant_emotion);
                        dispatch(updateCaptureEmotion(data.dominant_emotion));
                    } catch (error) {
                        alert(`Something wents wrong : ${error}`);
                    }
                }
            }
        } catch (error) {
            console.log("Something went wrong: ", error);
        } finally {
            setLoading(false);
        }
    };


    // useEffect(() => {
    //     return () => {
    //         stopWebcam();
    //     };
    // }, []);

    return (
        <Modal open={open} onClose={onClose} className="flex justify-center items-center backdrop-blur-lg">
            <div className="bg-gradient-to-br from-[#1a1a2e] via-[#292942] to-[#3c1361] p-6 rounded-xl shadow-2xl max-w-sm mx-auto w-full relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-gray-700 rounded-full text-white hover:bg-purple-500 transition cursor-pointer"
                >
                    <CancelRounded fontSize="large" />
                </button>

                <h2 className="text-purple-400 text-2xl font-extrabold text-center mb-6 animate-pulse">
                    Capture Emotion
                </h2>

                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <CircularProgress color="secondary" />
                    </div>
                ) : (
                    <>
                        <div className='relative flex justify-center items-center w-[260px] h-[260px] border rounded-full overflow-hidden mb-6 mx-auto'>
                            {!stream && !imageData && (
                                <div className="relative w-full h-full flex items-center justify-center text-white">
                                    <p className="absolute top-[51%] text-orange-400 text-xs z-10">
                                        Align your face with the line
                                    </p>
                                    <div className="absolute w-full h-0.5 bg-blue-500 top-[50%] z-10"></div>
                                </div>
                            )}
                            {stream && !imageData && (
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="w-full h-full object-contain"  // Changed from object-cover
                                    style={{ backgroundColor: 'black' }}
                                    onLoadedMetadata={() => {
                                        if (videoRef.current) videoRef.current.play();
                                    }}
                                />
                            )}
                            {imageData && (
                                <Image
                                    src={imageData}
                                    alt="Captured"
                                    width={320}
                                    height={240}
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>
                        <canvas ref={canvasRef} className="hidden" />
                        <div className="text-white text-center mb-6">
                            {dominantEmotion ? (
                                <p>
                                    Dominant Emotion: <span className="font-bold text-purple-300">{dominantEmotion}</span>
                                </p>
                            ) : (
                                <p className="italic text-gray-400">Emotion will appear here after capture</p>
                            )}
                        </div>

                        <div className="flex justify-between gap-4">
                            {!stream && !imageData && (
                                <button
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                                    onClick={startWebcam}
                                >
                                    Start Camera
                                </button>
                            )}
                            {stream && !imageData && (
                                <button
                                    className="px-4 py-2 bg-green-500 text-white rounded-md"
                                    onClick={captureImage}
                                >
                                    Capture
                                </button>
                            )}
                            {imageData && (
                                <>
                                    <button
                                        className="px-4 py-2 bg-yellow-500 text-white rounded-md"
                                        onClick={() => {
                                            setImageData(null);
                                            startWebcam();
                                        }}
                                    >
                                        Recapture
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-red-500 text-white rounded-md"
                                        onClick={() => {
                                            // Your upload logic here
                                        }}
                                    >
                                        Finish
                                    </button>
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
};

export default EmotionCaptureModal;


// "use client";
// import React, { useState, useRef, useEffect } from "react";
// import { Modal, Button, CircularProgress } from "@mui/material";
// import { CancelRounded } from "@mui/icons-material";
// import Image from "next/image";

// const EmotionCaptureModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
//     const [capturedImage, setCapturedImage] = useState<string | null>(null);
//     const [streaming, setStreaming] = useState<boolean>(false);

//     const videoRef = useRef<HTMLVideoElement | null>(null);
//     const canvasRef = useRef<HTMLCanvasElement | null>(null);

//     const startWebCam = async () => {
//         try {
//             console.log("Starting webcam...");
//             const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//             if (videoRef.current) {
//                 videoRef.current.srcObject = stream;
//                 videoRef.current.play();
//                 setStreaming(true);
//                 console.log("Webcam started successfully.");
//             } else {
//                 console.error("Video element reference is null.");
//             }
//         } catch (error) {
//             console.error("Error accessing webcam:", error);
//         }
//     };

//     const stopWebCam = () => {
//         console.log("Stopping webcam...");
//         if (videoRef.current) {
//             const stream = videoRef.current.srcObject as MediaStream;
//             if (stream) {
//                 stream.getTracks().forEach((track) => track.stop());
//             }
//             videoRef.current.srcObject = null;
//         }
//         setStreaming(false);
//     };

//     const captureEmotion = () => {
//         console.log("Capturing image...");
//         if (videoRef.current && canvasRef.current) {
//             const canvas = canvasRef.current;
//             const context = canvas.getContext("2d");
//             if (context) {
//                 canvas.width = videoRef.current.videoWidth;
//                 canvas.height = videoRef.current.videoHeight;
//                 context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
//                 const imageDataURL = canvas.toDataURL("image/png");
//                 setCapturedImage(imageDataURL);
//                 stopWebCam();
//                 console.log("Image captured successfully.");
//             } else {
//                 console.error("Canvas context is null.");
//             }
//         } else {
//             console.error("Video or canvas reference is null.");
//         }
//     };

//     const handleRecapture = () => {
//         setCapturedImage(null);
//         startWebCam();
//     };

//     // Cleanup on Modal Close
//     useEffect(() => {
//         if (!open) {
//             stopWebCam();
//         }
//         return () => stopWebCam();
//     }, [open]);

//     return (
//         <Modal open={open} onClose={onClose} className="flex justify-center items-center backdrop-blur-lg">
//             <div className="bg-gray-800 p-6 rounded-xl shadow-2xl max-w-sm mx-auto w-full relative">
//                 {/* Close Button */}
//                 <button
//                     onClick={onClose}
//                     className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-gray-700 rounded-full text-white hover:bg-purple-500 transition cursor-pointer"
//                 >
//                     <CancelRounded fontSize="large" />
//                 </button>

//                 <h2 className="text-purple-400 text-2xl font-extrabold text-center mb-6">Capture Emotion</h2>

//                 {/* Video or Captured Image */}
//                 <div className="relative flex justify-center items-center mb-6">
//                     {
//                         !streaming ? (
//                             <div className="w-40 h-40 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400">
//                                 No Video Stream
//                             </div>
//                         ) : (
//                             <div>

//                             </div>
//                         )
//                     }
//                     <canvas ref={canvasRef} className="hidden"></canvas>
//                 </div>

//                 {/* Buttons */}
//                 <div className="flex justify-between gap-4">
//                     {streaming ? (
//                         capturedImage ? (
//                             <Button
//                                 variant="outlined"
//                                 onClick={handleRecapture}
//                                 className="w-full text-purple-400 border-purple-400 hover:bg-purple-500 hover:text-white transition"
//                             >
//                                 Recapture
//                             </Button>
//                         ) : (
//                             <Button
//                                 variant="outlined"
//                                 onClick={captureEmotion}
//                                 className="w-full text-purple-400 border-purple-400 hover:bg-purple-500 hover:text-white transition"
//                             >
//                                 Capture
//                             </Button>
//                         )
//                     ) : (
//                         <Button
//                             variant="outlined"
//                             onClick={startWebCam}
//                             className="w-full text-purple-400 border-purple-400 hover:bg-purple-500 hover:text-white transition"
//                         >
//                             Start Camera
//                         </Button>
//                     )}
//                     <Button
//                         variant="contained"
//                         onClick={onClose}
//                         className="w-full bg-blue-500 text-white hover:bg-blue-600 transition"
//                     >
//                         Finish
//                     </Button>
//                 </div>
//             </div>
//         </Modal>
//     );
// };

// export default EmotionCaptureModal;

