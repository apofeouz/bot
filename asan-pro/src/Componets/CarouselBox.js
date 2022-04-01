import React from 'react';
import Carousel from 'react-bootstrap/Carousel'
import data from './data';


const CarouselBox = (props) => {

    return (

        <Carousel fabe>
            {data.carousel.map(id => (
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src={id.img}
                        alt="Картинка"
                    />
                    <Carousel.Caption>
                        <h3>{id.title}</h3>
                    </Carousel.Caption>
                </Carousel.Item>
            ))}
        </Carousel>
    );

}

export default CarouselBox;