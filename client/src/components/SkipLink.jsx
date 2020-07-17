import React from 'react';
import { scrollToMainContent } from '../utils/scrollToMainContent';

const SkipLink = () => (
  <a
    href="#main-content"
    className="govuk-skip-link"
    onClick={scrollToMainContent}
  >
    Skip to main content
  </a>
);

export default SkipLink;
