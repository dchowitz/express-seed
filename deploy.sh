#!/bin/bash

set -e

USAGE(){
    echo "Usage: ./`basename $0` <docker-machine name>"
}

if [ "$#" -ne "1" ]; then
    USAGE
    exit 1
fi

dockerHost=$1
echo "going to deploy to $dockerHost"

dockerEnv="$(docker-machine env $dockerHost)"
eval $dockerEnv

docker-compose build
docker-compose up -d

# unset docker host
eval $(docker-machine env -u)