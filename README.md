# To-Do Backend API
<img src="https://img.shields.io/badge/ToDo-API-brightgreen"/>
It is a simple backend API which can do CRUD operations with lists,tag,text,images for the todo Application.

### Link to the [API](https://todobackendapi.herokuapp.com/)


# Run the project

Clone this repo into your local machine and run the following commands
Use the npm package manager [NODE](https://nodejs.org/download) (npm comes along with Node) to install the dependencies.
Create a mongodb database and connect it with your project with environmental variable.You can use postman for checking the api without creating a front end form.

## Installing Dependencies

```bash
# for stable build
npm install --save express mongoose multer upath
# for development
npm install --save-dev nodemon dotenv
```

### Run the Server
```bash
# development
npm run dev-start
# build
npm start
```

## Usage

```
# returns every data in the database
GET https://todobackendapi.herokuapp.com/datas/

# returns a single data with the given id in the database
GET https://todobackendapi.herokuapp.com/datas/:id

# store a single data in the database
POST https://todobackendapi.herokuapp.com/datas/
content-type: application-json 

{
  "text":"next todo",
  "list":["do task 1","do task 2"],
  "tag":["important","high priority"]
}

# update a single or all value in the database
POST https://todobackendapi.herokuapp.com/datas/
content-type: application-json 

{
  "text":"updated todo",
}

# delete a value in the database
GET https://todobackendapi.herokuapp.com/datas/:id

#To upload a image we have to use a front-end form data or Postman

```

## Improvements can be done
To add authentication, signin options using Google to store user data, to create additional functionalities like sort based on a field

