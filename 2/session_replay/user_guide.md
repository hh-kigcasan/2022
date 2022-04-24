# User Guide

## Folders
- Place your Models, Controllers, and Views (Templates) files under 'application' folder that corresponds to each title/purpose.
- Place your static files (images, stylesheets, scripts) under 'assets' folder.
- Place your Routes files under 'config > routes' folder.

## Settings
- You can modify the configuration settings under 'config' folder and 'config.js'.

## Naming Conventions
| Designation | Convention | Example|
| ------ | ------ | ------ |
| Controller | PascalCase. Plural and ends with 'Controller'. File name and class name should be the same. | UsersController |
| Model | PascalCase. Singular. File name and class name should be the same. | User |
| View | snake_case | products_dashboard.ejs |
| Routes | Plural. | users |
| Function/Methods | camelCase. | getUser() |
| Variables/Class Properties | camelCase. | userData |

## Notes
- All files under 'system' folder should not be modified.