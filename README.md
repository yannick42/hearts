# Hearts (La dame de pique)

## Prerequisites
install **node** and **npm**

install **gcloud** (to deploy)

## Launch locally
install **http-server** globally with `npm run install-frontend`

run `npm run front`, then we should see the static site on *http://localhost:8080*

## github
generate a ssh public/private key that we should then add to github.com settings

`ssh-keygen -t rsa -C "your_email@example.com"`

configure

`git config --local user.name "your_name"`

`git config --local user.email "your_email@example.com"`

`git remote set-url origin git@github.com:yannick42/hearts.git`

## Deployment

**login** to GCP with your email by typing :

`npm run login`

> you will be asked to connect to your account on Google

**deploy** with :

`npm run deploy`

> it will deploy a new revision to the "Service URL" https://frontend-XXXXX.a.run.app
