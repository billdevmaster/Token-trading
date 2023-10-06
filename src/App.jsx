/* eslint-disable no-unused-vars */
import './App.css';
import Table from './components/Table';


function App() {
  return (
    <>
      <div className='max-w-7xl m-auto'>
        <div className="text-center">
          <p className='text-2xl text-white pb-5'>Token List</p>
        </div>
        <div className="relative overflow-x-auto">
          <Table />
        </div>
      </div>
    </>
  )
}

export default App
