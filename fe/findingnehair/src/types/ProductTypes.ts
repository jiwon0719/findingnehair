export interface ApiProduct {
    productId: number;
    productName: string;
    productLink?: string;
    productDescription: string;
    productPrice: number;
    productImage: string;
    subCategory?: {
      subCategoryId: number;
      subCategoryName: string;
      mainCategory?: {
        categoryId: number;
        categoryName: string;
      };
    };
    features?: {
      featureId: number;
      featureName: string;
    } [];
  }
  
  export interface ApiProductResponse {
    content: ApiProduct[];
    pageable: {
      pageNumber: number;
      pageSize: number;
      sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
      };
      offset: number;
      paged: boolean;
      unpaged: boolean;
    };
    totalPages: number;
    totalElements: number;
    last: boolean;
    size: number;
    number: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    numberOfElements: number;
    first: boolean;
    empty: boolean;
  }
  
  export interface FavoriteProduct {
    productId: number;
    productName: string;
    productLink: string;
    productDescription: string;
    productPrice: number;
    productImage: string;
  }
  
  export interface DisplayProduct extends ApiProduct {
    type: string; 
    isFavorite: boolean;
    tags: string[];
  }
  
  export interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    isFirst: boolean;
    isLast: boolean;
  }