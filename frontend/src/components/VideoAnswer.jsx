import React, { useState, useEffect, useRef } from "react";
import "../styles/VideoAnswer.css";

function VideoAnswer({ video, thumbnail, saveScore }) {
    const [selectedScore, setSelectedScore] = useState(""); // State to track the selected score
    const [isFullscreen, setIsFullscreen] = useState(false); // State to control fullscreen mode
    const swipeStartRef = useRef(0); // To store the initial touch position
    const isTapRef = useRef(false);  // Track if it's a tap or swipe

    const loadVideo = () => {
        setIsFullscreen(true); // Enter fullscreen mode
        document.body.classList.add('no-scroll'); // Disable scrolling
    };

    const handleScoreChange = (event) => {
        setSelectedScore(event.target.value); // Update the selected score
        saveScore(event.target.value);
    };

    const exitFullscreen = () => {
        setIsFullscreen(false); // Exit fullscreen mode
        document.body.classList.remove('no-scroll'); // Enable scrolling
    };

    const handleTouchStart = (e) => {
        // Store the starting position of the touch (Y-axis)
        swipeStartRef.current = e.changedTouches[0].clientY;
        isTapRef.current = true;  // Assume it's a tap unless proven otherwise
    };

    const handleTouchEnd = (e) => {
        // Capture the position on touch end
        const swipeEnd = e.changedTouches[0].clientY;
        const touchDistance = Math.abs(swipeEnd - swipeStartRef.current);
        // If the touch distance is small, it's a tap, so we prevent the default swipe action
        if (touchDistance < 10) {
            isTapRef.current = true;
            e.preventDefault();  // Prevent the default swipe behavior for tap detection
        } else {
            isTapRef.current = false;  // It's a swipe, not a tap
        }
        // If it's a tap, load the video
        if (isTapRef.current) {
            loadVideo();
        }
    };

    const credibilityOptions = [
        { value: 7, label: '7 - Completely Trustworthy' },
        { value: 6, label: '6 - Very Trustworthy' },
        { value: 5, label: '5 - Somewhat Trustworthy' },
        { value: 4, label: '4 - Neither Trustworthy Nor Untrustworthy' },
        { value: 3, label: '3 - Somewhat Untrustworthy' },
        { value: 2, label: '2 - Very Untrustworthy' },
        { value: 1, label: '1 - Completely Untrustworthy' }
    ];

    return (
        <div className="video-answer-container">
            <div className="video-answer-image">
                <img
                    src={thumbnail}
                    alt="thumbnail"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    draggable="false"
                />
            </div>
            <div className="video-answer-question">
                <p>Please rate this post</p>
                <select
                    value={selectedScore}
                    onChange={handleScoreChange}
                    className="credibility-dropdown"
                >
                    <option value="" disabled>Select an option</option>
                    {credibilityOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
            </div>
            <hr className="separator" />
            {isFullscreen && (
                <div className="fullscreen-video-container" onTouchStart={exitFullscreen}>
                    <video src={video} autoPlay disablePictureInPicture className="fullscreen-video" />
                </div>
            )}
        </div>
    );
}

export default VideoAnswer;