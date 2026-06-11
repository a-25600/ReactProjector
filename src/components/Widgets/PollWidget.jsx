import { useState, useEffect } from 'react';

const PollWidget = ({ articleId }) => {
  const [poll, setPoll] = useState(null);
  const [voted, setVoted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const url = articleId
          ? `${API_URL}/polls/active?articleId=${articleId}`
          : `${API_URL}/polls/active`;

        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setPoll(data);

          if (localStorage.getItem(`voted_poll_${data.id}`)) {
            setVoted(true);
          }
        }
      } catch (error) {
        console.error("Помилка завантаження опитування:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPoll();
  }, [API_URL]);

  const handleVote = async (optionId) => {
    try {
      const response = await fetch(`${API_URL}/polls/vote/${optionId}`, {
        method: 'POST'
      });

      if (response.ok) {
        localStorage.setItem(`voted_poll_${poll.id}`, 'true');
        setVoted(true);

        const updatedRes = await fetch(`${API_URL}/polls/active`);
        if (updatedRes.ok) {
          setPoll(await updatedRes.json());
        }
      }
    } catch (error) {
      console.error("Помилка під час голосування:", error);
    }
  };

  if (isLoading) return <div className="p-5 bg-white border border-gray-200 rounded-2xl animate-pulse text-gray-500 text-sm">Завантаження опитування...</div>;
  if (!poll) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm mt-5">
      <h4 className="text-lg font-bold text-gray-900 mb-4 leading-snug">{poll.question}</h4>

      <div className="flex flex-col gap-3">
        {!voted ? (
          poll.options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleVote(opt.id)}
              className="w-full p-3 rounded-xl border border-brand-blue bg-transparent text-brand-blue font-medium cursor-pointer text-left hover:bg-blue-50 transition-colors"
            >
              {opt.text}
            </button>
          ))
        ) : (
          <>
            {poll.options.map((opt) => {
              const percent = poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;
              return (
                <div key={opt.id} className="relative w-full bg-gray-100 rounded-lg overflow-hidden p-3 z-0">
                  <div
                    className="absolute top-0 left-0 h-full bg-blue-100 -z-10 transition-all duration-1000 ease-out"
                    style={{ width: `${percent}%` }}
                  ></div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-gray-800">{opt.text}</span>
                    <span className="font-bold text-brand-blue">{percent}%</span>
                  </div>
                </div>
              );
            })}
            <p className="text-xs text-gray-500 mt-2 text-center font-medium">Всього голосів: {poll.totalVotes}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default PollWidget;
