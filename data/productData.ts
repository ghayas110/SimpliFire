export interface ProductDetail {
    id: string;
    title: string;
    price: number;
    sku: string;
    brand: string;
    rating: number;
    reviewCount: number;
    description: string;
    features: string[];
    images: string[];
    specifications: Record<string, string>;
    downloads: { name: string; url: string }[];
}

export const products: Record<string, ProductDetail> = {
    "boyd-built-in": {
        id: "boyd-built-in",
        title: 'SimpliFire Boyd Built-In Electric Fireplace - 30"',
        price: 899.00,
        sku: "SF-BOYD-30",
        brand: "SimpliFire",
        rating: 4.8,
        reviewCount: 24,
        description: "The SimpliFire Boyd Built-In Electric Fireplace has been created with a traditional, authentic style. A textured log set sits inside a detailed masonry-style interior. Equipped with the ability to change between four flame heights, a multifunction remote allows you to control the fireplace at your fingertips.",
        features: [
            "Easily change between four flame heights",
            "Provides a viewing area of 648 square inches",
            "Equipped with lighting technology where bulbs never need to be changed",
            "100% efficient, costing pennies an hour to operate",
            "Zone heating allows for reduced monthly bills",
            "Multifunction remote for easy control",
        ],
        images: [
            "/assets/products/Social_Landscape-SFE_Boyd-2B_2336x1314.jpg",
            "/assets/products/Social_Landscape-1A_Boyd_room-Painted-Finish.jpg",
            "/assets/products/Social_Landscape-Boyd_Farmhouse-Style_UO_OrangeBlueFlameNoLights.jpg",
        ],
        specifications: {
            width: '31"',
            height: '26 3/4"',
            depth: '11 3/4"',
            fuelType: "Electric",
            type: "Built-In",
            watts: "3000 Watts",
            heatOutput: "4,800 BTUs",
            remoteControl: "Yes",
        },
        downloads: [
            { name: "Owner's Manual", url: "#" },
            { name: "Installation Guide", url: "#" },
        ],
    },
    "allusion-platinum": {
        id: "allusion-platinum",
        title: "SimpliFire Allusion Platinum Linear Electric Fireplace",
        price: 1999.00,
        sku: "SF-ALL-PLAT-50",
        brand: "SimpliFire",
        rating: 5,
        reviewCount: 12,
        description: "Experience the pinnacle of linear electric fireplaces with the Allusion Platinum. Featuring a large viewing area, minimal frame, and premium media options, it transforms any room into a modern masterpiece. The advanced LED flame technology offers adjustable colors and intensity to match your mood.",
        features: [
            "Premium linear design with minimal frame",
            "Adjustable flame and ember bed colors",
            "Ceramic white stones or crystal media included",
            "Touch controls and multifunction remote",
            "Safe for TV mounting above",
            "Hardwire or plug-in installation",
        ],
        images: [
            "/assets/images/Allusion Platinum.jpg",
        ],
        specifications: {
            width: '50"',
            height: '20"',
            depth: '5 1/2"',
            fuelType: "Electric",
            type: "Linear Wall-Mount / Recessed",
            watts: "5000 BTUs",
            heatOutput: "5,000 BTUs",
            remoteControl: "Yes",
        },
        downloads: [
            { name: "Brochure", url: "#" },
            { name: "Install Manual", url: "#" },
        ],
    },
    "allusion-slim": {
        id: "allusion-slim",
        title: "SimpliFire Allusion Slim Linear Electric Fireplace",
        price: 1299.00,
        sku: "SF-ALL-SLIM-42",
        brand: "SimpliFire",
        rating: 4.8,
        reviewCount: 45,
        description: "The Allusion Slim is designed for 2x4 wall construction, making it the easiest linear fireplace to install recessed into a wall. Its slim profile doesn't sacrifice visual impact, offering bold flames and vibrant lighting options.",
        features: [
            "Designed for 2x4 wall depth installation",
            "Four flame color themes",
            "14 ember bed color options",
            "Recess, flush-mount, or wall-mount capable",
            "Year-round enjoyment with or without heat",
        ],
        images: [
            "/assets/images/Allusion Slim.jpg",
        ],
        specifications: {
            width: '42"',
            height: '18"',
            depth: '4"',
            fuelType: "Electric",
            type: "Recessed Linear",
            watts: "5000 BTUs",
            heatOutput: "5,000 BTUs",
            remoteControl: "Yes",
        },
        downloads: [
            { name: "Spec Sheet", url: "#" },
        ],
    },
    "scion-trinity": {
        id: "scion-trinity",
        title: "SimpliFire Scion Trinity Electric Fireplace",
        price: 2499.00,
        sku: "SF-SCION-43",
        brand: "SimpliFire",
        rating: 4.9,
        reviewCount: 8,
        description: "The Scion Trinity offers a unique three-sided viewing experience, perfect for creating a stunning focal point. Its clean, seamless finish requires no trim, delivering a truly modern built-in look.",
        features: [
            "3-Sided (Bay), 2-Sided (Corner), or Single-Sided installation",
            "No visible vents or mesh screens",
            "Tallest flame in its class",
            "Accent lighting with custom colors",
            "Direct-wire only for clean look",
        ],
        images: [
            "/assets/images/The Scion.jpg",
        ],
        specifications: {
            width: '43"',
            height: '24"',
            depth: '10"',
            fuelType: "Electric",
            type: "Multi-Sided Built-In",
            watts: "5000 BTUs",
            heatOutput: "5,000 BTUs",
            remoteControl: "Yes",
        },
        downloads: [
            { name: "Framing Guide", url: "#" },
        ],
    },
    "forum-outdoor": {
        id: "forum-outdoor",
        title: "SimpliFire Forum Outdoor Electric Fireplace",
        price: 3299.00,
        sku: "SF-FORUM-55",
        brand: "SimpliFire",
        rating: 5,
        reviewCount: 6,
        description: "Extend your living space to the outdoors with the Forum. Built to withstand the elements, it brings the convenience and ambiance of electric fireplaces to your patio or deck.",
        features: [
            "Weather-resistant construction for outdoor use",
            "Water-tight enclosure",
            "Bold flames visible in daylight",
            "Drain pan included",
            "Hardwire installation",
        ],
        images: [
            "/assets/images/Forum.jpg",
        ],
        specifications: {
            width: '55"',
            height: '22"',
            depth: '8"',
            fuelType: "Electric",
            type: "Outdoor Built-In",
            watts: "N/A (No Heat)",
            heatOutput: "Ambiance Only",
            remoteControl: "Yes",
        },
        downloads: [
            { name: "Outdoor Guide", url: "#" },
        ],
    },
    "inception-insert": {
        id: "inception-insert",
        title: "SimpliFire Inception Electric Fireplace Insert",
        price: 1899.00,
        sku: "SF-INCEPT-36",
        brand: "SimpliFire",
        rating: 4.7,
        reviewCount: 22,
        description: "Digital Spark technology captures the essence of a real wood fire in the Inception insert. Designed to fit into existing wood-burning fireplaces, it offers the safest and easiest upgrade to electric.",
        features: [
            "Digital Spark™ technology for hyper-realistic flames",
            "Authentic brick interior appearance",
            "Fits most masonry and factory-built fireplaces",
            "Warming heater for supplemental heat",
            "Glass front for safety",
        ],
        images: [
            "/assets/images/Inception Insert.jpg",
        ],
        specifications: {
            width: '36"',
            height: '24"',
            depth: '14"',
            fuelType: "Electric",
            type: "Insert",
            watts: "1500 Watts",
            heatOutput: "5,000 BTUs",
            remoteControl: "Yes",
        },
        downloads: [
            { name: "Manual", url: "#" },
        ],
    },
    "format-wall-mount": {
        id: "format-wall-mount",
        title: "SimpliFire Format Wall Mount Electric Fireplace",
        price: 1499.00,
        sku: "SF-FMT-36",
        brand: "SimpliFire",
        rating: 4.6,
        reviewCount: 18,
        description: "The Format wall mount fireplace is the easiest way to add a modern focal point to your space. Its floating mantel design and simple installation make it a favorite for DIYers and renters.",
        features: [
            "Simple wall-mount installation",
            "Clean, floating mantel look",
            "Integrated downlighting for mood",
            "Shadow-box surround",
            "Plug-in ready",
        ],
        images: [
            "/assets/images/Format Wall Mount.jpg",
        ],
        specifications: {
            width: '36"',
            height: '22"',
            depth: '10"',
            fuelType: "Electric",
            type: "Wall Mount",
            watts: "1500 Watts",
            heatOutput: "5,000 BTUs",
            remoteControl: "Yes",
        },
        downloads: [
            { name: "User Guide", url: "#" },
        ],
    },
};

// Default export for backward compatibility if needed, but preferably use named export
export default products;
