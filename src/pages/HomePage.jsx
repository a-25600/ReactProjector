import {useNavigate} from 'react-router-dom';
import { useState } from 'react'
import './HomePage.css'
import CategoryNav from '../../components/News/CategoryNav';
import NewsCard from '../../components/News/NewsCard';
import AdBanner from '../../components/Widgets/AdBanner';
import PodcastPlayer from '../../components/Media/PodcastPlayer';
import PostOfTheDay from '../../components/Media/PostOfTheDay';

const MOCK_NEWS = [
    { id: '1', title: 'WEEKEND в стилі INDUSTRIAL: Як Кривий Ріг перетворюється на туристичний магніт', date: '08.06.2026', category: 'Культура', imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80' },
    { id: '2', title: 'Нові функції Дія: які послуги для студентів стануть доступними вже цього місяця', date: '07.06.2026', category: 'Технології', imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80' },
    { id: '3', title: 'Економічний форум у регіонах: гранти на відкриття власної справи', date: '06.06.2026', category: 'Регіони', imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80' }
]

const HomePage = () => {
	const [activeCategory, setActiveCategory] = useState('Актуальні події');
    const navigate = useNavigate();

    return (
			<div className="home-container">
				<main className="main-content">
        	<h2>Головні публікації</h2>
        
        	<div className="news-card">
          	<img src="путь_к_картинке_кривого_рога.jpg" alt="Кривий Ріг" />
          	<div className="news-card-overlay">
            	<span>15.04.26 19:50 Регіони</span>
            	<h3>"Місто довжиною в життя": чому варто відвідати Кривий Ріг?</h3>
          	</div>
        	</div>

        	<div className="news-card">
          	<img src="путь_к_картинке_єпідтримка.jpg" alt="єПідтримка" />
          	<div className="news-card-overlay">
            	<span>15.04.26 09:43 Актуальні події</span>
            	<h3>Як отримати допомогу від держави? Розповідаємо докладно</h3>
          	</div>
        	</div>
      	</main>

				<aside className="sidebar">
        	<h3 className="sidebar-title">Останні новини:</h3>
        	<ul className="sidebar-list">
          	<li className="sidebar-item"><strong>18:50</strong> Apple представила новий смартфон з 24 камерами</li>
          	<li className="sidebar-item"><strong>18:44</strong> Єдиний українець у "Шахтарі". Ексклюзив!</li>
          	<li className="sidebar-item"><strong>18:35</strong> У Житомирі пограбували панчішну крамницю: усі деталі</li>
        	</ul>
        	<button className="btn-more">Більше новин</button>
      	</aside>
			</div>
		)
}

export default HomePage;