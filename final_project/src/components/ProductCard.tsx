import { ProductDocuments } from "@/types/types";
import Image from "next/image";

interface ProductCardProps {
    product: ProductDocuments;
}

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <div className="card bg-base-100 w-96 shadow-xl">
            <figure>
                <Image
                src={product.images[0]}
                alt={product.title} />
            </figure>
            <div className="card-body">
                <h2 className="card-title">{product.name}</h2>
                <p>Price: ${(product.priceInCents / 100).toFixed(2)}</p>
                <p>Owner: {product.owner?.name}</p>
                <div className="card-actions justify-end">
                <button className="btn btn-primary">Buy Now</button>
                </div>
            </div>
        </div>
    );
}