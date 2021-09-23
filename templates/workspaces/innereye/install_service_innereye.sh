#!/bin/bash
set -e

porter install tre-service-innereye --reference "${MGMT_ACR_NAME}.azurecr.io/tre-service-innereye:v0.1.2" \
    --cred ./azure.json \
    --parameter-set ./parameters_service_innereye.json \
    --debug