# This script also can be used to run templates
echo "Run an import flow from commandline"

# ---- Configuration ---
# Tibco Developer Hub URL
DEV_HUB_URL="<DEVELOPER_HUB_URL>"
# Tibco OAuth2 Token
OAUTH2_TOKEN="<OAUTH2_TOKEN>"


#Import flow payload, add the payload in the import-payload.json file
IMPORT_FLOW_INPUT_FILE="../import-payload.json" #do not change this line

# Run the import flow
cd ./platform-scripts || exit
chmod +x import-flow.sh
./import-flow.sh "$DEV_HUB_URL" "$OAUTH2_TOKEN" "$IMPORT_FLOW_INPUT_FILE"