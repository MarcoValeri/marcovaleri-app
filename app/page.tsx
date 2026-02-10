import Nav from "./components/Nav/Nav";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import MainLayout from "./components/MainLayout/MainLayout";

const Home = () => {
    return (
        <div>
            <Nav />
            <Header />
            <MainLayout />
            <Footer />
        </div>
    )
}

export default Home;