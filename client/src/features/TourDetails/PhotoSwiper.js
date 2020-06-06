import React from 'react';
import { Image } from 'semantic-ui-react';
import Swiper from 'react-id-swiper';

const PhotoSwiper = ({images}) => {
    const params = {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        coverflowEffect: {
          rotate: 50,
          stretch: 1,
          depth: 100,
          modifier: 1,
          slideShadows: true
        },
        pagination: {
          el: '.swiper-pagination'
        }
      }
      if(images){
        var [img1, img2, img3] = images;
      }
    return (
        <Swiper {...params}>
            <Image src={`/tours/${img1}`} style={{height: '500px', width: '500px'}}/>
            <Image src={`/tours/${img2}`} style={{height: '500px', width: '500px'}}/>
            <Image src={`/tours/${img3}`} style={{height: '500px', width: '500px'}}/>
        </Swiper>
    )
};

export default PhotoSwiper;
