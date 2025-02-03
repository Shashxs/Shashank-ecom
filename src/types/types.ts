export interface Product {
    id: number;
    title: string;
    category: string;
    price: string;
    rating: number;
    img_url: string;
    collection: string;
    color: string;
    desc: string;
    color1: string;
    color2: string;
  }
  
  export interface ProductListProps {
    filters: {
      colors: string[];
      priceRange: number;
      categories: string[];
      collections: string[];
    };
    searchQuery: string;
  }
  
  export interface FavItems {
    id: number;
    title: string;
    price: number;
    img_url: string;
  }

  export interface NavbarProps {
    onToggleFilter: () => void;
    onSearch: (query: string) => void;
  }

  export interface Product {
    id: number;
    title: string;
    category: string;
    price: string;
    rating: number;
    img_url: string;
    collection: string;
    color: string;
    desc: string;
    color1: string;
    color2: string;
  }

  export interface StarRatingProps {
    rating: number;
  }

  export interface FilterProps {
    onApplyFilters: (filters: { colors: string[], priceRange: number, categories: string[], collections: string[] }) => void;
    onResetFilters: () => void;
    isVisible: boolean;
  }

  export interface CartItem {
    id: number;
    title: string;
    price: number;
    quantity: number;
    img_url: string;
  }