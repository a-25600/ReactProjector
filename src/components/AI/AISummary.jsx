import { useState } from 'react';

const AISummary = ({ articleText }) => {
    const [summary, setSummary] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

  const generateSummary = async () => {
    if (!articleText) return;

    setIsLoading(true);
    setError(null);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY?.trim();

    if (!apiKey) {
      setError('API-ключ не знайдено. Перевірте файл .env');
      setIsLoading(false);
      return;
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;

    const prompt = `Зроби стислий виклад цієї новини (максимум 3-4 речення), виділивши найголовніше. Текст новини: "${articleText}"`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Деталі помилки від Google:', errorData);
        throw new Error(errorData.error?.message || 'Помилка при зверненні до API');
      }

      const data = await response.json();
      const generatedText = data.candidates[0].content.parts[0].text;
      setSummary(generatedText);

    } catch (err) {
      console.error(err);
      setError(err.message || 'Не вдалося згенерувати виклад. Перевірте консоль (F12).');
    } finally {
      setIsLoading(false);
    }
  };

    return (
        <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-blue-800">✨ Стислий виклад від ШІ</h3>
                {!summary && !isLoading && (
                    <button
                        onClick={generateSummary}
                        className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                    >
                        Згенерувати
                    </button>
                )}
            </div>

            {isLoading && <p className="text-gray-500 animate-pulse">ШІ аналізує текст...</p>}

            {error && <p className="text-red-500 text-sm">{error}</p>}

            {summary && <p className="text-gray-700 leading-relaxed">{summary}</p>}
        </div>
    );
};

export default AISummary;
