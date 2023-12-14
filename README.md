# Task Manager App

This is a simple task manager app that allows users to manage their tasks, mark them as completed, and edit or delete existing tasks.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Web Server**: You need a web server to host the PHP files. You can use Apache, Nginx, or any other web server of your choice.

- **PHP**: Make sure you have PHP installed on your server.

- **Database**: This app uses a MySQL database. Set up a MySQL database and update the database configuration in `api.php`.

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/liubovridko/task-manager-app.git
    ```

2. Configure the database:

    - Create a new MySQL database for the app.
    - Update the database configuration in `api.php` with your database credentials:

        ```php
        $dbHost = 'your-database-host';
        $dbName = 'your-database-name';
        $dbUser = 'your-database-username';
        $dbPass = 'your-database-password';
        ```

3. Set up the web server:

    - Configure your web server to serve the app from the appropriate directory.
    - Make sure PHP is configured correctly.

4. Open the app in your browser:

    - Navigate to the app's URL in your web browser.
    - You should see the Task Manager interface.

## Usage

- **Adding a Task**: Fill out the "Title" and "Description" fields in the "Add Task" form and click "Add Task."

- **Completing a Task**: Check the checkbox next to a task to mark it as completed.

- **Editing a Task**: Click the "Edit" button next to a task to edit its title and description.

- **Deleting a Task**: Click the "Delete" button next to a task to delete it.

## Contributing

If you'd like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix: `git checkout -b feature/my-feature`.
3. Commit your changes: `git commit -am 'Add new feature'`.
4. Push to the branch: `git push origin feature/my-feature`.
5. Create a new pull request.
