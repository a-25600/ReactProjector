const CategoryNav = ({ activeCategory, onSelectCategory }) => {
	const categories = ['Актуальні події', 'Культура', 'Регіони', 'Шоубіз']

	const navStyle = {
    display: 'flex',
    gap: '24px',
    alignItems: 'center',
  }

	const itemStyle = (isActive) => ({
    fontSize: '16px',
    fontWeight: '600',
    color: isActive ? '#0056b3' : '#333',
    cursor: 'pointer',
    borderBottom: isActive ? '2px solid #0056b3' : '2px solid transparent',
    paddingBottom: '4px',
    transition: 'all 0.2s ease',
  })

	return (
    <nav style={navStyle}>
      {categories.map((cat) => (
        <span
          key={cat}
          style={itemStyle(activeCategory === cat)}
          onClick={() => onSelectCategory && onSelectCategory(cat)}
        >
          {cat}
        </span>
      ))}
    </nav>
  )
}

export default CategoryNav;