import { apiUrl, prjName } from "../Config";

export const post = async (data, endpoint, formData = false) => {
    let requestOptions;
    if (formData) {
        const formdata = new FormData();
        formdata.append("user", prjName);
        let copyFields = ["addressCopy", "panCopy", "gstCopy", "partnershipCopy"];
        Object.keys(data).forEach(key => {
            if (copyFields.includes(key) && !!data[key]) {
                formdata.append("Files", data[key], data[key]["path"]);
            } else if (!!data[key]) {
                formdata.append(key, data[key]);
            }
        });
        requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow"
        };
    } else {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(data),
            redirect: "follow",
        };
    }

    try {
        const response = await fetch(`${apiUrl}/${endpoint}`, requestOptions);
        if (!response?.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
};

export const get = async (endpoint) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json; charset=utf-8");

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
    };

    try {
        const response = await fetch(`${apiUrl}/${endpoint}`, requestOptions);
        if (!response?.ok) {
            throw new Error('Network response was not ok');
        }
        const parsedData = await response.json();
        return parsedData;
    } catch (error) {
        throw error;
    }
};