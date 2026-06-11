import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from './ProtectedRoute';

import Home from '../pages/Home/Home';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';

import Category from '../pages/News/Category';
import Article from '../pages/News/Article';
import SearchResults from '../pages/News/SearchResults';
import PodcastPage from '../pages/Podcasts/PodcastPage';
import VideoPage from '../pages/Podcasts/VideoPage';
import BlogList from '../pages/Blogs/BlogList';
import BlogPost from '../pages/Blogs/BlogPost';

import ForumHome from '../pages/Forum/ForumHome';
import ForumThread from '../pages/Forum/ForumThread';

import UserProfile from '../pages/Profile/UserProfile';

import JournalistWorkspace from '../pages/Admin/JournalistWorkspace';
import AuthorWorkspace from '../pages/Admin/AuthorWorkspace';
import ModeratorDashboard from '../pages/Admin/ModeratorDashboard';
import AdminDashboard from '../pages/Admin/AdminDashboard';


const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>

                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route path="/category/:categoryId" element={<Category />} />
                    <Route path="/news/:id" element={<Article />} />

                    <Route path="/podcasts" element={<PodcastPage />} />
                    <Route path="/blogs" element={<BlogList />} />
                    <Route path="/blogs/:id" element={<BlogPost />} />

                    <Route path="/forum" element={<ForumHome />} />
                    <Route path="/forum/:id" element={<ForumThread />} />
                    <Route path="/search" element={<SearchResults />} />
                    <Route path="/video" element={<VideoPage />} />

                    <Route element={<ProtectedRoute allowedRoles={['Зареєстрований', 'Журналіст', 'Запрошений автор', 'Модератор', 'Адміністратор']} />}>
                        <Route path="/profile" element={<UserProfile />} />
                    </Route>

                    <Route element={<ProtectedRoute allowedRoles={['Журналіст', 'Модератор', 'Адміністратор']} />}>
                      <Route path="/journalist-workspace" element={<JournalistWorkspace />} />
                    </Route>

                    <Route element={<ProtectedRoute allowedRoles={['Запрошений автор', 'Адміністратор']} />}>
                        <Route path="/author-workspace" element={<AuthorWorkspace />} />
                    </Route>

                    <Route element={<ProtectedRoute allowedRoles={['Модератор', 'Адміністратор']} />}>
                        <Route path="/moderator" element={<ModeratorDashboard />} />
                    </Route>

                    <Route element={<ProtectedRoute allowedRoles={['Адміністратор']} />}>
                        <Route path="/admin" element={<AdminDashboard />} />
                    </Route>

                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;
