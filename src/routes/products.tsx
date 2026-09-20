import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Menu,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  X,
} from "lucide-react";

import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import {
  categoryKeys,
  PRODUCTS_PAGE_SIZE,
  products,
  type Category,
  type Language,
} from "@/data/products";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "All products — Hamere Asian Market" },
      {
        name: "description",
        content: "Browse the full Hamere Asian Market catalog with search and pagination.",
      },
      { property: "og:title", content: "All products — Hamere Asian Market" },
      {
        property: "og:description",
        content: "Search and browse authentic East Asian groceries from Hamere Asian Market.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductsPage,
});

type Cart = Record<number, number>;

const copy = {
  en: {
    nav: ["Shop", "Custom sourcing", "Our story", "Contact"],
    cart: "Review order",
    catalogEyebrow: "The market edit",
    catalogTitle: "The full collection.",
    catalogText: "Search the catalog, filter by category, and browse every item we currently offer.",
    search: "Search products",
    searchPlaceholder: "Search by name, brand notes, or unit…",
    categories: [
      "All goods",
      "Fresh produce",
      "Pantry & sauces",
      "Snacks & drinks",
      "Frozen goods",
      "Household",
    ],
    add: "Add",
    added: "Added",
    stock: "In stock",
    preorder: "Pre-order",
    birr: "ETB",
    empty: "No products match your search.",
    emptySub: "Try another keyword or reset the category filter.",
    showing: (from: number, to: number, total: number) => `Showing ${from}–${to} of ${total}`,
    previous: "Previous",
    next: "Next",
    back: "Back to home",
    drawerTitle: "Your order",
    drawerSub: "Catalog items",
    cartEmpty: "Your market basket is empty.",
    cartEmptySub: "Add catalog goods to begin.",
  },
  zh: {
    nav: ["选购", "专属采买", "品牌故事", "联系我们"],
    cart: "查看订单",
    catalogEyebrow: "市场精选",
    catalogTitle: "全部商品。",
    catalogText: "搜索目录、按分类筛选，浏览我们目前提供的每一件商品。",
    search: "搜索商品",
    searchPlaceholder: "按名称、备注或规格搜索…",
    categories: ["全部商品", "新鲜蔬菜", "调料干货", "零食饮料", "冷冻食品", "生活用品"],
    add: "加入",
    added: "已加入",
    stock: "现货",
    preorder: "可预订",
    birr: "比尔",
    empty: "没有符合条件的商品。",
    emptySub: "请尝试其他关键词，或重置分类筛选。",
    showing: (from: number, to: number, total: number) => `显示 ${from}–${to} / 共 ${total}`,
    previous: "上一页",
    next: "下一页",
    back: "返回首页",
    drawerTitle: "您的订单",
    drawerSub: "现货商品",
    cartEmpty: "购物篮还是空的。",
    cartEmptySub: "添加商品即可开始。",
  },
};

const navTargets = ["/products", "/#sourcing", "/#story", "/#contact"] as const;

function ProductsPage() {
  const [lang, setLang] = useState<Language>("en");
  const [category, setCategory] = useState<Category>("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [cart, setCart] = useState<Cart>({});
  const [drawer, setDrawer] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [notice, setNotice] = useState("");
  const t = copy[lang];

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = category === "all" || product.category === category;
      if (!matchesCategory) return false;
      if (!term) return true;
      return (
        product.en.toLowerCase().includes(term) ||
        product.zh.toLowerCase().includes(term) ||
        product.unit.toLowerCase().includes(term)
      );
    });
  }, [category, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PRODUCTS_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PRODUCTS_PAGE_SIZE;
  const visible = filtered.slice(pageStart, pageStart + PRODUCTS_PAGE_SIZE);
  const itemCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  useEffect(() => {
    setPage(1);
  }, [category, query]);

  useEffect(() => {
    document.documentElement.lang = lang === "en" ? "en" : "zh-CN";
    if (!drawer && !mobileNav) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDrawer(false);
        setMobileNav(false);
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [drawer, mobileNav, lang]);

  const addProduct = (id: number) => {
    setCart((current) => ({ ...current, [id]: (current[id] ?? 0) + 1 }));
    setNotice(`${products.find((product) => product.id === id)?.[lang]} ${t.added.toLowerCase()}`);
    window.setTimeout(() => setNotice(""), 1800);
  };

  const updateQty = (id: number, amount: number) => {
    setCart((current) => {
      const next = Math.max(0, (current[id] ?? 0) + amount);
      const updated = { ...current, [id]: next };
      if (next === 0) delete updated[id];
      return updated;
    });
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <header className="glass-nav fixed inset-x-0 top-0 z-40 border-b border-border/70">
        <div className="mx-auto flex h-18 max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <Link to="/" className="group flex items-center gap-3 text-left" aria-label="Hamere Asian Market home">
            <span className="grid size-9 place-items-center bg-primary text-sm font-bold text-primary-foreground transition-transform group-hover:rotate-3">
              禾
            </span>
            <span>
              <span className="block text-sm font-extrabold uppercase leading-none">Hamere</span>
              <span className="mt-1 block text-[10px] font-semibold uppercase text-muted-foreground">
                Asian Market · 亚洲市集
              </span>
            </span>
          </Link>
          <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
            {t.nav.map((label, index) => {
              const target = navTargets[index];
              if (index === 0) {
                return (
                  <span key={label} className="text-xs font-bold uppercase text-primary">
                    {label}
                  </span>
                );
              }
              return (
                <a
                  key={label}
                  href={target}
                  className="text-xs font-bold uppercase text-ink-soft transition-colors hover:text-primary"
                >
                  {label}
                </a>
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
            <div className="flex h-9 items-center border border-border bg-card p-0.5" aria-label="Language">
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`h-8 px-2.5 text-[11px] font-bold transition-colors ${lang === "en" ? "bg-foreground text-background" : "text-muted-foreground"}`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang("zh")}
                className={`h-8 px-2.5 text-[11px] font-bold transition-colors ${lang === "zh" ? "bg-foreground text-background" : "text-muted-foreground"}`}
              >
                中文
              </button>
            </div>
            <Button
              type="button"
              onClick={() => setDrawer(true)}
              size="icon"
              className="relative size-9"
              aria-label={t.cart}
            >
              <ShoppingBag />
              {itemCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-jade text-[10px] font-bold text-jade-foreground">
                  {itemCount}
                </span>
              )}
            </Button>
            <Button
              type="button"
              onClick={() => setMobileNav((open) => !open)}
              variant="outline"
              size="icon"
              className="size-9 lg:hidden"
              aria-label="Menu"
            >
              {mobileNav ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
        {mobileNav && (
          <nav className="border-t border-border bg-background px-5 py-4 lg:hidden">
            {t.nav.map((label, index) => {
              const target = navTargets[index];
              return (
                <a
                  key={label}
                  href={target}
                  onClick={() => setMobileNav(false)}
                  className="flex w-full items-center justify-between border-b border-border py-3 text-left text-sm font-semibold last:border-0"
                >
                  {label}
                  <ChevronRight className="size-4" />
                </a>
              );
            })}
          </nav>
        )}
      </header>

      <main className="pt-18">
        <section className="px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="mx-auto max-w-[1440px]">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div className="max-w-2xl">
                <Link
                  to="/"
                  className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase text-primary hover:text-primary/80"
                >
                  <ArrowLeft className="size-3.5" />
                  {t.back}
                </Link>
                <p className="text-xs font-bold uppercase text-primary">{t.catalogEyebrow}</p>
                <h1 className="mt-3 text-3xl font-extrabold sm:text-5xl">{t.catalogTitle}</h1>
                <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">{t.catalogText}</p>
              </div>
              <Button variant="outline" onClick={() => setDrawer(true)} className="self-start lg:self-auto">
                <ShoppingBag />
                {t.cart} · {itemCount}
              </Button>
            </div>

            <label className="relative mt-10 block max-w-xl">
              <span className="sr-only">{t.search}</span>
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t.searchPlaceholder}
                className="h-12 w-full border border-input bg-background pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </label>

            <div className="mt-6 flex gap-2 overflow-x-auto border-b border-border pb-4 [scrollbar-width:none]">
              {categoryKeys.map((key, index) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setCategory(key)}
                  className={`shrink-0 border px-4 py-2 text-xs font-bold transition-colors ${category === key ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:border-primary hover:text-primary"}`}
                >
                  {t.categories[index]}
                </button>
              ))}
            </div>

            {visible.length > 0 ? (
              <>
                <div className="mt-8 grid grid-cols-1 gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
                  {visible.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      lang={lang}
                      inCart={Boolean(cart[product.id])}
                      labels={t}
                      onAdd={addProduct}
                    />
                  ))}
                </div>
                <div className="mt-12 flex flex-col items-center gap-5">
                  <p className="text-xs font-semibold text-muted-foreground">
                    {t.showing(
                      filtered.length === 0 ? 0 : pageStart + 1,
                      Math.min(pageStart + PRODUCTS_PAGE_SIZE, filtered.length),
                      filtered.length,
                    )}
                  </p>
                  {totalPages > 1 && (
                    <nav aria-label="Pagination" className="flex flex-wrap items-center justify-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-10"
                        disabled={currentPage === 1}
                        onClick={() => setPage((current) => Math.max(1, current - 1))}
                      >
                        <ChevronLeft />
                        {t.previous}
                      </Button>
                      {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                        <button
                          key={pageNumber}
                          type="button"
                          onClick={() => setPage(pageNumber)}
                          aria-current={pageNumber === currentPage ? "page" : undefined}
                          className={`grid size-10 place-items-center border text-xs font-bold transition-colors ${pageNumber === currentPage ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:border-primary hover:text-primary"}`}
                        >
                          {pageNumber}
                        </button>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        className="h-10"
                        disabled={currentPage === totalPages}
                        onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                      >
                        {t.next}
                        <ChevronRight />
                      </Button>
                    </nav>
                  )}
                </div>
              </>
            ) : (
              <div className="mt-16 grid place-items-center text-center">
                <div>
                  <Search className="mx-auto size-9 text-muted-foreground" />
                  <h2 className="mt-4 font-bold">{t.empty}</h2>
                  <p className="mt-2 text-xs text-muted-foreground">{t.emptySub}</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {notice && (
        <div
          role="status"
          className="fixed bottom-5 left-1/2 z-[70] flex -translate-x-1/2 items-center gap-2 bg-jade px-4 py-3 text-xs font-bold text-jade-foreground shadow-market"
        >
          <Check className="size-4" />
          {notice}
        </div>
      )}

      {drawer && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close order"
            onClick={() => setDrawer(false)}
            className="absolute inset-0 bg-foreground/55 backdrop-blur-sm"
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label={t.drawerTitle}
            className="absolute inset-y-0 right-0 flex w-full max-w-xl flex-col bg-background shadow-market"
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-5 sm:px-7">
              <div>
                <h2 className="text-xl font-extrabold">{t.drawerTitle}</h2>
                <p className="mt-1 text-xs text-muted-foreground">{t.drawerSub}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setDrawer(false)} aria-label="Close">
                <X />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-7">
              {itemCount === 0 ? (
                <div className="grid min-h-72 place-items-center text-center">
                  <div>
                    <ShoppingBag className="mx-auto size-9 text-muted-foreground" />
                    <h3 className="mt-4 font-bold">{t.cartEmpty}</h3>
                    <p className="mt-2 text-xs text-muted-foreground">{t.cartEmptySub}</p>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-border border-y border-border">
                  {products
                    .filter((product) => cart[product.id])
                    .map((product) => (
                      <div key={product.id} className="flex gap-3 py-4">
                        <img src={product.image} alt="" className="size-16 object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold">{product[lang]}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {t.birr} {product.price.toLocaleString()}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="size-7"
                              onClick={() => updateQty(product.id, -1)}
                              aria-label="Decrease"
                            >
                              <Minus />
                            </Button>
                            <span className="w-5 text-center text-xs font-bold">{cart[product.id]}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="size-7"
                              onClick={() => updateQty(product.id, 1)}
                              aria-label="Increase"
                            >
                              <Plus />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm font-bold">
                          {t.birr} {(product.price * (cart[product.id] ?? 0)).toLocaleString()}
                        </p>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
