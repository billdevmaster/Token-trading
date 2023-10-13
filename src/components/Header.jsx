import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <>
      <ul className="flex">
        <li className="mr-6">
          <Link to="/"><p className='text-white'>Tokens</p></Link>
        </li>
        <li className="mr-6">
          <Link to="/setting"><p className='text-white'>Setting</p></Link>
        </li>
      </ul>
    </>
  )
}

export default Header;