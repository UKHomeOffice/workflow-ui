import React from 'react';

const AccessibilityStatement = () => (
  <div className="govuk-width-container">
    <main className="govuk-main-wrapper">
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <h1 className="govuk-heading-xl">Accessibility statement for eForms</h1>
          <p className="govuk-body">We want everyone to be able to get and do what they need with this service, regardless of access needs, due to a disability or condition.</p>
          <p className="govuk-body">
            This accessibility statement contains information about eForms, available at
            {' '}
            <a href="https://www.eforms.cop.homeoffice.gov.uk (Opens in new tab)" target="_blank" rel="noopener noreferrer">https://www.eforms.cop.homeoffice.gov.uk (Opens in new tab)</a>
          </p>
          <p className="govuk-body">This website is run by Border Force. We want as many people as possible to be able to use this website. For example, that means you should be able to:</p>
          <ul className="govuk-list govuk-list--bullet">
            <li>Zoom in up to 300%, without the text spilling off the screen.</li>
            <li>Navigate most of the website using just a keyboard.</li>
            <li>Navigate to the main forms list from every form on eForms.</li>
            <li>Read and navigate the order on eForms as it is logical and intuitive/clear.</li>
            <li>Tab through questions in the form whilst always having the focus visible.</li>
          </ul>
          <p className="govuk-body">We’ve also made the website text as simple as possible to understand.</p>
          <p className="govuk-body">
            <a className="govuk-link" target="blank" href="https://mcmw.abilitynet.org.uk/">Abilitynet (opens in new tab)</a>
            {' '}
            has advice on making your device easier to use if you have a disability.
          </p>
          <h2 className="govuk-heading-l">How accessible this website is</h2>
          <p className="govuk-body">We aim to meet international accessibility guidelines. However, this may not always be possible, or we may have missed a problem.</p>
          <p className="govuk-body">Some people may find parts of this service difficult to use because:</p>
          <ul className="govuk-list govuk-list--bullet">
            <li>The JAWS screen reader is not compatible with the Edge Chromium browser, which is the Home Office standard.</li>
            <li>Skip to content does not highlight the body of text that it skips to.</li>
            <li>Questions on the form and some labels in names, such as the forms page, are unable to be identified by the screen reader. The NVDA screen reader is able to read text fields, tabs, links and radio buttons.</li>
            <li>Fields are only auto completed from information in the user’s profile on eForms and not from their browser.</li>
            <li>Headings and titles on eForms and pages do not get read out by the screen reader.</li>
            <li>
              The main headings on each page are paragraphs (
              {'<p>'}
              ) and not
              {'<h1>'}
              .
            </li>
          </ul>
          <p className="govuk-body">We know some parts of this website are not fully accessible. You can see a full list of any issues we currently know about in the Non-accessible content section of this statement.</p>

          <h2 className="govuk-heading-l">Feedback and contact information</h2>
          <p className="govuk-body">If you have difficulty using this service, contact us by:</p>

          <ul className="govuk-list govuk-list--bullet">
            <li>
              Selecting
              {' '}
              <a href="https://support.cop.homeoffice.gov.uk/servicedesk/customer/portal/3" target="_blank" rel="noopener noreferrer">Help (opens in new tab).</a>
            </li>
            <li>Using the chat service on ITNow.</li>
            <li>Reporting an issue on ITNow.</li>
            <li>Calling the service desk on 0845 000 0050.</li>
          </ul>
          <h2 className="govuk-heading-l">Reporting accessibility problems with this website</h2>
          <p className="govuk-body">As part of providing this service, we may need to send you messages or documents. Tell us how you want us to send messages or documents to you. Tell us if you need them in a different format, for example large print, audio recording or braille.</p>
          <p className="govuk-body">We’re always looking to improve the accessibility of our websites and services. If you find any problems or think we’re not meeting accessibility requirements, use the contact details above (in feedback and contact information section) to tell us.</p>

          <h2 className="govuk-heading-l">Enforcement procedure</h2>
          <p className="govuk-body">
            The Equality and Human Rights Commission (EHRC) is responsible for enforcing the Public Sector Bodies (Websites and Mobile Applications) (No. 2) Accessibility Regulations 2018 (the ‘accessibility regulations’). If you’re not happy with how we respond to your complaint,
            {' '}
            <a href="https://www.equalityadvisoryservice.com/" target="_blank" rel="noopener noreferrer">Equality Advisory and Support Service (EASS) (opens in new tab)</a>
            .
          </p>
          <p className="govuk-body">
            If you are in Northern Ireland and are not happy with how we respond to your complaint you can contact the
            {' '}
            <a href="https://www.equalityni.org/help" target="_blank" rel="noopener noreferrer">Equality Commission for Northern Ireland (opens in new tab)</a>
            {' '}
            who are responsible for enforcing the Public Sector Bodies (Websites and Mobile Applications) (No. 2) Accessibility Regulations 2018 (the ‘accessibility regulations’) in Northern Ireland.
          </p>

          <h2 className="govuk-heading-l">Technical information about this website&apos;s accessibility</h2>
          <p className="govuk-body">The Home Office is committed to making its website accessible, in accordance with the Public Sector Bodies (Websites and Mobile Applications) (No. 2) Accessibility Regulations 2018.</p>

          <h2 className="govuk-heading-l">Compliance status</h2>
          <p className="govuk-body">
            This website is partially compliant with the
            {' '}
            <a href="https://www.w3.org/TR/WCAG21/" target="_blank" rel="noopener noreferrer">Web Content Accessibility Guidelines version 2.1 AA standard (opens in new tab)</a>
            {' '}
            AA standard. The non-compliances are listed below.
          </p>
          <h2 className="govuk-heading-l">Non accessible content</h2>
          <p className="govuk-body">The content listed below is non-accessible for the following reasons.</p>

          <h3 className="govuk-heading-m">Non-compliance with the accessibility regulations</h3>
          <ul className="govuk-list govuk-list--bullet">
            <li>Identify input purpose (1.3.5) – we autocomplete from information in the user’s profile in our forms, not from the browser.</li>
            <li>Bypass block (2.4.1) – the skip to content doesn’t highlight the body of text.</li>
            <li>Parsing (4.1.1) – ID must be unique to differentiate each element from another in single sign-on, reports and forms page.</li>
            <li>Name, Role, Value (4.1.2) – Keycloak page aria-hidden attribute on an element removes the element and all its child nodes from the accessibility API.</li>
            <li>Status Message (4.1.3) – status messages/validation errors can be read by screen readers, however screen readers are unable to read questions within the form.</li>
            <li>Site name not included in the browser tab for all eForms.</li>
            <li>Home Office Operations or Project Name Request eForms – a sentence on the start page contains more than 25 words in 1 sentence.</li>
            <li>There is no heading 1 (h1) on all eForms.</li>
          </ul>
          <h3 className="govuk-heading-m">What we’re doing to improve accessibility</h3>
          <p className="govuk-body">Our plan below describes how and when we plan to improve the accessibility of this service:</p>
          <ul className="govuk-list govuk-list--bullet">
            <li>We will train our staff to create accessible services.</li>
            <li>We will implement automated and manual accessibility testing in our development process.</li>
            <li>We will conduct user research and testing with users who have access needs.</li>
            <li>We will put in place alternative arrangements for those who need them and be willing to make additional adjustments if these are not enough.</li>
          </ul>
          <p className="govuk-body">We plan to identify and fix the following areas to be fully compliant by the dates set:</p>
          <p className="govuk-body">By end January 2021</p>
          <ul className="govuk-list govuk-list--bullet">
            <li>Site name not included in the browser tab for all eForms.</li>
            <li>Home Office Operations or Project Name Request eForms – sentences will be reduced to a maximum 25 words.</li>
            <li>Heading 1 (h1) will be included across eForms.</li>
          </ul>
          <p className="govuk-body">By March 2021</p>
          <ul className="govuk-list govuk-list--bullet">
            <li>(4.1.1) The value assigned to an ARIA ID to be made unique to prevent the second instance from being overlooked by assistive technology.</li>
            <li>(4.1.2) Aria-hidden elements updated so they do not contain focusable elements.</li>
            <li>(4.1.3) Screen readers to identify and read questions on the eForms.</li>
          </ul>

          <h3 className="govuk-heading-m">Content that’s not within the scope of the accessibility regulations</h3>
          <h3 className="govuk-heading-m">PDFs</h3>
          <p className="govuk-body">eForms will send a PDF copy to your email, these are essential to providing our services.</p>
          <p className="govuk-body">At this time, we have not identified any content that is not within scope of the accessibility regulations.</p>

          <h2 className="govuk-heading-l">Preparation of this accessibility statement</h2>
          <p className="govuk-body">This statement was prepared on 21 October 2020. It was last reviewed on 20th October 2020.</p>
          <p className="govuk-body">This website was last tested on 20th October 2020. The test was carried out by the Home Office’s Quality Assurance and Testing team.</p>
          <p className="govuk-body">We tested the service based on a user&apos;s ability to complete key journeys. All parts of the chosen journeys were tested.</p>
        </div>
      </div>
    </main>
  </div>
);

export default AccessibilityStatement;
