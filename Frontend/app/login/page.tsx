import LoginCard from "@/components/login/LoginCard";
import Image from "next/image";

const foodItems = [
  {
    className: "food-float food-float-pizza",
    src: "/assets/pizza-quarter.png",
    width: 351,
    height: 353,
    alt: "",
  },
  {
    className: "food-float food-float-stack",
    src: "/assets/burger-stack.png",
    width: 450,
    height: 724,
    alt: "",
  },
  {
    className: "food-float food-float-burger",
    src: "/assets/burger-right.png",
    width: 368,
    height: 520,
    alt: "",
  },
] as const;

export default function LoginPage() {
  return (
    <main className="login-page relative isolate min-h-screen overflow-hidden bg-bocca-paper px-5 py-6 text-bocca-ink sm:px-8">
      <a
        className="bocca-logo absolute left-7 top-7 z-20 text-bocca-blue"
        href="/login"
        aria-label="BoccaCafe login"
      >
        BOCCA
      </a>

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {foodItems.map((item) => (
          <Image
            key={item.className}
            className={item.className}
            src={item.src}
            alt={item.alt}
            width={item.width}
            height={item.height}
            priority
          />
        ))}
      </div>

      <section className="relative z-10 flex min-h-[calc(100vh-3rem)] flex-col items-center justify-center gap-6 pt-20 text-center sm:min-h-[calc(100vh-4rem)] sm:pt-12">
        <LoginCard />

        <div className="hero-copy select-none" aria-label="BoccaCafe culture art cafe since 2014">
          <p className="culture-title font-display text-[clamp(2.35rem,5vw,5.65rem)] font-black uppercase leading-[0.85] text-bocca-ink">
            Culture Art Cafe.
          </p>
          <p className="since-copy mt-5 text-xs font-extrabold uppercase tracking-[0.18em] text-black/40 sm:text-sm">
            Since 2014
          </p>
        </div>
      </section>
    </main>
  );
}
