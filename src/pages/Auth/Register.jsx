import { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        requestedRole: 'Зареєстрований'
    });

    const [status, setStatus] = useState('idle');
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || 'Помилка реєстрації');
            }

            setStatus('success');
            setMessage('Заявку успішно надіслано! Ваш акаунт стане активним після перевірки модератором.');

            setFormData({
                name: '',
                email: '',
                password: '',
                requestedRole: 'Зареєстрований'
            });

        } catch (error) {
            setStatus('error');
            setMessage(error.message || 'Сталася помилка. Перевірте введені дані та спробуйте ще раз.');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-center mb-2">Реєстрація</h2>
            <p className="text-sm text-gray-500 text-center mb-6">
                Створіть акаунт, щоб залишати коментарі та брати участь в обговореннях
            </p>

            {status === 'success' && (
                <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 text-sm border border-green-200 text-center">
                    <span className="text-2xl block mb-2">✅</span>
                    {message}
                </div>
            )}

            {status === 'error' && (
                <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm border border-red-100">
                    {message}
                </div>
            )}

            {status !== 'success' && (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ім'я або Нікнейм</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Іван Іваненко"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="ivan@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength="6"
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Мінімум 6 символів"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Мета реєстрації (Бажана роль)</label>
                        <select
                            name="requestedRole"
                            value={formData.requestedRole}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                        >
                            <option value="Зареєстрований">Читати та коментувати (Звичайний користувач)</option>
                            <option value="Журналіст">Публікувати новини (Журналіст)</option>
                            <option value="Запрошений автор">Писати статті (Запрошений автор)</option>
                        </select>
                        <p className="text-xs text-gray-400 mt-1">Остаточне рішення ухвалює модератор.</p>
                    </div>

                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full bg-gray-900 text-white py-2.5 rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 font-medium mt-2"
                    >
                        {status === 'loading' ? 'Відправка даних...' : 'Подати заявку'}
                    </button>
                </form>
            )}

            <p className="mt-6 text-center text-sm text-gray-600">
                Вже маєте акаунт? <Link to="/login" className="text-blue-600 font-medium hover:underline">Увійти</Link>
            </p>
        </div>
    );
};

export default Register;
