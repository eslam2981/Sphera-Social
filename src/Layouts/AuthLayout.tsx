import { Outlet } from "react-router-dom"
import AuthIntro from "../components/Auth-Intro/AuthIntro"

/** Renders the auth layout component. */
export default function AuthLayout() {
  return (
    <main className="bg-sec dark:bg-slate-950 min-h-screen flex items-center justify-center py-4 px-4 overflow-x-hidden">
        <div className="w-full max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
                <div className="hidden lg:block order-2 lg:order-1 lg:col-span-7">
                  <AuthIntro />
                </div>
                <div className="order-1 lg:order-2 lg:col-span-5 w-full flex justify-center">
                    <Outlet />
                </div>
            </div>
        </div>
    </main>
  )
}
