import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-tooltip/dist/react-tooltip.css'
import Header from './components/Header';

const App = () => {
  return (
    <>
      <Header />
      <ToastContainer />
      <Container className='my-2'>
        <Outlet />
      </Container>
    </>
  );
};

export default App;
