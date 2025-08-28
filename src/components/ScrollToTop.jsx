import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
    const location = useLocation();

    useEffect(() => {
        // أوقف استرجاع التمرير التلقائي من المتصفح
        if ("scrollRestoration" in window.history) {
            window.history.scrollRestoration = "manual";
        }

        // لو فيه هاش (#section) انزل له، غير هيك طلع فوق
        if (location.hash) {
            const el = document.querySelector(location.hash);
            if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
                return;
            }
        }

        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }, [location.pathname, location.search, location.hash]);

    return null;
}
