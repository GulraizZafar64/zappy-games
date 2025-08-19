"use client"

interface Tab {
  id: string
  label: string
  icon: string
}

interface GameTabsProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

export function GameTabs({ tabs, activeTab, onTabChange }: GameTabsProps) {
  return (
    <div className="flex justify-center mb-8">
      <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-2 border border-purple-500/20">
        <div className="flex space-x-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30"
                  : "text-gray-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>

              {/* Active indicator */}
              {activeTab === tab.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-50" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
