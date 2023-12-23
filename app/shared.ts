import { CategoryInfo, CategoryName } from "./types";

export const categoryNames: CategoryName[] = [
  "General",
  "Meat and Fish",
  "Fruit and Veg",
  "Meat Meal",
  "Veg Meal",
  "Sweet",
];

export const categoryInfos: CategoryInfo[] = [
  {
    name: "General",
    slug: "general",
    borderColourClass: "border-blue-600",
    bgColourClass: "bg-blue-50",
    emoji: "❄️",
  },
  {
    name: "Fruit and Veg",
    slug: "fruitAndVeg",
    bgColourClass: "bg-green-50",
    borderColourClass: "border-green-600",
    emoji: "🥦",
  },
  {
    name: "Meat and Fish",
    slug: "meatAndFish",
    bgColourClass: "bg-red-50",
    borderColourClass: "border-red-600",
    emoji: "🥩",
  },
  {
    name: "Meat Meal",
    slug: "meatMeal",
    bgColourClass: "bg-orange-50",
    borderColourClass: "border-orange-600",
    emoji: "🍗",
  },
  {
    name: "Veg Meal",
    slug: "vegMeal",
    bgColourClass: "bg-teal-100",
    borderColourClass: "border-teal-600",
    emoji: "🥬",
  },
  {
    name: "Sweet",
    slug: "sweet",
    bgColourClass: "bg-yellow-50",
    borderColourClass: "border-yellow-600",
    emoji: "🍦",
  },
];
