# Profile Presentation Specification

## Purpose

Single-page presentation of static profile content in Spanish. A sticky anchor navigation with a mobile menu exposes the page sections: Hero, Sobre mí, Habilidades, Proyectos, Experiencia, Educación, Contacto. All profile content renders from typed, bundled data with a responsive and accessibility floor.

## Requirements

### Requirement: Single-page layout with anchor navigation

The site MUST present all profile sections on a single scrollable page, with a persistent navigation bar that provides anchor links to each section and a mobile menu exposing the same links at narrow widths.

#### Scenario: Desktop anchor navigation

- GIVEN a visitor opens the site on a desktop viewport
- WHEN they activate an anchor link in the navigation
- THEN the page scrolls to the corresponding section
- AND the target section is displayed with its content

#### Scenario: Mobile menu navigation

- GIVEN a visitor opens the site on a narrow (mobile) viewport
- WHEN they activate the menu control
- THEN the mobile menu opens and lists the same anchor links as the desktop navigation
- AND each link scrolls to its section when selected

### Requirement: Static profile content from typed data

The page MUST render the Hero, Sobre mí, Habilidades, Experiencia, and Educación sections from typed, bundled data without any network request, with Spanish copy, including editable placeholder entries for experience and education.

#### Scenario: Content renders without a backend

- GIVEN the site loads with no API or backend available
- WHEN the page renders
- THEN every profile section displays its Spanish content from the bundled data

#### Scenario: Placeholder experience and education entries

- GIVEN the bundled data contains placeholder entries for experience and education
- WHEN the page renders
- THEN those sections display the placeholder entries in Spanish

### Requirement: Social profile links

The page MUST provide links to the owner's LinkedIn and GitHub profiles, each opening the corresponding profile.

#### Scenario: Opening a social link

- GIVEN the page is rendered
- WHEN the visitor activates the GitHub or LinkedIn link
- THEN the corresponding profile opens in a new tab or window

### Requirement: Responsive and accessibility floor

The page MUST be usable on mobile viewports without horizontal overflow and with readable text, and interactive elements MUST be operable by keyboard with accessible names. The rendered page MUST achieve a mobile Lighthouse score of at least 90 for performance, accessibility, and SEO.

#### Scenario: Narrow viewport usability

- GIVEN the site is opened at a mobile viewport width
- WHEN the content is viewed
- THEN there is no horizontal overflow and all text remains readable

#### Scenario: Keyboard access

- GIVEN a visitor navigates without a pointing device
- WHEN they tab through the page
- THEN all navigation and menu controls become focused and operable via keyboard
- AND their accessible names are announced to assistive technology