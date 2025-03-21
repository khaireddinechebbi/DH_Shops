import { Footer, HeroSession, Navbar } from "@/components"
import ProductsList from "@/components/home/ProductsList"



export default function Home() {
  return (
    <>
      <Navbar/>
      <HeroSession/>
      <div className="mt-12 padding-x padding-y max-width padding-bottom" id='discover'>
        <div className="home__tex-container">
          <h1 className="text-4xl font-extrabold">Brands Catalogue</h1>
          <p>Explore the models you might like</p>
        </div>
        <div>
        </div>
      </div>
      <ProductsList />
      <Footer/>
    </>
    
  )
}
