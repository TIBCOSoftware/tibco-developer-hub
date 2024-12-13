repoHost=$repo_host
repoOwner=$repo_owner
repoName=$repo_name
projectName=$bw_project_folder
secret1=$SECRET1
secret2=$SECRET2
initialDir=$(pwd)
BWObfuscateFolder=$BW_OBFUSCATE_FOLDER

echo -----------------------------------------------------------
echo '            Generating EAR Script (Maven)                 '
echo -----------------------------------------------------------
echo ---       repoHost: $repoHost
echo ---      repoOwner: $repoOwner
echo ---       repoName: $repoName
echo ---    projectName: $projectName
echo ---     initialDir: $initialDir
echo -BWObfuscateFolder: $BWObfuscateFolder
echo -----------------------------------------------------------
echo STEP 1: Clone the repo
echo -----------------------------------------------------------
rm -rf $repo_name
repoCloneURL="git@"$repoHost":"$repoOwner"/"$repoName".git"
echo ---     repoCloneURL: $repoCloneURL
git clone $repoCloneURL


echo -----------------------------------------------------------
echo STEP 2: Retrieve the secret
echo -----------------------------------------------------------
key=$secret_encryption_key

PASSWORD1=$(node ./decrypt.js $key $secret1)

PASSWORD2=$(node ./decrypt.js $key $secret2)

echo -----------------------------------------------------------
echo STEP 3: Obfuscate the secret
echo -----------------------------------------------------------

cd $BWObfuscateFolder

OBFUSCATED_PASSWORD1=$(./bwobfuscator $PASSWORD1 <<<"N" grep | tail -1)
OBFUSCATED_PASSWORD2=$(./bwobfuscator $PASSWORD2 <<<"N" grep | tail -1)

echo "OBFUSCATED_PASSWORD1: |$OBFUSCATED_PASSWORD1|"
echo "OBFUSCATED_PASSWORD2: |$OBFUSCATED_PASSWORD2|"

cd $initialDir

echo -----------------------------------------------------------
echo STEP 4: Replace secret in Files
echo -----------------------------------------------------------

node ./replaceInDir.js "./$repoName" "@@SECRET1@@" $OBFUSCATED_PASSWORD1
node ./replaceInDir.js "./$repoName" "@@SECRET2@@" $OBFUSCATED_PASSWORD2

echo -----------------------------------------------------------
echo STEP 5: Run the maven build
echo -----------------------------------------------------------
cd ./$repoName/$projectName.parent
mvn clean package -B


echo -----------------------------------------------------------
echo STEP 6: DEPLOYING TO THE TIBCO PLATFORM
echo -----------------------------------------------------------

PLATFORM_TOKEN=$platform_token

echo ---         DP_URL: $DP_URL
echo ---      NAMESPACE: $NAMESPACE
echo ---   BASE_VERSION: $BASE_VERSION
echo --- BASE_IMAGE_TAG: $BASE_IMAGE_TAG

mvn install -DdpUrl=$DP_URL -DauthToken=$PLATFORM_TOKEN -Dnamespace=$NAMESPACE -DbaseVersion=$BASE_VERSION -DbaseImageTag=$BASE_IMAGE_TAG
