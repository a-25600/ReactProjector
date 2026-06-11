import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-auto border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">

        <div className="flex flex-col items-center md:items-start">
          <span className="text-xl font-black text-white tracking-tighter mb-1">
            PROЖЕКТОР
          </span>
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} PROЖЕКТОР. Всі права захищено.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium">
          <Link to="/about" className="hover:text-white transition-colors">Про нас</Link>
          <Link to="/contacts" className="hover:text-white transition-colors">Контакти</Link>
          <Link to="/privacy" className="hover:text-white transition-colors">Політика конфіденційності</Link>
          <Link to="/terms" className="hover:text-white transition-colors">Правила сайту</Link>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
