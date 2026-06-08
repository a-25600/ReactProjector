import {usePermissions} from '../../hooks/usePermissions'

const MOCK_BLOGS = [
		{ id: 1, author: "Олексій Коваленко", role: "Урбаніст", title: "5 помилок при ревіталізації старих фабрик", exсerpt: "Чому просто відкрити коворкінг у занедбаному цеху — це ще не ревіталізація, і як робити правильні громадські простори...", likes: 42 },
		{ id: 2, author: "Марія Назаренко", role: "Культуролог", title: "Феномен промислової естетики в мистецтві", exсerpt: "Як заводи перетворилися з символів важкої праці на об'єкти натхнення для художників та фотографів XXI століття.", likes: 29 }
]

const BlogsPage = () => {
	const { canWriteBlog } = usePermissions();

		return (
				<div className="space-y-6">
						<div className="flex justify-between items-center border-b border-gray-200 pb-4">
								<div>
										<h1 className="text-3xl font-black text-gray-900 tracking-tight">Авторські Блоги</h1>
										<p className="text-sm text-gray-500">Думки експертів, аналітика та суб'єктивні погляди на події.</p>
								</div>
								{canWriteBlog && (
										<button className="bg-blue-600 text-white font-medium text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
												Написати статтю
										</button>
								)}
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{MOCK_BLOGS.map((blog) => (
										<div key={blog.id} className="border border-gray-200 rounded-2xl p-6 bg-white hover:shadow-md transition-shadow flex flex-col justify-between">
												<div>
														<div className="flex items-center gap-2 mb-3">
																<div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xs">
																		{blog.author[0]}
																</div>
																<div>
																		<h4 className="text-sm font-semibold text-gray-800">{blog.author}</h4>
																		<p className="text-xs text-gray-400">{blog.role}</p>
																</div>
														</div>
														<h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">{blog.title}</h3>
														<p className="text-sm text-gray-600 leading-relaxed mb-4">{blog.exсerpt}</p>
												</div>
												<div className="flex justify-between items-center text-xs text-gray-400 pt-3 border-t border-gray-50">
														<span>❤️ {blog.likes} уподобань</span>
														<button className="text-blue-600 font-medium hover:underline">Читати повністю →</button>
												</div>
										</div>
								))}
						</div>
				</div>
		)
}

export default BlogsPage;