import { Check, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Language, Product } from "@/data/products";

type ProductCardProps = {
  product: Product;
  lang: Language;
  inCart: boolean;
  labels: {
    add: string;
    stock: string;
    preorder: string;
    birr: string;
  };
  onAdd: (id: number) => void;
};

export function ProductCard({ product, lang, inCart, labels, onAdd }: ProductCardProps) {
  return (
    <article className="group">
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={product.image}
          alt={`${product.en} / ${product.zh}`}
          loading="lazy"
          width={816}
          height={816}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <span
          className={`absolute left-3 top-3 px-2.5 py-1 text-[10px] font-bold uppercase ${product.stock === "stock" ? "bg-jade text-jade-foreground" : "bg-card text-primary"}`}
        >
          {product.stock === "stock" ? labels.stock : labels.preorder}
        </span>
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold">{product[lang]}</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {lang === "en" ? product.zh : product.en} · {product.unit}
          </p>
        </div>
        <Button
          type="button"
          size="icon"
          variant={inCart ? "default" : "outline"}
          onClick={() => onAdd(product.id)}
          aria-label={`${labels.add} ${product[lang]}`}
          title={`${labels.add} ${product[lang]}`}
        >
          {inCart ? <Check /> : <Plus />}
        </Button>
      </div>
      <p className="mt-3 text-sm font-extrabold">
        {labels.birr} {product.price.toLocaleString()}
      </p>
    </article>
  );
}
