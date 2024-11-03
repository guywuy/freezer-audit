export type CategoryName =
  | "General"
  | "Meat and Fish"
  | "Fruit and Veg"
  | "Meat Meal"
  | "Veg Meal"
  | "Sweet";

export interface CategoryInfo {
  name: CategoryName;
  emoji?: string;
  bgColourClass?: string;
  borderColourClass?: string;
}

export type MessageVariant = "ERROR" | "SUCCESS";
