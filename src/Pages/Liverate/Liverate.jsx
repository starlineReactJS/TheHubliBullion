import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import pako from "pako";
import { Toast, backgroundColorClass, usePrevious, usePreviousReference } from '../../Utils';
import { Skeleton } from '../../Components/Skeleton';
import { SocketContext } from '../../Layout';

export default function Liverate() {
    let socketContext = useContext(SocketContext);
    const [maindata, setMainData] = useState(null);
    const [referenceProductData, setReferenceProductData] = useState([]);
    const clientdetails = useSelector((state) => state.clientDetails);
    const clientData = !!clientdetails?.length ? clientdetails : [];
    const previousMainProduct = usePrevious(!!maindata ? maindata : []);
    const referenceData = useSelector((state) => state.referanceDetails);
    const previousReferenceProductData = usePreviousReference(!!referenceProductData ? referenceProductData : []);
    const [adBannerDisplay, setAdBannerDisplay] = useState('block');
    let displayFutureRef = useRef({});
    let displayNextRef = useRef({});
    let displaySpot = useRef({});
    const toast = Toast();

    const [isLoading, setIsLoading] = useState({});
    const maindataRef = useRef({});
    const referenceDataRef = useRef({});

    const dataLoadedFn = (data, type) => {
        if (type === 'mainData') {
            maindataRef.current = data;
        } else if (type === 'referenceProductData') {
            referenceDataRef.current = data;
        }
        setIsLoading({ ...maindataRef.current, ...referenceDataRef.current });
    };

    useEffect(() => {
        socketContext.on('mainProducts', function (data) {
            try {
                if (!!data) {
                    var strLiveRates = pako.inflate(data, { to: 'string' });
                    var mainproducts = JSON.parse(strLiveRates);
                    if (!!mainproducts) {
                        setMainData([...mainproducts]);
                    } else {
                        setMainData([]);
                    }
                } else {
                    setMainData([]);
                }
            } catch (error) {
                toast.error(error);
            }
        });

        socketContext.on('referanceProducts', function (data) {
            try {
                if (!!data) {
                    var referance = pako.inflate(data, { to: 'string' });
                    var referanceproducts = JSON.parse(referance);
                    if (!!referanceproducts) {
                        setReferenceProductData([...referanceproducts]);
                    } else {
                        setReferenceProductData([]);
                    }
                } else {
                    setReferenceProductData([]);
                }
            } catch (error) {
                toast.error(error);
            }
        });

        return () => {
            socketContext.off("mainProducts");
            socketContext.off("referanceProducts");
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socketContext]);

    let Ratedisplay = 'none';
    let available = 'none ';
    let isbuy;
    let issell;
    let ishigh;
    let islow;

    for (let data of clientData) {
        if (!!maindata && data?.isRate === true && maindata?.length > 0) {
            Ratedisplay = 'block';
            available = 'none';
            if (data?.isBuy === true) {
                isbuy = '';
            } else {
                isbuy = 'none';
            }
            if (data?.isSell === true) {
                issell = '';
            } else {
                issell = 'none';
            }
            if (data?.isHigh === true) {
                ishigh = '';
            } else {
                ishigh = 'none';
            }
            if (data?.isLow === true) {
                islow = '';
            } else {
                islow = 'none';
            }
        } else if ((!!maindata && maindata?.length < 1) || !data?.isRate) {
            Ratedisplay = 'none';
            available = 'block';
        }
    }

    // Main product 
    const renderMainProduct = useMemo(() => {
        if (!previousMainProduct) return null;

        if (!!maindata && maindata?.length > 0) {
            // eslint-disable-next-line array-callback-return
            return maindata?.map((item, index) => {
                if (item?.src === "gold" || item?.src === "silver") {
                    const bgAsk = backgroundColorClass(item?.ask, previousMainProduct[index]?.ask);
                    const bgBid = backgroundColorClass(item?.bid, previousMainProduct[index]?.bid);
                    return (
                        <div className="content-cover" key={`maindata_${item?.name}`}>
                            <table>
                                <tbody>
                                    <tr className="ligh-white">
                                        <td className="p-h p0">
                                            <div className="main-product-cover">
                                                <h3>{item?.name}</h3>
                                            </div>
                                        </td>
                                        <td className="p-h ph product-rate" style={{ display: (isbuy === "none" && islow === "none") ? "none" : "" }}>
                                            <div className="mn-rate-cover">
                                                <span className={`bgm ${bgBid}`} style={{ display: isbuy }}>
                                                    {item?.bid}
                                                </span>
                                                <span className="bgs hl" style={{ display: islow }}>
                                                    L - {item?.low}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-h ph product-rate" style={{ display: (issell === "none" && ishigh === "none") ? "none" : "" }}>
                                            <div className="mn-rate-cover">
                                                <span className={`bgm ${bgAsk}`} style={{ display: issell }}>
                                                    {item?.ask}
                                                </span>
                                                <span className="bgs hl" style={{ display: ishigh }}>
                                                    H - {item?.high}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    );
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [maindata]);
    //Future product
    const renderFutureProduct = useMemo(() => {
        if (!previousReferenceProductData) return null;
        if (!!referenceProductData && referenceProductData?.length > 0) {
            // eslint-disable-next-line array-callback-return
            return referenceProductData?.map((item, index) => {
                if (item?.symbol === "gold" || item?.symbol === "silver") {
                    const referenceItem = !!referenceData && referenceData?.length > 0 ? referenceData?.find((val) => val?.source === item?.symbol) : null;
                    if (!(!!referenceItem)) {
                        displayFutureRef.current[item?.symbol] = false;
                        return false;
                    } else {
                        displayFutureRef.current[item?.symbol] = true;
                    }
                    const bgAsk = backgroundColorClass(item?.Ask, previousReferenceProductData[index]?.Ask);
                    const bgBid = backgroundColorClass(item?.Bid, previousReferenceProductData[index]?.Bid);
                    let Symbol_Name;
                    if (referenceItem?.source === "gold" || referenceItem?.source === "silver") {
                        Symbol_Name = referenceItem?.name;
                    }
                    return (
                        <div className="col-md-6 mt-3" key={`future_${Symbol_Name}`} style={{ display: !!referenceItem ? "block" : "none" }}>
                            {/* <div className="gold-cover-tittle">
                                <h4>{Symbol_Name}</h4>
                                <div className="cover_bs">
                                    <div className="buy-sell-cover">
                                        <div className="rating-cover">
                                            <h6>buy</h6>
                                            <h5 className={`${bgBid}`}>{item?.Bid}</h5>
                                        </div>
                                        <div className="rating-cover">
                                            <h6>sell</h6>
                                            <h5 className={`${bgAsk}`}>{item?.Ask}</h5>
                                        </div>
                                    </div>
                                    <div className="hl-rate-cover">
                                        <p>h-{item?.High}</p>
                                        <p>l-{item?.Low}</p>
                                    </div>
                                </div>
                            </div> */}
                            <div className="spot-content">
                                <table className="table border-none title-css">
                                    <tbody>
                                        <tr className="product-title-color ligh-white">
                                            <td className="product-header" style={{ padding: "0px" }}>
                                                <span className="spot-title">
                                                    <h2>{Symbol_Name}</h2>
                                                </span>
                                            </td>

                                            <td className="product-header">
                                                <span className={`spt-rt ${bgAsk}`}>{item?.Ask}</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <table className="table border-none">
                                    <tbody>
                                        <tr className="product-title-color ref-rate">
                                            <td className="product-header" style={{ padding: "0px" }}>
                                                <div
                                                    className="product-header font-rate-1 border-none"
                                                    style={{ textAlign: "center" }}
                                                >
                                                    <span>L</span> - {item?.Low}
                                                </div>
                                                <span className="linesl">/</span>
                                                <div
                                                    className="product-header font-rate-1 border-none"
                                                    style={{ textAlign: "center" }}
                                                >
                                                    <span>H</span> - {item?.High}
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    );
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [referenceProductData]);
    // Next Product 
    const renderNextProduct = useMemo(() => {
        if (!previousReferenceProductData) return null;
        if (!!referenceProductData && referenceProductData?.length > 0) {
            // eslint-disable-next-line array-callback-return
            return referenceProductData?.map((item, index) => {
                // const referenceItem =  referenceData[index];
                if (item?.symbol === "goldnext" || item?.symbol === "silvernext") {
                    const referenceItem = !!referenceData && referenceData?.length > 0 ? referenceData?.find((val) => val?.source === item?.symbol) : null;
                    if (!(!!referenceItem)) {
                        displayNextRef.current[item?.symbol] = false;
                        return false;
                    } else {
                        displayNextRef.current[item?.symbol] = true;
                    }
                    const bgAsk = backgroundColorClass(item?.Ask, previousReferenceProductData[index]?.Ask, "next");
                    const bgBid = backgroundColorClass(item?.Bid, previousReferenceProductData[index]?.Bid, "next");
                    let Symbol_Name;
                    if (referenceItem?.source === "goldnext" || referenceItem?.source === "silvernext") {
                        Symbol_Name = referenceItem?.name;
                    }
                    return (
                        <div className="col-md-6 mt-3" key={`next_${Symbol_Name}`} style={{ display: !!referenceItem ? "block" : "none" }}>
                            {/* <div className="gold-cover-tittle">
                                <h4>{Symbol_Name}</h4>
                                <div className="cover_bs">
                                    <div className="buy-sell-cover">
                                        <div className="rating-cover">
                                            <h6>buy</h6>
                                            <h5 className={`${bgBid}`}>{item?.Bid}</h5>
                                        </div>
                                        <div className="rating-cover">
                                            <h6>sell</h6>
                                            <h5 className={`${bgAsk}`}>{item?.Ask}</h5>
                                        </div>
                                    </div>
                                    <div className="hl-rate-cover">
                                        <p>h-{item?.High}</p>
                                        <p>l-{item?.Low}</p>
                                    </div>
                                </div>
                            </div> */}
                            <div className="spot-content">
                                <table className="table border-none title-css">
                                    <tbody>
                                        <tr className="product-title-color ligh-white">
                                            <td className="product-header" style={{ padding: "0px" }}>
                                                <span className="spot-title">
                                                    <h2>{Symbol_Name}</h2>
                                                </span>
                                            </td>

                                            <td className="product-header">
                                                <span className={`spt-rt ${bgAsk}`}>{item?.Ask}</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <table className="table border-none">
                                    <tbody>
                                        <tr className="product-title-color ref-rate">
                                            <td className="product-header" style={{ padding: "0px" }}>
                                                <div
                                                    className="product-header font-rate-1 border-none"
                                                    style={{ textAlign: "center" }}
                                                >
                                                    <span>L</span> - {item?.Low}
                                                </div>
                                                <span className="linesl">/</span>
                                                <div
                                                    className="product-header font-rate-1 border-none"
                                                    style={{ textAlign: "center" }}
                                                >
                                                    <span>H</span> - {item?.High}
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    );
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [referenceProductData]);

    //Spot product 
    const renderSpotProduct = useMemo(() => {
        if (!previousReferenceProductData) return null;
        if (!!referenceProductData && referenceProductData?.length > 0) {
            // eslint-disable-next-line array-callback-return
            return referenceProductData?.map((item, index) => {
                // const referenceItem = !!referenceData ? referenceData[index] : []
                if (item?.symbol === "XAUUSD" || item?.symbol === "XAGUSD" || item?.symbol === "INRSpot") {
                    const referenceItem = !!referenceData && referenceData?.length > 0 ? referenceData?.find((val) => val?.source === item?.symbol) : null;
                    if (!(!!referenceItem)) {
                        displaySpot.current[item?.symbol] = false;
                        return false;
                    } else {
                        displaySpot.current[item?.symbol] = true;
                    }
                    const bgAsk = backgroundColorClass(item?.Ask, previousReferenceProductData[index]?.Ask);
                    const bgBid = backgroundColorClass(item?.Bid, previousReferenceProductData[index]?.Bid);
                    let Symbol_Name;
                    if (referenceItem?.source === "XAUUSD" || referenceItem?.source === "XAGUSD" || referenceItem?.source === "INRSpot") {
                        Symbol_Name = referenceItem?.name;
                    }
                    return (
                        <div className="col-md-4 mt-3" key={`spot_${Symbol_Name}`} style={{ display: !!referenceItem ? "block" : "none" }}>
                            {/* <div className="gold-cover-tittle">
                                <h4>{Symbol_Name}</h4>
                                <div className="cover_bs">
                                    <div className="buy-sell-cover">
                                        <div className="rating-cover">
                                            <h6>buy</h6>
                                            <h5 className={`${bgBid}`}>{item?.Bid}</h5>
                                        </div>
                                        <div className="rating-cover">
                                            <h6>sell</h6>
                                            <h5 className={`${bgAsk}`}>{item?.Ask}</h5>
                                        </div>
                                    </div>
                                    <div className="hl-rate-cover">
                                        <p>H-{item?.High}</p>
                                        <p>l-{item?.Low}</p>
                                    </div>
                                </div>
                            </div> */}
                            <div className="spot-content">
                                <table className="table border-none title-css">
                                    <tbody>
                                        <tr className="product-title-color ligh-white">
                                            <td className="product-header" style={{ padding: "0px" }}>
                                                <span className="spot-title">
                                                    <h2>{Symbol_Name}</h2>
                                                </span>
                                            </td>

                                            <td className="product-header">
                                                <span className={`spt-rt ${bgAsk}`}>{item?.Ask}</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <table className="table border-none">
                                    <tbody>
                                        <tr className="product-title-color ref-rate">
                                            <td className="product-header" style={{ padding: "0px" }}>
                                                <div
                                                    className="product-header font-rate-1 border-none"
                                                    style={{ textAlign: "center" }}
                                                >
                                                    <span>L</span> - {item?.Low}
                                                </div>
                                                <span className="linesl">/</span>
                                                <div
                                                    className="product-header font-rate-1 border-none"
                                                    style={{ textAlign: "center" }}
                                                >
                                                    <span>H</span> - {item?.High}
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    );
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [referenceProductData]);

    const handleAdBanner = () => {
        setAdBannerDisplay('none');
    };
    return (
        <div className="">
            {!!clientData?.[0]?.bannerWeb &&
                <div className="add-banner" style={{ display: adBannerDisplay }}>
                    <div className="cross">
                        <span className="close" onClick={handleAdBanner}>x</span>
                    </div>
                    <img id="advetiseImg" src={clientData?.[0]?.bannerWeb} alt="" />
                </div>
            }

            <h1 className='text-center' style={{ display: available, color: "#fff", textAlign: "center", padding: "8px", }}>Live Rate currently not available.</h1>
            <div className="liverate-cover">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12 mt-3 p-l-r">
                            <div className="main-product">
                                {!(!!isLoading?.maindata) ?
                                    <Skeleton dependency={{ maindata: maindata }} isLoading={(data) => dataLoadedFn(data, "mainData")} height='300px' />
                                    : <div style={{ display: Ratedisplay }}>
                                        <div id="divHeader" style={{ display: !(!!isLoading?.maindata) ? "none" : "block" }}>
                                            <table className="table">
                                                <tbody>
                                                    <tr className="product-title-color">
                                                        <td className="p-h p0">
                                                            <span>PRODUCT</span>
                                                        </td>
                                                        <td className="p-h ph text-center" style={{ display: (isbuy === "none" && islow === "none") ? "none" : "", border: 0 }}>
                                                            <span style={{ display: isbuy === "none" ? "none" : "", border: "0px" }}>BUY</span>
                                                        </td>
                                                        <td className="p-h ph text-center" style={{ display: (issell === "none" && ishigh === "none") ? "none" : "", border: 0 }}>
                                                            <span style={{ display: issell === "none" ? "none" : "", border: "0px" }}>SELL</span>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="divProduct" id="divProduct">
                                            {!!isLoading?.maindata && renderMainProduct}
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div >
            <div className="gold-spot-cover">
                <div className="container-fluid">
                    {!(!!isLoading?.referenceProductData) ?
                        <Skeleton dependency={{ referenceProductData: referenceProductData }}
                            isLoading={(data) => dataLoadedFn(data, "referenceProductData")} height='200px' />
                        : <div style={{ display: !Object.values(displaySpot.current).includes(true) ? "none" : "" }}>
                            <div style={{ display: !(!!isLoading?.referenceProductData) ? "none" : "block" }}>
                                <div className="row">
                                    {renderSpotProduct}
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
            <div className="gold-spot-cover desinround">
                <div className="container-fluid">
                    {!(!!isLoading?.referenceProductData) ?
                        <Skeleton dependency={{ referenceProductData: referenceProductData }}
                            isLoading={(data) => dataLoadedFn(data, "referenceProductData")}
                            height='200px' />
                        : <div
                            style={{
                                display: (!Object.values(displayFutureRef.current).includes(true) && !Object.values(displayNextRef.current).includes(true)) ? "none" : ""
                            }}>
                            <div style={{ display: !(!!isLoading?.referenceProductData) ? "none" : "block" }}>
                                <div className="row">
                                    {renderFutureProduct}
                                    {renderNextProduct}
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>

        </div >
    );
}
