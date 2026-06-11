import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';

const ForumThread = () => {
    const { id } = useParams();
    const { canUseForum } = usePermissions();

    const [topic, setTopic] = useState(null);
    const [messages, setMessages] = useState([]);
    const [replyText, setReplyText] = useState('');

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        const fetchThreadData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${API_URL}/forum/topics/${id}`);

                if (!response.ok) {
                    if (response.status === 404) throw new Error('Тему не знайдено');
                    throw new Error('Помилка завантаження теми');
                }

                const data = await response.json();
                setTopic(data);
                setMessages(data.messages || []);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchThreadData();
    }, [id, API_URL]);

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        if (!replyText.trim()) return;

        setIsSubmitting(true);
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`${API_URL}/forum/topics/${id}/replies`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ text: replyText })
            });

            if (!response.ok) throw new Error('Не вдалося відправити повідомлення');

            const newMessage = await response.json();

            setMessages([...messages, newMessage]);
            setReplyText('');
        } catch (err) {
            alert(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="text-center py-20 text-gray-500 animate-pulse">Завантаження обговорення...</div>;

    if (error || !topic) {
        return (
            <div className="max-w-3xl mx-auto py-20 text-center">
                <span className="text-4xl block mb-4">💬</span>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{error || 'Тему не знайдено'}</h2>
                <Link to="/forum" className="text-brand-blue font-medium hover:underline">
                    Повернутися до списку тем
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">

            <Link to="/forum" className="inline-flex items-center text-sm text-gray-500 hover:text-brand-blue transition-colors mb-2">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Назад до форуму
            </Link>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h1 className="text-2xl md:text-3xl font-black text-brand-dark leading-tight mb-2">
                    {topic.title}
                </h1>
                <p className="text-sm text-gray-500">
                    Створено автором <span className="font-bold text-gray-700">@{topic.author}</span>
                </p>
            </div>

            <div className="space-y-4">
                {messages.length === 0 ? (
                    <p className="text-center text-gray-500 py-6">Ще немає відповідей. Будьте першим!</p>
                ) : (
                    messages.map((msg) => (
                        <div key={msg.id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                            <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-brand-light rounded-full flex items-center justify-center text-brand-blue font-bold text-xs">
                                        {msg.author ? msg.author[0].toUpperCase() : 'U'}
                                    </div>
                                    <span className="font-bold text-gray-800 text-sm">@{msg.author}</span>
                                </div>
                                <span className="text-xs text-gray-400">{msg.date}</span>
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
                        </div>
                    ))
                )}
            </div>

            {canUseForum ? (
                <form onSubmit={handleReplySubmit} className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mt-8">
                    <h3 className="font-bold text-gray-800 mb-3">Ваша відповідь</h3>
                    <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        required
                        rows="4"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue focus:outline-none resize-y mb-3"
                        placeholder="Напишіть своє повідомлення..."
                    />
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-brand-blue text-white font-medium px-6 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:bg-gray-400"
                        >
                            {isSubmitting ? 'Відправка...' : 'Відправити'}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl text-center mt-8">
                    <p className="text-amber-800 font-medium text-sm">
                        Лише авторизовані користувачі можуть залишати повідомлення.
                    </p>
                </div>
            )}
        </div>
    );
};

export default ForumThread;
