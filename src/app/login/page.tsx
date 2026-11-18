
"use client";
import GoogleSignInButton from "@/components/auth/google-sign-in-button";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Pizza } from "lucide-react";

const LoginPage = () => {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setLoading(true);

        try {
            const { error } = await authClient.signIn.email({
                email,
                password,
            });

            if (error) {
                toast.error(error.message || "Login failed.");
                return;
            }

            toast.success("Welcome back to PizzaHub!");

            router.push("/account");
            router.refresh();
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#F8F1E7] px-4 py-12">
            <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl md:grid-cols-2">

                {/* Left Side */}
                <div className="relative hidden flex-col justify-between overflow-hidden bg-[#29231F] p-10 text-white md:flex">
                    <div className="relative z-10 flex items-center gap-2">
                        <Pizza className="size-8 text-[#E88A45]" />
                        <span className="text-2xl font-bold">
                            PizzaHub
                        </span>
                    </div>

                    <div className="relative z-10 space-y-4">
                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#E88A45]">
                            Good food. Great moments.
                        </p>

                        <h1 className="font-heading text-5xl leading-tight">
                            Welcome back to your pizza world.
                        </h1>

                        <p className="max-w-sm text-white/70">
                            Your favorite flavors and local pizza shops
                            are just a few clicks away.
                        </p>
                    </div>

                    <p className="relative z-10 text-sm text-white/50">
                        © 2026 PizzaHub. All rights reserved.
                    </p>

                    <div className="absolute -bottom-24 -right-20 size-80 rounded-full bg-[#D94B35]/30 blur-3xl" />
                    <div className="absolute -top-20 -left-20 size-64 rounded-full bg-[#E88A45]/20 blur-3xl" />
                </div>

                {/* Right Side */}
                <Card className="border-0 shadow-none">
                    <CardHeader className="space-y-3 px-6 pt-10 sm:px-10">
                        <Link
                            href="/"
                            className="flex items-center gap-2 font-bold text-[#D94B35] md:hidden"
                        >
                            <Pizza className="size-7" />
                            PizzaHub
                        </Link>

                        <CardTitle className="font-heading text-3xl text-[#29231F]">
                            Welcome back!
                        </CardTitle>

                        <CardDescription>
                            Sign in to continue your PizzaHub experience.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="px-6 pb-10 sm:px-10">
                        <form onSubmit={handleLogin} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="email">
                                    Email address
                                </Label>

                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">
                                    Password
                                </Label>

                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#D94B35] text-white hover:bg-[#BD3D2B]"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 size-4 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    "Sign In"
                                )}
                            </Button>
                        </form>

                        <div className="relative my-5">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>

                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-3 text-muted-foreground">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        <GoogleSignInButton />

                        <p className="mt-6 text-center text-sm text-muted-foreground">
                            Don&apos;t have an account?{" "}
                            <Link
                                href="/register"
                                className="font-semibold text-[#D94B35] hover:underline"
                            >
                                Create account
                            </Link>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
};

export default LoginPage;
