import React from 'react';

const CommentItem = ({ author, text, date }) => {
    return (
        <div className="py-4 border-b border-gray-200 last:border-0">
            <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-gray-800">{author}</span>
                <span className="text-xs text-gray-500">{date}</span>
            </div>
            <p className="text-gray-700">{text}</p>
        </div>
    );
};

export default CommentItem;