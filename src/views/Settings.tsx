import { useState } from 'react';
import { 
  User, Bell, Shield, Palette, Globe, Database, 
  Download, Upload, Trash2, HelpCircle, LogOut,
  ToggleLeft, ToggleRight, Edit3,
  Mail, Phone, MapPin, CreditCard,
  Lock, Key, Monitor
} from 'lucide-react';

// Removed unused interface

export default function Settings() {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    biometric: true,
    autoSync: true,
    currency: 'ETB',
    language: 'en',
    theme: 'light'
  });

  const [activeSection, setActiveSection] = useState('profile');

  const settingSections = [
    {
      id: 'profile',
      title: 'Profile',
      icon: User,
      items: [
        {
          id: 'name',
          title: 'Full Name',
          description: 'Alex Johnson',
          icon: User,
          type: 'button' as const,
          action: () => console.log('Edit name')
        },
        {
          id: 'email',
          title: 'Email',
          description: 'alex.johnson@email.com',
          icon: Mail,
          type: 'button' as const,
          action: () => console.log('Edit email')
        },
        {
          id: 'phone',
          title: 'Phone Number',
          description: '+251 9XX XXX XXX',
          icon: Phone,
          type: 'button' as const,
          action: () => console.log('Edit phone')
        },
        {
          id: 'location',
          title: 'Location',
          description: 'Addis Ababa, Ethiopia',
          icon: MapPin,
          type: 'button' as const,
          action: () => console.log('Edit location')
        }
      ]
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      items: [
        {
          id: 'push',
          title: 'Push Notifications',
          description: 'Receive notifications on your device',
          icon: Bell,
          type: 'toggle' as const,
          value: settings.notifications
        },
        {
          id: 'email',
          title: 'Email Notifications',
          description: 'Receive notifications via email',
          icon: Mail,
          type: 'toggle' as const,
          value: true
        },
        {
          id: 'transactions',
          title: 'Transaction Alerts',
          description: 'Get notified about new transactions',
          icon: CreditCard,
          type: 'toggle' as const,
          value: true
        },
        {
          id: 'budget',
          title: 'Budget Alerts',
          description: 'Get notified when approaching budget limits',
          icon: Shield,
          type: 'toggle' as const,
          value: true
        }
      ]
    },
    {
      id: 'security',
      title: 'Security',
      icon: Shield,
      items: [
        {
          id: 'biometric',
          title: 'Biometric Authentication',
          description: 'Use fingerprint or face ID to unlock',
          icon: Shield,
          type: 'toggle' as const,
          value: settings.biometric
        },
        {
          id: 'pin',
          title: 'PIN Protection',
          description: 'Set up a 6-digit PIN',
          icon: Lock,
          type: 'button' as const,
          action: () => console.log('Set PIN')
        },
        {
          id: 'password',
          title: 'Change Password',
          description: 'Update your account password',
          icon: Key,
          type: 'button' as const,
          action: () => console.log('Change password')
        },
        {
          id: '2fa',
          title: 'Two-Factor Authentication',
          description: 'Add an extra layer of security',
          icon: Shield,
          type: 'button' as const,
          action: () => console.log('Setup 2FA')
        }
      ]
    },
    {
      id: 'preferences',
      title: 'Preferences',
      icon: Palette,
      items: [
        {
          id: 'currency',
          title: 'Default Currency',
          description: 'Set your preferred currency',
          icon: CreditCard,
          type: 'select' as const,
          value: settings.currency,
          options: [
            { label: 'Ethiopian Birr (ETB)', value: 'ETB' },
            { label: 'US Dollar (USD)', value: 'USD' },
            { label: 'Euro (EUR)', value: 'EUR' }
          ]
        },
        {
          id: 'language',
          title: 'Language',
          description: 'Choose your preferred language',
          icon: Globe,
          type: 'select' as const,
          value: settings.language,
          options: [
            { label: 'English', value: 'en' },
            { label: 'Amharic', value: 'am' },
            { label: 'Oromo', value: 'om' }
          ]
        },
        {
          id: 'theme',
          title: 'Theme',
          description: 'Choose your preferred theme',
          icon: Palette,
          type: 'select' as const,
          value: settings.theme,
          options: [
            { label: 'Light', value: 'light' },
            { label: 'Dark', value: 'dark' },
            { label: 'Auto', value: 'auto' }
          ]
        },
        {
          id: 'autoSync',
          title: 'Auto Sync',
          description: 'Automatically sync data across devices',
          icon: Database,
          type: 'toggle' as const,
          value: settings.autoSync
        }
      ]
    },
    {
      id: 'data',
      title: 'Data & Privacy',
      icon: Database,
      items: [
        {
          id: 'export',
          title: 'Export Data',
          description: 'Download your financial data',
          icon: Download,
          type: 'button' as const,
          action: () => console.log('Export data')
        },
        {
          id: 'import',
          title: 'Import Data',
          description: 'Import data from other apps',
          icon: Upload,
          type: 'button' as const,
          action: () => console.log('Import data')
        },
        {
          id: 'backup',
          title: 'Backup Data',
          description: 'Create a backup of your data',
          icon: Database,
          type: 'button' as const,
          action: () => console.log('Backup data')
        },
        {
          id: 'delete',
          title: 'Delete Account',
          description: 'Permanently delete your account',
          icon: Trash2,
          type: 'button' as const,
          action: () => console.log('Delete account')
        }
      ]
    },
    {
      id: 'support',
      title: 'Help & Support',
      icon: HelpCircle,
      items: [
        {
          id: 'help',
          title: 'Help Center',
          description: 'Get help and support',
          icon: HelpCircle,
          type: 'button' as const,
          action: () => console.log('Help center')
        },
        {
          id: 'contact',
          title: 'Contact Us',
          description: 'Get in touch with our support team',
          icon: Mail,
          type: 'button' as const,
          action: () => console.log('Contact support')
        },
        {
          id: 'feedback',
          title: 'Send Feedback',
          description: 'Share your thoughts and suggestions',
          icon: Edit3,
          type: 'button' as const,
          action: () => console.log('Send feedback')
        },
        {
          id: 'about',
          title: 'About',
          description: 'App version and information',
          icon: Monitor,
          type: 'button' as const,
          action: () => console.log('About app')
        }
      ]
    }
  ];

  const handleToggle = (itemId: string) => {
    setSettings(prev => ({
      ...prev,
      [itemId]: !prev[itemId as keyof typeof prev]
    }));
  };

  const handleSelect = (itemId: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [itemId]: value
    }));
  };

  const currentSection = settingSections.find(section => section.id === activeSection);

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Settings</h1>
        <p className="text-slate-600">Manage your account and app preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <nav className="space-y-2">
              {settingSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeSection === section.id
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <section.icon className="w-5 h-5" />
                  <span className="font-medium">{section.title}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100">
            {/* Section Header */}
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  {currentSection && <currentSection.icon className="w-6 h-6 text-indigo-600" />}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">{currentSection?.title}</h2>
                  <p className="text-slate-600">Manage your {currentSection?.title.toLowerCase()} settings</p>
                </div>
              </div>
            </div>

            {/* Settings Items */}
            <div className="p-6 space-y-4">
              {currentSection?.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <item.icon className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">{item.title}</h3>
                      <p className="text-sm text-slate-600">{item.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {item.type === 'toggle' && (
                      <button
                        onClick={() => handleToggle(item.id)}
                        className="flex items-center"
                      >
                        {item.value ? (
                          <ToggleRight className="w-6 h-6 text-indigo-600" />
                        ) : (
                          <ToggleLeft className="w-6 h-6 text-slate-400" />
                        )}
                      </button>
                    )}

                    {item.type === 'select' && item.options && (
                      <select
                        value={item.value as string}
                        onChange={(e) => handleSelect(item.id, e.target.value)}
                        className="px-3 py-1 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {item.options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    )}

                    {item.type === 'button' && (
                      <button
                        onClick={item.action}
                        className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                        Edit
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Logout Section */}
          <div className="mt-6 bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <LogOut className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Sign Out</h3>
                  <p className="text-sm text-slate-600">Sign out of your account</p>
                </div>
              </div>
              <button className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
