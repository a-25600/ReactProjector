import { useState } from 'react';

const CommentItem = ({ id, author, text, date, currentUser, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);

  const isAuthor = currentUser?.name === author;
  const isModerator = currentUser?.role === 'Модератор' || currentUser?.role === 'Адміністратор';
  const canManage = isAuthor || isModerator;

  const handleSave = () => {
    if (editText.trim() !== '' && editText !== text) {
      onEdit(id, editText);
    }
    setIsEditing(false);
  };

  return (
    <div className="py-4 border-b border-gray-200 last:border-0 group">
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className="font-bold text-gray-900 mr-2">{author}</span>
          <span className="text-xs text-gray-500">{date}</span>
        </div>

        {canManage && !isEditing && (
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setIsEditing(true)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              Редагувати
            </button>
            <button
              onClick={() => onDelete(id)}
              className="text-xs font-semibold text-red-500 hover:text-red-700"
            >
              Видалити
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="mt-2">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full p-3 border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-blue-50"
            rows="3"
          />
          <div className="flex gap-2 mt-2">
            <button onClick={handleSave} className="bg-blue-600 text-white text-xs px-4 py-2 rounded-lg font-bold hover:bg-blue-700">
              Зберегти
            </button>
            <button onClick={() => { setIsEditing(false); setEditText(text); }} className="bg-gray-200 text-gray-700 text-xs px-4 py-2 rounded-lg font-bold hover:bg-gray-300">
              Скасувати
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">{text}</p>
      )}
    </div>
  );
};

export default CommentItem;
