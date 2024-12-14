import React, { useState } from 'react';
import { Modal, Button, CircularProgress } from '@mui/material';
import Image from 'next/image';
import { CancelRounded } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { updateCaptureEmotion } from '@/store/botSlice';

const EmotionCaptureModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [dominantEmotion, setDominantEmotion] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const dispatch = useDispatch();

    const captureEmotion = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_FLASK_APP}/capture-emotion`);
            const data = await response.json();

            if (data.error) {
                alert(data.error);
                return;
            }

            setCapturedImage(`data:image/jpeg;base64,${data.captured_image}`);
            setDominantEmotion(data.dominant_emotion);
            dispatch(updateCaptureEmotion(data.dominant_emotion));
        } catch (error) {
            console.error('Error during emotion capture:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            className="flex justify-center items-center backdrop-blur-lg"
        >
            <div className="bg-gradient-to-br from-[#1a1a2e] via-[#292942] to-[#3c1361] p-6 rounded-xl shadow-2xl max-w-sm mx-auto w-full relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-gray-700 rounded-full text-white hover:bg-purple-500 transition cursor-pointer"
                >
                    <CancelRounded fontSize='large' />
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
                        <div className="relative flex justify-center items-center mb-6">
                            {capturedImage !== null ? (
                                <div className='w-40 h-40'>
                                    <Image
                                        src={capturedImage}
                                        alt="Captured Emotion"
                                        width={200}
                                        height={250}
                                        className="rounded-full w-full h-full border-4 border-purple-500 shadow-lg object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="w-40 h-40 bg-gray-700 rounded-full flex items-center justify-center text-gray-400 text-sm relative">
                                    <p className="absolute bottom-[-20px] text-orange-400 text-xs">
                                        Align your face with the line
                                    </p>
                                    <div className="absolute w-full h-0.5 bg-blue-500 top-[50%]"></div>
                                    No Image
                                </div>
                            )}
                        </div>
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
                            <Button
                                variant="outlined"
                                onClick={captureEmotion}
                                className="w-full text-purple-400 border-purple-400 hover:bg-purple-500 hover:text-white transition"
                            >
                                {capturedImage ? 'Re-Capture' : 'Capture'}
                            </Button>
                            <Button
                                variant="contained"
                                onClick={onClose}
                                className="w-full bg-blue-500 text-white hover:bg-blue-600 transition"
                            >
                                Finish
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
};

export default EmotionCaptureModal;
