'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Sidebar({ className }) {
  const pathname = usePathname();
  const [openSection, setOpenSection] = useState(null);

  const handleSectionToggle = (sectionName) => {
    setOpenSection(openSection === sectionName ? null : sectionName);
  };

  const navItems = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
    },
    {
      name: 'Users',
      href: '/admin/users',
      subItems: [
        {
          name: 'All',
          href: '/admin/users'
        },
        {
          name: 'New',
          href: '/admin/users/new'
        }
      ]
    },
    {
      name: 'Courses',
      href: '/admin/courses',
      subItems: [
        {
          name: 'All',
          href: '/admin/courses'
        },
        {
          name: 'New',
          href: '/admin/courses/create'
        }
      ]
    },
    {
      name: 'Categories',
      href: '/admin/categories',
    },
    {
      name: 'Announcements',
      href: '/admin/announcements',
    },
    {
      name: 'Notifications',
      href: '/admin/notifications',
    },
    {
      name: 'Messages',
      href: '/admin/messages',
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
    },
    {
      name: 'Settings',
      href: '/admin/settings',
    },
  ];

  return (
    <div className={`w-60 text-gray-600 border-r border-gray-100 ${className}`}>
      <div className="p-4">
        <nav className="flex flex-col">
          {navItems.map((item) => (
            <div key={item.href}>
              {item.subItems ? (
                <div className="">
                  <button
                    onClick={() => handleSectionToggle(item.name)}
                    className={`px-4 py-3 text-sm rounded transition-all w-full flex justify-between items-center ${
                      pathname === item.href || openSection === item.name
                        ? 'bg-gray-100'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {item.name}
                    <svg className={`w-4 h-4 transition-transform ${openSection === item.name ? 'rotate-180' : ''} text-gray-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openSection === item.name && (
                    <div className="flex flex-col bg-gray-50">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={`px-4 py-3 w-full text-sm transition-colors ${
                            pathname === subItem.href
                              ? 'bg-gray-50'
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
               <div className='flex flex-col gap-5'>
                 <Link
                  href={item.href}
                  className={`px-4 py-3 w-full text-sm rounded transition-colors ${
                    pathname === item.href
                      ? 'bg-gray-100'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </Link>
               </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
