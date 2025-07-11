import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const Navigation = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(null);
  const categories = [
    {
      id: 1,
      name: 'Nam',
      subCategories: [
        { id: 11, name: 'Áo', path: '/men/shirts' },
        { id: 12, name: 'Quần', path: '/men/pants' },
        { id: 13, name: 'Phụ kiện', path: '/men/accessories' },
      ],
    },
    { id: 2, name: 'Nữ', path: '/women' },
    { id: 3, name: 'Trẻ em', path: '/kids' },
    { id: 4, name: 'Khuyến mãi', path: '/sale' },
  ];

  const handleMouseEnter = (id) => setActiveItem(id);
  const handleMouseLeave = () => setActiveItem(null);

  return (
    <nav isOpen={isOpen}>
      <ul className='main-menu'>
        {categories.map((category) => (
          <li
            key={category.id}
            onMouseEnter={() => handleMouseEnter(category.id)}
            onMouseLeave={handleMouseLeave}
          >
            <Link
              to={category.path}
              className={
                location.pathname.includes(category.path) ? 'active' : ''
              }
            >
              {category.name}
            </Link>
            <div>
              {activeItem === category.id && category.subCategories && (
                <div
                  className='dropdown'
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  transition={{ duration: 0.2 }}
                >
                  {category.subCategories.map((sub) => (
                    <Link key={sub.id} to={sub.path}>
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </nav>
  );
};
export default Navigation;
