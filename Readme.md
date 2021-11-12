![Website](https://img.shields.io/website?url=https%3A%2F%2Fece444-planit.herokuapp.com%2Fapi%2Fstatus)
# PlanIt 
A course discovery tool by ECE444 Group 10 - 4Sight

Website: [ece444-planit.herokuapp.com](https://ece444-planit.herokuapp.com/)

# Table of Contents

1. [Project Purpose](#project-purpose)
2. [Version](#version)
3. [Tech Stack](#tech-stack)
4. [Development Environment](#development-environment)
5. [License](#license)
6. [Contributing](#contributing)
7. [Resources](#resources)

# Project Purpose
This is an ECE444 group project where our team of five is tasked with creating a course discovery tool. The tool is based off of and meant to be an improvement of [Education Pathways](https://educationpathways.herokuapp.com/). The repository for Education Pathways can be found [here](https://github.com/nelaturuk/education_pathways).

# Version

v0.0.1

# Tech Stack

React.js

Flask

PostgreSQL

# Development Environment

More information can be found in the [Wiki](https://github.com/ECE444-2021Fall/project1-education-pathways-group-10-4sight/wiki#developer-commands).

1. Download and install [docker-compose](https://docs.docker.com/compose/install/#install-compose)

2. From the project directory, run `docker-compose -f docker-compose.yml up -d --build`

3. The App should be up at [localhost:3000](http://localhost:3000) and you can see the logs with `docker logs --follow planit_app`

4. The API should be up at [localhost:5000](http://localhost:5000) and you can see the logs with `docker logs --follow planit_api`

## Testing:

For now, you can test the api using docker with the following steps:

1. After building the api from step 2 (or using `docker-compose-f docker-compose.yml up -d --build`)

2. Run `docker-compose -f docker-compose.yml run -e ENVIRONMENT=testing --rm api python -m pytest` and the tests should run 

# License

[MIT License](http://choosealicense.com/licenses/mit/)

# Contributing

See [Contribution.md](./Contribution.md)

# Contributors

* [Yousif Al-Furaiji](https://github.com/YousifAlfuraiji)
* [Peter Maksymowsky](https://github.com/petermaksymo)
* [Alan (Jia Bao) Du](https://github.com/PomeloFruit)
* [Yuhang Yan](https://github.com/Hoowolf)
* [Kieun Joshua Park](https://github.com/kjoshuapark)

# Resources
[Github Projects Board](https://github.com/ECE444-2021Fall/project1-education-pathways-group-10-4sight/projects/1)

[Github Wiki](https://github.com/ECE444-2021Fall/project1-education-pathways-group-10-4sight/wiki)

[Milestone Documentation](https://utoronto-my.sharepoint.com/:f:/r/personal/peter_maksymowsky_mail_utoronto_ca/Documents/ECE444_F2021_group10?csf=1&web=1&e=PuLxtK) (invite-only)

