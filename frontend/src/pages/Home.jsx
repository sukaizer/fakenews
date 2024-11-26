import { useState, useEffect } from "react";
import "../styles/Home.css";
import ProfileForm from "../components/ProfileForm";
import api from "../api";
import VideoFeed from "../components/VideoFeed";
import VideoAnswer from "../components/VideoAnswer";

import thumbnail1 from "../assets/thumbnail1.png";
import thumbnail2 from "../assets/thumbnail2.png";
import thumbnail3 from "../assets/thumbnail3.png";
import thumbnail4 from "../assets/thumbnail4.png";
import thumbnail5 from "../assets/thumbnail5.png";
import thumbnail6 from "../assets/thumbnail6.png";
import thumbnail7 from "../assets/thumbnail7.png";
import thumbnail8 from "../assets/thumbnail8.png";

function Home() {
    const [content, setContent] = useState("unauthorized");
    const [password, setPassword] = useState("");
    const [profile, setProfile] = useState(null); // State to check if the user has a profile
    const [videoUrls, setVideoUrls] = useState([]);  // State for storing video URLs
    const [videos, setVideos] = useState([]); // State for storing video objects
    const [interactions, setInteractions] = useState({});
    const [thumbnails, setThumbnails] = useState([]);
    const [selectedScores, setSelectedScores] = useState([null, null, null, null, null, null, null, null]);
    const [confirmationPopup, setConfirmationPopup] = useState(false);

    useEffect(() => {
        setVideoUrls([
            "1. TikTok - Palestinian Health Ministry - Al Ahli.mp4",
            "2. X 16x9 IDF Spokesman - Al Ahli - 18-Oct-24.mp4",
            "3. TikTok - Pro-Pal Influencer - Al Ahli.mp4",
            "4. TikTok - Pro-Israel Influencer - Al-Ahli.mp4",
            "5. TikTok - Pro-Ukraine - Individual - Bucha.mp4",
            "6. TikTok - Pro-Russia - Official - Bucha.mp4",
            "7. TikTok - Pro-Ukraine - Official - Bucha.mp4",
            "8. Insta - 9x16 - Pro-Russia - VoxPop - Bucha.mp4",
        ]);
        setThumbnails([thumbnail1, thumbnail2, thumbnail3, thumbnail4, thumbnail5, thumbnail6, thumbnail7, thumbnail8]);
    }, []);

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const checkPassword = async () => {
        try {
            const res = await api.post('/api/verify-password/', { password });
            if (res.status === 200) {
                console.log("Password verified.");
                setContent("base");
            }
        } catch (error) {
            console.error('Incorrect password:', error.message);
            alert("Incorrect password. Please try again.");
        }
    };

    const navigateFurther = () => {
        setContent("profile");
    };

    const saveInteractions = (interactions) => {
        setContent("answer");
        setInteractions(interactions);
    };

    const saveScore = (score, index) => {
        setSelectedScores(prevScores => {
            const newScores = [...prevScores];
            newScores[index] = parseInt(score);
            console.log(index);
            
            return newScores;
        });
    };

    const handleDataSubmit = async () => {
        if (confirmationPopup) {

            try {
                const res = await api.post("/api/profile-info/", profile);
                if (res.status === 201) {
                    console.log("Profile info posted successfully.");
                } else {
                    alert("Failed to post profile info.");
                    return;
                }
    
                const interactionsArray = Object.values(interactions);
                const payload = interactionsArray.map((interaction, index) => ({
                    profile: res.data.id,
                    post: interaction.videoID,
                    like: interaction.liked,
                    bookmark: interaction.saved,
                    comment: interaction.comment,
                    share_platform: interaction.share.platform,
                    share_to: interaction.share.recipient,
                    time_spent: interaction.timeSpent,
                    watch_durations: interaction.watchDurations,
                    credibility_score: selectedScores[index + 1],
                }));
    
                for (const item of payload) {
                    await api.post('/api/interactions/', item);
                }
            } catch (err) {
                alert(err);
            }

            setContent("completed");
            //TODO maybe reset all state values ?
        } else {
            setConfirmationPopup(true);
        }
    };

    return (
        <>
            {content === "unauthorized" && (
                <div className="experiment-home">
                    <h1>Please enter password</h1>
                    <input
                    type="text"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password"
                    className='feed-form'
                />
                    <button onClick={checkPassword}>Enter</button>
                </div>
            )}

            {content === "base" && (
                <div className="experiment-home">
                    <h1>Please proceed to start the experiment</h1>
                    <button onClick={navigateFurther}>Start Experiment</button>
                </div>
            )}

            {content === "profile" && <ProfileForm setProfile={setProfile} setContent={setContent} />}

            {content === "completed" && (
                <div className="experiment-home">
                    <h1>Your responses have been recorded. <br /> Thank you for participating.</h1>
                </div>
            )}

            {content === "experiment" && (
                <>
                    <VideoFeed saveInteractions={saveInteractions} videoUrls={videoUrls} setVideos={setVideos} videos={videos} />
                </>
            )}

            {content === "answer" && (
                <>
                    <div className="thumbnail-title-content">
                        <h2>Please rate each of the 8 posts you just viewed</h2>
                        <p>If you'd like to see the video again, click on the thumbnail, and click again to stop</p>
                    </div>
                    {videos.map((video, index) => (
                        <VideoAnswer key={index} video={video} thumbnail={thumbnails[index]} saveScore={(score) => saveScore(score, index)} />
                    ))}
                    <div className="home-finalanswer">
                        {selectedScores.includes(null) && <p>Please give a credibility score to all the videos before submitting</p>}
                        {!selectedScores.includes(null) && <p>If you have provided credibility scores for all the posts and you wish to submit your answers, press <strong>Next</strong> below</p>}

                        <button className="submit-button" disabled={selectedScores.includes(null)} onClick={handleDataSubmit}>Next</button>
                    </div>
                    {confirmationPopup && (
                        <div className="confirmation-popup">
                            <div className="confirmation-popup-content">
                                <p>Please confirm you wish to submit your answers by pressing <strong>Next</strong> again</p>
                                <div className="confirmation-popup-buttons">
                                    <button className="popup-button button-ok" onClick={handleDataSubmit}>Next</button>
                                    <button className="popup-button button-close" onClick={() => setConfirmationPopup(false)}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    );
}

export default Home;
