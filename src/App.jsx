import React, { createContext, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './CSS/bootstrap.min.css';
import './CSS/font-awesome.min.css';
import './CSS/style.css';
import './CSS/liverateBanner.css';
import './Components/Skeleton/style.css';
import BaseLayout from "./Layout";
import NotFoundPage from "./Pages/Not Found Page";
import { hasOtr, menuTitleArr } from "./Config";
import Otr from "./Pages/Otr/Otr";

let SocketContext = createContext();

function App() {
  //! //////////////////////////Don't delete OTR code commented below///////////////////////////////

  let otrFetch = localStorage.getItem('otrDetails');
  otrFetch = JSON.parse(otrFetch);

  return (

    <BrowserRouter>
      {
        (!!hasOtr && !(!!otrFetch)) ?
          <Otr />
          :
          <Routes>
            <Route path="/" element={<BaseLayout />}>
              {menuTitleArr?.length > 0 && menuTitleArr?.map((page, index) => {
                if (!(!!page?.display)) return false;
                return (
                  <React.Fragment key={index}>
                    <Route path={`/${page?.path}`} element={page?.element} />
                  </React.Fragment>
                );
              })}
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
      }
    </BrowserRouter>

  );
}

export { SocketContext };
export default App;
