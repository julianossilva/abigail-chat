FROM ubuntu:22.04

USER root

RUN export DEBIAN_FRONTEND=noninteractive
RUN apt-get update 
RUN apt-get -y install --no-install-recommends \
    git \
    curl \
    ca-certificates

ARG USERNAME=vscode
ARG GROUP=vscode
ARG UID=1000
ARG GID=1000
RUN groupadd -g ${GID} ${GROUP}
RUN useradd -u ${UID} -g ${GROUP} -s /bin/sh -m ${USERNAME} 

USER ${UID}:${GID}

WORKDIR /home/${USERNAME} 

RUN curl -O https://nodejs.org/dist/v18.16.0/node-v18.16.0-linux-x64.tar.gz
RUN tar -xf node-v18.16.0-linux-x64.tar.gz
RUN mv node-v18.16.0-linux-x64 /home/${USERNAME}/node
RUN echo "export PATH=\"$PATH:$HOME/node/bin\"" >> .bashrc

WORKDIR /home/${USERNAME}/app 
