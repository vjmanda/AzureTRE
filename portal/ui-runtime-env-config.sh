#!/bin/bash
#
# runtime-env-config.sh
#
# Creates PortalUI configuration file from environment variables.
# Useful for runtime configuration injection (vs build time) and
# local development.
#
# Replaces first by alphanumeric lowercase match first, then
# exact match.

# Setup script
UI_PATH=" /usr/share/nginx/html"
CONFIG_DEFAULT_FILE_LOCATION="${UI_PATH}/assets/config.default.json"
CONFIG_FILE_LOCATION="${UI_PATH}/assets/config.json"

echo "$UI_PATH - $CONFIG_DEFAULT_FILE_LOCATION - $CONFIG_FILE_LOCATION"

# Get keys for default configuration
CONFIG_KEYS=`jq -r '. | to_entries | .[].key' $CONFIG_DEFAULT_FILE_LOCATION`

# Get existing configuration (if it exists)
CONFIG="{}"
if test -f "$CONFIG_FILE_LOCATION"; then
    CONFIG=`cat $CONFIG_FILE_LOCATION`
fi

# Cache environment variable keys
ENV_KEYS=`printenv | sed 's;=.*;;'`

# Update config from environment
while IFS= read -r KEY; do

    # First override with fuzzy match (alphanumeric, lowecase)
    KEY_FUZZY=`echo "$KEY" | tr -cd [:alnum:] | tr '[:upper:]' '[:lower:]'`
    for ENV_VAR_NAME in $ENV_KEYS
    do
        ENV_VAR_NAME_FUZZY=`echo "$ENV_VAR_NAME" | tr -cd [:alnum:] | tr '[:upper:]' '[:lower:]'`

        if [[ "$KEY_FUZZY" == "$ENV_VAR_NAME_FUZZY" ]]; then
            CONFIG=`echo $CONFIG | jq ".$KEY = \"${!ENV_VAR_NAME}\""`
        fi
    done

    # Then override for perfect matches
    for ENV_VAR_NAME in $ENV_KEYS
    do
        if [[ "$KEY" == "$ENV_VAR_NAME" ]]; then
            CONFIG=`echo $CONFIG | jq ".$KEY = \"${!ENV_VAR_NAME}\""`
        fi
    done
done <<< $CONFIG_KEYS

# Update runtime config file
echo "done"
echo $CONFIG > $CONFIG_FILE_LOCATION
cat $CONFIG_DEFAULT_FILE_LOCATION
cat $CONFIG_FILE_LOCATION