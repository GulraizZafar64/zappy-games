"use client"

import { Gamepad2, Puzzle, Car, Trophy, Map, Target } from "lucide-react"

interface Category {
  name: string
  url: string
  type: string
}

interface CategoryFilterProps {
  categories: Category[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

const categoryIcons: Record<string, any> = {
  all: Gamepad2,
  action: Target,
  puzzle: Puzzle,
  racing: Car,
  sports: Trophy,
  adventure: Map,
  strategy: Target,
}

export function CategoryFilter({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const allCategories = [{ name: "All Games", url: "all", type: "category" }, ...categories]

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {allCategories.map((category) => {
        const Icon = categoryIcons[category.url] || Gamepad2
        const isSelected = selectedCategory === category.name

        return (
          <button
            key={category.name}
            onClick={() => onCategoryChange(category.name.toLocaleLowerCase())}
            className={`group relative flex items-center gap-2.5 px-5 py-3 rounded-xl font-medium transition-all duration-200 ${
              isSelected
                ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20 scale-[1.02]"
                : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10 hover:border-purple-500/50"
            }`}
          >
            <Icon
              className={`h-4 w-4 transition-all duration-200 ${
                isSelected 
                  ? "text-white" 
                  : "text-purple-500 group-hover:text-purple-400 group-hover:rotate-12"
              }`}
            />
            <span className="text-sm font-medium">{category.name}</span>

            {/* Subtle hover effect */}
            {!isSelected && (
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/5 to-purple-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
            )}
            
            {/* Active indicator */}
            {isSelected && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-white rounded-full" />
            )}
          </button>
        )
      })}
    </div>
  )
}