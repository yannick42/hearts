# Hearts (La dame de pique)

a Hearts game coded in vanilla JS (ES6+ ?...)

- The **development environment** is avaible here : https://frontend-hdhtb3y7gq-od.a.run.app

---
## Prerequisites

To launch local commands and to develop the backend (NodeJS), install **node** (and **npm**...)

Also install **gcloud** to deploy inside a container to the **Google Cloud Run** service (project_id = *my-sandbox-yannick*)

---
## Launch locally (for development)

Install development tools (local dev server) and both services locally with `npm run install`

Run: `npm run back` and `npm run front`, then we should see the static site on *http://localhost:8080*, it updates automatically while you are coding, and modifying files (css, js, ...), but not the backend which must be manually restarted after code modification :/

---
## Work with GitHub
If needed, generate a **new ssh public/private** key pair :

`ssh-keygen -t rsa -C "your_email@example.com"`

Then you should add it (the public key) to your github.com settings (*"Settings" > "SSH and GPG keys", "New SSH key" button > choose a title and paste it in the textarea*)

After that you can test it in you CLI with : `ssh -T git@github.com`

Also you can configure your local repository (without touching to your global settings)

`git config --local user.name "your_name"`

`git config --local user.email "your_email@example.com"`

If you already cloned this repo. in https, and need to update to use your ssh keys

`git remote set-url origin git@github.com:yannick42/hearts.git` (inside your cloned repo.)

---
## Domain

If you need to setup a mapping of the *frontend* service to the custom domain :

`gcloud beta run domain-mappings create --service frontend --domain hearts.yannick42.dev`

---
## Deployment

First, **login** to your GCP account, with your email by typing :

`npm run login`

> you will be asked to connect to your account on Google (through their web pages / OAuth)

To **deploy** (frontend & backend services) with :

`npm run deploy-all`

It will deploy a new revision to the "Service URL" https://SERVICE-XXXXX.a.run.app

> **Hint**: Or use `npm run deploy-front` and `npm run deploy-back`
