
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 text-center">
        <span className="mb-5 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
          Welcome to PizzaHub
        </span>

        <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight md:text-7xl">
          Good food.
          <span className="block text-primary">
            Great moments.
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground md:text-lg">
          Discover your favorite local pizza shops,
          explore delicious menus, and enjoy every bite
          with PizzaHub.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Button size="lg">
            Explore Menu
          </Button>

          <Button size="lg" variant="outline">
            Our Story
          </Button>
        </div>

        <p className="mt-12 text-sm text-muted-foreground">
          Crafted with passion. Delivered with love.
        </p>
      </section>
    </main>
  );
}