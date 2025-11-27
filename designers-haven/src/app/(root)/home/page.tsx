import { Footer, Navbar } from "@/components"
import ProductsList from "@/components/home/ProductsList"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50">
      <Navbar />

      {/* Hero Banner */}
      <div className="relative pt-32 pb-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-20 right-20 w-96 h-96 bg-purple-300 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-10 left-20 w-80 h-80 bg-pink-300 rounded-full blur-3xl animate-float-delayed"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-slide-down">
            <h1 className="text-6xl md:text-7xl font-display font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
              Discover Unique Fashion
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
              Explore curated collections from talented designers worldwide
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto mb-12 animate-slide-up delay-200">
            {[
              { label: "New Today", value: "24" },
              { label: "Designers", value: "500+" },
              { label: "Collections", value: "150+" }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
                  <div className="relative bg-white p-6 rounded-2xl shadow-lg">
                    <div className="text-3xl font-display font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="mb-12 animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-4xl font-display font-bold text-gray-900 mb-2">
                Featured Collections
              </h2>
              <p className="text-gray-600">Handpicked pieces from our top designers</p>
            </div>
          </div>
        </div>

        <ProductsList />
      </div>

      <Footer />
    </div>
  )
}
