Please replace the following example with your own content.

Core Design Document: [Change Tracking and Approval Design](https://docs.google.com/document/d/1Vvtp411LVTAyNpnO7oV50xI6FZi6mmEImA2VgHwURuU/edit)

# User Story

An "edit" level user can request a change to a site,
this generates an approval record that must be approved by an "admin" level user.

# Requirements

- An Admin user can approve an individual change or approval all changes to a site/record.
- An Admin user can reject an individual change or reject all changes to a site/record.
- Once an Edit user edits a record, that record goes into an "edited" state and no other users can edit it until the change is approved by an Admin user.

## Data Format

Data format for change tracking is currently set in the PlaceEdit table. The data format is one column for each column in the Place table, plus one JSONB column for each related object.

# Tasks

- Build an ERD (entity relationship diagram) of all associations of the "site/:id#summary" form - max 4 hours.
- Investigate existing change approval design options (examples such as Calibre, or SublimeMerge) - max 1 hour
- Build a wireframe showing a change approval for the "site summary" form. - max 4 hours
- Determine data format for a change approval or use the existing format of PlaceEdit table.

## Related issues

- https://github.com/icefoganalytics/yhsi/issues/10
