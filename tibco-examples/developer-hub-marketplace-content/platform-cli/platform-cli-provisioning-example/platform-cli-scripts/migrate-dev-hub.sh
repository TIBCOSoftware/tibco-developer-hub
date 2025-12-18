# Configuration
platform_cli_profile="<Your_CLI_Profile>"
DATAPLANE_NAME_SOURCE="DevHubA"
DATAPLANE_NAME_TARGET="DevHubB"
ENTITIES_FILE="devhub_entities.json"

do_export=false
# do_export=true
do_import=false
# do_import=true


tibcop refresh-token --profile "$platform_cli_profile"

if [ "$do_export" = true ]; then
  echo "---------- Extracting configuration from a TIBCO Developer Hub  --------------------";
  echo "-- Profile: $platform_cli_profile"
  echo "-- Dataplane Source Name: $DATAPLANE_NAME_SOURCE"
  echo "----------------------------------------------------------------------------------------";

  tibcop thub:list-entities --dataplane-name "$DATAPLANE_NAME_SOURCE" --profile "$platform_cli_profile"

  echo "Writing entites to file: $ENTITIES_FILE"
  tibcop thub:list-entities --dataplane-name "$DATAPLANE_NAME_SOURCE" --profile "$platform_cli_profile" --json > "$ENTITIES_FILE" # Get entities out of DevHub_A
fi

if [ "$do_import" = true ]; then
  echo "---------- Injecting configuration into a TIBCO Developer Hub  --------------------";
  echo "-- Profile: $platform_cli_profile"
  echo "-- Dataplane Taget Name: $DATAPLANE_NAME_TARGET"
  echo "----------------------------------------------------------------------------------------";

  # Create a temporary file to track processed URLs
  temp_file=$(mktemp)
  # temp_file="temp.txt"

  # List entities before:
  tibcop thub:list-entities --dataplane-name "$DATAPLANE_NAME_TARGET" --profile "$platform_cli_profile"

  # Extract and process unique origin URLs
  jq -r '.[] | .metadata.annotations."backstage.io/managed-by-origin-location" // empty' < "$ENTITIES_FILE" | \
  while IFS= read -r origin_location; do
      # Extract the URL part (everything after "url:")
      if [[ "$origin_location" =~ ^url:(.+)$ ]]; then
          url="${BASH_REMATCH[1]}"

          # Check if we've already processed this URL
          if ! grep -Fxq "$url" "$temp_file" 2>/dev/null; then
              # Mark this URL as processed
              echo "$url" >> "$temp_file"

              # Execute your code here for the unique URL
              echo "Processing unique URL: $url"
              tibcop thub:register-entity --dataplane-name "$DATAPLANE_NAME_TARGET" --url "$url" --profile "$platform_cli_profile"

          else
              echo "Skipping duplicate URL: $url"
              echo ""
          fi
      fi
  done

  # Clean up
  rm -f "$temp_file"

  # List entities after:
  tibcop thub:list-entities --dataplane-name "$DATAPLANE_NAME_TARGET" --profile "$platform_cli_profile"
fi
