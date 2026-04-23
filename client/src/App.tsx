import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import { ALL_ROUTES } from './config/route-config'
import ProtectedRoute from './config/ProtectedRoute'
import { Suspense } from 'react'


const App = () => {
   return(
  <BrowserRouter>
     <Routes>
      <Route path='/' element = {<Home/>}></Route>
      {ALL_ROUTES.map(({path, Component, isProtected}) => {
         return (
         <Route key={path} path={path} element = {
            <ProtectedRoute isProtected={isProtected}>
               <Suspense
               fallback={<div className="flex h-screen w-full bg-slate-900  items-center justify-center">
                             <div className="text-center text-lg text-gray-100">Loading...</div>
                         </div>}>
              <Component/>
              </Suspense>
            </ProtectedRoute>
         }></Route>
         );
      })}
     </Routes>
  </BrowserRouter>
   )
  
}
export default App
