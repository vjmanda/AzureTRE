# Azure Provider source and version being used
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "=2.86.0"
    }
  }

  backend "azurerm" {}
}

provider "azurerm" {
  features {
    key_vault {
      purge_soft_delete_on_destroy    = var.debug == "true" ? true : false
      recover_soft_deleted_key_vaults = true
    }
  }
}

resource "azurerm_resource_group" "core" {
  location = var.location
  name     = "rg-${var.tre_id}"
  tags = {
    project    = "Azure Trusted Research Environment"
    tre_id     = var.tre_id
    source     = "https://github.com/microsoft/AzureTRE/"
    ci_git_ref = var.ci_git_ref # TODO: not include if empty
  }

  lifecycle { ignore_changes = [tags] }
}

module "azure_monitor" {
  source                                   = "./azure-monitor"
  tre_id                                   = var.tre_id
  location                                 = var.location
  resource_group_name                      = azurerm_resource_group.core.name
  shared_subnet_id                         = module.network.shared_subnet_id
  azure_monitor_dns_zone_id                = module.network.azure_monitor_dns_zone_id
  azure_monitor_oms_opinsights_dns_zone_id = module.network.azure_monitor_oms_opinsights_dns_zone_id
  azure_monitor_ods_opinsights_dns_zone_id = module.network.azure_monitor_ods_opinsights_dns_zone_id
  azure_monitor_agentsvc_dns_zone_id       = module.network.azure_monitor_agentsvc_dns_zone_id
  blob_core_dns_zone_id                    = module.network.blob_core_dns_zone_id
}

module "network" {
  source              = "./network"
  tre_id              = var.tre_id
  location            = var.location
  resource_group_name = azurerm_resource_group.core.name
  core_address_space  = var.core_address_space
}

module "appgateway" {
  source                 = "./appgateway"
  tre_id                 = var.tre_id
  location               = var.location
  resource_group_name    = azurerm_resource_group.core.name
  app_gw_subnet          = module.network.app_gw_subnet_id
  shared_subnet          = module.network.shared_subnet_id
  api_fqdn               = azurerm_app_service.api.default_site_hostname
  keyvault_id            = azurerm_key_vault.kv.id
  static_web_dns_zone_id = module.network.static_web_dns_zone_id
  depends_on             = [azurerm_key_vault.kv]
}

module "resource_processor_vmss_porter" {
  count                                           = var.resource_processor_type == "vmss_porter" ? 1 : 0
  source                                          = "./resource_processor/vmss_porter"
  tre_id                                          = var.tre_id
  location                                        = var.location
  resource_group_name                             = azurerm_resource_group.core.name
  acr_id                                          = data.azurerm_container_registry.mgmt_acr.id
  app_insights_connection_string                  = module.azure_monitor.app_insights_connection_string
  resource_processor_subnet_id                    = module.network.resource_processor_subnet_id
  docker_registry_server                          = var.docker_registry_server
  resource_processor_vmss_porter_image_repository = var.resource_processor_vmss_porter_image_repository
  service_bus_namespace_id                        = azurerm_servicebus_namespace.sb.id
  service_bus_resource_request_queue              = azurerm_servicebus_queue.workspacequeue.name
  service_bus_deployment_status_update_queue      = azurerm_servicebus_queue.service_bus_deployment_status_update_queue.name
  mgmt_storage_account_name                       = var.mgmt_storage_account_name
  mgmt_resource_group_name                        = var.mgmt_resource_group_name
  terraform_state_container_name                  = var.terraform_state_container_name
  keyvault_id                                     = azurerm_key_vault.kv.id

  depends_on = [
    module.azure_monitor,
    azurerm_key_vault.kv,
    module.firewall
  ]
}

module "firewall" {
  source                     = "./firewall"
  tre_id                     = var.tre_id
  location                   = var.location
  resource_group_name        = azurerm_resource_group.core.name
  log_analytics_workspace_id = module.azure_monitor.log_analytics_workspace_id

  shared_subnet = {
    id               = module.network.shared_subnet_id
    address_prefixes = module.network.shared_subnet_address_prefixes
  }
  firewall_subnet = {
    id               = module.network.azure_firewall_subnet_id
    address_prefixes = module.network.azure_firewall_subnet_address_prefixes
  }
  resource_processor_subnet = {
    id               = module.network.resource_processor_subnet_id
    address_prefixes = module.network.resource_processor_subnet_address_prefixes
  }
  web_app_subnet = {
    id               = module.network.web_app_subnet_id
    address_prefixes = module.network.web_app_subnet_address_prefixes
  }
  depends_on = [
    module.network
  ]
}

module "gitea" {
  count                    = var.deploy_gitea == true ? 1 : 0
  source                   = "../../shared_services/gitea/terraform"
  tre_id                   = var.tre_id
  location                 = var.location
  acr_name                 = data.azurerm_container_registry.mgmt_acr.name
  mgmt_resource_group_name = var.mgmt_resource_group_name

  depends_on = [
    module.network,
    azurerm_app_service_plan.core,
    azurerm_key_vault.kv,
    azurerm_storage_account.stg
  ]
}

module "nexus" {
  count    = var.deploy_nexus == true ? 1 : 0
  source   = "../../shared_services/sonatype-nexus/terraform"
  tre_id   = var.tre_id
  location = var.location

  depends_on = [
    module.network,
    azurerm_app_service_plan.core,
    azurerm_key_vault.kv,
    azurerm_storage_account.stg
  ]
}
