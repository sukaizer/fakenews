import React, { useState } from 'react';
import '../styles/CommentPopup.css';

function CommentPopup({ comment, onSave, onClose }) {
    const [text, setText] = useState(comment);

    const handleSave = () => {
        onSave(text);
        onClose();
    };

    return (
        <div className="comment-popup">
            <div className="comment-popup-content">
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Write your comment..."
                />
                <div className='comment-popup-button-section'>
                    <button className='popup-button button-ok' onClick={handleSave}>Post</button>
                    <button className='popup-button button-close' onClick={onClose}>Cancel</button>
                </div>
                <div className="comment-display">
                    <p>{comment === '' ? comment : localStorage.getItem('username') + " : " + comment}</p>
                </div>
            </div>
        </div>
    );
}

export default CommentPopup;