import React, { useEffect, useMemo, useState } from 'react';
import { get } from '../../Api Methods';
import { prjName } from '../../Config';
import moment from 'moment/moment';
import { Skeleton } from '../../Components/Skeleton';
import { Toast } from '../../Utils';

export default function Update() {
    const [updateContent, setUpdateContent] = useState([]);
    const [updateMessage, setUpdateMessage] = useState([]);
    const today = moment().format("yyyy-MM-DD");
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);
    const [noData, setNoData] = useState(false);
    const [isLoading, setIsLoading] = useState({});
    // eslint-disable-next-line no-unused-vars
    let toast = Toast();

    useEffect(() => {
        if (moment(startDate).format('yyyy-MM-DD') > moment(endDate).format('yyyy-MM-DD')) {
            setEndDate(startDate);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startDate]);

    const updateFn = async () => {
        setIsLoading({});
        let tempStartDate = startDate.split("-").reverse().join("/");
        let tempEndDate = endDate.split("-").reverse().join("/");
        get(`updateDetails?user=${prjName}&fromDate=${tempStartDate}&toDate=${tempEndDate}`)
            .then((res) => {
                if (!!res?.data) {
                    const updateRes = res?.data;
                    if (updateRes?.length === 0 || !(!!updateRes)) {
                        setNoData(true);
                    }
                    setUpdateContent(updateRes?.reverse());
                } else {
                    setNoData(true);
                    setUpdateContent([]);
                }
                setUpdateMessage(res);
            }).catch((err) => {
                toast.error(err);
            });
    };

    const dataLoadedFn = (data) => {
        setIsLoading(data);
    };

    useEffect(() => {
        if (!!noData) {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            setIsLoading({ updateContent: 'dataLoaded' });
        }
    }, [noData]);

    useEffect(() => {
        updateFn();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderUpdates = useMemo(() => {
        if (!!noData && (!(!!updateContent) || updateContent?.length === 0)) {
            return (<h1 className='text-center' style={{ color: '#000', fontWeight: 600 }}>No Updates Found</h1>);
        }
        // eslint-disable-next-line array-callback-return
        return updateContent?.map((data, index) => {
            let dateTime = data?.modifiedDate.split('T');
            let date = dateTime?.[0];
            // eslint-disable-next-line no-unused-vars
            const [year, month, day] = date.split('-');
            const formattedDate = `${day} ${new Date(date).toLocaleString('default', { month: 'long' })} ${year}`;
            let time = dateTime?.[1].split('.');
            if (updateMessage.message !== "Data not available.") {
                return (
                    <div className="up-cover" key={index}>
                        <div className="update-date-cover">
                            <h2>
                                {formattedDate}
                                <p className="update-time">Time: {time?.[0]}</p>
                            </h2>
                        </div>
                        <div className="update-title">
                            <h4>{data?.title}</h4>
                            <p>
                                {data?.description === null ? 'NA' : data?.description}
                            </p>
                        </div>
                    </div>
                );
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateContent]);

    return (
        <>
            <div className="main-cover">
                <div className="container">
                    <div className="update-cover">
                        <div className="col-md-12">
                            <div className="header">
                                <div className="title-wth title-name">
                                    UPDATES
                                    <div className="mn-title-border">
                                        <div className="date-picker">
                                            <input id="txtStartDate" type="date" className='hasDatepicker'
                                                value={startDate}
                                                onChange={(e) =>
                                                    setStartDate(e.target.value)}
                                            />
                                            <input id="txtEndDate" type="date" className='hasDatepicker'
                                                value={endDate}
                                                onChange={(e) =>
                                                    setEndDate(e.target.value)}
                                                min={startDate.split("/").reverse().join("-")}
                                            />
                                            <input type="button" id="SearchNewsDateWise" style={{ cursor: "pointer" }} value="Search"
                                                onClick={() => updateFn()}
                                                onMouseDown={(e) => setNoData(false)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <div class="col-md-12" id="divNews"> */}
                        <div className="col-md-12">
                            <div className="update-cover">
                                {!(!!isLoading?.updateContent)
                                    ? <Skeleton dependency={{ updateContent: updateContent }} isLoading={(data) => dataLoadedFn(data)} height='200px' />
                                    : <div id="divNews">
                                        <div style={{ display: (!(!!isLoading?.updateContent) && !(!!noData)) ? "none" : "block" }}>
                                            {renderUpdates}
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
