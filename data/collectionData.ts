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
        id: "montigo-delray-48",
        title: 'Montigo Delray Direct Vent Gas Fireplace - 48"',
        brand: "Montigo",
        price: 3749.90,
        image: "/images/products/montigo-delray.jpg",
        rating: 5,
        reviewCount: 1,
        badges: ["Free Fire Glass"],
        isFreeShipping: true,
        sku: "M86500012"
    },
    {
        id: "superior-drt2000",
        title: "Superior DRT2000 Direct Vent Gas Fireplace",
        brand: "Superior Products",
        price: 2849.00,
        image: "/images/products/superior-drt2000.jpg",
        rating: 4.5,
        reviewCount: 4,
        badges: ["Top Pick", "3 Sizes"],
        isFreeShipping: true,
        sku: "M49900011"
    },
    {
        id: "empire-rushmore-50",
        title: 'Empire Rushmore Direct Vent Gas Fireplace - 50"',
        brand: "Empire",
        price: 8955.00,
        image: "/images/products/empire-rushmore.jpg",
        rating: 0,
        reviewCount: 0,
        badges: [],
        isFreeShipping: true,
        sku: "M35130888"
    },
    {
        id: "montigo-distinction-36",
        title: 'Montigo Distinction D3615 Direct Vent Gas Fireplace - 36"',
        brand: "Montigo",
        price: 5779.00,
        image: "/images/products/montigo-distinction.jpg",
        rating: 5,
        reviewCount: 1,
        badges: ["Free Fire Glass"],
        isFreeShipping: true,
        sku: "M86500001"
    },
    {
        id: "simplifire-30",
        title: 'SimpliFire Built-In Electric Fireplace - 30"',
        brand: "SimpliFire",
        price: 899.00,
        image: "/images/products/simplifire-30-main.jpg",
        rating: 4.8,
        reviewCount: 24,
        badges: ["Best Seller"],
        isFreeShipping: true,
        sku: "37101177"
    },
    {
        id: "drl3000",
        title: 'Superior DRL3000 Direct Vent Gas Fireplace - 45"',
        brand: "Superior Products",
        price: 3299.00,
        image: "/images/products/superior-drl3000.jpg",
        rating: 4.2,
        reviewCount: 12,
        badges: [],
        isFreeShipping: true,
        sku: "M49900022"
    },
    {
        id: "empire-tahoe",
        title: 'Empire Tahoe Premium Direct Vent Gas Fireplace - 36"',
        brand: "Empire",
        price: 2159.00,
        image: "/images/products/empire-tahoe.jpg",
        rating: 4.7,
        reviewCount: 8,
        badges: ["Quick Ship"],
        isFreeShipping: true,
        sku: "M35130999"
    },
    {
        id: "napoleon-entice",
        title: 'Napoleon Entice Wall Hanging Electric Fireplace - 50"',
        brand: "Napoleon",
        price: 1099.00,
        image: "/images/products/napoleon-entice.jpg",
        rating: 4.9,
        reviewCount: 35,
        badges: ["On Sale"],
        isFreeShipping: true,
        sku: "M22500055"
    }
];
