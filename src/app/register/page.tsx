
"use client";
import GoogleSignInButton from "@/components/auth/google-sign-in-button";
import { useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
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
import {
    RadioGroup,
    RadioGroupItem,
} from "@/components/ui/radio-group";
import { Eye, EyeOff, Loader2, Pizza } from "lucide-react";

const RegisterPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const initialAccountType =
        searchParams.get("type") === "vendor" ? "vendor" : "customer";

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [accountType, setAccountType] = useState<
        "customer" | "vendor"
    >(initialAccountType);
    const [loading, setLoading] = useState(false);

    const handleRegister = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();



        if (password.length < 8) {
            toast.error("Password must be at least 8 characters.");
            return;
        }

        setLoading(true);

        try {
            const { error } = await authClient.signUp.email({
                name,
                email,
                password,
                accountType,
            });

            if (error) {
                toast.error(error.message || "Registration failed.");
                return;
            }

            toast.success("Account created successfully!");
            router.push("/");
            router.refresh();
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
            <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-card shadow-xl md:grid-cols-2">
                <div className="relative hidden flex-col justify-between overflow-hidden bg-brand-surface p-10 text-white md:flex">
                    <div className="relative z-10 flex items-center gap-2">
                        <Pizza className="size-8 text-[#E88A45]" />
                        <span className="text-2xl font-bold">PizzaHub</span>
                    </div>

                    <div className="relative z-10 space-y-4">
                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#E88A45]">
                            Good food. Great moments.
                        </p>
                        <h1 className="font-heading text-5xl leading-tight">
                            Your next favorite pizza is waiting.
                        </h1>
                        <p className="max-w-sm text-white/70">
                            Discover amazing local pizza shops and enjoy
                            delicious food from the comfort of your home.
                        </p>
                    </div>

                    <p className="relative z-10 text-sm text-white/50">
                        © 2026 PizzaHub. All rights reserved.
                    </p>

                    <div className="absolute -bottom-24 -right-20 size-80 rounded-full bg-[#D94B35]/30 blur-3xl" />
                    <div className="absolute -top-20 -left-20 size-64 rounded-full bg-[#E88A45]/20 blur-3xl" />
                </div>

                <Card className="border-0 shadow-none">
                    <CardHeader className="space-y-3 px-6 pt-10 sm:px-10">
                        <Link
                            href="/"
                            className="flex items-center gap-2 font-bold text-[#D94B35] md:hidden"
                        >
                            <Pizza className="size-7" />
                            PizzaHub
                        </Link>

                        <CardTitle className="font-heading text-3xl text-foreground">
                            Create your account
                        </CardTitle>

                        <CardDescription>
                            Join PizzaHub and discover something delicious.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="px-6 pb-10 sm:px-10">
                        <form onSubmit={handleRegister} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full name</Label>
                                <Input
                                    id="name"
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    minLength={2}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email address</Label>
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
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="At least 8 characters"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pr-10"
                                        required
                                        minLength={8}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon-sm"
                                        className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        aria-pressed={showPassword}
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff /> : <Eye />}
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label>Choose account type</Label>

                                <RadioGroup
                                    value={accountType}
                                    onValueChange={(value) =>
                                        setAccountType(value as "customer" | "vendor")
                                    }
                                    className="grid grid-cols-2 gap-3"
                                >
                                    <Label
                                        htmlFor="customer"
                                        className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 ${accountType === "customer"
                                            ? "border-[#D94B35] bg-[#D94B35]/5"
                                            : "border-input"
                                            }`}
                                    >
                                        <RadioGroupItem
                                            value="customer"
                                            id="customer"
                                        />
                                        <span>
                                            <span className="block font-semibold">
                                                Customer
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                Order pizzas
                                            </span>
                                        </span>
                                    </Label>

                                    <Label
                                        htmlFor="vendor"
                                        className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 ${accountType === "vendor"
                                            ? "border-[#D94B35] bg-[#D94B35]/5"
                                            : "border-input"
                                            }`}
                                    >
                                        <RadioGroupItem value="vendor" id="vendor" />
                                        <span>
                                            <span className="block font-semibold">
                                                Vendor
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                Sell pizzas
                                            </span>
                                        </span>
                                    </Label>
                                </RadioGroup>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#D94B35] text-white hover:bg-[#BD3D2B]"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 size-4 animate-spin" />
                                        Creating account...
                                    </>
                                ) : (
                                    "Create Account"
                                )}
                            </Button>
                        </form>

                        <div className="relative my-5">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>

                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-3 text-muted-foreground">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        <GoogleSignInButton />

                        <p className="mt-6 text-center text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                className="font-semibold text-[#D94B35] hover:underline"
                            >
                                Sign in
                            </Link>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
};

export default RegisterPage;
