/* Create Reaction

PUT/channels/{channel.id}/messages/{message.id}/reactions/{emoji}/@me
Create a reaction for the message. This endpoint requires the 'READ_MESSAGE_HISTORY' permission to be present on the current user.
Additionally, if nobody else has reacted to the message using this emoji,
this endpoint requires the 'ADD_REACTIONS' permission to be present on the current user.


Get Reactions

GET/channels/{channel.id}/messages/{message.id}/reactions/{emoji}
Get a list of users that reacted with this emoji. Returns an array of user objects on success.
FIELD	TYPE	    DESCRIPTION	                    REQUIRED	        DEFAULT
after	snowflake	get users after this user ID	false           	absent
limit	integer 	max number of users to return   (1-100)	false	    25
*/
