export const defaultHeaders = () => {
    let headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };
    return headers;
};

export const json = (response) => {
    return response.status === 204 ? {} : response.json();
};

export const status = (response) => {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(response);
    }
};