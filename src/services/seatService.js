import baseUrl from "../apis/instance"

export const getListSeatSolds = async (showTimeId) => {
    const response = await baseUrl.get(`/api.myService.com/v1/bookingSeats/getBookingSeatByShowTime/${showTimeId}`);
    return response.data ;
}

export const getListSeatByBookingId = async (bookingId) => {
    const response = await baseUrl.get(`/api.myService.com/v1/admin/bookingSeats/getBookingSeatByBookingId/${bookingId}`);
    return response.data ;
}