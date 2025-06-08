import React from "react";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { DisplayProduct } from "../../../types/ProductTypes";

interface ProductItemProps extends Omit<DisplayProduct, 'onToggleFavorite' | 'type' | 'tags'> {
    productId: number;
    productName: string;
    productDescription: string;
    productPrice: number;
    productImage: string;
    productLink?: string;
    isFavorite: boolean;
    tags?: string[];
    onToggleFavorite: (productId: number, currentIsFavorite: boolean) => void;
}

const ProductItem: React.FC<ProductItemProps> = React.memo(({
    productId,
    productName,
    productDescription,
    productPrice,
    productImage,
    productLink,
    tags,
    isFavorite,
    onToggleFavorite,
}) => {

    const handleClick = () => {
        if (productLink) {
            window.open(productLink, '_blank', 'noopener noreferrer');
        } else {
            console.log(`Product ${productId} link is not available.`);
        }
    };

    const handleToggleFavoriteClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        onToggleFavorite(productId, isFavorite);
    };

    const renderedTags = tags?.map((tag) => (
        <span key={tag} className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full mr-1 mb-1 inline-block">
            #{tag}
        </span>
    ));

    return (
        <div
            className="flex items-start p-4 border-b border-gray-300 w-full cursor-pointer hover:bg-[#ECF1EEF] relative transition-colors duration-150"
            onClick={handleClick}
            role="link"
            aria-label={`상품 ${productName} 상세 보기`}
        >
            <img
                src={productImage || '/placeholder-image.png'}
                alt={`${productName} 상품 이미지`}
                className="w-24 h-24 object-cover mr-4 rounded flex-shrink-0"
                loading="lazy"
                onError={(e) => { e.currentTarget.src = '/placeholder-image.png'; }}
            />
            <div className="flex flex-col flex-grow min-w-0">
                <p className="text-sm font-semibold text-gray-800 mb-1 truncate" title={productName}>
                    {productName}
                </p>
                <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                    {productDescription}
                </p>
                <p className="text-base text-gray-900 font-bold mb-2">
                    {productPrice.toLocaleString()}원
                </p>
                {tags && tags.length > 0 && (
                    <div className="flex flex-wrap mb-1">
                        {renderedTags}
                    </div>
                )}
            </div>
            <button
                onClick={handleToggleFavoriteClick}
                className="absolute **bottom-2 right-3** p-1 text-gray-400 hover:text-red-500 transition-colors duration-150 z-10"
                aria-label={isFavorite ? `${productName} 찜 해제하기` : `${productName} 찜하기`}
            >
                {isFavorite ? (
                    <GoHeartFill className="text-red-500 text-2xl" />
                ) : (
                    <GoHeart className="text-2xl" />
                )}
            </button>
        </div>
    );
});

export default ProductItem;