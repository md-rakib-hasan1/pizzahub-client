
import { Pizza } from "lucide-react";

const Loading = () => {
    return (
        <main className="flex min-h-[75vh] items-center justify-center bg-background px-4">
            <div className="flex flex-col items-center text-center">
                <div className="relative flex size-20 items-center justify-center">
                    <div className="absolute inset-0 animate-spin rounded-full border-4 border-[#D94B35]/15 border-t-[#D94B35]" />

                    <div className="flex size-14 items-center justify-center rounded-2xl bg-[#D94B35]/10">
                        <Pizza className="size-7 text-[#D94B35]" />
                    </div>
                </div>

                <h2 className="mt-7 font-[family-name:var(--font-fraunces)] text-2xl font-bold text-foreground">
                    Preparing something delicious...
                </h2>

                <p className="mt-2 text-sm text-foreground/60">
                    Please wait while we get everything ready.
                </p>

                <div className="mt-6 h-1.5 w-40 overflow-hidden rounded-full bg-muted">
                    <div className="h-full w-1/2 animate-pulse rounded-full bg-[#D94B35]" />
                </div>
            </div>
        </main>
    );
};

export default Loading;
