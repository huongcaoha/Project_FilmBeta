import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        {/* Grid responsive */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-8">
          {/* Cột 1: Logo và các liên kết */}
          <div>
            <img
              src="https://betacinemas.vn/Assets/Common/logo/logo.png"
              alt="Beta Cinemas Logo"
              className="mb-4 w-32"
            />
            <ul className="space-y-2 text-gray-600 text-sm">
              <li>Giới thiệu</li>
              <li>Tuyển dụng</li>
              <li>Liên hệ</li>
              <li>F.A.Q</li>
              <li>Hoạt động xã hội</li>
              <li>Điều khoản sử dụng</li>
              <li>Chính sách thanh toán, đổi trả - hoàn vé</li>
              <li>Liên hệ quảng cáo</li>
              <li>Điều khoản bảo mật</li>
              <li>Hướng dẫn đặt vé online</li>
            </ul>
          </div>

          {/* Cột 2: Cụm rạp Beta */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              Cụm rạp Beta
            </h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li>Beta Cinemas Vĩnh Yên, Vĩnh Phúc</li>
              <li>Beta Cinemas Ung Văn Khiêm, TP Hồ Chí Minh</li>
              <li>Beta Cinemas Lào Cai</li>
              <li>Beta Cinemas Trần Quang Khải, TP Hồ Chí Minh</li>
              <li>Beta Cinemas Tmall Phú Quốc, Kiên Giang</li>
              <li>Beta Cinemas Empire Bình Dương</li>
              <li>Beta Cinemas Quang Trung, TP Hồ Chí Minh</li>
              <li>Beta Cinemas Giải Phóng, Hà Nội</li>
              <li>Beta Cinemas Thanh Xuân, Hà Nội</li>
              <li>Beta Cinemas Mỹ Đình, Hà Nội</li>
              <li>Beta Cinemas Dan Phượng, Hà Nội</li>
              <li>Beta Cinemas Thái Nguyên</li>
              <li>Beta Cinemas Thanh Hóa</li>
            </ul>
          </div>

          {/* Cột 3: Kết nối với chúng tôi */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              Kết nối với chúng tôi
            </h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li>
                <a href="#" className="flex items-center space-x-2">
                  <i className="fab fa-facebook"></i>
                  <span>Facebook</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center space-x-2">
                  <i className="fab fa-youtube"></i>
                  <span>YouTube</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center space-x-2">
                  <i className="fab fa-tiktok"></i>
                  <span>TikTok</span>
                </a>
              </li>
            </ul>
            <img
              src="https://betacinemas.vn/Assets/Common/logo/dathongbao.png"
              alt="Đã Thông Báo Bộ Công Thương"
              className="mt-4 w-32"
            />
          </div>

          {/* Cột 4: Liên hệ */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              Liên hệ
            </h4>
            <p className="text-gray-600 text-sm">
              Công ty Cổ phần Beta Media
              <br />
              Địa chỉ trụ sở: Tầng 3, số 595, đường Giải Phóng, phường Giáp Bát,
              quận Hoàng Mai, thành phố Hà Nội
            </p>
            <p className="text-gray-600 mt-4 text-sm">
              Hotline: 1900 636807 / 0934632682
              <br />
              Email: mkt@betacinemas.vn
            </p>
            <p className="text-gray-600 mt-4 text-sm">
              Liên hệ hợp tác kinh doanh:
              <br />
              Hotline: 1800 646 420
              <br />
              Email: bachtx@betagroup.vn
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
