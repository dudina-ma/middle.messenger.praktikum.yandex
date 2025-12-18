export default `
      <div class="chat-list-item__avatar"></div>
      <div class="chat-list-item__info">
        <div class="chat-list-item__header">
          <span class="chat-list-item__title">{{chatData.title}}</span>
          <span class="chat-list-item__time">{{time}}</span>
        </div>
        <div class="chat-list-item__preview">
          <span class="chat-list-item__message">
            {{#if isLastMessageFromMe}}<span class="chat-list-item__from-me">Вы:
            </span>{{/if}}{{lastMessage}}
          </span>
          {{#if unreadCount}}
            <span class="chat-list-item__badge">{{unreadCount}}</span>
          {{/if}}
        </div>
      </div>
`;
