Please replace the following example with your own content.

Fixes [#25](https://github.com/icefoganalytics/yhsi/issues/25)

# User Story

See https://github.com/icefoganalytics/yhsi/issues/3
As an edit level user I can edit the /sites Themes & Function form and it will create a site change request for admin approval.

# Details

Now that I have a working example in the form of the Summary, Location, and Dates & Conditions sections, this task is simply a port of the existing patterns to include an additional sub-form.

# Implementation Details

- Tweaked PlaceEdit saving and serialization to hopefully reduce developer errors.
- Dockerize the test suite and update the README.
- add a `dev ts-node` to get access to a local node repl that runs typescript.

# Screenshots

![image](https://user-images.githubusercontent.com/23045206/163441939-d889fb77-1b78-40e6-b59d-c3a386cc3a5d.png)

# Testing Instructions

1. Update your user roles to include `Site Admin` via the database console.
2. Go to the /sites table and select a site.
3. In the Themes & Function form, make an edit and press save.
4. The site will refresh and your edits will be saved.
5. Update your user roles so that they _do not include_ `Site Admin` or `Administrator` via the database console. Something like `Site Viewer` would probably be best.
6. Go to the /sites table and select a site.
7. In the summary form, make and edit (or two) and press save.
8. The page will refresh and all Themes & Function fields will become readonly. The save button on the Themes & Function form will be disabled with an appropriate tooltip.
9. Make yourself an `Site Admin` again and go to the /sites-change-requests table.
10. The new change request will be at the top of the list. Click on it to review.
11. Note the various features:

- "accept/reject" toggle buttons
- accept/reject all
- save button is locked until all changes are approved/rejected

12. Reject and accept some changes and press Save.
13. Go back to the /sites table and check that you can now edit the site and that the changes have been applied or rejected correctly.
