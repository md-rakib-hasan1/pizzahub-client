
import Link from "next/link";
import { ArrowLeft, Home, Pizza } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
    return (
        <main className="flex min-h-[75vh] items-center justify-center bg-[#F8F1E7] px-4 py-16">
            <div className="mx-auto w-full max-w-xl text-center">
                <div className="mx-auto mb-8 flex size-20 items-center justify-center rounded-3xl bg-[#D94B35]/10">
                    <Pizza className="size-10 text-[#D94B35]" />
                </div>

                <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-[#D94B35]">
                    404 — Page Not Found
                </p>

                <h1 className="font-[family-name:var(--font-fraunces)] text-4xl font-bold text-[#29231F] sm:text-5xl">
                    Oops! This slice is missing.
                </h1>

                <p className="mx-auto mt-5 max-w-md text-base leading-7 text-[#29231F]/65">
                    Looks like the page you are searching for is not on our
                    menu. It may have been moved or no longer exists.
                </p>

                <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                    <Link href="/">
                        <Button className="w-full gap-2 bg-[#D94B35] text-white hover:bg-[#B83B29] sm:w-auto">
                            <Home className="size-4" />
                            Back to Home
                        </Button>
                    </Link>

                    <Link href="/menu">
                        <Button
                            variant="outline"
                            className="w-full gap-2 border-[#29231F]/20 text-[#29231F] hover:bg-[#29231F]/5 sm:w-auto"
                        >
                            <ArrowLeft className="size-4" />
                            Explore Menu
                        </Button>
                    </Link>
                </div>

                <p className="mt-12 text-sm text-[#29231F]/45">
                    Hungry? Your next favorite pizza is waiting for you.
                </p>
            </div>
        </main>
    );
};

export default NotFound;
