# Project2 Basic Website

This is a very basic, technology-agnostic website foundation created for Project2. Its design uses modern CSS aesthetics (gradients, micro-animations, glassmorphism) and is currently fully static, allowing any backend language or database to be integrated seamlessly later.

## Prerequisites

- [Docker](https://www.docker.com/get-started) installed on your machine.

## Running the Website via Docker

Follow these steps to build and run the provided Dockerized website.

### 1. Build the Docker Image

Open your terminal, navigate to the `Project2` folder (where this README is located), and build the image with the following command:

```bash
docker build -t project2-website .
```

### 2. Run the Docker Container

Once the image is built, run a container based on that image. This command maps port 8080 on your host machine to port 80 on the container:

```bash
docker run -d -p 8080:80 --name project2-instance project2-website
```

### 3. Access the Website

Open your web browser and navigate to:

[http://localhost:8080](http://localhost:8080)

### 4. Live Updates (Development Mode)

If you modify `index.html`, you would normally have to stop the container, remove it, rebuild the image, and run it again.

**To avoid rebuilding and see changes live**, you can map your local folder directly into the container using a "bind mount" (`-v`).

Stop and remove any running container first:
```bash
docker stop project2-instance
docker rm project2-instance
```

Then, run this command (the `$(pwd)` automatically inserts your current directory path):
```bash
docker run -d -p 8080:80 -v "$(pwd):/usr/share/nginx/html" --name project2-instance project2-website
```

*(Note for Windows Command Prompt users: replace `$(pwd)` with `%cd%`. If using PowerShell, `$(pwd)` or `${PWD}` will work.)*

Now, if you save changes to `index.html` on your computer, simply **refresh your browser** and the updates will appear instantly—no rebuild required!

## Stopping and Restarting the Container

To stop the running container, execute:

```bash
docker stop project2-instance
```

If you want to start the container again later (without having to re-run the `run` command with all the port arguments), you simply use:

```bash
docker start project2-instance
```

To remove the container completely (if you want to run a fresh one from scratch or update the image):

```bash
docker rm project2-instance
```
