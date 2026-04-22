import Navbar from "../components/navbar";
import Banner from "../components/banner";
import Carousel from "../components/Carousel";
import Nosotros from "../components/nosotros";
import ContactoSocial from "../components/contactosocial";

function HomePage() {
    return (
        <div className="bg-yellow-400 min-h-screen">
            <Navbar/>
            <Banner/>
            <Carousel/>
            <Nosotros />
            <ContactoSocial />
        </div>
    )
}

export default HomePage;
