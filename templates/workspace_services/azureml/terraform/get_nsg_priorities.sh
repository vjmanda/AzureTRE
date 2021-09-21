#!/bin/bash

set -e

eval "$(jq -r '@sh "nsg_name=\(.nsg_name) resource_group_name=\(.resource_group_name) direction=\(.direction)"')"

NSG_RULE_MAX_PRIORITY=$(az network nsg rule list -g $resource_group_name --nsg-name  $nsg_name --query 'not_null(max_by([?direction==`Outbound` && access==`Allow`],&priority).priority) || `100`')
NSG_RULE_PRIORITY=$(($NSG_RULE_MAX_PRIORITY + 1))

# Safely produce a JSON object containing the result value.
jq -n --arg nsg_rule_priority "$NSG_RULE_PRIORITY"  '{ "nsg_rule_priority":$nsg_rule_priority }'