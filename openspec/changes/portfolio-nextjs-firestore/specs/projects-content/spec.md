# Projects Content Specification

## Purpose

Project content is stored in Firestore and served to the client through `GET /api/projects`, ordered by `sortOrder` with ISO-8601 timestamps. The Proyectos section renders that data dynamically and degrades gracefully with loading, empty, and error states.

## Requirements

### Requirement: Projects API ordered response

`GET /api/projects` MUST return the projects from Firestore ordered by `sortOrder` ascending, each including title, summary, description, technologies, links, featured, and sortOrder, with timestamps serialized as ISO-8601 strings.

#### Scenario: Projects returned in sort order

- GIVEN Firestore contains projects with sortOrder 2 and 1
- WHEN a client requests GET /api/projects
- THEN the response lists the sortOrder-1 project before the sortOrder-2 project

#### Scenario: ISO-8601 timestamps

- GIVEN a stored project has creation and update timestamps
- WHEN it is returned by GET /api/projects
- THEN those timestamps are ISO-8601 formatted strings

### Requirement: Malformed records do not break the response

The API MUST omit individual records that fail response validation and MUST still return the remaining valid projects instead of failing the whole request.

#### Scenario: One malformed record among valid ones

- GIVEN Firestore contains one record with invalid data and two valid records
- WHEN a client requests GET /api/projects
- THEN the response succeeds and contains only the two valid records

### Requirement: Changes reflected without redeploy

The site MUST reflect current Firestore project data without requiring a redeploy.

#### Scenario: Firestore edit appears on reload

- GIVEN the site is deployed and displays a project titled "Alpha"
- WHEN the title is changed in Firestore to "Alpha v2" and the page is reloaded
- THEN the Proyectos section displays "Alpha v2"

### Requirement: Loading and empty states

The Proyectos section MUST show a loading indicator while fetching, and when no projects exist it MUST render a Spanish empty-state message instead of an empty or broken list.

#### Scenario: Loading indicator

- GIVEN the section is fetching projects
- WHEN the request is still in flight
- THEN a loading indicator is displayed

#### Scenario: No projects

- GIVEN GET /api/projects returns an empty list
- WHEN the section renders the response
- THEN a Spanish empty-state message is displayed

### Requirement: Error state

When fetching projects fails, the section MUST display a Spanish error message and MUST NOT prevent the remainder of the page from rendering.

#### Scenario: Projects API unavailable

- GIVEN the projects request fails due to a server or network error
- WHEN the failure occurs
- THEN the Proyectos section shows a Spanish error message
- AND the rest of the page still renders normally