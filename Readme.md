Gym Tour Backend Project
==
Backend project for Gym Tour Multi-tenant.

To install project locally please follow the instruction on [Installation Guide][installation-guide].

## Installation Guide

0- You need to have NPM and TypeScript pre-installed globally on your machine.
1- Clone the git repository repository to ur machine in the desired location.
2- Run npm install
3- Change the DB credentials in the .env file to the desired testing DB (local or hosted)
4- Run npm run dbseed
5- Run npm run build
6- Run npm run start

## Contents


If you are looking for something specific, you can jump right into the relevant section from here.

  
1. [Getting Started](#getting-started)

1. [Common Libraries](#common-libraries)

1. [Coding Style](#coding-style)

1. [Deployment](#deployment)

## Getting Started

### VSCode


[VSCode][vscode] is the IDE of choice for most developers.
To install, simply download [Vscode your machine][vscode-website]. It comes with the newest tools and extensions.

[vscode]: https://code.visualstudio.com/docs

[vscode-website]: https://code.visualstudio.com/


### Project Setup

  
We simply need to clone the backend project from github and install the NPM packages then we are ready to run the services.


### Ignores

Check `.gitignore` file for ignored files on Git. That way, unwanted files (node_modules, user settings, temporary files, etc.) will never even make it into your repository.

### Dependency Management

We are using [NPM][npm] as our main dependency management.

[npm]: https://www.npmjs.com/

### Project Structure

Our project structure:

├─ Commands<br>
├─ Dist<br>
├─ Plugins<br>
├─ Src<br>
&nbsp;&nbsp;&nbsp;&nbsp;├─ Api<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├─ Controllers (Has the API logic itself that uses the Services and the models) <br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├─ Errors<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├─ Interceptors<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├─ Middlewares<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├─ Models<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├─ Repositories (Interfacing the DB tables)<br> 
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├─ Services (Holds the basic and custom Crud and other operations implementation for each model)<br> 
&nbsp;&nbsp;&nbsp;&nbsp;├─ Auth<br>
&nbsp;&nbsp;&nbsp;&nbsp;├─ Database<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├─ Factories<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├─ Migrations (Database migration files that generate DB tables)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├─ Seeds (Data Seeding files) <br>
&nbsp;&nbsp;&nbsp;&nbsp;├─ Decorators<br>
&nbsp;&nbsp;&nbsp;&nbsp;├─ Lib<br>
&nbsp;&nbsp;&nbsp;&nbsp;├─ Loaders<br>
&nbsp;&nbsp;&nbsp;&nbsp;├─ Plugin-Manager<br>
&nbsp;&nbsp;&nbsp;&nbsp;├─ Public<br>
&nbsp;&nbsp;&nbsp;&nbsp;├─ Report<br>
├─ Types<br>
├─ Test<br>
├─ Uploads<br>
├─ Views<br>
├─ Assets<br>

### Minimum NPM Version Requirement

We are supporting NPM 10.x.x and above.

## Common Libraries

Generally speaking, make it a conscious decision to add an external dependency to our project. Sure, this one neat library solves your problem now, but maybe later gets stuck in maintenance limbo. Another scenario is that a feature only achievable with external libraries suddenly becomes part of the official APIs. In a well-designed codebase, switching out the implementation is a small effort that pays off quickly. 

Therefore this section has been deliberately kept rather short. The libraries featured here tend to reduce boilerplate code or solve complex problems that require extensive testing, such as date calculations. As you become more proficient with NodeJs, be sure to dive into the source here and there, and acquaint yourself with their underlying NPM Packages. You'll find that those alone can do a lot of the heavy lifting.

#### APIDOCS
Our automated APIDocs generating Package.

#### AWS-SDK
AWS Package allowing us to access AWS resources such as S3, Cloudfront and more.

#### Bcrypt
Password maniplutation and hashing package.

#### EJS
We use EJS to render some server-side views such as some invoices, payment pages, email templates and more.

#### EXPRESS
Express on top of vanilla nodejs to create to serve the incoming API requests.

#### HELMET
Helmet helps you secure your Express apps by setting various HTTP headers.

#### Jsonwebtoken
Helps us Sign and Verifiy JWT tokens to authenticate users.

#### Nodemailer
Connecting our mailing services through SMTP Protocol.

#### Sharp
For image resizing.

#### Winston
For system logging.


### Models

We are using [TypeORM][typeorm] to make data models and preserve their relations.

[typeorm]: https://typeorm.io

## Coding Style

Camel Case coding style is globally used in this project.
We use TSLint to keep the code style 

### Logging

We currently supporting logging system actions from each service call only through Winston Logger.


### Targets

Currently we have only a testing enviornment as the project is under development and we will be serving UFC, GoldsGym, TrueGym and 711 Brands.

As a Multi-tenant software it will be a Single Extensible Point in the Cloud. Meaning that no longer each branch will have their own deployment, rather all of them will be joining Gym Tour Platform.

For Each Brand/Branch Users (Admins, Employees and Customers) they will only need to log in and Gym Tour will provide them with the data and interface according to their roles and which brand/branch they belong to.

## Deployment

- We will be using AWS EC2 server for hosing our demo and later on we are planning to scale it using target groups and load balancers. This point is still under R&D and the current options are AWS ECS using Elastic Containers which is optimal to scale horizontally on spike/stress times.
- For Documents, files and images we will be using AWS S3.
- An AWS RDS Database instance will be used to host our Database with options to scale vertically.

### To Access EC2 Server

- You will need the pem/ppk key to connect with the Server.
- For windows users you can use Putty. For Linux/Mac users you can use the terminal.

---
_Just like software, this document will rot unless we take care of it. We encourage everyone to help us on that – just open an issue or send a pull request!_