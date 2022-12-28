import React from 'react';
import Link from 'next/link';
import { AiOutlineShopping } from 'react-icons/ai';

import { Cart } from './';
import { useStateContext } from '../context/StateContext';

/**
 * Navbar component; responsible for logic and display of the navigation bar in the application.
 */
function Navbar() {
  const { showCart, setShowCart, totalQuantities } = useStateContext();

  return (
    <div className='navbar-container'>

      <p className='logo'>
        <Link href="/">
          The Headphones Store
        </Link>
      </p>

      <button type='button' className='cart-icon' onClick={() => {
        setShowCart(true);
      }}>
        <AiOutlineShopping />
        <span className='cart-item-qty'>{totalQuantities}</span>
      </button>

      {showCart && <Cart />}
    </div>
  )
}

export default Navbar