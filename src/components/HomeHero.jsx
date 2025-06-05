
import BannerImage from '@/assets/banner-image.png'
import Image from 'next/image'

export default function HomeHero() {
    return <section className="relative w-full py-5 my-12">
    
    {/* Hero Content */}
    <div className="relative w-full px-8 lg:p-0 mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left Content */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold text-blue-800 mb-6 leading-10">
            Let's bridge<span className='text-green-600'> the wealth gap.</span>
          </h1>
          <p className="text-md md:text-lg text-gray-800 mb-6 max-w-2xl mx-auto md:mx-0">
            Start, switch, or advance your business or career with our practical online and offline courses in tech, business, design, and more. Join Uwise today and start building your future!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a
              href="/register"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-800 hover:bg-blue-700 transition-all duration-200 justify-center"
            >
              Get Started Free
            </a>
            <a
              href="/explore"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white transition-all duration-200 justify-center"
            >
              Explore Courses
            </a>
          </div>

          {/* Trust Badges and Stats */}
            {/* <div className="mt-10 text-sm md:text-base">
                <div className="flex flex-col md:flex-row md:justify-start gap-4 md:gap-4 max-w-4xl">
                    <div className="flex items-start gap-2 text-gray-600">
                        <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                        </svg>
                        <span>100% Nigerian Curriculum</span>
                    </div>
                    <div className="flex items-start gap-2 text-gray-600">
                        <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                        </svg>
                        <span>95% Student Satisfaction</span>
                    </div>
                    <div className="flex items-start gap-2 text-gray-600">
                        <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                        </svg>
                        <span>1000+ Students Served</span>
                    </div>
                </div>
            </div> */}
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
