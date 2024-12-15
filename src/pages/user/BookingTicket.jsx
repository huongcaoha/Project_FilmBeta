
import { useCookies } from 'react-cookie';
import React, { useEffect, useState } from "react";

import "../../css/MovieBooking.css";
import { Button, message } from "antd";
import { getSeatByScreen } from '../../services/screenRoom';
export default function BookingTicket () {
  const [cookies] = useCookies(['showTimeDetail']); // Khai báo cookies
  const [seats ,setSeats] = useState([]);
  const showTimeDetail = cookies.showTimeDetail || {}; 
  console.log(showTimeDetail) ;
  const screenRoomDetail = showTimeDetail.screenRoom ;
  const rows = screenRoomDetail.numberRowSeat; // Số hàng ghế
  const cols = screenRoomDetail.numberColSeat; // Số cột ghế

  const toggleSeat = (seat) => {
    setSeats(seats.map(s => {
        if(s.id === seat.id){
          return {...s,status : !s.status} ;
        }else {
          return s ;
        }
      }))
  }
    
    

    const getListSeats = async () => {
        try {
          const response = await getSeatByScreen(screenRoomDetail.id);
          setSeats(response);
        } catch (error) {
          console.error(error);
        }
      };

    const seatGrid = () => {
        const grid = [];
        for (let i = 0; i <= rows; i++) {
          grid.push(seats.slice(i * cols, (i + 1) * cols));
        }
        return grid;
    };

    useEffect(() => {
        getListSeats();
    }, [screenRoomDetail.id]);

    console.log(seats);
  return (
   <div className="flex justify-between gap-[100px]  bg-[#f8f8f8] w-[100%] h-[100vh] pt-[100px] pl-[100px]">
         <div className="text-center bg-black w-[50%] h-[80vh] relative">
           <p className=" w-[70%] h-[40px] m-auto flex justify-center items-center mt-3 text-2xl text-black bg-white  p-5">Projection Screen</p>
         {screenRoomDetail && (
           <div className="booking-section">
            
             <div className="seat-map">
               {seatGrid().map((row, rowIndex) => (
                 <div key={rowIndex} className="seat-row" style={{ display: 'flex' }}>
                   {row.map((seat) => (
                     <button
                       key={seat.id}
                       onClick={() => toggleSeat(seat)}
                    //    className={`seat ${selectedSeats.includes(seat.id) ? 'selected' : ''}`}
                       style={{
                         margin: '2px',
                         backgroundColor: seat.typeSeat === "STANDARD" ? (seat.status ? '#f0f0f0' : 'yellow') : (seat.status ? 'pink' : 'yellow'),
                         color: 'black',
                         padding: '10px',
                         border: 'none',
                         borderRadius: '5px',
                         cursor: 'pointer',
                         width : "40px",
                         height : "40px"
                       }}
                     >
                       {seat.seatName}
                     </button>
                   ))}
                 </div>
               ))}
             </div>
            
           </div>
         )}
         <div className="flex justify-between mt-10">
   
         <div className="flex justify-start gap-x-10 bg-[white] p-[50px] absolute bottom-0 border border-black w-[100%]">
           <div className="flex gap-4 items-center">
             <div className="bg-red-600 w-10 h-10"></div>
             <p className="font-bold">Chairs sold</p>
           </div>
           <div className="flex gap-4 items-center">
             <div className="bg-pink-500 w-10 h-10"></div>
             <p className="font-bold">SweetBox Seat</p>
           </div>
           <div className="flex gap-4 items-center">
             <div className="bg-yellow-500 w-10 h-10"></div>
             <p className="font-bold">Selected chair</p>
           </div>
           <div className="flex gap-4 items-center">
             <div className="bg-[rgb(240, 240, 240);] border border-[#007bff] w-10 h-10"></div>
             <p className="font-bold">Empty chair</p>
           </div>
         </div>
   
         
         </div>  
        </div>
   
   
<div className='w-[50%] ' >
    <div className="bg-white w-[50%] ">
    <div className="row">
    <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">
      <div className="pi-img-wrapper flex ">
        <img
          style={{ width: "40%" }}
          alt=""
          src="https://files.betacorp.vn/media/images/2024/10/16/400wx633h-162649-161024-28.jpg"
        />
        <span style={{ position: "absolute", top: 10, left: 10 }}>
          <img
            src="/Assets/Common/icons/films/c-13.png"
            className="img-responsive"
          />
        </span>
        <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 p-[20px]">
            <h3 className="bold color1 text-xl font-bold">Công Tử Bạc Liêu</h3>
            <h4 className='text-xl mt-5'>2D Phụ đề</h4>
        </div>
      </div>
    </div>
    
    <div className="col-lg-16 col-md-16 col-sm-8 col-xs-16">
      <ul
        className="list-unstyled padding-left-30 padding-right-30 padding-top-10 padding-bottom-10 font-md font-family-san"
        style={{ marginBottom: 0 }}
      >
        <li className="padding-bottom-10 padding-top-10">
          {/* <div className="row flex justify-between px-10">
            <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">
              <i className="fa fa-tags" />
              &nbsp;Thể loại : 
            </div>
            <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">
              <span className="bold">Tâm lý, Hài hước</span>
            </div>
          </div> */}
          <p>Thể loại : Tâm lý , hài hước</p>
        </li>
        <li className="padding-bottom-10 padding-top-10">
          {/* <div className="row">
            <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">
              <i className="fa fa-clock-o" />
              &nbsp;Thời lượng
            </div>
            <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">
              <span className="bold">113 phút</span>
            </div>
          </div> */}
          <p>Thời lượng : 113 phút</p>
        </li>
      </ul>
    </div>
    <div className="col-lg-16 col-md-16 col-sm-8 col-xs-16">
      <hr
        className="border-dashed border-top-2"
        style={{ marginTop: 5, marginBottom: 5 }}
      />
      <ul className="list-unstyled padding-left-30 padding-right-30 padding-top-10 padding-bottom-10 font-md font-family-san">
        <li className="padding-bottom-10 padding-top-10">
          <div className="row">
            <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">
              <i className="fa fa-institution" />
              &nbsp;Rạp chiếu
            </div>
            <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">
              <span className="bold">Beta Thanh Xuân</span>
            </div>
          </div>
        </li>
        <li className="padding-bottom-10 padding-top-10">
          <div className="row">
            <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">
              <i className="fa fa-calendar" />
              &nbsp; Ngày chiếu
            </div>
            <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">
              <span className="bold">15/12/2024</span>
            </div>
          </div>
        </li>
        <li className="padding-bottom-10 padding-top-10">
          <div className="row">
            <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">
              <i className="fa fa-clock-o" />
              &nbsp;Giờ chiếu
            </div>
            <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">
              <span className="bold">23:00</span>
            </div>
          </div>
        </li>
        <li className="padding-bottom-10 padding-top-10">
          <div className="row">
            <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">
              <i className="fa fa-desktop" />
              &nbsp;Phòng chiếu
            </div>
            <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">
              <span className="bold">P1</span>
            </div>
          </div>
        </li>
        <li className="padding-bottom-10 padding-top-10">
          <div className="row">
            <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">
              <i className="fa fa-cubes" />
              &nbsp;Ghế ngồi
            </div>
            <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">
              <span className="seat-name-selected bold">E12, E13</span>
            </div>
          </div>
        </li>
      </ul>
      <div className="text-center padding-bottom-30 " >
        <Button type='primary'>Payment</Button>
      </div>
    </div>
  </div>
</div>

        </div>   
    
   
    </div>
  );
};

