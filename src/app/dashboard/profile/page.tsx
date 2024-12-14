'use client'
import { RootState } from '@/store'
import React from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { Edit } from '@mui/icons-material'
import Image from 'next/image'

const MyProfile = () => {
    // get the user data from the Redux store
    const userInfo = useSelector((state: RootState) => state.user)
    const router = useRouter()

    const handleEditClick = () => {
        // Redirecting to the settings page
        router.push('/dashboard/settings')
    }

    return (
        <>
            {
                !userInfo.userData ? (
                    <div className="flex h-screen w-full items-center justify-center">
                        <span className="loader"></span>
                    </div>
                ) : (
                    <div className="h-[calc(100vh-4rem)] flex justify-center items-center p-6">
                        <div className="w-full max-w-4xl rounded-xl p-8 text-white space-y-6">
                            {/* Profile Picture */}
                            <div className="flex flex-col items-center mt-16">
                                <Image
                                    src={
                                        userInfo.userData?.profilePic ||
                                        `https://api.dicebear.com/5.x/initials/svg?seed=${userInfo.userData?.firstName}%20${userInfo.userData?.lastName}`
                                    }
                                    alt="Profile"
                                    className="w-56 h-56 rounded-full shadow-lg shadow-purple-500 object-cover object-top"
                                    width={148}
                                    height={132}
                                />
                                <h2 className="text-3xl font-bold mt-4">{`${userInfo.userData?.firstName || ''} ${userInfo.userData?.lastName || ''
                                    }`}</h2>
                                <p
                                    className="px-6 py-2 mt-2 rounded-full border border-purple-500 bg-[#1f1d2b] text-purple-400 hover:bg-purple-500 hover:text-white transition"
                                >
                                    {userInfo.userData.profile?.gender}
                                </p>
                            </div>

                            {/* Profile Information */}
                            <div className="space-y-8">
                                {/* Interests */}
                                <div>
                                    <h3 className="text-lg font-semibold text-purple-400 mb-4">Interests</h3>
                                    <div className="flex flex-wrap gap-4">
                                        {userInfo.userData?.profile?.interest?.length ? (
                                            userInfo.userData.profile.interest.map((interest, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-4 py-2 rounded-full border border-purple-500 bg-[#1f1d2b] text-purple-400 hover:bg-purple-500 hover:text-white transition"
                                                >
                                                    {interest}
                                                </span>
                                            ))
                                        ) : (
                                            <p className="text-gray-500">No interests specified.</p>
                                        )}
                                    </div>
                                </div>

                                {/* Emotional Connect */}
                                <div>
                                    <h3 className="text-lg font-semibold text-purple-400 mb-4">Emotional Connect</h3>
                                    <div className="w-full">
                                        <div className="relative">
                                            <input
                                                type="range"
                                                className="w-full h-2 rounded-lg appearance-none bg-gray-700 accent-orange-500"
                                                min="0"
                                                max="100"
                                                value={userInfo.userData?.profile?.emotions || 50}
                                                readOnly
                                            />
                                            <div className="absolute left-1/2 transform -translate-x-1/2 top-[-24px] text-orange-500 font-bold text-sm">
                                                {userInfo.userData?.profile?.emotions || 50}%
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Edit Button */}
                            <div className="flex justify-end">
                                <button
                                    onClick={handleEditClick}
                                    className="px-6 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-400 flex items-center gap-2"
                                >
                                    <Edit className="text-lg" />
                                    Edit Profile
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default MyProfile
