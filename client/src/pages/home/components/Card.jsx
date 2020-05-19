import React from 'react';
import PropTypes from 'prop-types';
import './_card.scss';
import { useTranslation } from 'react-i18next';

const Card = ({
  href, handleClick, footer, count, isLoading,
}) => {
  const { t } = useTranslation();
  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-full __card">
        <a
          href={href}
          onClick={(e) => {
            e.preventDefault();
            handleClick();
          }}
          className="card__body"
        >
          {
          isLoading ? (
            <span className="govuk-!-font-size-19 govuk-!-font-weight-bold">
              {t('loading')}
            </span>
          ) : (
            <span id="count" className="govuk-!-font-size-48 govuk-!-font-weight-bold">
              {count}
            </span>
          )
        }
        </a>
        <div className="card__footer">
          <span className="govuk-!-font-size-19">
            {footer}
          </span>
        </div>
      </div>
    </div>
  );
};

Card.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  count: PropTypes.number.isRequired,
  href: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  footer: PropTypes.string.isRequired,
};

export default Card;
