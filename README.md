# Hearts (La dame de pique)

Hearts game coded in vanilla JS (ES6+ ?)

- Development environment is avaible here : https://frontend-hdhtb3y7gq-od.a.run.app

## Prerequisites
install **node** and **npm** (to launch local command)

install **gcloud** (to deploy inside a container to the **Google CloudRun** service)

## Launch locally
install development tools (local dev server) with `npm run install-frontend`

run `npm run front`, then we should see the static site on *http://localhost:8080*, it updates automatically while you are coding, and modifying files (css, js, ...)

## github
generate a ssh public/private key

`ssh-keygen -t rsa -C "your_email@example.com"`

Then you should add to github.com settings

You can test it with : `ssh -T git@github.com`

Configure your local repository (without touching to your global settings)

`git config --local user.name "your_name"`

`git config --local user.email "your_email@example.com"`

If you clone with https, and need to update to use git/ssh keys

`git remote set-url origin git@github.com:yannick42/hearts.git`

## Deployment

**login** to GCP with your email by typing :

`npm run login`

> you will be asked to connect to your account on Google

**deploy** with :

`npm run deploy`

> it will deploy a new revision to the "Service URL" https://frontend-XXXXX.a.run.app
