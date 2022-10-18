
Cyan='\033[0;36m'
NC='\033[0m' # No Color
Yellow='\033[0;33m'
Red='\033[0;31m'
Green='\033[0;32m'
Blue='\033[0;34m'

printf "Starting ${Cyan}Vocabify ${NC}Setup...\n\n"

npmVersion=$(npm -v)
firebaseVersion=$(firebase -V)
angularCliVersion=$(ng v)

if [[ -z "$npmVersion" ]];
then
  printf "You dont have ${Red}npm ${NC}installed. Please install it and Try again\n"
  exit 1;
else
  printf "Your npm version is ${Green}${npmVersion}${NC} the there might be some issues if your version is not 7.X.X\n\n";
fi

if [[ -z "$firebaseVersion" ]];
then
  printf "${Red}You dont have ${Yellow}firebase-tools ${Red}installed.\n"
  read -p "Install firebase-tools now? [y/N]" -n 1 -r
  if [[ ! $REPLY =~ ^[Yy]$ ]]
  then
      printf "\n${NC}Exiting Shell. Please install firebase-tools.\n"
      [[ "$0" = "$BASH_SOURCE" ]] && exit 1 || return 1 # exit;
  fi
  printf "\n${Green}Installing ${Yellow}firebase-tools${Green} now Globaly\n";
  npm install -g firebase-tools
else
  printf "${Green}Your ${Yellow}firebase-tools ${Green}is ${Yellow}${firebaseVersion}${Green} the script was tested with version 11.14.X\n";
fi

if [[ -z "$angularCliVersion" ]];
then
  printf "${Red}You dont have ${Blue}angular-cli ${Red}installed.\n"
  read -p "Install angular-cli now? [y/N]" -n 1 -r
  if [[ ! $REPLY =~ ^[Yy]$ ]]
  then
      printf "\n${NC}Exiting Shell. Please install angular-cli.\n"
      [[ "$0" = "$BASH_SOURCE" ]] && exit 1 || return 1 # exit;
  fi
  printf "\n${Green}Installing ${Blue}angular-cli${Green} now Globaly\n";
  npm install -g @angular/cli;
else
  printf "${Green}You have ${Blue}angular-cli ${Green}installed the script was tested with version 14.2.4\n";
fi

cd ..
printf "${NC}Now Installing dependencies\n";
repositoryBase=$(pwd)
npm ci --silent;
printf "Now installing the Backend dependencies\n"
cd functions/
npm ci --silent;
cd ${repositoryBase}


printf "${Cyan}Starting ${Yellow}Firebase${Cyan} setup. Please follow instructions\n"
firebase login
firebase projects:create
