import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle');
    const [message, setMessage] = useState('');

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        setMessage('');

        try {

            await new Promise((resolve) => setTimeout(resolve, 1000));

            const existingSubscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');

            if (existingSubscribers.includes(email)) {
                throw new Error('Ця електронна адреса вже підписана на розсилку.');
            }

            existingSubscribers.push(email);
            localStorage.setItem('newsletter_subscribers', JSON.stringify(existingSubscribers));

            setStatus('success');
            setMessage('Дякуємо! Ви успішно підписалися на ексклюзивні матеріали.');
            setEmail('');

        } catch (error) {
            setStatus('error');
            setMessage(error.message || 'Сталася помилка. Будь ласка, спробуйте пізніше.');
        }

        setTimeout(() => {
            setStatus('idle');
            setMessage('');
        }, 5000);
    };

    return (
        <footer className="bg-gray-900 text-gray-300 py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                <div>
                    <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Розсилка новин</h4>
                    <p className="text-xs text-gray-400 mb-4">
                        Отримуйте головні події дня та ексклюзивні матеріали на пошту (доступно для зареєстрованих).
                    </p>

                    <form onSubmit={handleSubscribe} className="flex flex-col gap-3 relative">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Ваша e-mail адреса"
                            required
                            disabled={status === 'loading'}
                            className="px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold flex justify-center items-center disabled:bg-blue-800 disabled:cursor-not-allowed h-10"
                        >
                            {status === 'loading' ? (
                                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                            ) : (
                                'Підписатися'
                            )}
                        </button>

                        {message && (
                            <div className={`absolute top-full mt-2 text-xs p-2 rounded w-full ${status === 'success' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
                                }`}>
                                {message}
                            </div>
                        )}
                    </form>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-gray-800 text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center gap-4">
                <p>© {new Date().getFullYear()} PROЖЕКТОР. Всі права захищено.</p>
                <div className="flex space-x-6">
                    <Link to="/privacy" className="hover:text-gray-300 transition-colors">Політика конфіденційності</Link>
                    <Link to="/terms" className="hover:text-gray-300 transition-colors">Правила сайту</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;