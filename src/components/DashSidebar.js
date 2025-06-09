'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function DashSidebar({ className }) {

    const pathname = usePathname();
    const [openSection, setOpenSection] = useState(null);

    const handleSectionToggle = (sectionName) => {
        setOpenSection(openSection === sectionName ? null : sectionName);
    };

    const navItems = [
        {
          name: 'Dashboard',
          href: '/dashboard',
        },
        {
          name: 'Courses',
          href: '/dashboard/courses',
          subItems: [
            {
              name: 'All',
              href: '/dashboard/courses/all'
            },
            {
              name: 'In Progress',
              href: '/dashboard/courses/started'
            },
            {
            name: 'Completed',
            href: '/dashboard/courses/completed'
            }
          ]
        },
        {
          name: 'Messages',
          href: '/dashboard/messages',
        },
        {
            name: 'Announcements',
            href: '/dashboard/announcements',
            subItems: [
              {
                name: 'All',
                href: '/dashboard/announcements/all'
              },
              {
                name: 'General',
                href: '/dashboard/announcements/general'
              },
              {
              name: 'Courses',
              href: '/dashboard/announcements/courses'
              }
            ]
        },
        {
            name: 'Notes',
            href: '/dashboard/notes',
        },
        {
          name: 'Certificates',
          href: '/dashboard/certificates',
        }
      ];

      return (
        <div className={`hidden md:block w-45 text-gray-600 border-r border-gray-100 ${className}`}>
          <div className="">
            <nav className="flex flex-col">
              {navItems.map((item) => (
                <div key={item.href}>
                  {item.subItems ? (
                    <div className="">
                      <button
                        onClick={() => handleSectionToggle(item.name)}
                        className={`px-4 py-3 text-sm transition-all w-full flex justify-between items-center ${
                          pathname === item.href || openSection === item.name
                            ? 'bg-blue-50/50'
                            : 'hover:bg-blue-50'
                        }`}
                      >
                        {item.name}
                        <svg className={`w-4 h-4 transition-transform ${openSection === item.name ? 'rotate-180' : ''} text-gray-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {openSection === item.name && (
                        <div className="flex flex-col bg-blue-50/20">
                          {item.subItems.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              className={`px-4 py-3 w-full text-sm transition-colors ${
                                pathname === subItem.href
                                  ? 'bg-blue-50/50'
                                  : 'hover:bg-blue-50'
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
                          ? 'bg-blue-50/50'
                          : 'hover:bg-blue-50'
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