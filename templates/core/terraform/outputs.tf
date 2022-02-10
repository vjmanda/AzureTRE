output "core_resource_group_name" {
  value = azurerm_resource_group.core.name
}

output "core_resource_group_location" {
  value = azurerm_resource_group.core.location
}

output "log_analytics_name" {
  value = module.azure_monitor.log_analytics_workspace_name
}

output "azure_tre_fqdn" {
  value = module.appgateway.app_gateway_fqdn
}

output "app_gateway_name" {
  value = module.appgateway.app_gateway_name
}

output "static_web_storage" {
  value = module.appgateway.static_web_storage
}

output "keyvault_name" {
  value = azurerm_key_vault.kv.name
}

output "service_bus_resource_id" {
  value = azurerm_servicebus_namespace.sb.id
}

output "service_bus_workspace_queue" {
  value = azurerm_servicebus_queue.workspacequeue.name
}

output "service_bus_deployment_status_queue" {
  value = azurerm_servicebus_queue.service_bus_deployment_status_update_queue.name
}

output "state_store_resource_id" {
  value = azurerm_cosmosdb_account.tre-db-account.id
}

output "state_store_endpoint" {
  value = azurerm_cosmosdb_account.tre-db-account.endpoint
}

output "state_store_account_name" {
  value = azurerm_cosmosdb_account.tre-db-account.name
}

output "app_insights_instrumentation_key" {
  value     = module.azure_monitor.app_insights_instrumentation_key
  sensitive = true
}

output "app_insights_connection_string" {
  value     = module.azure_monitor.app_insights_connection_string
  sensitive = true
}
