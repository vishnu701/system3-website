# Deployment Guide

This guide covers the deployment process for the GEC-x frontend and backend. The deployment is managed through Docker and Ansible scripts, aimed at provisioning and managing instances on GCP, as well as setting up the necessary Docker containers.

## Overview

The deployment folder contains scripts and configuration files for setting up the server, deploying Docker containers, and managing cloud resources.

## Prerequisites

- Ansible
- Docker
- <mark>Access to GCP (or your cloud provider of choice)</mark>
- <mark>Nginx installed on the server where the application is deployed</mark>
- data.zip inside the deployment directory that consists of the postgres database

## Structure

- `nginx/`: Contains Nginx configuration for the web server. The `nginx.conf` file within this directory should be tailored to the specific requirements of your application, such as defining the server block for your domain and the location of your static files and reverse proxy setup if applicable.
- `*.yml`: Ansible playbooks for various deployment tasks.
- `docker-entrypoint.sh`: Entrypoint script for Docker containers.
- `Dockerfile`: Dockerfile to build the project's Docker image.

## Usage

### API's to enable in GCP before you begin
<mark> Search for each of these in the GCP search bar and click enable to enable these API's
* Compute Engine API
* Service Usage API
* Cloud Resource Manager API
* Google Container Registry API

#### Setup GCP Service Account for deployment
- Here are the step to create a service account:
- To setup a service account you will need to go to [GCP Console](https://console.cloud.google.com/home/dashboard), search for  "Service accounts" from the top search box. or go to: "IAM & Admins" > "Service accounts" from the top-left menu and create a new service account called "deployment". 
- Give the following roles:
- For `deployment`:
    - Compute Admin
    - Compute OS Login
    - Container Registry Service Agent
    - Kubernetes Engine Admin
    - Service Account User
    - Storage Admin
- Then click done.
- This will create a service account
- On the right "Actions" column click the vertical ... and select "Create key". A prompt for Create private key for "deployment" will appear select "JSON" and click create. This will download a Private key json file to your computer. Copy this json file into the **secrets** folder.
- Rename the json key file to `deployment.json`
- Follow the same process Create another service account called `gcp-service`
- For `gcp-service` give the following roles:
    - Storage Object Viewer
- Then click done.
- This will create a service account
- On the right "Actions" column click the vertical ... and select "Create key". A prompt for Create private key for "gcp-service" will appear select "JSON" and click create. This will download a Private key json file to your computer. Copy this json file into the **secrets** folder.
- Rename the json key file to `gecx.json`


### Setup Docker Container (Ansible, Docker, Kubernetes)

Rather than each of installing different tools for deployment we will use Docker to build and run a standard container will all required software.

#### Run `deployment` container
- cd into `deployment`
- Go into `docker-shell.sh` and change `GCP_PROJECT` and `GCP_ZONE` to your project id and zone respectively.
- Run `sh docker-shell.sh` 

- Check versions of tools:
```
gcloud --version
ansible --version
kubectl version --client
```

- Check to make sure you are authenticated to GCP
- Run `gcloud auth list`

Now you have a Docker container that connects to your GCP and can create VMs, deploy containers all from the command line

### SSH Setup
#### Configuring OS Login for service account
```
gcloud compute project-info add-metadata --project <YOUR GCP_PROJECT> --metadata enable-oslogin=TRUE
```

#### Create SSH key for service account
```
cd /secrets
ssh-keygen -f ssh-key-deployment
cd /app
```

### Providing public SSH keys to instances
```
gcloud compute os-login ssh-keys add --key-file=/secrets/ssh-key-deployment.pub
```
From the output of the above command keep note of the username. Here is a snippet of the output 
```
- accountId: gecx
    gid: '3906553998'
    homeDirectory: /home/sa_100110341521630214262
    name: users/deployment@gecx.iam.gserviceaccount.com/projects/gecx
    operatingSystemType: LINUX
    primary: true
    uid: '3906553998'
    username: sa_100110341521630214262
```
The username is `sa_100110341521630214262`

### Deployment Setup
* Add ansible user details in inventory.yml file
* GCP project details in inventory.yml file
* GCP Compute instance details in inventory.yml file



### Ansible Playbooks

Several Ansible playbooks are provided for different purposes, the recommeded order is below:

- `deploy-docker-images.yml`: Builds and pushes the Docker images to GCR.
- `deploy-create-instance.yml`: Creates an instance with the appropriate firewall rules on GCP.
- `deploy-provision-instance.yml`: Provisions new instances for deployment.
- `deploy-setup-containers.yml`: Sets up the required Docker containers.
- `deploy-setup-webserver.yml`: Configures the web server for the application.


To run any playbook, use the following command:

```bash
ansible-playbook -i inventory.yml playbook-name.yml
```

Replace `playbook-name.yml` with the appropriate playbook file name.


### Deployment steps

#### Build and Push Docker Containers to GCR (Google Container Registry)
```
ansible-playbook deploy-docker-images.yml -i inventory.yml
```

#### Create Compute Instance (VM) Server in GCP
```
ansible-playbook deploy-create-instance.yml -i inventory.yml --extra-vars cluster_state=present
```

Once the command runs successfully get the IP address of the compute instance from GCP Console and update the appserver>hosts in inventory.yml file

#### Provision Compute Instance in GCP
Install and setup all the required things for deployment.
```
ansible-playbook deploy-provision-instance.yml -i inventory.yml
```

#### Setup Docker Containers in the  Compute Instance
```
ansible-playbook deploy-setup-containers.yml -i inventory.yml
```


You can SSH into the server from the GCP console and see status of containers
```
sudo docker container ls
sudo docker container logs api-service -f
```

To get into a container run:
```
sudo docker exec -it api-service /bin/bash
```



#### Nginx Configuration

The provided `nginx.conf` should be reviewed and placed in the appropriate directory for Nginx on your server. It should be customized to match your domain and specific application needs. Currently this is set up to work with Streamlit.

If working with something other than Streamlit, Create nginx.conf file for defaults routes in web server

#### Setup Webserver on the Compute Instance
```
ansible-playbook deploy-setup-webserver.yml -i inventory.yml
```
Once the command runs go to `http://<External IP>/


## **Delete the Compute Instance / Persistent disk**
```
ansible-playbook deploy-create-instance.yml -i inventory.yml --extra-vars cluster_state=absent
```

## Continuous Deployment

For continuous deployment, integrate these scripts with your CI/CD pipeline, triggering the necessary playbooks on each code push to the main branch.



## License

This project is licensed under the [LICENSE NAME] License - see the LICENSE.md file for details.

## Acknowledgments

- [Ansible](https://www.ansible.com/)
- [Docker](https://www.docker.com/)
- [Nginx](https://nginx.org/)



