
"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ErrorPageProps {
    error: Error & { digest?: string };
    reset: () => void;
}

const ErrorPage = ({ error, reset }: ErrorPageProps) => {
    useEffect(() => {
        console.error("Application Error:", error);
    }, [error]);

    return (
        <main className="flex min-h-[75vh] items-center justify-center bg-background px-4 py-16">
            <div className="mx-auto w-full max-w-xl text-center">
                <div className="mx-auto mb-8 flex size-20 items-center justify-center rounded-3xl bg-destructive/10">
                    <AlertTriangle className="size-10 text-[#D94B35]" />
                </div>

                <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-[#D94B35]">
                    Something Went Wrong
                </p>

                <h1 className="font-[family-name:var(--font-fraunces)] text-4xl font-bold text-foreground sm:text-5xl">
                    Oops! Something went off the menu.
                </h1>

                <p className="mx-auto mt-5 max-w-md text-base leading-7 text-foreground/65">
                    We encountered an unexpected problem. Please try again.
                    Your PizzaHub experience is just one click away.
                </p>

                {error.digest && (
                    <p className="mt-3 text-xs text-foreground/40">
                        Error reference: {error.digest}
                    </p>
                )}

                <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                    <Button
                        onClick={reset}
                        className="gap-2 bg-[#D94B35] text-white hover:bg-[#B83B29]"
                    >
                        <RefreshCw className="size-4" />
                        Try Again
                    </Button>

                    <Link href="/">
                        <Button
                            variant="outline"
                            className="w-full gap-2 border-border text-foreground hover:bg-muted/50 sm:w-auto"
                        >
                            <Home className="size-4" />
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default ErrorPage;
