# Property-managament-system - SQL database system
## 🖥️ Status: Project Complete (however can be bug fixes)
## About project:
Project created using MYSQL, node.js, react.js, tailwind. Project is full stack application  
that has been created to manage and store data about properties, owners, rents

Project created in Polish language for SK INVEST company  
## Run Project
Clone this repository and type:
```
npm i
```
to install node modules in backend section and type same in *app* directory  
Also you need to import property_managament_system MySQL database  
To start this project type:
```
npm run dev
```
Project will start using vite.js and can be avaiable in *localhost:5173*
## Project Config
.env file structure
```.env
PORT=<backend port default 3000>
STATIC_HOST=<0 for using devmode or 1 to production>
DB_HOST=<MySQL host default localhost>
DB_USER=<MySQL user default root>
DB_PASSWORD=<MySQL password default "">
DB_NAME=<MySQL db name default "property_managament_system">
BACKUP_DIR=<MySQL database backups folder default "./backups">
ACCESS_TOKEN_KEY=<jsonwebtoken access token key>
REFRESH_TOKEN_KEY=<jsonwebtoken refresh token key>

MAIL_HOST=<Mail host>
MAIL_PORT=<Mail port>
MAIL_USER="<Mail adress>"
MAIL_PASSWORD=<Mail password>
MAIL_ADMIN=<Email which system will send emails>
CRON_SHEDULE=<Cron schedule for backup making and email send (once for 4 weeks) default "0 12 * * 2">
```
## Contributors
Only me (Kamil Kijak)

