import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import api from "../api";
import "../styles/VideoFeed.css";

import CommentPopup from './CommentPopup';
import SharePopup from './SharePopup';


import likeImage from '../assets/like.svg';
import saveImage from '../assets/save.svg';
import commentImage from '../assets/comment.svg';
import shareImage from '../assets/share.svg';


function VideoFeed({ videoUrls, saveInteractions, setVideos, videos}) {
    const [videoIds, setVideoIds] = useState([]);

    const [currentIndex, setCurrentIndex] = useState(0);  // Track the active slide index
    const [interactions, setInteractions] = useState({});
    
    const [loading, setLoading] = useState(true);  // Loading state for fetching videos
    const [showCommentPopup, setShowCommentPopup] = useState(false);
    const [showSharePopup, setShowSharePopup] = useState(false);
    const [showEndButton, setshowEndButton] = useState(false);
    const [confirmationPopup, setConfirmationPopup] = useState(false);
    const delay = ms => new Promise(res => setTimeout(res, ms));

    const videoRefs = useRef([]);  // Store references to each video element
    const swipeStartRef = useRef(0); // To store the initial touch position
    const isTapRef = useRef(false);  // Track if it's a tap or swipe
    const hasFetchedVideos = useRef(false); // Flag to ensure videos are fetched only once because of strict mode DEBUG

    const [entryTime, setEntryTime] = useState(Date.now());
    const [currentVideoPaused, setCurrentVideoPaused] = useState(false);

    const TIMETHRESHOLD = 2000;
    
    // Function to load and preload videos
    const preloadVideos = async () => {
        if (hasFetchedVideos.current) return; // Prevent multiple fetches DEBUG
        hasFetchedVideos.current = true;

        const fetchedVideos = [];
        try {
            for (const videoKey of videoUrls) {
                const response = await api.get(`/api/video/${videoKey}/`, {
                    responseType: 'blob'
                });
                if (response.status === 200) {
                    const videoObjectUrl = URL.createObjectURL(response.data);
                    fetchedVideos.push(videoObjectUrl);
                    console.log("Fetched video:", videoKey);
                } else {
                    throw new Error('Failed to fetch video');
                }
            }
            setVideos(fetchedVideos);  // Set video URLs after fetching
        } catch (err) {
            console.error("Error fetching video:", err.message);
        } finally {
            const ids = videoUrls.map(video => video.substring(0, 1));
            setVideoIds(ids);
            const initialInteractions = videoUrls.reduce((acc, _, index) => {
                acc[index] = { liked: false, saved: false, comment: '', share : {
                    recipient: '',
                    platform: '', },
                videoID: ids[index], 
                timeSpent: 0,
                watchDurations: [],       
                };
                return acc;
            }, {});
            setInteractions(initialInteractions);
            setLoading(false);
        }
    };


    useEffect(() => {
        preloadVideos();  // Call the function to preload videos when component mounts
    }, []);

    const handleSlideChange = (swiper) => {
        const newIndex = swiper.activeIndex;

        updateTimeSpent();
    
        // Reset entry time for the new video
        setEntryTime(Date.now());
    
        setCurrentIndex(newIndex);
    
        videoRefs.current.forEach((video, index) => {
            if (video) {
                if (index === newIndex) {
                    video.play();
                } else {
                    video.pause();
                    video.currentTime = 0;
                }
            }
        });
    
        setshowEndButton(newIndex === videos.length - 1);
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

        // If it's a tap, toggle the video playback
        if (isTapRef.current) {
            const activeVideo = videoRefs.current[currentIndex];
            if (activeVideo) {
                if (activeVideo.paused) {
                    activeVideo.play();  // Resume playback if paused
                    setCurrentVideoPaused(false);
                } else {
                    activeVideo.pause();  // Pause playback if playing
                    setCurrentVideoPaused(true);
                }
            }
        }
    };

    const handleLike = () => {
        setInteractions(prev => ({
            ...prev,
            [currentIndex]: {
                ...prev[currentIndex],
                liked: !prev[currentIndex].liked
            }
        }));
    };

    const handleSave = () => {
        setInteractions(prev => ({
            ...prev,
            [currentIndex]: {
                ...prev[currentIndex],
                saved: !prev[currentIndex].saved
            }
        }));
    };

    const handleComment = () => {
        setShowCommentPopup(true);
    };

    const handleSaveComment = (comment) => {
        setInteractions(prev => ({
            ...prev,
            [currentIndex]: {
                ...prev[currentIndex],
                comment
            }
        }));
    };

    const handleShare = () => {
        setShowSharePopup(true);
    };

    const handleSaveShare = (share) => {
        setInteractions(prev => ({
            ...prev,
            [currentIndex]: {
                ...prev[currentIndex],
                share
            }
        }));
    };

    const updateTimeSpent = async () => {
        const currentTimeSpent = Date.now() - entryTime;
        if (currentTimeSpent >= TIMETHRESHOLD) {          
            setInteractions(prevInteractions => ({
                ...prevInteractions,
                [currentIndex]: {
                    ...prevInteractions[currentIndex],
                    watchDurations: [
                        ...prevInteractions[currentIndex].watchDurations, 
                        currentTimeSpent
                    ]
                }
            }));

            const totalWatchDuration = interactions[currentIndex]?.watchDurations.reduce((acc, duration) => acc + duration, 0) || 0;

            setInteractions(prevInteractions => ({
                ...prevInteractions,
                [currentIndex]: {
                    ...prevInteractions[currentIndex],
                    timeSpent: totalWatchDuration + currentTimeSpent
                }
            }));
        }
    };

    const handleSaveInteractions = async () => {   
        if(confirmationPopup) {
            saveInteractions(interactions);
        } else {
            updateTimeSpent();
            setConfirmationPopup(true);
        }
    };

    return (
        <>
            {loading ? (
                <div className="loading-spinner"></div>
            ) : (
                <Swiper
                    direction="vertical"
                    spaceBetween={0}
                    slidesPerView={1}
                    loop={false}
                    style={{ height: '100vh' }}
                    modules={[Navigation]}  // Removed Pagination module to hide pagination
                    onSlideChange={handleSlideChange}  // Handle slide change event
                >
                    {videos.map((video, index) => (
                        <SwiperSlide key={index}>
                            <div 
                                // className={`video-container ${showCommentPopup ? 'swiper-no-swiping' : ''}`}
                                className='video-container'
                                onTouchStart={handleTouchStart}  // Capture touch start
                                onTouchEnd={handleTouchEnd}      // Handle touch end to detect tap
                            >
                                <video
                                    ref={(el) => (videoRefs.current[index] = el)}  // Store ref to each video
                                    src={video}
                                    autoPlay={index === 0}
                                    loop
                                    controls={false}
                                    className="video"
                                    disablePictureInPicture
                                />
                            </div>
                            <div className="interaction-buttons">
                                <button onClick={handleLike} className={interactions[index]?.liked ? 'button-clicked' : 'button-normal'}>
                                    <img src={likeImage} alt="like" />
                                </button>
                                <button onClick={handleSave} className={interactions[index]?.saved ? 'button-clicked' : 'button-normal'}>
                                    <img src={saveImage} alt="save" />
                                </button>
                                <button onClick={handleComment} className='button-normal'>
                                    <img src={commentImage} alt="comment" />
                                </button>
                                <button onClick={handleShare} className='button-normal'>
                                    <img src={shareImage} alt="share" />
                                </button>
                            </div>
                            {showEndButton && (
                                <div className='end-button-container'>
                                    <button onClick={handleSaveInteractions}>Next</button>
                                </div>
                            )}


                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
            {showCommentPopup && (
                <CommentPopup
                    comment={interactions[currentIndex]?.comment || ''}
                    onSave={handleSaveComment}
                    onClose={() => setShowCommentPopup(false)}
                />
            )}
            {showSharePopup && (
                <SharePopup
                    onSave={handleSaveShare}
                    onClose={() => setShowSharePopup(false)}
                />
            )}
            {confirmationPopup && (
                <div className="confirmation-popup">
                    <div className="confirmation-popup-content">
                        <p>If you have finished viewing the posts and are ready to move on to the next section, press <strong>Next</strong> below</p>
                        <div className="confirmation-popup-buttons">
                            <button className="popup-button button-ok" onClick={handleSaveInteractions}>Next</button>
                            <button className="popup-button button-close" onClick={() => setConfirmationPopup(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

        </>
    );
}

export default VideoFeed;