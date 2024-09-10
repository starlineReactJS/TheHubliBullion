import React, { useContext, useEffect } from 'react';
import pako from "pako";
import { useDispatch } from 'react-redux';
import { setClientData, setPopup, setReferanceData } from './Redux/reducers';
import { SocketContext } from './Layout';
import { Toast } from './Utils';

export default function Socket() {
    let socketContext = useContext(SocketContext);
    const dispatch = useDispatch();
    const toast = Toast();
    useEffect(() => {
        socketContext.on("alertDetails", function (data) {
            try {
                if (!!data) {
                    var popup = pako.inflate(data, { to: 'string' });
                    var popupData = JSON.parse(popup);
                    if (!!popupData) {
                        dispatch(setPopup(popupData));
                    } else {
                        dispatch(setPopup([]));
                    }
                } else {
                    dispatch(setPopup([]));
                }
            } catch (error) {
                toast.error(error);
            }
        });

        socketContext.on('contactDetails', function (data) {
            try {
                if (!!data) {
                    var strLiveRates = pako.inflate(data, { to: 'string' });
                    var clientDetails = JSON.parse(strLiveRates);
                    if (!!clientDetails) {
                        dispatch(setClientData(clientDetails));
                    }
                    else {
                        dispatch(setClientData([]));
                    }
                } else {
                    dispatch(setClientData([]));
                }
            } catch (error) {
                toast.error(error);
            }
        });

        socketContext.on('referanceDetails', function (data) {
            try {
                if (!!data) {
                    var refereancedata = pako.inflate(data, { to: 'string' });
                    var referancedetails = JSON.parse(refereancedata);
                    if (!!referancedetails) {
                        dispatch(setReferanceData(referancedetails));
                    } else {
                        dispatch(setReferanceData([]));
                    }
                } else {
                    dispatch(setReferanceData([]));
                }
            } catch (error) {
                toast.error(error);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div>

        </div>
    );
}
