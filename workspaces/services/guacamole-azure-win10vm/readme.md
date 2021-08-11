# Guacamole User Resource Service bundle (Windows 10)

This is a User Resource Service template. It contains a Windows 10 to be used by TRE researchers and to be connected using a [Guacamole server](https://guacamole.apache.org/).
It blocks all inbound and outbound traffic to the internet and allows only RDP connections from within the vnet.

## Firewall Rules

Please be aware that the following Firewall rules are opened for the workspace when this service is deployed:

Inbound connectivity from within the VNET to the RDP port

## Manual Deployment

1. Prerequisites for deployment:
    - [A vanilla workspace bundle installed](../../vanilla)
    - [A guacamole workspace service bundle installed](../guacamole)

1. Create a copy of `workspaces/services/guacamole/.env.sample` with the name `.env` and update the variables with the appropriate values.

| Environment variable name | Description |
| ------------------------- | ----------- |
| `WORKSPACE_ID` | The 4 character unique identifier used when deploying the vanilla workspace bundle. |
| `PARENT_SERVICE_ID` | The unique identifier of this service parent (a Guacamole service) |

1. Build and install the Guacamole Service bundle
    - `make porter-build DIR=./workspaces/services/guacamole-azure-win10vm`  
    - `make porter-install DIR=./workspaces/services/guacamole-azure-win10vm`