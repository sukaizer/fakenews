import React, { useState, useEffect } from 'react';
import api from "../api";


function VideoPlayer ({ videoKey }) {
    const [videoUrl, setVideoUrl] = useState(null);  // State to store video URL
    const [isLoading, setIsLoading] = useState(true);  // State for loading status
    const [error, setError] = useState(null);  // State to capture any errors

    useEffect(() => {
        const fetchVideoUrl = async () => {
            try {
                setIsLoading(true);  // Start loading
                const response = await api.get(`/api/video/${videoKey}/`, {
                    responseType: 'blob' // Specify the response type as 'blob'
                });
                if (response.status === 200) {
                    // Create an object URL for the Blob (video data)
                    const videoObjectUrl = URL.createObjectURL(response.data);

                    // Set the video URL in the state
                    setVideoUrl(videoObjectUrl);
                } else {
                    throw new Error('Failed to fetch video');
                }
            } catch (err) {
                setError(err.message);  // Capture error
            } finally {
                setIsLoading(false);  // Stop loading
            }
        };

        fetchVideoUrl();
    }, [videoKey]);  // Only run this effect when the videoKey changes

    if (error) {
        return <div>Error: {error}</div>;  // Display error if fetch fails
    }

    return (
        <div>
            {isLoading ? (
                <p>Loading video...</p>  // Show loading text while video is loading
            ) : (
                <video controls>
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            )}
        </div>
    );
};

export default VideoPlayer;
