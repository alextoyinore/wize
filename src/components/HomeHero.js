
import BannerImage from '@/assets/banner-image.png'
import Image from 'next/image'
import Partners from './Partners'
import Link from 'next/link'

export default function HomeHero({className}) {
    return <section className={"relative w-full " + className}>
    
    {/* Hero Content */}
    <div className="relative w-[90%] lg:w-[97%] lg:p-0 mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left Content */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold text-blue-800 mb-6 leading-10">
            Let's bridge<span className='text-green-600'> the wealth gap.</span>
          </h1>
          <p className="text-md md:text-md text-gray-800 mb-6 max-w-2xl mx-auto md:mx-0">
            Start, switch, or advance your business or career with our practical online and offline courses in tech, business, design, and more. Join Uwise today and start building your future!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link
              href="/register"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-800 hover:bg-blue-700 transition-all duration-200 justify-center"
            >
              Get Started
            </Link>
            <Link
              href="/explore"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white transition-all duration-200 justify-center"
            >
              Explore Courses
            </Link>
          </div>
        </div>
        
        {/* Right Content - Illustration */}
        <div className="flex-1 text-center hidden md:block md:text-right">
          <Image
            src={BannerImage}
            alt="African lady coding"
            objectFit='cover'
            className="mx-auto w-[90%] flex-shrink-0"
          />
        </div>
      </div>
    </div>

  </section> 
}
