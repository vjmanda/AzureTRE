# Bootstrapping

This document covers the steps that have to be executed manually before Azure TRE can be deployed (both manually or using the CI/CD).

## Login to Azure

Run `login` command and select the Azure subscription you wish to deploy Azure TRE to:

```cmd
az login
az account list
az account set --subscription <subscription ID>
```

> **Note:** When running locally the credentials of the logged in user will be used to deploy the infrastructure. Hence it is essential the user has enough permissions to deploy all resources.

See [Sign in with Azure CLI](https://docs.microsoft.com/cli/azure/authenticate-azure-cli) for more details.

## Create service principals

Two service principals need to be created: One to authorize the [Makefile](../Makefile) (for deploying locally) and/or [workflows](./workflows.md) (for deploying using CI/CD) and another for [Resource Processor Function](../processor_function/README.md) to provision resources for the TRE workspaces and workspace services.

1. Create a main service principal with "**Owner**" role:

    ```cmd
    az ad sp create-for-rbac --name "sp-aztre-core" --role Owner --scopes /subscriptions/<subscription_id> --sdk-auth
    ```

1. Save the JSON output

    * Locally
    * In a [GitHub secret](https://docs.github.com/en/actions/reference/encrypted-secrets) called `AZURE_CREDENTIALS`.

## Create app registrations

Create app registrations for auth based on the [Authentication & authorization](./auth.md) guide.