import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { t } from '../../utils/common';
import type { NavLink, Language } from '../../types';

interface DesktopNavProps {
  navItems: NavLink[];
  lang: Language;
  pathname: string;
  textStyle: string;
}

export default function DesktopNav({ navItems, lang, pathname, textStyle }: DesktopNavProps) {
  // 控制哪个导航项的下拉菜单处于激活状态
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // 点击外部时关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveItem(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setActiveItem(activeItem === id ? null : id);
  };

  // 限制只渲染前 5 个一级导航
  const visibleItems = navItems.slice(0, 5);

  return (
    <nav ref={navRef} className="hidden md:flex items-center gap-8 relative h-full">
      {visibleItems.map((item) => {
        // 如果子菜单正好有且只有 1 个，则直接作为普通链接处理
        const isSingleLink = item.children && item.children.length === 1;
        const hasDropdown = item.children && item.children.length > 1;
        
        // 当只有1个子菜单时，使用子菜单的链接；否则如果是空或者还没配置好，默认 '#'
        const targetHref = isSingleLink ? item.children![0].href : (item.href || '#');
        
        const isActive = pathname === targetHref || (hasDropdown && item.children!.some(child => pathname === child.href));
        
        return (
          <div 
            key={item.id || item.href} 
            className="relative h-full flex items-center"
          >
            <a
              href={hasDropdown ? '#' : targetHref}
              onClick={(e) => hasDropdown ? handleClick(item.id || item.href, e) : null}
              className={`flex items-center gap-1 text-sm font-medium ${textStyle} ${
                isActive ? 'opacity-100' : 'opacity-70'
              } hover:opacity-100 transition-opacity py-2`}
            >
              {t(item.name, lang)}
              {hasDropdown && <ChevronDown className={`w-4 h-4 opacity-70 transition-transform ${activeItem === (item.id || item.href) ? 'rotate-180' : ''}`} />}
            </a>

            {/* 下拉菜单 */}
            {hasDropdown && (
              <AnimatePresence>
                {activeItem === (item.id || item.href) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-[100%] left-1/2 -translate-x-1/2 min-w-[200px] pt-4 z-50"
                  >
                    <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden py-2 px-1 relative">
                       {/* 向上小箭头 */}
                       <div className="absolute -top-[5px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-t border-l border-gray-100 transform rotate-45"></div>
                       
                       <div className="relative z-10 flex flex-col">
                        {item.children!.map((child) => (
                          <a
                            key={child.id || child.href}
                            href={child.href}
                            onClick={() => setActiveItem(null)}
                            className={`px-4 py-2.5 mx-1 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors whitespace-nowrap ${
                                pathname === child.href ? 'bg-gray-50 text-gray-900 font-bold' : ''
                            }`}
                          >
                            {t(child.name, lang)}
                          </a>
                        ))}
                       </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        );
      })}
    </nav>
  );
}
