# Students
- mitsukaki - Ephraim B.
- egalized00 - Ibrahim
- Nost01 - Winston N.
- Mohammed-Darbi - Mohammed

# Installation Instructions
## Step 1: Install Node.js
- Download and install Node.js from [here](https://nodejs.org/en/download/)

## Step 2: Install MongoDB
- Download and install MongoDB from [here](https://www.mongodb.com/try/download/community)

### Runnning MongoDB
- Open a terminal, and navigate to the installation folder of MongoDB. On windows this is generally `C:\Program Files\MongoDB\Server\7\bin`
- run `mongod.exe`

## Step 3: Install npm packages
- Open a terminal and navigate to the root directory of this project
- Run `npm install`

## Step 4: Run the server
- Run `npm start` or `node src/main.js`

## Additional Notes
- To use an external mongodb server, simply set the `MDB_URL` environment variable to the connection string of the server. It defaults to `mongodb://localhost:27017` which would be the adress of the local server.
- To set the port of the server, set the `TH_PORT` environment variable. It defaults to `3000`

# Git Command Help
## To Add all new files (usually you should run this every time before you commit)
Run that from the root directory
`git add . --all`

## To commit your changes
`git commit -am "Your message here"`

## To push your changes to the server
`git push`

## To pull the latest changes from the server
`git pull`
