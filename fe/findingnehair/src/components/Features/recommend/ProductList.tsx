// ProductList.tsx
import React from "react";
import ProductItem from "./ProductItems";
import { DisplayProduct } from "../../../types/ProductTypes";

interface ProductListProps {
    products: DisplayProduct[];
    onToggleFavorite: (productId: number, isCurrentlyFavorite: boolean) => void;
}

const ProductList: React.FC<ProductListProps> = React.memo(({ products, onToggleFavorite }) => {
    return (
        <div className="flex flex-col w-full">
            <div className="flex flex-row flex-wrap items-center justify-center">
                {products.map((product) => (
                    <ProductItem
                        key={product.productId}
                        {...product}
                        onToggleFavorite={onToggleFavorite}
                    />
                ))}
            </div>
        </div>
    );
});

export default ProductList;
