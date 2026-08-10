# Contact Form Specification

## Purpose

The Contacto form submits to `POST /api/contact`. Submissions are validated, honeypot-filtered, and best-effort rate-limited; accepted messages are stored in the Firestore `contacts` collection with a review status. The client shows Spanish success and failure feedback. The owner reviews messages in the Firebase console only; no email delivery in v1.

## Requirements

### Requirement: Validated submission endpoint

`POST /api/contact` MUST validate the submitted payload (required fields and a well-formed email) and MUST reject invalid submissions without persisting them.

#### Scenario: Valid submission

- GIVEN a visitor submits a complete form with a well-formed email
- WHEN the form is submitted
- THEN the API accepts the submission and the message is stored in contacts

#### Scenario: Invalid submission rejected

- GIVEN the submitted payload is missing a required field or has a malformed email
- WHEN the form is submitted
- THEN the API rejects the request with a validation error
- AND no record is stored in contacts

### Requirement: Honeypot filtering

Submissions that contain a value in the hidden honeypot field MUST be dropped and MUST NOT be stored in Firestore.

#### Scenario: Bot fills the honeypot

- GIVEN an automated submitter fills the hidden honeypot field
- WHEN the request reaches the API
- THEN the submission is discarded
- AND no record is stored in contacts

### Requirement: Best-effort rate limiting

The API MUST enforce a best-effort, per-client rate limit that rejects bursts of rapid submissions beyond the allowed count while allowing normal single submissions.

#### Scenario: Burst throttled

- GIVEN many rapid submissions originate from the same client within the limit window
- WHEN the submissions exceed the allowed count
- THEN the excess submissions are rejected with an HTTP 429 response

#### Scenario: Normal submission unaffected

- GIVEN a visitor submits the form once after a quiet period
- WHEN the submission is processed
- THEN it is accepted and stored in contacts

### Requirement: Stored messages with review status

Accepted submissions MUST be stored in the `contacts` collection with a status indicating the message awaits owner review, retrievable via the Firebase console.

#### Scenario: Stored message awaiting review

- GIVEN a valid submission is accepted
- WHEN the record is written to contacts
- THEN the message is stored with a status of "new" (not yet reviewed)
- AND the owner can read it in the Firebase console

### Requirement: Spanish success and failure UX

The form MUST display Spanish feedback: a success message when the server accepts the submission, and an error message when the request fails or is rejected, allowing the visitor to retry.

#### Scenario: Success feedback

- GIVEN the API accepts the submission
- WHEN the client receives the success response
- THEN the form shows a Spanish confirmation message

#### Scenario: Failure feedback and retry

- GIVEN the API rejects the request or the network fails
- WHEN the error occurs
- THEN the form shows a Spanish error message
- AND the visitor can edit and resubmit the form