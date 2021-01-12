# Yukon Historic Sites

## Overview

This application replaces a legacy ASP.NET application 

## Directory Structure

- `/db` Database scripts and schema information
- `/api` Back-end APIs written in Node.js
- `/web` Frond-end application written in Vue.js

## Environment Variables

Within `/api/.env.sample` you will see a listing of relevant environment variables. Depending on the instance (development, test, production) of `NODE_ENV` you are running, you must create the appropriate `.env.**` file. Copy the sample file and fill it in.

## Development

To run this application in development, you must copy `/api/.env.sample`, rename it `/api/.env.development` and fill it with the appropriate values.

## Prodution

To be filled in later...