export default `
      <div class="chat__avatar"></div>
      <div class="chat__info">
        <div class="chat__header">
          <span class="chat__title">{{chatData.title}}</span>
          <span class="chat__time">{{time}}</span>
        </div>
        <div class="chat__preview">
          <span class="chat__message">
            {{#if isLastMessageFromMe}}<span class="chat__from-me">Вы:
            </span>{{/if}}{{lastMessage}}
          </span>
          {{#if unreadCount}}
            <span class="chat__badge">{{unreadCount}}</span>
          {{/if}}
        </div>
      </div>
`;
