# An Express Server

## 

<br/>

## Install

* **Note: requires a node version >= 7 and an npm version >= 4.**

First, clone the repo via git:

```bash
git clone https://github.com/ringong95/Express-Mongo-Middlegrounds.git your-project-name
```

And then install dependencies with yarn.

```bash
$ cd your-project-name
$ yarn
```
**Note**: If you can't use [yarn](https://github.com/yarnpkg/yarn), run `npm install`.

## Run

Start the app in the `dev` environment. This starts process with Nodemon which allows for any changes in your source to automatically restart your server.

```bash
$ npm run dev
```

## What is it?

This is an Express Server.

## What does it do?

It creates a REST API which accepts data in a format and checks if it meets the requirements. If so it saves it in the MongoDB that its connected to and it also serves up that data from Mongo back to whoever requests it.

## What have i learned?

Learning the difficulties of working with multiple Async actions that require planning to avoid over use of promises and callbacks. I've learned to thin out the data sent in a API call to minimize the strain i am causing with my actions. Trying to minimize Code smell while working with a new format has proven to be challenging.