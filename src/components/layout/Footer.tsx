import { Link } from '../ui/Link';
import { Linkedin, Twitter, Github } from 'lucide-react';
import { cn } from '../../lib/utils';

const navigation = {
  main: [
    { name: 'About Us', href: '#/about' },
    { name: 'Contact', href: '#/contact' },
    { name: 'Privacy Policy', href: '#/privacy' },
    { name: 'Terms of Service', href: '#/terms' },
  ],
  social: [
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com',
      icon: Linkedin,
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com',
      icon: Twitter,
    },
    {
      name: 'GitHub',
      href: 'https://github.com',
      icon: Github,
    },
  ],
};

interface FooterProps {
  onNavigate: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <nav className="flex flex-wrap justify-center space-x-6 md:space-x-12" aria-label="Footer">
          {navigation.main.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm text-gray-500 hover:text-fundspoke-600 dark:text-gray-400 dark:hover:text-fundspoke-400"
            >
              {item.name}
            </Link>
          ))}
          <button
            onClick={() => onNavigate('search')}
            className="text-sm text-gray-500 hover:text-fundspoke-600 dark:text-gray-400 dark:hover:text-fundspoke-400"
          >
            Advanced Search
          </button>
        </nav>

        <div className="mt-8 flex justify-center space-x-6">
          {navigation.social.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-400 hover:text-fundspoke-600 dark:hover:text-fundspoke-400"
                external
              >
                <span className="sr-only">{item.name}</span>
                <Icon className="h-6 w-6" />
              </Link>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-fundspoke-500 to-teal-dark rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">F</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-fundspoke-600 to-teal-dark bg-clip-text text-transparent">
              Fundspoke
            </span>
          </div>
          <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
            &copy; {currentYear} Fundspoke, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}