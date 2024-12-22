import baseUrl from "../apis/instance"

export const updateGetCoin = async () => {
    const response = await baseUrl.put("/api.myService.com/v1/user/account/updateGetCoin");
    return response.data ;
}

export const getGifts = async () => {
    const response = await baseUrl.get("/api.myService.com/v1/user/gifts/getGiftEvent");
    return response.data ;
}

export const findAllGift = async (page) => {
    const response = await baseUrl.get(`/api.myService.com/v1/admin/gifts/findAll?page=${page}`);
    return response.data ;
}

export const checkUserReceiveGift = async () => {
    const response = await baseUrl.get("/api.myService.com/v1/user/userGifts/checkReceiveGift");
    return response.data ;
}

export const saveGiftUser = async (userGiftRequest) => {
    const response = await baseUrl.post("/api.myService.com/v1/user/userGifts",userGiftRequest);
    return response.data ;
}

export const getGiftUser = async (userId) => {
    const response = await baseUrl.get(`/api.myService.com/v1/user/userGifts/getGiftUser`);
    return response.data ;
}

export const useGift = async (giftUserId) => {
    const response = await baseUrl.put(`/api.myService.com/v1/user/userGifts/${giftUserId}`);
    return response.data ;
}

export const useCoinUser = async () => {
    const response = await baseUrl.put("/api.myService.com/v1/user/account/useCoin");
    return response.data ;
}

export const getGiftUserById = async (giftUserId) => {
    const response = await baseUrl.get(`/api.myService.com/v1/user/userGifts/${giftUserId}`);
    return response.data ;
}

export const updateGift = async (idGift ,gift) => {
    const response = await baseUrl.put(`/api.myService.com/v1/admin/gifts/${idGift}`,gift);
    return response.data ;
}

export const createGift = async (gift) => {
    const response = await baseUrl.post("/api.myService.com/v1/admin/gifts",gift);
    return response.data ;
}

export const uploadImageGift = async (gift) => {
    const response = await baseUrl.put("/api.myService.com/v1/admin/gifts/uploadImage",gift);
    return response.data;
}

export const deleteGiftById = async (giftId) =>  {
    const response = await baseUrl.delete(`/api.myService.com/v1/admin/gifts/${giftId}`);
    return response.data ;
}