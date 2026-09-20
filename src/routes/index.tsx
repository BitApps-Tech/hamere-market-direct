import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Clock3,
  Globe2,
  ImagePlus,
  MapPin,
  Menu,
  MessageCircle,
  Minus,
  PackageCheck,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import heroImage from "@/assets/hamere-market-hero.jpg";
import bokChoyImage from "@/assets/product-bok-choy.jpg";
import chopsticksImage from "@/assets/product-chopsticks.jpg";
import chiliCrispImage from "@/assets/product-chili-crisp.jpg";
import dumplingsImage from "@/assets/product-dumplings.jpg";
import riceImage from "@/assets/product-jasmine-rice.jpg";
import sodaImage from "@/assets/product-lychee-soda.jpg";
import seaweedImage from "@/assets/product-seaweed.jpg";
import soySauceImage from "@/assets/product-soy-sauce.jpg";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hamere Asian Market — Authentic Asian Groceries & Sourcing" },
      {
        name: "description",
        content:
          "Shop curated East Asian groceries and request custom sourcing across East Africa from Hamere Asian Market.",
      },
      {
        property: "og:title",
        content: "Hamere Asian Market — Authentic Asian Groceries & Sourcing",
      },
      {
        property: "og:description",
        content: "Curated East Asian essentials and personal sourcing for East Africa.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MarketPage,
});

type Language = "en" | "zh";
type Category = "all" | "produce" | "pantry" | "snacks" | "frozen" | "household";
type Product = {
  id: number;
  en: string;
  zh: string;
  category: Exclude<Category, "all">;
  price: number;
  unit: string;
  stock: "stock" | "preorder";
  image: string;
};
type Cart = Record<number, number>;
type SourceRequest = {
  id: number;
  item: string;
  quantity: string;
  unit: string;
  notes: string;
  imageName: string;
  imageUrl: string;
};

const products: Product[] = [
  {
    id: 1,
    en: "Shanghai Bok Choy",
    zh: "上海青",
    category: "produce",
    price: 180,
    unit: "500g",
    stock: "stock",
    image: bokChoyImage,
  },
  {
    id: 2,
    en: "Premium Light Soy Sauce",
    zh: "特级生抽",
    category: "pantry",
    price: 420,
    unit: "500ml",
    stock: "stock",
    image: soySauceImage,
  },
  {
    id: 3,
    en: "Roasted Seaweed Crisps",
    zh: "烤海苔",
    category: "snacks",
    price: 260,
    unit: "12 pack",
    stock: "stock",
    image: seaweedImage,
  },
  {
    id: 4,
    en: "Pork & Chive Dumplings",
    zh: "猪肉韭菜水饺",
    category: "frozen",
    price: 680,
    unit: "700g",
    stock: "preorder",
    image: dumplingsImage,
  },
  {
    id: 5,
    en: "Sichuan Chili Crisp",
    zh: "四川香辣脆",
    category: "pantry",
    price: 480,
    unit: "280g",
    stock: "stock",
    image: chiliCrispImage,
  },
  {
    id: 6,
    en: "Fragrant Jasmine Rice",
    zh: "茉莉香米",
    category: "pantry",
    price: 1250,
    unit: "5kg",
    stock: "stock",
    image: riceImage,
  },
  {
    id: 7,
    en: "Sparkling Lychee Soda",
    zh: "荔枝汽水",
    category: "snacks",
    price: 390,
    unit: "3 bottles",
    stock: "preorder",
    image: sodaImage,
  },
  {
    id: 8,
    en: "Bamboo Chopstick Set",
    zh: "竹筷套装",
    category: "household",
    price: 520,
    unit: "5 pairs",
    stock: "stock",
    image: chopsticksImage,
  },
];

const copy = {
  en: {
    nav: ["Shop", "Custom sourcing", "Our story", "Contact"],
    cart: "Review order",
    eyebrow: "Curated in Addis Ababa · Sourced across Asia",
    hero: "Authentic Asian Ingredients & Custom Sourcing",
    heroSub: "亚裔美馔 · 专属采买",
    heroText: "The ingredients you miss, carefully selected and brought closer to home.",
    shop: "Shop the collection",
    source: "Request an item",
    delivery: "Delivery across Addis",
    direct: "Direct supplier sourcing",
    bilingual: "Bilingual assistance",
    catalogEyebrow: "The market edit",
    catalogTitle: "Everyday essentials, chosen well.",
    catalogText:
      "A considered selection for home kitchens, restaurants, and the tastes you know by heart.",
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
    storyEyebrow: "Hamere’s table",
    storyTitle: "More than a market. A familiar taste of home.",
    storyText:
      "Hamere Asian Market began with a simple promise: make authentic East Asian ingredients easier to find in East Africa. Every item is chosen for freshness, provenance, and the way it earns its place in a real kitchen.",
    storyQuote: "If it isn’t on the shelf, I’ll help you find it.",
    sourcingEyebrow: "Personal sourcing desk",
    sourcingTitle: "Looking for something specific?",
    sourcingText:
      "Share a name, photo, or brand. Hamere will verify the exact item with trusted suppliers and return a clear quote.",
    itemName: "Item name",
    itemPlaceholder: "e.g. Lee Kum Kee oyster sauce / 李锦记蚝油",
    upload: "Add reference photo",
    uploadHelp: "JPG or PNG · packaging photos work best",
    quantity: "Quantity",
    unit: "Preferred unit",
    notes: "Brand preference or notes",
    notesPlaceholder: "Size, flavor, preferred brand, or acceptable alternatives…",
    addRequest: "Add sourcing request",
    requestAdded: "Request added to your order.",
    drawerTitle: "Your order",
    drawerSub: "Catalog + custom sourcing",
    empty: "Your market basket is empty.",
    emptySub: "Add catalog goods or a sourcing request to begin.",
    catalogItems: "Catalog items",
    sourceItems: "Sourcing requests",
    subtotal: "Catalog subtotal",
    quoteNote: "Custom items will be priced in your quote.",
    customer: "Delivery details",
    name: "Full name",
    phone: "Phone / WhatsApp",
    address: "Delivery address",
    submit: "Submit order & request quote",
    required: "Please complete your name, phone, and delivery address.",
    confirmed: "Request ready",
    confirmedTitle: "Thank you — your order is prepared.",
    confirmedText:
      "Hamere will review your custom requests and reply with prices within 2 hours during opening hours.",
    openWhatsapp: "Continue to WhatsApp",
    continueShop: "Keep shopping",
    footerTitle: "A closer market for the flavors you love.",
    hours: "Opening hours",
    location: "Find us",
    contact: "Contact",
    weekdays: "Mon–Sat · 9:00–19:00",
    sunday: "Sunday · 10:00–17:00",
    sample: "Sample contact details — replace before launch",
    mapLabel: "Bole, Addis Ababa",
    wechat: "WeChat QR",
    whatsapp: "Chat on WhatsApp",
  },
  zh: {
    nav: ["选购", "专属采买", "品牌故事", "联系我们"],
    cart: "查看订单",
    eyebrow: "亚的斯亚贝巴精选 · 亚洲直采",
    hero: "地道亚洲食材与专属采买",
    heroSub: "Authentic Asian Ingredients · Custom Sourcing",
    heroText: "将您想念的味道，悉心挑选，送到离家更近的地方。",
    shop: "选购商品",
    source: "提交采买需求",
    delivery: "亚的斯市区配送",
    direct: "供应商直接采购",
    bilingual: "中英双语服务",
    catalogEyebrow: "市场精选",
    catalogTitle: "日常所需，样样用心。",
    catalogText: "为家庭厨房、餐厅与熟悉的家乡味道，甄选可靠好物。",
    categories: ["全部商品", "新鲜蔬菜", "调料干货", "零食饮料", "冷冻食品", "生活用品"],
    add: "加入",
    added: "已加入",
    stock: "现货",
    preorder: "可预订",
    birr: "比尔",
    storyEyebrow: "Hamere 的餐桌",
    storyTitle: "不只是一家市场，更是一份熟悉的家乡味。",
    storyText:
      "Hamere Asian Market 始于一个简单的承诺：让东非的亚洲食材更容易获得。我们以新鲜度、来源与真实厨房体验为标准，认真挑选每一件商品。",
    storyQuote: "货架上没有的，我也会帮您找到。",
    sourcingEyebrow: "专属采买服务",
    sourcingTitle: "在找特别的商品？",
    sourcingText: "发送名称、图片或品牌，Hamere 将通过可信供应商确认商品，并提供清晰报价。",
    itemName: "商品名称",
    itemPlaceholder: "例如：李锦记蚝油 / oyster sauce",
    upload: "添加参考图片",
    uploadHelp: "JPG 或 PNG · 包装图片更便于确认",
    quantity: "数量",
    unit: "单位",
    notes: "品牌偏好或备注",
    notesPlaceholder: "规格、口味、品牌，或可接受的替代品……",
    addRequest: "加入采买需求",
    requestAdded: "采买需求已加入订单。",
    drawerTitle: "您的订单",
    drawerSub: "现货商品 + 专属采买",
    empty: "购物篮还是空的。",
    emptySub: "添加商品或提交采买需求即可开始。",
    catalogItems: "现货商品",
    sourceItems: "采买需求",
    subtotal: "商品小计",
    quoteNote: "定制采购商品将在报价中计价。",
    customer: "配送信息",
    name: "姓名",
    phone: "电话 / WhatsApp",
    address: "配送地址",
    submit: "提交订单并索取报价",
    required: "请填写姓名、电话和配送地址。",
    confirmed: "订单已准备",
    confirmedTitle: "谢谢，您的订单已整理完成。",
    confirmedText: "营业时间内，Hamere 将在 2 小时内审核采购需求并回复报价。",
    openWhatsapp: "前往 WhatsApp",
    continueShop: "继续选购",
    footerTitle: "让喜爱的家乡味，离您更近。",
    hours: "营业时间",
    location: "店铺位置",
    contact: "联系方式",
    weekdays: "周一至周六 · 9:00–19:00",
    sunday: "周日 · 10:00–17:00",
    sample: "以下为示例联系信息，上线前请替换",
    mapLabel: "亚的斯亚贝巴 · 博莱",
    wechat: "微信二维码",
    whatsapp: "WhatsApp 咨询",
  },
};

const categoryKeys: Category[] = ["all", "produce", "pantry", "snacks", "frozen", "household"];
const navTargets = ["catalog", "sourcing", "story", "contact"];

function MarketPage() {
  const [lang, setLang] = useState<Language>("en");
  const [category, setCategory] = useState<Category>("all");
  const [cart, setCart] = useState<Cart>({});
  const [requests, setRequests] = useState<SourceRequest[]>([]);
  const [drawer, setDrawer] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");
  const [customer, setCustomer] = useState({ name: "", phone: "", address: "" });
  const [sourceForm, setSourceForm] = useState({
    item: "",
    quantity: "1",
    unit: "pieces",
    notes: "",
    imageName: "",
    imageUrl: "",
  });
  const t = copy[lang];
  const filtered = products.filter(
    (product) => category === "all" || product.category === category,
  );
  const itemCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0) + requests.length;
  const subtotal = useMemo(
    () => products.reduce((sum, product) => sum + product.price * (cart[product.id] ?? 0), 0),
    [cart],
  );

  useEffect(() => {
    document.documentElement.lang = lang === "en" ? "en" : "zh-CN";
    if (!drawer && !confirmed && !mobileNav) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDrawer(false);
        setConfirmed(false);
        setMobileNav(false);
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [drawer, confirmed, mobileNav, lang]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileNav(false);
  };

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

  const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (sourceForm.imageUrl) URL.revokeObjectURL(sourceForm.imageUrl);
    setSourceForm((current) => ({
      ...current,
      imageName: file.name,
      imageUrl: URL.createObjectURL(file),
    }));
  };

  const addSourceRequest = (event: FormEvent) => {
    event.preventDefault();
    if (!sourceForm.item.trim()) return;
    setRequests((current) => [...current, { ...sourceForm, id: Date.now() }]);
    setSourceForm({
      item: "",
      quantity: "1",
      unit: "pieces",
      notes: "",
      imageName: "",
      imageUrl: "",
    });
    setNotice(t.requestAdded);
    window.setTimeout(() => setNotice(""), 1800);
  };

  const prepareOrder = () => {
    if (!customer.name.trim() || !customer.phone.trim() || !customer.address.trim()) {
      setFormError(t.required);
      return;
    }
    if (itemCount === 0) {
      setFormError(t.empty);
      return;
    }
    setFormError("");
    setDrawer(false);
    setConfirmed(true);
  };

  const whatsappUrl = useMemo(() => {
    const selected = products
      .filter((p) => cart[p.id])
      .map((p) => {
        const quantity = cart[p.id] ?? 0;
        return `• ${p.en} / ${p.zh} × ${quantity} — ETB ${(p.price * quantity).toLocaleString()}`;
      });
    const sourced = requests.map(
      (r) =>
        `• ${r.item} — ${r.quantity} ${r.unit}${r.notes ? ` (${r.notes})` : ""}${r.imageName ? ` [Photo: ${r.imageName}]` : ""}`,
    );
    const message = [
      `HAMERE ASIAN MARKET — NEW ORDER`,
      ``,
      `CUSTOMER`,
      `Name: ${customer.name}`,
      `Phone: ${customer.phone}`,
      `Address: ${customer.address}`,
      ``,
      `CATALOG ITEMS`,
      selected.length ? selected.join("\n") : "None",
      ``,
      `CUSTOM SOURCING`,
      sourced.length ? sourced.join("\n") : "None",
      ``,
      `Catalog subtotal: ETB ${subtotal.toLocaleString()}`,
      `Please confirm availability, sourcing prices, and delivery.`,
    ].join("\n");
    return `https://wa.me/251911000000?text=${encodeURIComponent(message)}`;
  }, [cart, customer, requests, subtotal]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <header className="glass-nav fixed inset-x-0 top-0 z-40 border-b border-border/70">
        <div className="mx-auto flex h-18 max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <button
            type="button"
            onClick={() => scrollTo("top")}
            className="group flex items-center gap-3 text-left"
            aria-label="Hamere Asian Market home"
          >
            <span className="grid size-9 place-items-center bg-primary text-sm font-bold text-primary-foreground transition-transform group-hover:rotate-3">
              禾
            </span>
            <span>
              <span className="block text-sm font-extrabold uppercase leading-none">Hamere</span>
              <span className="mt-1 block text-[10px] font-semibold uppercase text-muted-foreground">
                Asian Market · 亚洲市集
              </span>
            </span>
          </button>
          <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
            {t.nav.map((label, index) => (
              <button
                key={label}
                type="button"
                onClick={() => {
                  const target = navTargets[index];
                  if (target) scrollTo(target);
                }}
                className="text-xs font-bold uppercase text-ink-soft transition-colors hover:text-primary"
              >
                {label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <div
              className="flex h-9 items-center border border-border bg-card p-0.5"
              aria-label="Language"
            >
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
            {t.nav.map((label, index) => (
              <button
                key={label}
                type="button"
                onClick={() => {
                  const target = navTargets[index];
                  if (target) scrollTo(target);
                }}
                className="flex w-full items-center justify-between border-b border-border py-3 text-left text-sm font-semibold last:border-0"
              >
                {label}
                <ChevronRight className="size-4" />
              </button>
            ))}
          </nav>
        )}
      </header>

      <main id="top">
        <section className="relative flex min-h-[760px] items-center overflow-hidden pt-18 lg:min-h-[800px]">
          <img
            src={heroImage}
            alt="Bok choy, sauces, chilies, mushrooms, and pantry ingredients"
            width={1920}
            height={1088}
            className="absolute inset-0 size-full object-cover object-[67%_center]"
          />
          <div className="hero-shade absolute inset-0" />
          <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 py-28 sm:px-8 lg:px-12">
            <div className="reveal-up max-w-2xl text-hero-foreground">
              <div className="mb-7 flex items-center gap-3 text-[11px] font-bold uppercase text-gold">
                <span className="h-px w-10 bg-gold" />
                {t.eyebrow}
              </div>
              <h1 className="text-4xl font-extrabold leading-[1.08] sm:text-6xl lg:text-7xl">
                {t.hero}
              </h1>
              <p className="mt-5 text-xl font-medium text-hero-foreground/80 sm:text-2xl">
                {t.heroSub}
              </p>
              <p className="mt-7 max-w-lg text-base leading-7 text-hero-foreground/75">
                {t.heroText}
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button size="lg" onClick={() => scrollTo("catalog")} className="h-12 px-6">
                  {t.shop}
                  <ArrowRight />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => scrollTo("sourcing")}
                  className="h-12 border-hero-foreground/40 bg-foreground/20 px-6 text-hero-foreground hover:bg-foreground/40 hover:text-hero-foreground"
                >
                  {t.source}
                </Button>
              </div>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 z-10 border-t border-hero-foreground/20 bg-foreground/55 text-hero-foreground backdrop-blur-md">
            <div className="mx-auto grid max-w-[1440px] grid-cols-1 divide-y divide-hero-foreground/15 px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8 lg:px-12">
              {[
                { Icon: MapPin, label: t.delivery },
                { Icon: PackageCheck, label: t.direct },
                { Icon: Globe2, label: t.bilingual },
              ].map(({ Icon, label }) => (
                <div
                  key={String(label)}
                  className="flex items-center gap-3 py-4 sm:px-6 sm:first:pl-0"
                >
                  <Icon className="size-4 text-gold" />
                  <span className="text-xs font-semibold">{String(label)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="catalog" className="px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="mx-auto max-w-[1440px]">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div className="max-w-2xl">
                <p className="text-xs font-bold uppercase text-primary">{t.catalogEyebrow}</p>
                <h2 className="mt-3 text-3xl font-extrabold sm:text-5xl">{t.catalogTitle}</h2>
                <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
                  {t.catalogText}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setDrawer(true)}
                className="self-start lg:self-auto"
              >
                <ShoppingBag />
                {t.cart} · {itemCount}
              </Button>
            </div>
            <div className="mt-10 flex gap-2 overflow-x-auto border-b border-border pb-4 [scrollbar-width:none]">
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
            <div className="mt-8 grid grid-cols-1 gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
              {filtered.map((product) => (
                <article key={product.id} className="group">
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
                      {product.stock === "stock" ? t.stock : t.preorder}
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
                      variant={cart[product.id] ? "default" : "outline"}
                      onClick={() => addProduct(product.id)}
                      aria-label={`${t.add} ${product[lang]}`}
                      title={`${t.add} ${product[lang]}`}
                    >
                      {cart[product.id] ? <Check /> : <Plus />}
                    </Button>
                  </div>
                  <p className="mt-3 text-sm font-extrabold">
                    {t.birr} {product.price.toLocaleString()}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="story"
          className="market-grid border-y border-border bg-secondary/55 px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
        >
          <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
            <div className="relative mx-auto grid size-72 place-items-center border border-primary/20 sm:size-96">
              <div className="absolute inset-6 border border-primary/15" />
              <div className="relative text-center">
                <span className="text-7xl font-extrabold text-primary">禾</span>
                <p className="mt-3 text-xs font-bold uppercase text-muted-foreground">
                  Hamere · 哈梅蕾
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-primary">{t.storyEyebrow}</p>
              <h2 className="mt-3 max-w-2xl text-3xl font-extrabold leading-tight sm:text-5xl">
                {t.storyTitle}
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground">
                {t.storyText}
              </p>
              <blockquote className="mt-8 border-l-2 border-primary pl-5 text-xl font-semibold">
                “{t.storyQuote}”
              </blockquote>
              <p className="mt-4 text-xs font-bold uppercase text-primary">
                — Hamere, Founder & curator
              </p>
            </div>
          </div>
        </section>

        <section id="sourcing" className="px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-[.8fr_1.2fr]">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="text-xs font-bold uppercase text-primary">{t.sourcingEyebrow}</p>
              <h2 className="mt-3 text-3xl font-extrabold sm:text-5xl">{t.sourcingTitle}</h2>
              <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground">
                {t.sourcingText}
              </p>
              <div className="mt-8 space-y-4">
                {[
                  { en: "Send any reference", zh: "发送任意参考信息" },
                  { en: "We verify exact packaging", zh: "确认准确包装与品牌" },
                  { en: "Receive one combined quote", zh: "收到一份合并报价" },
                ].map((step, index) => (
                  <div key={step.en} className="flex items-center gap-4">
                    <span className="grid size-8 shrink-0 place-items-center border border-primary text-xs font-bold text-primary">
                      0{index + 1}
                    </span>
                    <span className="text-sm font-semibold">{step[lang]}</span>
                  </div>
                ))}
              </div>
            </div>
            <form
              onSubmit={addSourceRequest}
              className="border border-border bg-card p-5 shadow-market sm:p-8"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="sm:col-span-2">
                  <span className="mb-2 block text-xs font-bold">{t.itemName}</span>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      required
                      value={sourceForm.item}
                      onChange={(e) => setSourceForm({ ...sourceForm, item: e.target.value })}
                      placeholder={t.itemPlaceholder}
                      className="h-12 w-full border border-input bg-background pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                    />
                  </div>
                </label>
                <label className="sm:col-span-2">
                  <span className="mb-2 block text-xs font-bold">{t.upload}</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={handleImage}
                    className="sr-only"
                  />
                  <span className="flex min-h-28 cursor-pointer items-center justify-center gap-4 border border-dashed border-input bg-background p-4 text-center transition hover:border-primary">
                    {sourceForm.imageUrl ? (
                      <img
                        src={sourceForm.imageUrl}
                        alt="Reference preview"
                        className="size-20 object-cover"
                      />
                    ) : (
                      <span className="grid size-11 place-items-center bg-secondary text-primary">
                        <ImagePlus className="size-5" />
                      </span>
                    )}
                    <span className="text-left">
                      <span className="block text-sm font-semibold">
                        {sourceForm.imageName || t.upload}
                      </span>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {t.uploadHelp}
                      </span>
                    </span>
                  </span>
                </label>
                <label>
                  <span className="mb-2 block text-xs font-bold">{t.quantity}</span>
                  <input
                    min="1"
                    type="number"
                    value={sourceForm.quantity}
                    onChange={(e) => setSourceForm({ ...sourceForm, quantity: e.target.value })}
                    className="h-12 w-full border border-input bg-background px-3 text-sm outline-none focus:border-primary"
                  />
                </label>
                <label>
                  <span className="mb-2 block text-xs font-bold">{t.unit}</span>
                  <select
                    value={sourceForm.unit}
                    onChange={(e) => setSourceForm({ ...sourceForm, unit: e.target.value })}
                    className="h-12 w-full border border-input bg-background px-3 text-sm outline-none focus:border-primary"
                  >
                    <option value="pieces">{lang === "en" ? "Pieces" : "件"}</option>
                    <option value="packs">{lang === "en" ? "Packs" : "包"}</option>
                    <option value="cartons">{lang === "en" ? "Cartons" : "箱"}</option>
                    <option value="kg">kg</option>
                  </select>
                </label>
                <label className="sm:col-span-2">
                  <span className="mb-2 block text-xs font-bold">{t.notes}</span>
                  <textarea
                    rows={4}
                    value={sourceForm.notes}
                    onChange={(e) => setSourceForm({ ...sourceForm, notes: e.target.value })}
                    placeholder={t.notesPlaceholder}
                    className="w-full resize-none border border-input bg-background p-3 text-sm outline-none focus:border-primary"
                  />
                </label>
              </div>
              <Button type="submit" size="lg" className="mt-6 w-full sm:w-auto">
                <Upload />
                {t.addRequest}
              </Button>
            </form>
          </div>
        </section>

        <section id="contact" className="bg-foreground px-5 py-20 text-background sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1440px]">
            <div className="grid gap-10 border-b border-background/15 pb-14 lg:grid-cols-[1.2fr_.8fr_.8fr_.8fr]">
              <div>
                <span className="grid size-10 place-items-center bg-primary font-bold text-primary-foreground">
                  禾
                </span>
                <h2 className="mt-6 max-w-md text-3xl font-extrabold">{t.footerTitle}</h2>
                <p className="mt-4 text-xs text-background/50">{t.sample}</p>
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase text-gold">{t.hours}</h3>
                <p className="mt-5 text-sm">{t.weekdays}</p>
                <p className="mt-2 text-sm text-background/60">{t.sunday}</p>
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase text-gold">{t.location}</h3>
                <a
                  href="https://maps.google.com/?q=Bole+Addis+Ababa"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 flex items-start gap-2 text-sm hover:text-gold"
                >
                  <MapPin className="mt-0.5 size-4 shrink-0" />
                  {t.mapLabel}
                  <br />
                  Edna Mall vicinity
                </a>
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase text-gold">{t.contact}</h3>
                <a href="tel:+251911000000" className="mt-5 block text-sm hover:text-gold">
                  +251 911 000 000
                </a>
                <p className="mt-2 text-sm text-background/60">WeChat: HamereMarket</p>
                <Button asChild className="mt-5 bg-jade text-jade-foreground hover:bg-jade/90">
                  <a href="https://wa.me/251911000000" target="_blank" rel="noreferrer">
                    <MessageCircle />
                    {t.whatsapp}
                  </a>
                </Button>
              </div>
            </div>
            <div className="flex flex-col justify-between gap-3 pt-6 text-[10px] font-semibold uppercase text-background/45 sm:flex-row">
              <span>© 2026 Hamere Asian Market</span>
              <span>亚裔美馔 · 专属采买</span>
            </div>
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
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDrawer(false)}
                aria-label="Close"
              >
                <X />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-7">
              {itemCount === 0 ? (
                <div className="grid min-h-72 place-items-center text-center">
                  <div>
                    <ShoppingBag className="mx-auto size-9 text-muted-foreground" />
                    <h3 className="mt-4 font-bold">{t.empty}</h3>
                    <p className="mt-2 text-xs text-muted-foreground">{t.emptySub}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-7">
                  {Object.keys(cart).length > 0 && (
                    <section>
                      <h3 className="mb-3 text-xs font-bold uppercase text-primary">
                        {t.catalogItems}
                      </h3>
                      <div className="divide-y divide-border border-y border-border">
                        {products
                          .filter((p) => cart[p.id])
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
                                  <span className="w-5 text-center text-xs font-bold">
                                    {cart[product.id]}
                                  </span>
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
                                {t.birr}{" "}
                                {(product.price * (cart[product.id] ?? 0)).toLocaleString()}
                              </p>
                            </div>
                          ))}
                      </div>
                    </section>
                  )}
                  {requests.length > 0 && (
                    <section>
                      <h3 className="mb-3 text-xs font-bold uppercase text-primary">
                        {t.sourceItems}
                      </h3>
                      <div className="divide-y divide-border border-y border-border">
                        {requests.map((request) => (
                          <div key={request.id} className="flex gap-3 py-4">
                            {request.imageUrl ? (
                              <img src={request.imageUrl} alt="" className="size-16 object-cover" />
                            ) : (
                              <span className="grid size-16 shrink-0 place-items-center bg-secondary">
                                <Sparkles className="size-5 text-primary" />
                              </span>
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-bold">{request.item}</p>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {request.quantity} {request.unit}
                                {request.notes ? ` · ${request.notes}` : ""}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                setRequests((current) =>
                                  current.filter((item) => item.id !== request.id),
                                )
                              }
                              aria-label="Remove"
                            >
                              <Trash2 />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                  <section>
                    <h3 className="mb-3 text-xs font-bold uppercase text-primary">{t.customer}</h3>
                    <div className="grid gap-3">
                      <input
                        value={customer.name}
                        onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                        placeholder={t.name}
                        className="h-11 border border-input bg-card px-3 text-sm outline-none focus:border-primary"
                      />
                      <input
                        value={customer.phone}
                        onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                        placeholder={t.phone}
                        className="h-11 border border-input bg-card px-3 text-sm outline-none focus:border-primary"
                      />
                      <textarea
                        value={customer.address}
                        onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                        placeholder={t.address}
                        rows={3}
                        className="resize-none border border-input bg-card p-3 text-sm outline-none focus:border-primary"
                      />
                      {formError && (
                        <p className="text-xs font-semibold text-destructive">{formError}</p>
                      )}
                    </div>
                  </section>
                </div>
              )}
            </div>
            <div className="border-t border-border bg-card px-5 py-5 sm:px-7">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t.subtotal}</span>
                <strong>
                  {t.birr} {subtotal.toLocaleString()}
                </strong>
              </div>
              <p className="mb-4 text-[11px] text-muted-foreground">{t.quoteNote}</p>
              <Button
                onClick={prepareOrder}
                size="lg"
                className="h-12 w-full"
                disabled={itemCount === 0}
              >
                <MessageCircle />
                {t.submit}
              </Button>
            </div>
          </aside>
        </div>
      )}

      {confirmed && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-foreground/65 p-5 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-md bg-background p-7 text-center shadow-market sm:p-10"
          >
            <span className="mx-auto grid size-14 place-items-center rounded-full bg-jade text-jade-foreground">
              <Check className="size-6" />
            </span>
            <p className="mt-6 text-xs font-bold uppercase text-jade">{t.confirmed}</p>
            <h2 className="mt-2 text-2xl font-extrabold">{t.confirmedTitle}</h2>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{t.confirmedText}</p>
            <div className="mt-7 grid gap-3">
              <Button asChild size="lg" className="h-12">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setConfirmed(false)}
                >
                  <MessageCircle />
                  {t.openWhatsapp}
                </a>
              </Button>
              <Button variant="ghost" onClick={() => setConfirmed(false)}>
                {t.continueShop}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
