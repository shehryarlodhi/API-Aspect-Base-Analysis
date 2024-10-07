import './App.css';
import Home from './components/Home/Home';
import Navs from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Page1 from './components/SearchPages/Page1';
import Page2 from './components/SearchPages/Page2';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Navs />
                <Routes>
                    <Route path="/" element={<Home className="Home" />} />
                    <Route path="/page1" element={<Page1 />} />
                    <Route path="/page2" element={<Page2 />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
