import React from 'react';
import { useSelector } from 'react-redux';
import { footerData } from '../../Config';

export default function Footer() {
    const clientData = useSelector((state) => state.clientDetails);

    return (
        <footer>
            <div className="footer-cover">

                <div className="header-top-marquee">
                    <div className="container-fluid">
                        {/* eslint-disable-next-line jsx-a11y/no-distracting-elements */}
                        <marquee>{clientData?.[0]?.marqueeBottom}</marquee>
                    </div>
                </div>
                <div className="cover-copyright">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="cover-copyright-tittle">
                                    <h6>{footerData?.copyright}</h6>
                                </div>
                                <p className="footer-company-name text-right">
                                    <a className="starline" href={footerData?.companyLink} target="_blank" rel="noreferrer">
                                        {footerData?.companyName} <img src={footerData?.logo} alt="" />
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
