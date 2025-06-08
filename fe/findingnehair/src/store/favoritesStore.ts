import {create} from 'zustand';

interface FavoriteStore {
    favorites: Record<number, boolean>;
    initializeFavorites: (favorites: number[]) => void;
    toggleFavorite: (productId: number) => void;
    setFavorites: (favorites: Record<number, boolean>) => void; // 즐겨찾기 상태를 설정하는 함수 추가
}

export const useFavoriteStore = create<FavoriteStore>((set) => ({
    favorites: {},
    initializeFavorites: (favorites) =>
        set(() => ({
            favorites: favorites.reduce((acc, productId) => {
                acc[productId] = true;
                return acc;
            }, {} as Record<number, boolean>),
        })),
    toggleFavorite: (productId) =>
        set((state) => ({
            favorites: {
                ...state.favorites,
                [productId]: !state.favorites[productId],
            },
        })),
    setFavorites: (favorites) => set({ favorites }), // 즐겨찾기 상태를 설정하는 함수 구현
}));