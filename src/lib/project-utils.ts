// Shapes and helpers for portfolio projects stored in Firestore
// (`websites`, `games` and `photos` collections).

export type Category = "web" | "mobile" | "games" | "photography";

export interface Project {
  id: string;
  title: string;
  description?: string;
  image?: string;
  images?: string[];
  link?: string;
  tags: string[];
  category: Category;
  createdAt?: number;
}

export const CATEGORY_LABEL: Record<Category, string> = {
  web: "Website",
  mobile: "Mobile app",
  games: "Game",
  photography: "Photography",
};

// The admin saves tags either as an array or a comma-separated string
export const normalizeTags = (tags: unknown): string[] =>
  Array.isArray(tags)
    ? tags.map(String).filter(Boolean)
    : typeof tags === "string"
      ? tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

export const yearOf = (p: Project) => (p.createdAt ? new Date(p.createdAt).getFullYear() : null);

// Documents in the `websites` collection are websites unless marked as a mobile app
export const websiteCategory = (data: any): Category => (data?.category === "mobile" ? "mobile" : "web");

export const toProject = (id: string, data: any, category: Category): Project => ({
  ...data,
  id,
  title: data.title || "Untitled",
  tags: normalizeTags(data.tags),
  category,
});

export const byNewest = (a: Project, b: Project) => (b.createdAt || 0) - (a.createdAt || 0);
