// eslint-disable-next-line import/prefer-default-export
export function getUrlChange (url : string, params : any | undefined) {
    let str = '?';
    for(const i in (params as any)) {
        if (params && params[i] !== null && params[i] !== undefined) {
            str+=`${i}=${params[i]}&`
        }
    }
    str = str.replace(/&$/,'');
    return `${url}${str}`
}

export function returnFormData (data: any) {
    data = typeof(data) === 'string' && JSON.parse(data) || data;
    const form = new FormData();
    for(const i in data) {
        if (i) form.append(i, data[i]);        
    }
    return form;
}