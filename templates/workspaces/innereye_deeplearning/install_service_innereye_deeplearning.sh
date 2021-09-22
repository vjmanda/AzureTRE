#!/bin/bash
set -e

export AZUREML_WORKSPACE_NAME=$(porter installations output show azureml_workspace_name -i tre-service-azureml | tr -d '"')
export AZUREML_ACR_ID=$(porter installations output show azureml_acr_id -i tre-service-azureml | tr -d '"')
export WORKSPACE_ID=${ID: -4}

porter install tre-service-innereye-deeplearning --reference "${MGMT_ACR_NAME}.azurecr.io/tre-service-innereye-deeplearning:v0.1.0" \
    --cred ./azure.json \
    --parameter-set ./parameters_service_innereye-deeplearning.json \
    --debug