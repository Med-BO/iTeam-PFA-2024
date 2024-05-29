import { Container, Card, Button } from 'react-bootstrap';

const Hero = () => {
  return (
    <div className=' py-5'>
      <Container className='d-flex justify-content-center'>
        <Card className='p-5 d-flex flex-column align-items-center hero-card bg-light w-75'>
          <h1 className='text-center mb-4'>PFA - Assurance</h1>
          <p className='text-center mb-4'>
          This project, currently in its initial development phase, has a plethora of envisioned functionalities yet to be incorporated.
          </p>
          <div className='d-flex'>
            <Button variant='primary' href='/store' className='me-3'>
              Go to Store
            </Button>
          </div>
        </Card>
      </Container>
    </div>
  );
};

export default Hero;
