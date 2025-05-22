import React from 'react';
import { FaFacebookF, FaInstagram, FaQuestionCircle } from 'react-icons/fa';
import './Footer.css'; // Optional for custom styles

export default function Footer() {
  return (
    <div className="foo bg-light border-top py-3 px-4">
      <div className="foo-content d-flex justify-content-around align-items-center">
        <div className="foo-text text-muted">
          © 2025 <strong>StoreRating</strong>. All rights reserved.
        </div>
        <ul className="list-unstyled d-flex gap-3 mb-0">
          <li><FaInstagram className="text-secondary" /></li>
          <li><FaQuestionCircle className="text-secondary" /></li>
          <li><FaFacebookF className="text-secondary" /></li>
        </ul>
      </div>
    </div>
  );
}
