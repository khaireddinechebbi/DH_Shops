import { ProductDocuments } from "@/types/types";
import Image from "next/image";

interface ProductCardProps {
    product: ProductDocuments;
}

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <div className="product-card">
            <Image src={product.image[0]} alt={product.name} width={150} height={150} />
            <h3>{product.name}</h3>
            <p>Price: ${(product.priceInCents / 100).toFixed(2)}</p>
            <p>Owner: {product.owner?.name}</p>
        </div>
    );
}
