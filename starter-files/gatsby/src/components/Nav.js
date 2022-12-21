import React from 'react';
import { Link, navigate } from 'gatsby';

function goToSliceMasters() {
  setTimeout(() => {
    navigate('/slicemasters');
  }, 2000);
}

export default function Nav() {
  return (
    <nav>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/beers">Beers</Link>
      </li>
      <li>
        <button type="button" onClick={goToSliceMasters}>
          click me to see slicemasters after two seconds
        </button>
      </li>
    </nav>
  );
}
