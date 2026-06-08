import {usePermissions} from '../../hooks/usePermissions'

const MOCK_TOPICS = [
		{ id: 1, title: "Чи потрібні безкоштовні велосипеди для туристів у центрі міста?", replies: 14, author: "BicycleLover" },
		{ id: 2, title: "Обговорення нового генерального плану розвитку промислових зон", replies: 8, author: "Urban_Kryvyi" },
		{ id: 3, title: "Де знайти найкращу каву біля театру?", replies: 22, author: "CoffeeQueen" }
]

const ForumPage = () => {
	const { canUseForum } = usePermissions();

		return (
				<div className="space-y-6">
						<div className="border-b border-gray-200 pb-4">
								<h1 className="text-3xl font-black text-gray-900 tracking-tight">Міський Форум</h1>
								<p className="text-sm text-gray-500">Відкритий простір для обговорень, ідей та запитань від жителів.</p>
						</div>

						{!canUseForum ? (
								<div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl text-center">
										<p className="text-amber-800 font-medium">Форум доступний лише для авторизованих користувачів.</p>
										<p className="text-xs text-amber-600 mt-1">Будь ласка, увійдіть у свій аккаунт, щоб створювати теми та брати участь у дискусіях.</p>
								</div>
						) : (
								<div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
										<div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
												<span className="text-sm font-bold text-gray-600 uppercase">Актуальні гілки обговорень</span>
												<button className="bg-gray-900 text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-gray-800">
														+ Створити тему
												</button>
										</div>

										<div className="divide-y divide-gray-150">
												{MOCK_TOPICS.map((topic) => (
														<div key={topic.id} className="p-4 hover:bg-gray-50 transition-colors flex justify-between items-center gap-4">
																<div>
																		<h3 className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer text-base">
																				{topic.title}
																		</h3>
																		<p className="text-xs text-gray-400 mt-1">Автор: @{topic.author}</p>
																</div>
																<div className="text-center px-3 py-1 bg-blue-50 rounded-lg min-w-[70px]">
																		<span className="block text-sm font-bold text-blue-700">{topic.replies}</span>
																		<span className="text-[10px] uppercase font-bold text-blue-400 tracking-tight">відповідей</span>
																</div>
														</div>
												))}
										</div>
								</div>
						)}
				</div>
		)
}

export default ForumPage;