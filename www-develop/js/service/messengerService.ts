module Service {
    export class MessengerService {
        messagesIdCache;

        constructor(private $http, private CacheFactory, private basePathRealtime, private UserService) {
            this.messagesIdCache = this.CacheFactory.createCache('messagesId');
        }


        getConversations() {
            return this.$http.get(this.basePathRealtime + '/my/conversations');
        }

        getConversationById(conversationId){
            return this.$http.get(this.basePathRealtime + '/conversations/' + conversationId)
        }

        getMessages(id) {
            return this.$http.get(this.basePathRealtime + '/messages/' + id, {cache: this.messagesIdCache});
        }

        sendMessage(msg, conversationID, toID, fromID) {

            return this.$http.post(this.basePathRealtime + '/messages/' + conversationID,
                {
                    "from": fromID,
                    "to": toID,
                    "message": msg
                }
            )
        }

        startConversation(msg) {
            var userId = this.UserService.getConversationUserId();
            return this.$http.post(this.basePathRealtime + '/conversations',
                {
                    "message": msg,
                    "user_id": userId
                }
            )
        }

        clearMessageCacheById(messageId) {
            this.messagesIdCache.remove(this.basePathRealtime + '/messages/' + messageId);
        }

        static serviceId:string = "MessengerService";
    }
}
