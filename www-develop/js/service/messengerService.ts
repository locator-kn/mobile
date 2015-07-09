module Service {
    export class MessengerService {
        messagesIdCache;
        badgeBash:any = {};

        constructor(private $http, private CacheFactory, private basePathRealtime, private UserService, private $rootScope) {
            this.messagesIdCache = this.CacheFactory.createCache('messagesId');
        }

        getConversations() {
            return this.$http.get(this.basePathRealtime + '/my/conversations');
        }

        getConversationById(conversationId) {
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

        setBadgeHash(badgeHash) {
            this.badgeBash = badgeHash;
            for (var element in this.badgeBash) {
                if (!this.badgeBash[element]) {
                    this.$rootScope.badge += 1;
                }
            }
        }

        badgeStatusOf(conversationId) {
            return this.badgeBash[conversationId];
        }

        updateBadge(conversationId:string, newMessage:boolean) {
            var status = this.badgeBash[conversationId];
            if (status === false) {
                if (newMessage === true) {
                    this.$rootScope.badge -= 1;
                }
            } else {
                if (newMessage === false) {
                    this.$rootScope.badge += 1;
                }
            }
            this.badgeBash[conversationId] = newMessage;
        }

        static serviceId:string = "MessengerService";
    }
}
