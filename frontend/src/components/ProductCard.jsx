import React from 'react';
import { ShoppingCart, Star, MapPin } from 'lucide-react';

const ProductCard = ({ product }) => {
    return (
        <div className="bg-white rounded-lg max-w-2xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-lg flex h-64">
            {/* Product Image - Left Side */}
            <div className="relative w-1/4 overflow-hidden">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain"
                />
                {product.soldout && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-md text-sm font-medium">
                        Sold Out
                    </div>
                )}
            </div>

            {/* Product Details - Right Side */}
            <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                    {/* Header Section */}
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1 capitalize">
                                {product.name}
                            </h3>
                            <div className="flex items-center">
                                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                                <span className="text-sm font-medium text-gray-800">
                                    {product.avgrating || 'New'}
                                    <span className="text-gray-600 ml-1">
                                        ({product.reviewCount} reviews)
                                    </span>
                                </span>
                            </div>
                        </div>
                        <span className="text-2xl font-bold text-mycol-mint">
                            ₹{product.price}
                        </span>

                    </div>

                    {/* Product Info */}
                    <div className="space-y-2 mb-4">
                        <div className="flex items-center">
                            <span className="text-sm font-semibold text-gray-900 w-20">Type:</span>
                            <span className="text-sm text-gray-800">{product.type}</span>
                        </div>
                        <div className="flex items-center">
                            <span className="text-sm font-semibold text-gray-900 w-20">Category:</span>
                            <span className="text-sm text-gray-800">{product.subtype}</span>
                        </div>
                    </div>

                    {/* Store Locations */}
                    <div className="flex justify-between items-end"> {/* Changed to justify-between and items-end */}
                        {/* Store Locations */}
                        <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-2">Available at:</h4>
                            <div className="space-y-1">
                                {product.storelocation.slice(0, 2).map((store) => (
                                    <div key={store.id} className="flex items-center text-sm text-gray-800">
                                        <MapPin className="w-4 h-4 text-mycol-mint mr-1" />
                                        {store.name}
                                    </div>
                                ))}
                                {product.storelocation.length > 2 && (
                                    <div className="text-sm font-medium text-mycol-mint">
                                        +{product.storelocation.length - 2} more stores
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Buy Button */}
                        <div className="ml-auto pb-6"> {/* Added ml-auto to push to the right */}
                            <a
                                href={`https://cropify-v1.onrender.com/crops/${product._id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-mycol-mint text-white py-2.5 px-6 rounded-lg hover:bg-mycol-mint-2 transition-colors flex items-center justify-center font-semibold whitespace-nowrap"
                            >
                                <ShoppingCart className="w-5 h-5 mr-2" />
                                Buy Now
                            </a>
                        </div>
                    </div>

                </div>


            </div>
        </div>
    );
};

export default ProductCard;