"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/layout/footer";

const ConditionalFooter = () => {
    const pathname = usePathname();

    if (pathname.startsWith("/dashboard")) {
        return null;
    }

    return <Footer />;
};

export default ConditionalFooter;