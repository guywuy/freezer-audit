export type CategoryName =
  | "General"
  | "Meat and Fish"
  | "Meat Meal"
  | "Veg Meal"
  | "Sweet";

export interface CategoryInfo {
  name: CategoryName;
  emoji?: string;
  bgColourClass?: string;
  borderColourClass?: string;
}
