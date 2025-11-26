export default `
        <section class="chats-page__sidebar">
            <header class="chats-page__header">
                <a href="/pages/profile/profile" class="chats-page__profile-link">Профиль <span
                        class="chats-page__profile-link-arrow">&gt;</span></a>

                <search class="chats-page__search-box">
                    {{{searchForm}}}
                </search>
            </header>

            <section class="chats-page__chat-list">
                <ul>
                    {{#each chats}}
                    <li class="chats-page__chat-item {{#if isSelected}}chats-page__chat-item--selected{{/if}}">
                        <div class="chats-page__chat-avatar"></div>
                        <div class="chats-page__chat-info">
                            <div class="chats-page__chat-header">
                                <span class="chats-page__chat-name">{{name}}</span>
                                <span class="chats-page__chat-time">{{time}}</span>
                            </div>
                            <div class="chats-page__chat-preview">
                                <span class="chats-page__chat-message">
                                    {{#if isLastMessageFromMe}}<span class="chats-page__chat-from-me">Вы:
                                    </span>{{/if}}{{lastMessage}}
                                </span>
                                {{#if unreadCount}}
                                <span class="chats-page__chat-badge">{{unreadCount}}</span>
                                {{/if}}
                            </div>
                        </div>
                    </li>
                    {{/each}}
                </ul>
            </section>
        </section>

        <section class="chats-page__dialog">
            <header class="chats-page__dialog-header">
                <div class="chats-page__dialog-avatar"></div>
                <div class="chats-page__dialog-info">
                    <span class="chats-page__dialog-name">{{dialog.name}}</span>
                </div>
                <button class="chats-page__dialog-menu" type="button">
                    <span class="chats-page__dialog-menu-icon"></span>
                </button>
            </header>

            <section class="chats-page__messages">
                {{#each dialog.messages}}
                <div class="chats-page__message {{#if isFromMe}}chats-page__message--from-me{{/if}}">
                    <div class="chats-page__message-content">
                        <p class="chats-page__message-text">{{content}}</p>
                        <div class="chats-page__message-footer">
                            {{#if isFromMe}}
                            {{#if isRead}}
                            <span class="chats-page__message-status chats-page__message-status--read"></span>
                            {{else}}
                            <span class="chats-page__message-status chats-page__message-status--unread"></span>
                            {{/if}}
                            {{/if}}
                            <span class="chats-page__message-time">{{time}}</span>
                        </div>
                    </div>
                </div>
                {{#if showDate}}
                <div class="chats-page__message-date">{{date}}</div>
                {{/if}}
                {{/each}}
            </section>

            <footer class="chats-page__message-block">
                {{{messageForm}}}
            </footer>
        </section>
    `;
