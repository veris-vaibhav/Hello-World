import { useState } from 'react';
import {
  Cog6ToothIcon,
  BellIcon,
  ClockIcon,
  ShieldCheckIcon,
  CurrencyRupeeIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

export function Settings() {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', name: 'General', icon: Cog6ToothIcon },
    { id: 'booking', name: 'Booking Rules', icon: ClockIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'pricing', name: 'Pricing', icon: CurrencyRupeeIcon },
    { id: 'policies', name: 'Policies', icon: DocumentTextIcon },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Configure parking system settings and rules</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-64 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="h-5 w-5 mr-3" />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-xl shadow-sm p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">General Settings</h2>

              <div className="space-y-4">
                <div>
                  <label className="label">Location Name</label>
                  <input type="text" defaultValue="Tower A Parking" className="input mt-1" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Weekday Operating Hours</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <input type="time" defaultValue="06:00" className="input" />
                      <span className="text-gray-500">to</span>
                      <input type="time" defaultValue="23:00" className="input" />
                    </div>
                  </div>
                  <div>
                    <label className="label">Weekend Operating Hours</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <input type="time" defaultValue="08:00" className="input" />
                      <span className="text-gray-500">to</span>
                      <input type="time" defaultValue="20:00" className="input" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="label">Time Zone</label>
                  <select className="input mt-1">
                    <option>Asia/Kolkata (IST)</option>
                    <option>Asia/Dubai (GST)</option>
                    <option>America/New_York (EST)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between py-3 border-t">
                  <div>
                    <p className="font-medium text-gray-900">Allow Overnight Parking</p>
                    <p className="text-sm text-gray-500">Vehicles can stay beyond operating hours</p>
                  </div>
                  <input type="checkbox" defaultChecked className="toggle" />
                </div>

                <div className="flex items-center justify-between py-3 border-t">
                  <div>
                    <p className="font-medium text-gray-900">Require Vehicle Registration</p>
                    <p className="text-sm text-gray-500">All vehicles must be pre-registered</p>
                  </div>
                  <input type="checkbox" defaultChecked className="toggle" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'booking' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Booking Rules</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Max Advance Booking Days</label>
                    <input type="number" defaultValue={7} className="input mt-1" />
                  </div>
                  <div>
                    <label className="label">Min Hours Before Booking</label>
                    <input type="number" defaultValue={2} className="input mt-1" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Max Active Bookings per Employee</label>
                    <input type="number" defaultValue={2} className="input mt-1" />
                  </div>
                  <div>
                    <label className="label">Max Consecutive Days</label>
                    <input type="number" defaultValue={5} className="input mt-1" />
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-t">
                  <div>
                    <p className="font-medium text-gray-900">Allow Multi-Day Booking</p>
                    <p className="text-sm text-gray-500">Enable bookings spanning multiple days</p>
                  </div>
                  <input type="checkbox" defaultChecked className="toggle" />
                </div>

                <div>
                  <label className="label">No-Show Grace Period (minutes)</label>
                  <input type="number" defaultValue={30} className="input mt-1" />
                </div>

                <div>
                  <label className="label">No-Show Action</label>
                  <select className="input mt-1">
                    <option value="release">Release Spot</option>
                    <option value="release_penalize">Release & Penalize</option>
                    <option value="hold">Hold Spot</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Notification Settings</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="font-medium text-gray-900">Booking Confirmation</p>
                    <p className="text-sm text-gray-500">Send confirmation on booking</p>
                  </div>
                  <input type="checkbox" defaultChecked className="toggle" />
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="font-medium text-gray-900">Check-in Reminder</p>
                    <p className="text-sm text-gray-500">Remind before booking time</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input type="number" defaultValue={30} className="input w-20" />
                    <span className="text-gray-500">min before</span>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="font-medium text-gray-900">Overstay Alert</p>
                    <p className="text-sm text-gray-500">Alert when parking beyond time</p>
                  </div>
                  <input type="checkbox" defaultChecked className="toggle" />
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="font-medium text-gray-900">Exception Alerts</p>
                    <p className="text-sm text-gray-500">Alert on parking exceptions</p>
                  </div>
                  <input type="checkbox" defaultChecked className="toggle" />
                </div>

                <div>
                  <label className="label">Alert Channels</label>
                  <div className="mt-2 space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-2" />
                      <span className="text-sm text-gray-700">Push Notification</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-2" />
                      <span className="text-sm text-gray-700">Email</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm text-gray-700">SMS</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Security Settings</h2>

              <div className="space-y-4">
                <div>
                  <label className="label">Anti-Passback Mode</label>
                  <select className="input mt-1">
                    <option value="strict">Strict - Block duplicate entry/exit</option>
                    <option value="soft">Soft - Log but allow</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </div>

                <div className="flex items-center justify-between py-3 border-t">
                  <div>
                    <p className="font-medium text-gray-900">Require ANPR Verification</p>
                    <p className="text-sm text-gray-500">Validate vehicle number on entry/exit</p>
                  </div>
                  <input type="checkbox" defaultChecked className="toggle" />
                </div>

                <div className="flex items-center justify-between py-3 border-t">
                  <div>
                    <p className="font-medium text-gray-900">Block Unknown Vehicles</p>
                    <p className="text-sm text-gray-500">Deny entry to unregistered vehicles</p>
                  </div>
                  <input type="checkbox" className="toggle" />
                </div>

                <div>
                  <label className="label">ANPR Confidence Threshold</label>
                  <input type="number" defaultValue={85} min={0} max={100} className="input mt-1" />
                  <p className="text-sm text-gray-500 mt-1">Minimum confidence % for ANPR match</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Pricing Configuration</h2>

              <div className="space-y-4">
                <div>
                  <label className="label">Pricing Model</label>
                  <select className="input mt-1">
                    <option value="free">Free</option>
                    <option value="subscription">Subscription Only</option>
                    <option value="pay_per_use">Pay Per Use</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Pay Per Use Rates</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label text-sm">Four Wheeler - First 4 hours</label>
                      <input type="number" defaultValue={50} className="input mt-1" />
                    </div>
                    <div>
                      <label className="label text-sm">Four Wheeler - Per hour after</label>
                      <input type="number" defaultValue={20} className="input mt-1" />
                    </div>
                    <div>
                      <label className="label text-sm">Two Wheeler - First 4 hours</label>
                      <input type="number" defaultValue={20} className="input mt-1" />
                    </div>
                    <div>
                      <label className="label text-sm">Two Wheeler - Per hour after</label>
                      <input type="number" defaultValue={10} className="input mt-1" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="label">Overstay Penalty (per hour)</label>
                  <input type="number" defaultValue={100} className="input mt-1" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'policies' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Policies & Data Retention</h2>

              <div className="space-y-4">
                <div>
                  <label className="label">Entry/Exit Log Retention (days)</label>
                  <input type="number" defaultValue={90} className="input mt-1" />
                </div>

                <div>
                  <label className="label">Booking Record Retention (days)</label>
                  <input type="number" defaultValue={365} className="input mt-1" />
                </div>

                <div>
                  <label className="label">Image Retention (days)</label>
                  <input type="number" defaultValue={30} className="input mt-1" />
                </div>

                <div className="flex items-center justify-between py-3 border-t">
                  <div>
                    <p className="font-medium text-gray-900">Anonymize Data After Retention</p>
                    <p className="text-sm text-gray-500">Mask personal info instead of deleting</p>
                  </div>
                  <input type="checkbox" defaultChecked className="toggle" />
                </div>

                <div className="flex items-center justify-between py-3 border-t">
                  <div>
                    <p className="font-medium text-gray-900">Delete on Employee Exit</p>
                    <p className="text-sm text-gray-500">Remove data when employee leaves</p>
                  </div>
                  <input type="checkbox" defaultChecked className="toggle" />
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 pt-6 border-t flex justify-end space-x-3">
            <button className="btn-secondary">Cancel</button>
            <button className="btn-primary">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}
