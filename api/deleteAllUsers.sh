#!/bin/bash

# THIS SCRIPT DELETES ALL USERS FROM THE COGNITO USER POOL. USE VERY CAREFULLY 
USER_POOL_ID=us-west-1_YqFXItxNG
 
RUN=1
until [ $RUN -eq 0 ] ; do
echo "Listing users"
USERS=`aws cognito-idp list-users --user-pool-id ${USER_POOL_ID} | grep Username | awk -F: '{print $2}' | sed -e 's/\"//g' | sed -e 's/,//g'`
if [ ! "x$USERS" = "x" ] ; then
	for user in $USERS; do
		echo "Deleting user $user"
		aws cognito-idp admin-delete-user --user-pool-id ${USER_POOL_ID} --username ${user}
		echo "Result code: $?"
		echo "Done"
	done
else
	echo "Done, no more users"
	RUN=0
fi
done