import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/Header";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"

export default function Layout() {

    const location = useLocation();
    const hide = ['/auth'];
    const showHeader = !hide.includes(location.pathname);

    return (
        <div className="font-outfit " >
            <main >
               
                    <div >
                        {showHeader && <Header />}
                        <Outlet />
                    </div>
               
                <Toaster />

            </main>
        </div>
    );
}
