import React, { useState } from 'react';
import logo from "../../Images/logo.png";
import android from "../../Images/android.png";
import ios from "../../Images/ios.png";
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { androidUrl, iosUrl, menuTitleArr, pushMenu } from '../../Config';
// import DateClock from '../DateClock';

export default function Header() {

  const clientData = useSelector((state) => state.clientDetails);
  const [toggleMenu, setToggleMenu] = useState(true);
  const [toggleMenuFirstTime, setToggleMenuFirstTime] = useState(true);
  let location = useLocation().pathname;
  let currentPathName = location?.split('/')?.length > 1 ? location?.split('/')[1] : location?.split('/')[0];

  return (
    <header>
      {pushMenu ?
        <>
          <div className="bigscreen">
            <div className="container">
              <div className="col-md-4 col-sm-4 col-xs-12" />
              <div className="col-md-4 col-sm-4 col-xs-12 ">
                <a href="/" style={{ textAlign: 'center' }}>
                  <img src={logo} className="img-responsive mlogo" alt='Lilam Enterprise Logo' /></a>
              </div>
              <div className="col-md-4 col-sm-4 col-xs-12">
                <div className="appicon">
                  <a target="_blank" href={androidUrl} rel="noreferrer" >
                    <img src={android} title="Android" alt='Android' className=" andapp" style={{ marginRight: '5px' }} />
                  </a>
                  <a target="_blank" href={iosUrl} rel="noreferrer">
                    <img src={ios} className=" andapp" title="Iphone" alt='Ios' />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div id="header">
            <div className="container">
              <div className="row">
                <div className="col-md-4 col-sm-4 col-xs-12" style={{ float: 'left' }}>
                  <a href="/">
                    <img src={logo} className="img-responsive mlogo" alt='Lilam Enterprise Logo' />
                  </a>
                </div>
                <div className="col-md-8 col-sm-8 col-xs-12">
                  <nav className="navbar navbar-default fullright ">
                    <div className="container-fluid">
                      <div className="navbar-header">
                        <button aria-expanded="false"
                          data-target="#bs-example-navbar-collapse-8"
                          data-toggle="collapse"
                          className="navbar-toggle collapsed"
                          type="button">
                          <span className="sr-only">Toggle navigation</span>
                          <span className="icon-bar" />
                          <span className="icon-bar" />
                          <span className="icon-bar" />
                        </button>
                      </div>
                      <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-8">
                        <ul className="nav navbar-nav navbar-right">
                          {menuTitleArr.map((menu) => {
                            if (!menu?.display) return false;
                            return (
                              <li className="pgabout">
                                <Link to={`/${menu?.path}`}>
                                  {menu?.name}</Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  </nav>
                </div>
              </div>
            </div>
          </div>
          <div className="bgc">
            <div className="container">
              <div className="row">
                <div className="col-md-11 col-sm-10 col-xs-9">
                  {/* eslint-disable-next-line jsx-a11y/no-distracting-elements */}
                  <marquee scrollamount={3} className="marquee1">
                    {clientData[0]?.marqueeTop}
                  </marquee>
                </div>
              </div>
            </div>
          </div>
          <div id="container" className="pushmenu">
            {!toggleMenuFirstTime &&
              <div id='pm_menu' className={`${!toggleMenu ? 'pm_open' : 'pm_close'}`} >
                <div className="logo-cover">
                  <a href="/">
                    <img src={logo} alt="" />
                  </a>
                </div>
                <div className="menu-cover">
                  <div className="bg-rdimg">
                    <img src="images/rd.png" alt="" />
                  </div>
                  <ul>
                    {menuTitleArr.map((menu) => {
                      if (!menu?.display) return false;
                      return (
                        <li className="pgabout">
                          <Link to={`/${menu?.path}`} onClick={() => setToggleMenu(!toggleMenu)}>
                            <img src='{smMark}' alt='Small Logo' />
                            {menu?.name}</Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            }
            <div className="open-btn-cover" id="open" onClick={() => { setToggleMenu(!toggleMenu); setToggleMenuFirstTime(false); }}>
              <div className="left-icon-cover">
                <i className="fa fa-align-justify" aria-hidden="true" />
              </div>
              <div className="right-aerow"  >
                <img src='{smMark}' alt="" />
              </div>
            </div>
          </div>
          {
            !toggleMenu && (
              <div
                className="pm_overlay pm_show"
                onClick={() => {
                  setToggleMenu(!toggleMenu);
                }}
              ></div>
            )
          }
        </>
        :
        <>
          <div className="header-top-marquee">
            <div className="container-fluid">
              {/* eslint-disable-next-line jsx-a11y/no-distracting-elements */}
              <marquee>{clientData?.[0]?.marqueeTop}</marquee>
            </div>
          </div>
          <div className="header-top-details">
            <div className="container-fluid">
              <div className="second-part-cover">
                <div className="row">
                  {/* <div className="col-md-12 col-lg-2 align-self-center">
                    <div className="booking-no">
                      <h6>Booking No</h6>
                      <p>
                        <span className="bookingno1">{clientData?.[0]?.number1}</span>
                      </p>
                      <p>
                        <span className="bookingno2">{clientData?.[0]?.number2}</span>
                      </p>
                      <p>
                        <span className="bookingno3">{clientData?.[0]?.number3}</span>
                      </p>
                    </div>
                  </div> */}
                  <div className="col-md-12 col-lg-8 align-self-center">
                    <div className="logo-cover">
                      <a href="/">
                        <img src={logo} alt="Logo" />
                      </a>
                    </div>
                  </div>

                  <div className="col-md-12 col-lg-4 align-self-center">
                    <div className="cnt-cover app-iconlogo">
                      <div className="app-icon">
                        <a href={androidUrl} target='_blank' rel="noreferrer">
                          <img src={android} alt='Android' />
                        </a>
                        <a href={iosUrl} target='_blank' rel="noreferrer">
                          <img src={ios} alt='IOS' />
                        </a>
                      </div>
                    </div>
                  </div>




                  {/* <div className="col-md-12 col-lg-2 align-self-center">
                    <div className="cnt-cover">
                      <h2>
                        <i className="fa fa-envelope" />
                        E-MAIL ADDRESS
                      </h2>
                      <p>{clientData?.[0]?.email1}</p>
                    </div>
                    
                  </div> */}
                </div>
              </div>
            </div>
            <div className="header-cover">
              <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <button
                  className="navbar-toggler"
                  type="button"
                  data-toggle="collapse"
                  data-target="#navbarsExample07"
                  aria-controls="navbarsExample07"
                  aria-expanded="false"
                  aria-label="Toggle navigation">
                  <span className="navbar-toggler-icon" />
                </button>
                <div
                  className="collapse navbar-collapse"
                  id="navbarsExample07">
                  <ul className="navbar-nav">
                    {!!menuTitleArr && menuTitleArr?.length > 0 && menuTitleArr.map((menu) => {
                      if (!menu?.display) return false;
                      return (
                        <li className={`nav-item pgabout_Us ${currentPathName === menu?.path ? "active" : ""}`} key={menu?.id}>
                          <Link className={`nav-link`} to={`/${menu?.path}`}>{menu.name}</Link>
                        </li>
                      );
                    }
                    )}
                  </ul>
                </div>

              </nav>

            </div>
          </div>
        </>
      }
    </header>
  );
}
