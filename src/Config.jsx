import slLogo from "./Images/sl.png";
import KYC from "./Pages/Kyc/Kyc";
import About from "./Pages/About/About";
import Bank from "./Pages/Bank/Bank";
import Calculator from "./Pages/Calculator";
import Calendar from "./Pages/Calendar/Calendar";
import Coin from "./Pages/Coin/Coin";
import Feedback from "./Pages/Feedback/Feedback";
import Liverate from "./Pages/Liverate/Liverate";
import Update from "./Pages/Updates/Update";

export const DMNNMSTTG = {
    DMNNM: 'slbullion',
    DMN: 'in',
    ENDPNT: '/api/bullion',
    SKTPRT: '10001',
};

export const apiUrl = `https://${DMNNMSTTG.DMNNM}.${DMNNMSTTG.DMN}${DMNNMSTTG.ENDPNT}`;
export const adminsocketurl = `https://www.${DMNNMSTTG.DMNNM}.${DMNNMSTTG.DMN}:${DMNNMSTTG.SKTPRT}`;
export const prjName = "hublibullion";
export const footerData = {
    copyright: "©Copyright 2024 hublibullion",
    companyName: "Starline Solutions Pvt Ltd.",
    logo: slLogo,
    companyLink: "http://www.starlinetechno.net/",
};
export const androidUrl = "#";
export const iosUrl = "#";
export const economicCalendar = "https://www.mql5.com/en/economic-calendar/widget?mode=1&amp;";
export const coinImgUrl = "https://www.starlinejewellers.co.in/images/coin/";
export const hasOtr = true;
export const hasViewBtn = true;
export const pushMenu = false;
export const menuTitleArr = [
    {
        id: "1",
        path: "about",
        name: "About Us",
        display: true,
        element: <About />
    },
    {
        id: "2",
        path: "",
        name: "Liverate",
        display: true,
        element: <Liverate />
    },
    {
        id: "3",
        path: "coin",
        name: "Coins",
        display: false,
        element: <Coin />
    },
    {
        id: "4",
        path: "kyc",
        name: "Kyc",
        display: false,
        element: <KYC />
    },
    {
        id: "5",
        path: "update",
        name: "Updates",
        display: true,
        element: <Update />
    },
    {
        id: "6",
        path: "bankDetail",
        name: "Bank Details",
        display: true,
        element: <Bank />
    },
    {
        id: "7",
        path: "calculator",
        name: "Calculator",
        display: false,
        element: <Calculator />
    },
    {
        id: "8",
        path: "calendar",
        name: "Economic Calendar",
        display: true,
        element: <Calendar />
    },
    {
        id: "9",
        path: "feedback",
        name: "Contact Us",
        display: true,
        element: <Feedback />
    }
];
