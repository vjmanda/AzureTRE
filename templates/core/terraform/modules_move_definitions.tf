# admin jumpbox
moved {
  from = module.jumpbox.azurerm_network_interface.jumpbox_nic
  to   = azurerm_network_interface.jumpbox_nic
}

moved {
  from = module.jumpbox.random_string.username
  to   = random_string.username
}

moved {
  from = module.jumpbox.random_password.password
  to   = random_password.password
}

moved {
  from = module.jumpbox.azurerm_virtual_machine.jumpbox
  to   = azurerm_virtual_machine.jumpbox
}

moved {
  from = module.jumpbox.azurerm_key_vault_secret.jumpbox_credentials
  to   = azurerm_key_vault_secret.jumpbox_credentials
}

## Storage
moved {
  from = module.storage.azurerm_storage_account.stg
  to   = azurerm_storage_account.stg
}

moved {
  from = module.storage.azurerm_storage_share.storage_state_path
  to   = azurerm_storage_share.storage_state_path
}

moved {
  from = module.storage.azurerm_private_dns_zone.blobcore
  to   = azurerm_private_dns_zone.blobcore
}

moved {
  from = module.storage.azurerm_private_endpoint.blobpe
  to   = azurerm_private_endpoint.blobpe
}

moved {
  from = module.storage.azurerm_private_dns_zone.filecore
  to   = azurerm_private_dns_zone.filecore
}

moved {
  from = module.storage.azurerm_private_endpoint.filepe
  to   = azurerm_private_endpoint.filepe
}

## Identity
moved {
  from = module.identity.azurerm_user_assigned_identity.id
  to   = azurerm_user_assigned_identity.id
}

moved {
  from = module.identity.azurerm_role_assignment.vm_contributor
  to   = azurerm_role_assignment.vm_contributor
}

moved {
  from = module.identity.azurerm_role_assignment.acrpull_role
  to   = azurerm_role_assignment.acrpull_role
}

moved {
  from = module.identity.azurerm_role_assignment.servicebus_sender
  to   = azurerm_role_assignment.servicebus_sender
}

moved {
  from = module.identity.azurerm_role_assignment.servicebus_receiver
  to   = azurerm_role_assignment.servicebus_receiver
}

moved {
  from = module.identity.azurerm_role_assignment.cosmos_contributor
  to   = azurerm_role_assignment.cosmos_contributor
}

# Api-webapp
moved {
  from = module.api-webapp.azurerm_app_service_plan.core
  to   = azurerm_app_service_plan.core
}

moved {
  from = module.api-webapp.azurerm_app_service.api
  to   = azurerm_app_service.api
}

moved {
  from = module.api-webapp.azurerm_private_endpoint.api_private_endpoint
  to   = azurerm_private_endpoint.api_private_endpoint
}

moved {
  from = module.api-webapp.azurerm_app_service_virtual_network_swift_connection.api-integrated-vnet
  to   = azurerm_app_service_virtual_network_swift_connection.api-integrated-vnet
}

moved {
  from = module.api-webapp.azurerm_monitor_diagnostic_setting.webapp_api
  to   = azurerm_monitor_diagnostic_setting.webapp_api
}

# Service bus
moved {
  from = module.servicebus.azurerm_servicebus_namespace.sb
  to   = azurerm_servicebus_namespace.sb
}
moved {
  from = module.servicebus.azurerm_servicebus_queue.workspacequeue
  to   = azurerm_servicebus_queue.workspacequeue
}
moved {
  from = module.servicebus.azurerm_servicebus_queue.service_bus_deployment_status_update_queue
  to   = azurerm_servicebus_queue.service_bus_deployment_status_update_queue
}
moved {
  from = module.servicebus.azurerm_private_dns_zone.servicebus
  to   = azurerm_private_dns_zone.servicebus
}
moved {
  from = module.servicebus.azurerm_private_dns_zone_virtual_network_link.servicebuslink
  to   = azurerm_private_dns_zone_virtual_network_link.servicebuslink
}
moved {
  from = module.servicebus.azurerm_private_endpoint.sbpe
  to   = azurerm_private_endpoint.sbpe
}
moved {
  from = module.servicebus.azurerm_servicebus_namespace_network_rule_set.servicebus_network_rule_set
  to   = azurerm_servicebus_namespace_network_rule_set.servicebus_network_rule_set
}

# Keyvault
moved {
  from = module.keyvault.azurerm_key_vault.kv
  to   = azurerm_key_vault.kv
}

moved {
  from = module.keyvault.azurerm_key_vault_access_policy.deployer
  to   = azurerm_key_vault_access_policy.deployer
}

moved {
  from = module.keyvault.azurerm_key_vault_access_policy.managed_identity
  to   = azurerm_key_vault_access_policy.managed_identity
}

moved {
  from = module.keyvault.azurerm_private_endpoint.kvpe
  to   = azurerm_private_endpoint.kvpe
}

# Firewall
moved {
  from = module.firewall.azurerm_public_ip.fwpip
  to   = azurerm_public_ip.fwpip
}
moved {
  from = module.firewall.azurerm_firewall.fw
  to   = azurerm_firewall.fw
}
moved {
  from = module.firewall.azurerm_management_lock.fw
  to   = azurerm_management_lock.fw
}
moved {
  from = module.firewall.azurerm_monitor_diagnostic_setting.firewall
  to   = azurerm_monitor_diagnostic_setting.firewall
}
moved {
  from = module.firewall.azurerm_firewall_application_rule_collection.shared_subnet
  to   = azurerm_firewall_application_rule_collection.shared_subnet
}
moved {
  from = module.firewall.azurerm_firewall_application_rule_collection.resource_processor_subnet
  to   = azurerm_firewall_application_rule_collection.resource_processor_subnet
}
moved {
  from = module.firewall.azurerm_firewall_network_rule_collection.general
  to   = azurerm_firewall_network_rule_collection.general
}
moved {
  from = module.firewall.azurerm_firewall_network_rule_collection.resource_processor_subnet
  to   = azurerm_firewall_network_rule_collection.resource_processor_subnet
}
moved {
  from = module.firewall.azurerm_firewall_network_rule_collection.web_app_subnet
  to   = azurerm_firewall_network_rule_collection.web_app_subnet
}
moved {
  from = module.firewall.azurerm_firewall_application_rule_collection.web_app_subnet
  to   = azurerm_firewall_application_rule_collection.web_app_subnet
}

# Routetable
moved {
  from = module.routetable.azurerm_route_table.rt
  to   = azurerm_route_table.rt
}

moved {
  from = module.routetable.azurerm_subnet_route_table_association.rt_shared_subnet_association
  to   = azurerm_subnet_route_table_association.rt_shared_subnet_association
}

moved {
  from = module.routetable.azurerm_subnet_route_table_association.rt_resource_processor_subnet_association
  to   = azurerm_subnet_route_table_association.rt_resource_processor_subnet_association
}

moved {
  from = module.routetable.azurerm_subnet_route_table_association.rt_web_app_subnet_association
  to   = azurerm_subnet_route_table_association.rt_web_app_subnet_association
}

# State store
moved {
  from = module.state-store.azurerm_cosmosdb_account.tre-db-account
  to   = azurerm_cosmosdb_account.tre-db-account
}

moved {
  from = module.state-store.azurerm_cosmosdb_sql_database.tre-db
  to   = azurerm_cosmosdb_sql_database.tre-db
}
moved {
  from = module.state-store.azurerm_management_lock.tre-db
  to   = azurerm_management_lock.tre-db
}
moved {
  from = module.state-store.azurerm_private_dns_zone.cosmos
  to   = azurerm_private_dns_zone.cosmos
}
moved {
  from = module.state-store.azurerm_private_dns_zone_virtual_network_link.cosmos_documents_dns_link
  to   = azurerm_private_dns_zone_virtual_network_link.cosmos_documents_dns_link
}
moved {
  from = module.state-store.azurerm_private_endpoint.sspe
  to   = azurerm_private_endpoint.sspe
}


# Bastion
moved {
  from = module.bastion.azurerm_public_ip.bastion
  to   = azurerm_public_ip.bastion
}

moved {
  from = module.bastion.azurerm_bastion_host.bastion
  to   = azurerm_bastion_host.bastion
}