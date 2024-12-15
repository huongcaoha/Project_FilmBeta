import React, { useState } from 'react';
import { Button, List, Typography, Alert } from 'antd';
// import 'antd/dist/antd.css'; // Import CSS cho Ant Design
import '../css/MovieBooking.css'; // CSS tùy chỉnh của bạn

const { Title, Text } = Typography;

export default function Demo() {
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);

    const movies = [
        { id: 1, title: 'Phim A', time: '18:00' },
        { id: 2, title: 'Phim B', time: '20:00' },
    ];

    const rows = 10;
    const columns = 20;
    const seats = Array.from({ length: rows }, (_, rowIndex) =>
        Array.from({ length: columns }, (_, colIndex) => `(${rowIndex + 1}, ${colIndex + 1})`)
    );

    const handleMovieSelect = (movie) => {
        setSelectedMovie(movie);
        setSelectedSeats([]);
    };

    const toggleSeat = (seat) => {
        setSelectedSeats((prev) =>
            prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
        );
    };

    return (
        <div className="container">
            <Title level={1}>Đặt Vé Xem Phim</Title>
            <div className="movie-list">
                <Title level={2}>Danh Sách Phim</Title>
                <List
                    bordered
                    dataSource={movies}
                    renderItem={movie => (
                        <List.Item onClick={() => handleMovieSelect(movie)} style={{ cursor: 'pointer' }}>
                            {movie.title} - {movie.time}
                        </List.Item>
                    )}
                />
            </div>

            {selectedMovie && (
                <div className="booking-section">
                    <Title level={2}>Chi Tiết Phim: {selectedMovie.title}</Title>
                    <Title level={3}>Chọn Ghế</Title>
                    <div className="seat-map">
                        {seats.map((row, rowIndex) => (
                            <div key={rowIndex} className="seat-row">
                                {row.map((seat) => (
                                    <Button
                                        key={seat}
                                        onClick={() => toggleSeat(seat)}
                                        className={`seat ${selectedSeats.includes(seat) ? 'selected' : ''}`}
                                        style={{
                                            margin: '2px',
                                            backgroundColor: selectedSeats.includes(seat) ? '#007bff' : '#f0f0f0',
                                            color: selectedSeats.includes(seat) ? 'white' : 'black',
                                        }}
                                    >
                                        {seat}
                                    </Button>
                                ))}
                            </div>
                        ))}
                    </div>
                    <Text strong>Ghế đã chọn: {selectedSeats.join(', ')}</Text>
                    <div style={{ marginTop: '10px' }}>
                        <Button
                            type="primary"
                            onClick={() => alert('Đặt vé thành công!')}
                        >
                            Đặt Vé
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}