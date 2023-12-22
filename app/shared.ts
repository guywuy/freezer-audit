import { CategoryInfo, CategoryName } from "./types";

export const categoryNames: CategoryName[] = [
  "General",
  "Meat and Fish",
  "Meat Meal",
  "Veg Meal",
  "Sweet",
];

export const categoryInfos: CategoryInfo[] = [
  {
    name: "General",
    borderColourClass: "border-blue-600",
    bgColourClass: "bg-blue-50",
    emoji: "❄️"
  },
  {
    name: "Meat and Fish",
    bgColourClass: "bg-red-50",
    borderColourClass: "border-red-600",
    emoji: "🥩"
  },
  {
    name: "Meat Meal",
    bgColourClass: "bg-orange-50",
    borderColourClass: "border-orange-600",
    emoji: "🍗"
  },
  {
    name: "Veg Meal",
    bgColourClass: "bg-teal-100",
    borderColourClass: "border-teal-600",
    emoji: "🥬"
  },
  {
    name: "Sweet",
    bgColourClass: "bg-yellow-50",
    borderColourClass: "border-yellow-600",
    emoji: "🍦"
  },
];
