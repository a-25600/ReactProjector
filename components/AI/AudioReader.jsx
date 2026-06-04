import { useState, useEffect } from 'react';

const AudioReader = ({ textToRead }) => {
    const [isPlaying, setIsPlaying] = useState(false);

    const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

    useEffect(() => {
        return () => {
            if (isSupported) {
                window.speechSynthesis.cancel();
            }
        };
    }, [isSupported]);

    const togglePlay = () => {
        if (!isSupported) return;

        if (isPlaying) {
            window.speechSynthesis.cancel();
            setIsPlaying(false);
        } else {
            const utterance = new SpeechSynthesisUtterance(textToRead);

            utterance.lang = 'uk-UA';
            utterance.rate = 1.0;

            utterance.onend = () => setIsPlaying(false);
            utterance.onerror = (e) => {
                console.error("Помилка відтворення:", e);
                setIsPlaying(false);
            };

            window.speechSynthesis.speak(utterance);
            setIsPlaying(true);
        }
    };

    if (!isSupported) {
        return <p className="text-xs text-red-500">Ваш браузер не підтримує аудіоначитку.</p>;
    }

    return (
        <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg w-max mb-4 shadow-sm border border-gray-200">
            <button
                onClick={togglePlay}
                className="w-10 h-10 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
                aria-label={isPlaying ? "Зупинити читання" : "Слухати новину"}
            >
                {isPlaying ? '⏸' : '▶'}
            </button>
            <div>
                <p className="text-sm font-medium text-gray-800">Слухати новину</p>
                <p className="text-xs text-gray-500">Аудіогенерація браузером</p>
            </div>
        </div>
    );
};

export default AudioReader;