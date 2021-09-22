#!/bin/bash
set -e

porter install tre-service-innereye-deeplearning --reference "${MGMT_ACR_NAME}.azurecr.io/tre-service-innereye-deeplearning:v0.1.2" \
    --cred ./azure.json \
    --parameter-set ./parameters_service_innereye-deeplearning.json \
    --debug