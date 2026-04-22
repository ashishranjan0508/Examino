import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import { ALL_ROUTES } from './config/route-config'


const App = () => {
   return(
  <BrowserRouter>
     <Routes>
      <Route path='/' element = {<Home/>}></Route>
      {ALL_ROUTES.map(({path, Component, isProtected}) => (
         <Route key={path} path={path} element = {<Component/>}></Route>
      ))}
     </Routes>
  </BrowserRouter>
   )
  
}
export default App
