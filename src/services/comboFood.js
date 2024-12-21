import baseUrl from "../apis/instance"

export const getAllComboFood = async (page) => {
    const response = await baseUrl.get(`/api.myService.com/v1/admin/comboFoods?page=${page}`);
    return response.data ;
}

export const updateFood = async (comboFoodId , comboFood) => {
    const response = await baseUrl.put(`/api.myService.com/v1/admin/comboFoods/${comboFoodId}`,comboFood);
    return response.data ;
}

export const createFood = async (comboFood) => {
    const response = await baseUrl.post("/api.myService.com/v1/admin/comboFoods",comboFood);
    return response.data ;
}

export const deleteFood = async (comboFoodId) => {
    const response = await baseUrl.delete(`/api.myService.com/v1/admin/comboFoods/${comboFoodId}`);
    return response.data ;
}

export const updateImage = async (comboFood) => {
    const response = await baseUrl.put(`/api.myService.com/v1/admin/comboFoods/updateImage`,comboFood);
    return response.data ;
}

export const userGetAllComboFood = async () => {
    const response = await baseUrl.get("/api.myService.com/v1/comboFoods");
    return response.data;
}

export const getFoodByBookingId = async (bookingId) => {
    const response = await baseUrl.get(`/api.myService.com/v1/admin/foodBookings/getFoodByBookingId/${bookingId}`);
    return response.data ;
}