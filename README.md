# CVWO winter assignment AY 2021/22

**Name:** Bryan Lim Jing Xiang

**Matriculation No:** A0233605M

**Application Link:** [todo-list](https://todo-list-frontend-react.herokuapp.com/)

Note: On the first load, the hosted web app might run into some issues or be a bit slow. Do refresh the page and wait for the data to be fetched from the backend server which also has to be started up too. While improvements can be made to include a loading animation as mentioned below, this has to do with heroku dynos being idle when there is no traffic so the first load might be a bit slow.

**Writeups:**

-   [Mid-assignment writeup](./Writeup/BryanLimJingXiang_A0233605M.pdf)
-   [Final assignment writeup](./Writeup/BryanLimJingXiang_A0233605M_FinalWriteup.pdf)

[Backend: ruby on rails](https://github.com/bryanljx/todo-list-backend)

## Overview

This project is currently deployed and hosted on heroku. Do note that the frontend and backend servers are hosted separately.

The tools/technology used are as follow:

-   react
-   material-ui
-   ruby on rails
-   postgresql

## Features

-   CRUD operations on todos
-   Creating, deleting tags
-   Adding/removing tags from todos
-   Filtering todos based on tags and/or completion status

## Areas of improvement:

-   User authentication
-   Loading animation while fetching data (especially when first loading the page)
-   Pagination when there is too many todos
-   Using cron for scheduled backups of database, as well as compression and archival
-   UI/UX improvements
-   Deadlines and reminders
-   Calendar
-   Implement testing
