import React, { useState } from 'react';
import CommentItem from './CommentItem';
import { useAuth } from '../../hooks/useAuth'; 

const CommentList = ({ articleId, initialComments = [] }) => {
    const { user } = useAuth();

    const [comments, setComments] = useState(initialComments);
    const [newComment, setNewComment] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        const comment = {
            id: Date.now(),
            author: user.name,
            text: newComment,
            date: new Date().toLocaleDateString()
        };

        setComments([comment, ...comments]);
        setNewComment('');
    };

    return (
        <div className="mt-10">
            <h3 className="text-2xl font-bold mb-6">Коментарі ({comments.length})</h3>

            {user && user.role !== 'Незареєстрований' ? (
                <form onSubmit={handleSubmit} className="mb-8">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Напишіть свою думку..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        rows="3"
                    />
                    <button
                        type="submit"
                        className="mt-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Відправити
                    </button>
                </form>
            ) : (
                <div className="bg-gray-50 p-6 rounded-lg text-center mb-8 border border-gray-200">
                    <p className="text-gray-600 mb-4">Тільки зареєстровані користувачі можуть залишати коментарі.</p>
                    <button className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-900">
                        Увійти або зареєструватися
                    </button>
                </div>
            )}

            <div className="space-y-2">
                {comments.map((comment) => (
                    <CommentItem key={comment.id} {...comment} />
                ))}
            </div>
        </div>
    );
};

export default CommentList;