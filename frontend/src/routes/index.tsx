import BaseLayout from "@/layouts/base-layout"
import { Route, Routes } from "react-router-dom"
import { authRoutesPaths } from "./routes"
import AppLayout from "@/layouts/app-layout"
import RouteGuard from "./route-guard"

const AppRoutes = () => {
    return (
        <Routes>
            {/* public routes */}
            <Route path="/" element={<RouteGuard requireAuth={false} />} >
                <Route element={<BaseLayout />} >
                    {
                        authRoutesPaths?.map(({ path, element }) => (
                            <Route key={path} path={path} element={element} />
                        ))
                    }
                </Route>
            </Route>

            {/* protected routes */}
            <Route element={<RouteGuard requireAuth={true} />} >
                <Route element={<AppLayout />}  >
                </Route>
                
            </Route>
        </Routes>
    )
}

export default AppRoutes