import Categories from '../../components/Categories/Categories'
import Header from '../../components/Header/Header'
//import IntroOverlay from '../../components/Header/IntroOverlay'
import Reviews from '../../components/Reviews/Reviews'
import Offers from '../../components/Offers/Offers'
import Servcies from '../../components/Servcies/Servcies'
import FeaturedProducts from '../../components/FeaturedProducts/FeaturedProducts'
import './Home.css'
import Products from '../../components/lastProducts/lastProducts'
import OtherProducts from '../../components/Products/OtherProducts'
export default function Home() {
  return (
    <div className='container mx-auto'>
      {/* <IntroOverlay/> */}
      <Header/>
      <Categories/>
      <Products/>
      <FeaturedProducts />
      <OtherProducts/>
      <Offers/>
      <Reviews/>
      <Servcies/>
    </div>
  )
}
