import { useParams, Link } from 'react-router-dom';
import {useAuth} from '../../hooks/useAuth';
import AISummary from '../../components/AI/AISummary'
import AudioReader from '../../components/AI/AudioReader'
import CommentList from '../../components/Comments/CommentList'
import TagCloud from '../../components/News/TagCloud'
import PollWidget from '../../components/Widgets/PollWidget'

const NewsPage = () => {
	const { id } = useParams();
    const { user } = useAuth();

    const isGuest = !user || user.role === 'неавторизований' || user.role === '';

    const articleData = {
        title: "WEEKEND в стилі INDUSTRIAL: Як Кривий Ріг перетворюється на туристичний магніт",
        date: "08 Червня, 2026",
        author: "Анастасія Антонова",
        category: "Культура",
        tags: ['Кривий Ріг', 'ІндустріальнийТуризм', 'Культура', 'Подорожі'],
        previewText: "Індустріальний туризм в Україні стрімко набирає обертів. Замість класичних музеїв та архітектурних пам'яток, мандрівники все частіше обирають гігантські залізорудні кар'єри, діючі шахти та космічні ландшафти промислових міст.",
        fullText: "Кривий Ріг став справжнім першопрохідцем у цій сфері. Туристична інфраструктура міста активно адаптується під потреби сучасних екскурсій. Відвідувачам пропонують спуститися у справжні шахти на глибину понад 1000 метрів, побачити масштаби діючих кар'єрів Південного ГЗК та насолодитися унікальним залізорудним заходом сонця. Окрім візуальних вражень, це потужний поштовх для розвитку місцевого малого бізнесу, готелів та арт-просторів, що трансформують індустріальну спадщину у сучасне мистецтво."
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
            <div className="lg:col-span-2 space-y-6">
                <div>
                    <span className="text-sm font-bold text-blue-600 uppercase tracking-wide">{articleData.category}</span>
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 mt-2 leading-tight">{articleData.title}</h1>
                    <div className="text-xs text-gray-500 mt-3 flex gap-4">
                        <span>{articleData.date}</span>
                        <span>Автор: {articleData.author}</span>
                    </div>
                </div>

                <div className="rounded-2xl overflow-hidden shadow-md max-h-[400px]">
                    <img 
                        src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80" 
                        alt="Industrial" 
                        className="w-full h-full object-cover"
                    />
                </div>

                <p className="text-lg font-medium text-gray-800 leading-relaxed italic border-l-4 border-blue-600 pl-4">
                    {articleData.previewText}
                </p>

                {isGuest ? (
                    <div className="relative mt-8 p-8 border border-red-200 bg-red-50 rounded-2xl text-center shadow-lg overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-red-50 via-transparent to-transparent opacity-90" />
                        <span className="text-4xl mb-2 block">🔒</span>
                        <h3 className="text-xl font-bold text-red-800">Стаття лише для зареєстрованих користувачів</h3>
                        <p className="text-sm text-gray-600 mt-2 max-w-md mx-auto">
                            Щоб прочитати повну версію репортажу, отримати доступ до інтелектуального ШІ-викладу та слухати аудіоначитку, приєднуйтесь до нашої спільноти!
                        </p>
                        <div className="mt-6">
                            <Link to="/login" className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:bg-blue-700 transition-all transform hover:-translate-y-0.5">
                                Реєструйтеся вже зараз!
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 animate-fadeIn">
                        <AudioReader textToRead={`${articleData.title}. ${articleData.previewText} ${articleData.fullText}`} />
                        <AISummary articleText={`${articleData.previewText} ${articleData.fullText}`} />

                        <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line">
                            {articleData.fullText}
                        </p>

                        <div className="pt-4 border-t border-gray-100">
                            <TagCloud tags={articleData.tags} />
                        </div>

                        <CommentList articleId={id} initialComments={[
                            { id: 1, author: "Іван Іванов", text: "Чудовий репортаж! Давно хотів побувати на екскурсії в кар'єрі.", date: "08.06.2026" }
                        ]} />
                    </div>
                )}
            </div>

            <div className="space-y-6">
                <PollWidget 
                    question="Чи підтримуєте ви розвиток промислового туризму у вашому місті?" 
                    options={["Так, це залучить інвестиції", "Ні, це екологічно небезпечно", "Важко відповісти"]} 
                />
            </div>
        </div>
    )
}

export default NewsPage;