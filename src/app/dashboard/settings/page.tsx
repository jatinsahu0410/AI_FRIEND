/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { CldUploadButton } from 'next-cloudinary'
import { Button, Slider } from '@mui/material'
import { CloudUploadOutlined, Clear } from '@mui/icons-material'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import { useUser } from '@clerk/nextjs'
import { setUserData } from '@/store/userSlice'

const ProfileEditForm: React.FC = () => {
    const { control, handleSubmit, setValue, formState: { isDirty } } = useForm()
    const [selectedInterests, setSelectedInterests] = useState<string[]>([])
    const [customInterestInput, setCustomInterestInput] = useState('')
    const [customInterests, setCustomInterests] = useState<string[]>([])
    const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null)
    const [customOpen, setCustomOpen] = useState(false)
    const [changed, setChanged] = useState(false);
    const { user } = useUser();
    const router = useRouter();
    const dispatch = useDispatch();

    // Get user data from Redux store
    const userInfo = useSelector((state: RootState) => state.user.userData)

    useEffect(() => {
        if (userInfo) {
            // Initialize form with existing user data
            setValue('firstName', userInfo.firstName)
            setValue('lastName', userInfo.lastName)
            setProfilePicUrl(userInfo.profilePic || `https://api.dicebear.com/5.x/initials/svg?seed=${userInfo.firstName}%20${userInfo.lastName}`)
            setSelectedInterests(userInfo.profile?.interest || [])
            setValue('gender', userInfo.profile?.gender)
        }
    }, [userInfo, setValue])

    const handleInterestChange = (interest: string) => {
        if (selectedInterests.includes(interest)) {
            setChanged(true);
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

    const handleRest = () => {
        if (userInfo) {
            setValue('firstName', userInfo.firstName)
            setValue('lastName', userInfo.lastName)
            setProfilePicUrl(userInfo.profilePic || `https://api.dicebear.com/5.x/initials/svg?seed=${userInfo.firstName}%20${userInfo.lastName}`)
            setSelectedInterests(userInfo.profile?.interest || [])
            setValue('gender', userInfo.profile?.gender)
        }
        setChanged(false);
    }

    const uploadImage = (result: any) => {
        setChanged(true);
        setProfilePicUrl(result?.info?.secure_url);
    }

    const onSubmit = async (data: any) => {
        const formData = {
            ...data,
            selectedInterests,
            profilePicUrl,
        }
        console.log('Form Data:', formData);

        try {
            const res = await fetch('/api/update-profile', {
                method: 'POST',
                headers: {
                    'content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.id}`
                },
                body: JSON.stringify(formData)
            });

            // after the response 
            const response = await res.json();
            console.log("The res is : ", response);
            if (res.ok) {
                dispatch(setUserData(response.data));
                router.push('/dashboard/profile');
            }
        } catch (error) {
            console.log("Error in update profile : ", error);
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
                className="w-[80%] bg-[#1e1e2f] p-8 rounded-lg shadow-lg space-y-6"
            >
                <h2 className="text-purple-400 text-3xl font-bold mb-6">Edit Profile</h2>

                {/* Profile Picture */}
                <div>
                    {profilePicUrl && (
                        <div className="mt-4 mb-2 flex justify-center">
                            <Image
                                src={profilePicUrl}
                                alt="Profile"
                                className="rounded-full shadow-lg border border-purple-500"
                                width={148}
                                height={148}
                            />
                        </div>
                    )}
                    <div className='flex w-full'>
                        <CldUploadButton
                            uploadPreset="aifriend"
                            onSuccess={uploadImage}
                            className='items-center justify-center mx-auto'
                        >
                            <button
                                type="button"
                                className="flex items-center justify-center px-4 py-2 bg-purple-500 text-white rounded-lg shadow-md hover:bg-purple-400"
                            >
                                <CloudUploadOutlined className="mr-2" /> Update Image
                            </button>
                        </CldUploadButton>
                    </div>
                </div>
                {/* Full Name Input */}
                <div className='flex flex-row gap-x-2 justify-between'>
                    <div>
                        <label className="text-white">First Name</label>
                        <Controller
                            name="firstName"
                            control={control}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    placeholder="First Name"
                                    className="w-full px-4 py-2 rounded-lg border bg-[#292942] text-white focus:ring-2 focus:ring-purple-400"
                                />
                            )}
                        />
                    </div>
                    <div>
                        <label className="text-white">Last Name</label>
                        <Controller
                            name="lastName"
                            control={control}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    placeholder="Last Name"
                                    className="w-full px-4 py-2 rounded-lg border bg-[#292942] text-white focus:ring-2 focus:ring-purple-400"
                                />
                            )}
                        />
                    </div>
                </div>
                {/* Gender */}
                <div className='mt-2'>
                    <label className="text-white">Gender</label>
                    <Controller
                        name="gender"
                        control={control}
                        render={({ field }) => (
                            <select
                                {...field}
                                className="w-full px-4 py-2 rounded-lg border border-purple-500 bg-[#292942] text-white focus:ring-2 focus:ring-purple-400">
                                <option value="female">Female</option>
                                <option value="male">Male</option>
                                <option value="other">others</option>
                            </select>
                        )}
                    />
                </div>
                {/* Interests Selection */}
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
                                : 'bg-[#292942] text-white hover:bg-purple-400'}`} >
                            Add Other
                        </button>
                    </div>
                </div>

                {/* Custom Interest Input */}
                {customOpen && (
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
                )}

                {/* Emotional Connect */}
                <div>
                    <label className="text-white">Emotional Connect</label>
                    <Controller
                        name="emotionalConnect"
                        control={control}
                        defaultValue={userInfo?.profile?.emotions || 50}
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

                {/* Submit & Reset Buttons */}
                <div className="flex justify-between">
                    <Button
                        variant="outlined"
                        onClick={() => handleRest()}
                        className="text-white border-purple-500 hover:border-purple-400"
                    >
                        Reset
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={!isDirty && changed === false}
                        className="bg-orange-500 hover:bg-orange-400 text-white"
                    >
                        Save
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default ProfileEditForm
