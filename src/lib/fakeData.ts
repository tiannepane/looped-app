export interface ListingItem {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
  condition: string;
  description: string;
  messageCount: number;
  postedDaysAgo: number;
  platforms: string[];
  isSold?: boolean;
  soldPrice?: number;
}

export interface Message {
  id: string;
  buyerName: string;
  message: string;
  platform: "facebook" | "kijiji" | "carrot";
  timestamp: string;
  isRead: boolean;
}

export const fakeListings: ListingItem[] = [
  {
    id: "1",
    title: "Mid-Century Coffee Table",
    price: 200,
    image: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=400&h=400&fit=crop",
    category: "Furniture",
    condition: "Like New",
    description: "Beautiful mid-century modern coffee table in excellent condition. Barely used, no scratches.",
    messageCount: 5,
    postedDaysAgo: 2,
    platforms: ["facebook", "kijiji", "carrot"],
  },
  {
    id: "2",
    title: "Vintage Brass Lamp",
    price: 75,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop",
    category: "Furniture",
    condition: "Good",
    description: "Antique brass desk lamp with adjustable arm. Works perfectly, minor patina adds character.",
    messageCount: 3,
    postedDaysAgo: 5,
    platforms: ["facebook", "kijiji"],
  },
  {
    id: "3",
    title: "Gaming Chair - DXRacer",
    price: 180,
    image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=400&h=400&fit=crop",
    category: "Furniture",
    condition: "Good",
    description: "Comfortable gaming chair, adjustable height and armrests. Some wear on the armrests.",
    messageCount: 8,
    postedDaysAgo: 1,
    platforms: ["facebook", "kijiji", "carrot"],
  },
];

export const fakeMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "m1",
      buyerName: "Michael T.",
      message: "Hi! Is this still available? I can pick up today.",
      platform: "facebook",
      timestamp: "2 hours ago",
      isRead: false,
    },
    {
      id: "m2",
      buyerName: "Emma R.",
      message: "Would you take $180? I'm in the area.",
      platform: "kijiji",
      timestamp: "4 hours ago",
      isRead: true,
    },
    {
      id: "m3",
      buyerName: "David L.",
      message: "What are the dimensions?",
      platform: "carrot",
      timestamp: "1 day ago",
      isRead: true,
    },
    {
      id: "m4",
      buyerName: "Sarah K.",
      message: "Can you deliver to downtown Toronto?",
      platform: "facebook",
      timestamp: "1 day ago",
      isRead: true,
    },
    {
      id: "m5",
      buyerName: "James W.",
      message: "Is this solid wood or veneer?",
      platform: "kijiji",
      timestamp: "2 days ago",
      isRead: true,
    },
  ],
  "2": [
    {
      id: "m6",
      buyerName: "Lisa M.",
      message: "Love this lamp! Does it come with a bulb?",
      platform: "facebook",
      timestamp: "3 hours ago",
      isRead: false,
    },
    {
      id: "m7",
      buyerName: "Tom B.",
      message: "Is the cord in good condition?",
      platform: "kijiji",
      timestamp: "6 hours ago",
      isRead: true,
    },
    {
      id: "m8",
      buyerName: "Anna P.",
      message: "Would you do $60?",
      platform: "facebook",
      timestamp: "1 day ago",
      isRead: true,
    },
  ],
  "3": [
    {
      id: "m9",
      buyerName: "Chris H.",
      message: "What color is this exactly?",
      platform: "facebook",
      timestamp: "30 min ago",
      isRead: false,
    },
    {
      id: "m10",
      buyerName: "Alex N.",
      message: "Can you hold it until Saturday?",
      platform: "kijiji",
      timestamp: "1 hour ago",
      isRead: false,
    },
    {
      id: "m11",
      buyerName: "Jordan F.",
      message: "I'll take it for $180! When can I pick up?",
      platform: "carrot",
      timestamp: "2 hours ago",
      isRead: false,
    },
    {
      id: "m12",
      buyerName: "Pat D.",
      message: "Is this the 2022 or 2023 model?",
      platform: "facebook",
      timestamp: "5 hours ago",
      isRead: true,
    },
    {
      id: "m13",
      buyerName: "Morgan S.",
      message: "Any issues with the lumbar support?",
      platform: "kijiji",
      timestamp: "8 hours ago",
      isRead: true,
    },
    {
      id: "m14",
      buyerName: "Riley C.",
      message: "Would you trade for a standing desk?",
      platform: "carrot",
      timestamp: "1 day ago",
      isRead: true,
    },
    {
      id: "m15",
      buyerName: "Casey B.",
      message: "What's the weight limit?",
      platform: "facebook",
      timestamp: "1 day ago",
      isRead: true,
    },
    {
      id: "m16",
      buyerName: "Quinn A.",
      message: "Does it recline?",
      platform: "kijiji",
      timestamp: "2 days ago",
      isRead: true,
    },
  ],
};

export const pricingSuggestions = {
  priceRange: { min: 180, max: 220 },
  average: 200,
  location: "Toronto",
  searchCount: 12,
  searchTerm: "coffee table",
};

export const aiSuggestions = [
  "IKEA LACK coffee table, barely used",
  "Modern wooden coffee table, great condition",
  "Minimalist living room table, like new",
];

export const categories = ["Furniture", "Electronics", "Appliances", "Clothing", "Other"];

export const conditions = ["New", "Like New", "Good", "Fair"];
