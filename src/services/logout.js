import baseUrl from "../apis/instance";

import Cookies from "js-cookie";

export const logoutUser = async () => {
    const response = await baseUrl.put(`/api.myService.com/v1/user/account/logout`)
    return response.data;
}

export const logoutAdmin = async () => {

    const data = JSON.parse(Cookies.get('adminData'));


    const response = await baseUrl.put(`/api.myService.com/v1/user/account/logout`, {}, {
        headers: {
            'Authorization': `Bearer ${data && data.accessToken}`
        }
    })
    return response.data;
}