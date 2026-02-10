export interface Product {
    id: string;
    title: string;
    brand: string;
    price: number;
    image: string;
    rating: number;
    reviewCount: number;
    badges: string[];
    isFreeShipping: boolean;
    sku: string;
}

export const collectionData: Product[] = [
    {
        id: "allusion-platinum",
        title: "SimpliFire Allusion Platinum Linear Electric Fireplace",
        brand: "SimpliFire",
        price: 1999.00,
        image: "/assets/images/Allusion Platinum.jpg",
        rating: 5,
        reviewCount: 12,
        badges: ["Top Pick", "Premium"],
        isFreeShipping: true,
        sku: "SF-ALL-PLAT-50"
    },
    {
        id: "allusion-slim",
        title: "SimpliFire Allusion Slim Linear Electric Fireplace",
        brand: "SimpliFire",
        price: 1299.00,
        image: "/assets/images/Allusion Slim.jpg",
        rating: 4.8,
        reviewCount: 45,
        badges: ["Best Seller"],
        isFreeShipping: true,
        sku: "SF-ALL-SLIM-42"
    },
    {
        id: "scion-trinity",
        title: "SimpliFire Scion Trinity Electric Fireplace",
        brand: "SimpliFire",
        price: 2499.00,
        image: "/assets/images/The Scion.jpg",
        rating: 4.9,
        reviewCount: 8,
        badges: ["New Arrival"],
        isFreeShipping: true,
        sku: "SF-SCION-43"
    },
    {
        id: "forum-outdoor",
        title: "SimpliFire Forum Outdoor Electric Fireplace",
        brand: "SimpliFire",
        price: 3299.00,
        image: "/assets/images/Forum.jpg",
        rating: 5,
        reviewCount: 6,
        badges: ["Outdoor Ready"],
        isFreeShipping: true,
        sku: "SF-FORUM-55"
    },
    {
        id: "inception-insert",
        title: "SimpliFire Inception Electric Fireplace Insert",
        brand: "SimpliFire",
        price: 1899.00,
        image: "/assets/images/Inception Insert.jpg",
        rating: 4.7,
        reviewCount: 22,
        badges: ["Eco-Friendly"],
        isFreeShipping: true,
        sku: "SF-INCEPT-36"
    },
    {
        id: "format-wall-mount",
        title: "SimpliFire Format Wall Mount Electric Fireplace",
        brand: "SimpliFire",
        price: 1499.00,
        image: "/assets/images/Format Wall Mount.jpg",
        rating: 4.6,
        reviewCount: 18,
        badges: ["Easy Install"],
        isFreeShipping: true,
        sku: "SF-FMT-36"
    },
    {
        id: "boyd-built-in",
        title: 'SimpliFire Boyd Built-In Electric Fireplace - 30"',
        brand: "SimpliFire",
        price: 899.00,
        image: "/assets/products/Social_Landscape-SFE_Boyd-2B_2336x1314.jpg",
        rating: 4.8,
        reviewCount: 52,
        badges: ["Value Pick"],
        isFreeShipping: true,
        sku: "SF-BOYD-30"
    }
];
