#!/bin/bash
echo "version: $1"
docker build . -t problembank-server:$1
docker push problembank-server:$1
