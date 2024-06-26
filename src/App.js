
// import HomePage from './pages/home'
// import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Book from './pages/book';

import Admin from './pages/ADMIN/admin.js';
import Main from './pages/main';
import HomePage from './pages/home';
import NotFoundPage from './pages/notfound';
import History from './pages/history'; 
import Verify from './pages/ADMIN/verify.js';
import Confirmerror from "./pages/confirmerror";

// import ConfirmationPage from "./pages/confirm";
// import { PageProvider } from "./pages/PageContext";
function App() {

  return (


    <>
    {/* <PageProvider> */}
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Main/>}/>
          <Route path="/home" element={<HomePage/>}/>
          <Route path="/book" element={<Book/>}/>
         
          <Route path="/admin" element={<Admin/>}/>
          <Route path="/history" element={<History/>}/>
          <Route path="/verify" element={<Verify/>}/>
          
          <Route path="/confirmerror" element={<Confirmerror/>}/>
          <Route path="*" element={<NotFoundPage/>}/>
          {/* <Route path="/confirm" element={<ConfirmationPage/>}/> */}
          
      </Routes>
    </BrowserRouter>
    {/* </PageProvider> */}
    </>
  );
}

export default App;
