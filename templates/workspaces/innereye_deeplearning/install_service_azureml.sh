#!/bin/bash
set -e


porter install tre-service-azureml --reference "${MGMT_ACR_NAME}.azurecr.io/tre-service-azureml:v0.1.13" \
    --cred ./azure.json \
    --parameter-set ./parameters_service_azureml.json \
    --param id=$ID"1" \
    --param workspace_id=$ID \
    --debug