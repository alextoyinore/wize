'use client'

import React, { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import { Navigation } from 'swiper/modules'
import Erilearn from '@assets/partners/erilearn.png'
import Truuskill from '@assets/partners/truuskill.png'
import Image from 'next/image'

const partners = [
  {
    name: 'Erilearn',
    logo: Erilearn,
    alt: 'Erilearn Logo'
  },
  {
    name: 'Truuskill',
    logo: Truuskill,
    alt: 'Truuskill Logo'
  },
]

const Partners = ({ className }) => {
  return (
    <section className={className}>
      <div className="container mx-auto bg-green-100 p-4 rounded-lg">
        {/* <h2 className="text-3xl font-bold text-center mb-12 text-blue-800">
          Our Partners
        </h2> */}
        
        <Swiper
          // navigation={true}
          modules={[Navigation]}
          spaceBetween={30}
          slidesPerView={3}
          breakpoints={{
            320: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
            1280: {
              slidesPerView: 4,
            },
          }}
          className="mySwiper"
        >
          {partners.map((partner, index) => (
            <SwiperSlide key={index}>
              <div className="flex justify-center items-center">
                <Image
                  src={partner.logo}
                  alt={partner.alt}
                  className="h-8 object-contain filter grayscale brightness-100 hover:grayscale-0 hover:brightness-100 transition-all duration-200 cursor-pointer"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}

export default Partners
