resource "azurerm_user_assigned_identity" "id" {
  resource_group_name = azurerm_resource_group.core.name
  location            = azurerm_resource_group.core.location

  name = "id-api-${var.tre_id}"

  lifecycle { ignore_changes = [tags] }
}

resource "azurerm_role_assignment" "vm_contributor" {
  scope                = data.azurerm_subscription.current.id
  role_definition_name = "Virtual Machine Contributor"
  principal_id         = azurerm_user_assigned_identity.id.principal_id
}

resource "azurerm_role_assignment" "acrpull_role" {
  scope                = data.azurerm_container_registry.mgmt_acr.id
  role_definition_name = "AcrPull"
  principal_id         = azurerm_user_assigned_identity.id.principal_id
}

resource "azurerm_role_assignment" "servicebus_sender" {
  scope                = azurerm_servicebus_namespace.sb.id
  role_definition_name = "Azure Service Bus Data Sender"
  principal_id         = azurerm_user_assigned_identity.id.principal_id
}

resource "azurerm_role_assignment" "servicebus_receiver" {
  scope                = azurerm_servicebus_namespace.sb.id
  role_definition_name = "Azure Service Bus Data Receiver"
  principal_id         = azurerm_user_assigned_identity.id.principal_id
}

resource "azurerm_role_assignment" "cosmos_contributor" {
  scope                = azurerm_cosmosdb_account.tre-db-account.id
  role_definition_name = "Contributor"
  principal_id         = azurerm_user_assigned_identity.id.principal_id
}
