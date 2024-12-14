"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";

type FormValues = {
    name: string;
    email: string;
    message: string;
};

const ContactUsPage: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>();

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        console.log(data);
        // Replace with actual API endpoint
        const response = await fetch("/api/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            alert("Message sent successfully!");
        } else {
            alert("Failed to send message. Please try again.");
        }
    };

    return (
        <div className="relative text-white min-h-screen py-16 px-8 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-3xl opacity-30 animate-floating"></div>
                <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-3xl opacity-20 animate-floating delay-2000"></div>
                <div className="absolute inset-0 bg-[url('/path-to-starfield.png')] bg-cover opacity-10"></div>
            </div>

            <div className="relative max-w-4xl mx-auto z-10 space-y-16">
                {/* Header Section */}
                <header className="text-center">
                    <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent animate-gradient-move">
                        Contact Us
                    </h1>
                    <p className="mt-4 text-lg md:text-xl text-gray-300">
                        We&lsquo;re here to help! Reach out to us with any questions or feedback.
                    </p>
                </header>

                {/* Contact Form */}
                <section>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-8 bg-gradient-to-br from-purple-800 via-purple-900 to-indigo-900 p-8 rounded-lg shadow-lg"
                    >
                        <div className="space-y-4">
                            {/* Name Field */}
                            <label className="block">
                                <span className="block text-lg font-medium text-gray-200">
                                    Your Name
                                </span>
                                <input
                                    type="text"
                                    {...register("name", { required: "Name is required" })}
                                    className={`w-full mt-2 p-4 bg-black/30 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.name ? "border-red-500" : ""
                                        }`}
                                    placeholder="Enter your name"
                                />
                                {errors.name && (
                                    <p className="mt-2 text-sm text-red-400">
                                        {errors.name.message}
                                    </p>
                                )}
                            </label>

                            {/* Email Field */}
                            <label className="block">
                                <span className="block text-lg font-medium text-gray-200">
                                    Your Email
                                </span>
                                <input
                                    type="email"
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                            message: "Enter a valid email address",
                                        },
                                    })}
                                    className={`w-full mt-2 p-4 bg-black/30 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.email ? "border-red-500" : ""
                                        }`}
                                    placeholder="Enter your email"
                                />
                                {errors.email && (
                                    <p className="mt-2 text-sm text-red-400">
                                        {errors.email.message}
                                    </p>
                                )}
                            </label>

                            {/* Message Field */}
                            <label className="block">
                                <span className="block text-lg font-medium text-gray-200">
                                    Your Message
                                </span>
                                <textarea
                                    {...register("message", { required: "Message is required" })}
                                    className={`w-full mt-2 p-4 bg-black/30 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-32 resize-none ${errors.message ? "border-red-500" : ""
                                        }`}
                                    placeholder="Enter your message"
                                ></textarea>
                                {errors.message && (
                                    <p className="mt-2 text-sm text-red-400">
                                        {errors.message.message}
                                    </p>
                                )}
                            </label>
                        </div>

                        <div className="text-center">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`px-10 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg transform transition-transform hover:scale-110 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                            >
                                {isSubmitting ? "Sending..." : "Send Message"}
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </div>
    );
};

export default ContactUsPage;
