import React, { lazy } from "react";

export interface RouteConfig {
    path: string;
    Component: React.FC;
    isProtected: boolean;
}

//Public routes
const Login = lazy(() => import("../pages/Login"));
const Signup = lazy(() => import("../pages/Signup"));

//Private routes
const StudentDashboard = lazy(() => import("../pages/Student_dashboard"));




const PUBLIC_ROUTES: RouteConfig[] = [
    { path: "/login", Component: Login, isProtected: false },
    { path: "/signup", Component: Signup, isProtected: false },
];

const PRIVATE_ROUTES: RouteConfig[] = [
    { path: "/studentdashboard", Component: StudentDashboard, isProtected: true },
];

export const ALL_ROUTES: RouteConfig[] = [...PUBLIC_ROUTES, ...PRIVATE_ROUTES];