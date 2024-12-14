/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { CldUploadWidget } from 'next-cloudinary'
import { Button, Slider } from '@mui/material'
import { CloudUploadOutlined, Clear } from '@mui/icons-material'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'


const OnboardingForm: React.FC = () => {
    const { register, handleSubmit, control, reset } = useForm()
    const [selectedInterests, setSelectedInterests] = useState<string[]>([])
    const [customInterestInput, setCustomInterestInput] = useState('')
    const [customInterests, setCustomInterests] = useState<string[]>([])
    const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null)
    const [customOpen, setCustomOpen] = useState(false);
    const router = useRouter();
    const { user } = useUser();

    const handleInterestChange = (interest: string) => {
        if (selectedInterests.includes(interest)) {
            setSelectedInterests(selectedInterests.filter(i => i !== interest))
        } else if (selectedInterests.length < 4) {
            setSelectedInterests([...selectedInterests, interest])
        }
    }

    const handleCustomInterestAdd = () => {
        if (
            customInterestInput.trim() &&
            !customInterests.includes(customInterestInput) &&
            selectedInterests.length < 4
        ) {
            const newInterests = [...customInterests, customInterestInput.trim()]
            setCustomInterests(newInterests)
            setSelectedInterests([...selectedInterests, customInterestInput.trim()])
            setCustomInterestInput('')
        }
    }

    const handleCustomInterestRemove = (interest: string) => {
        setCustomInterests(customInterests.filter(ci => ci !== interest))
        setSelectedInterests(selectedInterests.filter(si => si !== interest))
    }

    const onSubmit = async (data: any) => {
        const formData = {
            ...data,
            selectedInterests,
            profilePicUrl,
        }
        console.log('Form Data:', formData)

        // call the update onboarding api 
        try {
            const res = await fetch('/api/update-onboarding',
                {
                    method: 'POST',
                    headers: {
                        'content-Type': 'application/json',
                        'Authorization': `Bearer ${user?.id}`
                    },  
                    body: JSON.stringify(formData),
                }
            );
            const data = await res.json();
            console.log('Response Data:', data); // Ensure you log the response data

            if (res.ok) {
                router.push('/dashboard/chatbots'); // Use router for navigation
                console.log('Redirecting to dashboard...');
            } else {
                console.error('Unexpected response status:', data);
            }
        } catch (error: any) {
            console.error('Onboarding Error:', error.response?.data || error.message || error);
        }
    }

    const interests = [
        'Gaming', 'Music', 'Travel', 'Cooking', 'Fitness',
        'Art', 'Movies', 'Reading', 'Writing', 'Tech'
    ]

    return (
        <div className="flex justify-center items-center">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-3/4 max-w-2xl bg-[#1e1e2f] p-8 rounded-lg shadow-lg space-y-6"
            >
                <h2 className="text-purple-400 text-3xl font-bold mb-6">Onboarding</h2>

                {/* Gender Selection */}
                <div>
                    <label className="text-white">Gender</label>
                    <select
                        {...register('gender')}
                        className="w-full px-4 py-2 rounded-lg border border-purple-500 bg-[#292942] text-white focus:ring-2 focus:ring-purple-400"
                    >
                        <option value="" disabled selected>Select Your Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">others</option>
                    </select>
                </div>

                {/* Interests */}
                <div>
                    <label className="text-white">Select Your Interests (max 4)</label>
                    <div className="flex flex-wrap gap-3 mt-2">
                        {interests.map(interest => (
                            <button
                                key={interest}
                                type="button"
                                onClick={() => handleInterestChange(interest)}
                                className={`px-4 py-2 rounded-full border ${selectedInterests.includes(interest)
                                    ? 'bg-purple-500 text-white'
                                    : 'bg-[#292942] text-white hover:bg-purple-400'
                                    }`}
                            >
                                {interest}
                            </button>
                        ))}
                        <button
                            onClick={() => setCustomOpen(!customOpen)}
                            className={`px-4 py-2 rounded-full border ${customOpen ? 'bg-purple-500 text-white'
                                : 'bg-[#292942] text-white hover:bg-purple-400'}`}>
                            Others
                        </button>
                    </div>
                </div>

                {/* Custom Interest Input */}
                {
                    customOpen ? (
                        <div className="mt-4">
                            <label className="text-white">Add Custom Interests</label>
                            <div className="flex items-center gap-2 mt-2">
                                <input
                                    type="text"
                                    placeholder="Type and press Add"
                                    value={customInterestInput}
                                    onChange={(e) => setCustomInterestInput(e.target.value)}
                                    className="flex-1 px-4 py-2 rounded-lg border border-purple-500 bg-[#292942] text-white focus:ring-2 focus:ring-purple-400"
                                />
                                <Button
                                    onClick={handleCustomInterestAdd}
                                    disabled={!customInterestInput || selectedInterests.length >= 4}
                                    className="bg-orange-500 hover:bg-orange-400 text-white px-4 py-2 rounded-lg"
                                >
                                    Add
                                </Button>
                            </div>

                            {/* Display Custom Interests */}
                            <div className="flex flex-wrap gap-2 mt-4">
                                {customInterests.map((interest, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-2 bg-purple-500 text-white px-3 py-1 rounded-full"
                                    >
                                        <span>{interest}</span>
                                        <button
                                            onClick={() => handleCustomInterestRemove(interest)}
                                            className="text-white hover:text-gray-300"
                                        >
                                            <Clear fontSize="small" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (<div></div>)
                }

                {/* Emotional Connect */}
                <div>
                    <label className="text-white">Emotional Connect</label>
                    <Controller
                        name="emotionalConnect"
                        control={control}
                        defaultValue={50}
                        render={({ field }) => (
                            <Slider
                                {...field}
                                valueLabelDisplay="auto"
                                min={0}
                                max={100}
                                sx={{
                                    color: '#FF5722',
                                    height: 8,
                                    '& .MuiSlider-thumb': {
                                        width: 24,
                                        height: 24,
                                    },
                                }}
                            />
                        )}
                    />
                </div>

                {/* Profile Picture */}
                <div>
                    <label className="text-white">Profile Picture (Optional)</label>
                    <CldUploadWidget
                        uploadPreset="aifriend"
                        onUpload={(result: any) => setProfilePicUrl(result.info.secure_url)}
                    >
                        {({ open }) => (
                            <button
                                type="button"
                                onClick={() => open()}
                                className="flex items-center justify-center w-full px-4 py-2 bg-purple-500 text-white rounded-lg shadow-md hover:bg-purple-400"
                            >
                                <CloudUploadOutlined className="mr-2" /> Upload Image
                            </button>
                        )}
                    </CldUploadWidget>
                    {profilePicUrl && (
                        <div className="mt-4 flex justify-center">
                            <Image
                                src={profilePicUrl}
                                alt="Profile"
                                className="w-32 h-32 rounded-full shadow-lg border border-purple-500"
                            />
                        </div>
                    )}
                </div>

                {/* Submit & Reset Buttons */}
                <div className="flex justify-between">
                    <Button
                        variant="outlined"
                        onClick={() => reset()}
                        className="text-white border-purple-500 hover:border-purple-400"
                    >
                        Reset
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        className="bg-orange-500 hover:bg-orange-400 text-white"
                    >
                        Save
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default OnboardingForm
