import React, { useState } from 'react';
import '../styles/SharePopup.css';

// Import images for platforms
import facebookImage from '../assets/facebook.svg';
import instagramImage from '../assets/instagram.svg';
import whatsappImage from '../assets/whatsapp.svg';
import xImage from '../assets/x.svg';
import otherImage from '../assets/other.svg';


function SharePopup({ onSave, onClose }) {
    const [platform, setPlatform] = useState('');
    const [customPlatform, setCustomPlatform] = useState('');
    const [recipient, setRecipient] = useState('');
    const [customRecipient, setCustomRecipient] = useState('');
    const [groupRecipient, setGroupRecipient] = useState('');

    const handleSave = () => {

        if (!recipient || !platform || (recipient === 'other' && !customRecipient) || (platform === 'other' && !customPlatform)) {
            alert('Please fill in all required fields.');
            return;
        }

        let finalRecipient;
        const finalPlatform = platform === 'other' ? customPlatform : platform;

        if (recipient === 'particularGroup' && groupRecipient !== 'other') {
            finalRecipient = groupRecipient;
        } else if ((recipient === 'particularGroup' && groupRecipient === 'other') || (recipient === 'directMessage')) {
            finalRecipient = customRecipient;
        }

        onSave({ recipient: finalRecipient, platform: finalPlatform });
        onClose();
    };

    return (
        <div className="share-popup">
            <div className="share-popup-content">
                <h2>Share</h2>
                <div className="platform-buttons">
                    <button
                        onClick={() => setPlatform('facebook')}
                        className={platform === 'facebook' ? 'selected' : ''}
                    >
                        <img src={facebookImage} alt="facebook" />
                    </button>
                    <button
                        onClick={() => setPlatform('whatsapp')}
                        className={platform === 'whatsapp' ? 'selected' : ''}
                    >
                        <img src={whatsappImage} alt="Whatsapp" />
                    </button>
                    <button
                        onClick={() => setPlatform('instagram')}
                        className={platform === 'instagram' ? 'selected' : ''}
                    >
                        <img src={instagramImage} alt="Instagram" />
                    </button>
                    <button
                        onClick={() => setPlatform('x')}
                        className={platform === 'x' ? 'selected' : ''}
                    >
                        <img src={xImage} alt="X" />
                    </button>
                    <button
                        onClick={() => setPlatform('other')}
                        className={platform === 'other' ? 'selected' : ''}
                    >
                        <img src={otherImage} alt="other" />
                    </button>
                </div>
                {platform === 'other' && (
                    <input
                        type="text"
                        placeholder="Or enter custom platform"
                        value={customPlatform}
                        onChange={(e) => setCustomPlatform(e.target.value)}
                        className='feed-form'
                    />
                )}
                <select value={recipient} onChange={(e) => setRecipient(e.target.value)}>
                    <option disabled value="">Select Recipient</option>
                    <option value="finalAnswer">All contacts</option>
                    <option value="particularGroup">Particular Group</option>
                    <option value="directMessage">Direct Message</option>
                </select>

                {recipient === 'particularGroup' && (
                    <select value={groupRecipient} onChange={(e) => setGroupRecipient(e.target.value)}>
                        <option disabled value="">Select Group</option>
                        <option value="friends">Friends</option>
                        <option value="family">Family</option>
                        <option value="classmates">Classmates</option>
                        <option value="other">Other (e.g. colleagues etc)</option>
                    </select>
                )}
                {recipient === 'particularGroup' && groupRecipient === 'other' && (
                    <input
                        type="text"
                        placeholder="Or enter custom recipient"
                        value={customRecipient}
                        onChange={(e) => setCustomRecipient(e.target.value)}
                        className='feed-form'
                    />
                )}
                {recipient === 'directMessage' && (
                    <input
                        type="text"
                        placeholder="Enter recipient category (e.g. friend, classmate etc)"
                        value={customRecipient}
                        onChange={(e) => setCustomRecipient(e.target.value)}
                        className='feed-form'
                    />
                )}
                <div className="share-popup-button-section">
                    <button className='popup-button button-ok' onClick={handleSave}>Share</button>
                    <button className='popup-button button-close' onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default SharePopup;