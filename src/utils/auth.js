import Cookies from "js-cookie";

export const isUserLogin = () => {
    const data = Cookies.get("data")
    if (data) {
        if (data.roles.some((e) => e.roles === "USER")) {
            return true;
        }
        return false;
    } else {
        return false;
    }
};