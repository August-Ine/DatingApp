# DatingApp

This repository contains the source code for a dating application built with an Angular front-end, .NET backend, and PostgreSQL database. The application is hosted at [https://da-august.fly.dev/](https://da-august.fly.dev/).

## Description

The DatingApp is a web application that allows users to create profiles, browse other users' profiles, and interact with potential matches. The application provides features such as user authentication, profile management, liking/disliking profiles, and messaging.

The front-end of the application is developed using Angular, a popular TypeScript-based framework for building web applications. Angular provides a robust and scalable architecture for creating dynamic and responsive user interfaces.

The back-end of the application is built with .NET, a versatile and powerful framework for building web applications and APIs using C#. It provides a reliable and scalable foundation for handling business logic, data processing, and communication with the database.

The PostgreSQL database is used to store user profiles, preferences, and messaging data. PostgreSQL is a robust and highly customizable open-source relational database management system known for its reliability and advanced features.

## Repository Structure

The repository is structured as follows:

- `/client`: Contains the Angular front-end code.
- `/API`: Contains the .NET back-end code.

## Installation and Setup

To set up the DatingApp project locally, follow these steps:

1. Clone the repository:

```shell
git clone https://github.com/August269/DatingApp.git
```

2. Set up the database:
To create a docker containerized postgres database:
   - Install Docker on your development machine.
   - Confirm successful installation by entering `docker` in the terminal
   - Create postgres container: (in terminal):
        - `docker run --name postgres -e POSTGRES_PASSWORD=postgrespw -p 5433:5432 -d postgres:latest`

3. Set up the back-end:
   - Open the `/API` directory.
   - Configure the database connection string in the `appsettings.json` file with port number, postgres password and username.
   - Build and run the back-end using your preferred .NET development tools or CLI.

4. Set up the front-end:
   - Open the `/client` directory.
   - Install the necessary dependencies by running `npm install`.
   - Configure the API endpoint in the `environment.ts` file.
   - Build and run the front-end using the Angular CLI with `ng serve`.

5. Access the application:
   - Once the back-end and front-end are running, you can access the DatingApp at [http://localhost:4200/](http://localhost:4200/).

## Deployment

The DatingApp is deployed using the Fly.io platform and can be accessed at [https://da-august.fly.dev/](https://da-august.fly.dev/). The deployment process involves building and deploying the front-end and back-end components to the Fly.io infrastructure.

To deploy the application to Fly.io, follow the deployment instructions specific to the platform.

## Contributing

Contributions to the DatingApp repository are welcome. If you encounter any issues, have suggestions, or would like to contribute new features, please create a pull request or submit an issue in the GitHub repository.

## License

The DatingApp project is licensed under the [MIT License](LICENSE). Feel free to use and modify the code as per the license terms.

## Acknowledgments

The DatingApp project is inspired by various dating applications and online dating platforms. Special thanks to the open-source community for providing the tools and libraries used in this project.

